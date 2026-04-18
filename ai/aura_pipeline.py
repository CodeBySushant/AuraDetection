import io
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import cv2
from rembg import remove
from deepface import DeepFace

# ── Chakra map ────────────────────────────────────────────────────────────────
CHAKRA_MAP = {
    "happy":    {"color": (255, 223,   0), "chakra": "Solar Plexus", "hex": "#FFDF00"},
    "sad":      {"color": ( 30, 100, 210), "chakra": "Throat",       "hex": "#1E64D2"},
    "angry":    {"color": (220,  30,  30), "chakra": "Root",         "hex": "#DC1E1E"},
    "fear":     {"color": (128,   0, 200), "chakra": "Crown",        "hex": "#8000C8"},
    "disgust":  {"color": (100, 170,  30), "chakra": "Heart",        "hex": "#64AA1E"},
    "surprise": {"color": (255, 140,   0), "chakra": "Sacral",       "hex": "#FF8C00"},
    "neutral":  {"color": ( 50, 200, 120), "chakra": "Heart",        "hex": "#32C878"},
}

# Secondary color blend per emotion (makes aura unique)
SECONDARY_MAP = {
    "happy":    (255, 165,   0),   # orange warmth
    "sad":      ( 80,  80, 180),   # deeper blue
    "angry":    (200,   0, 100),   # magenta-red
    "fear":     ( 60,   0, 140),   # dark indigo
    "disgust":  ( 60, 130,  20),   # dark green
    "surprise": (255, 200,  50),   # golden yellow
    "neutral":  ( 20, 160, 200),   # teal
}


# ── Step 1: Remove background ─────────────────────────────────────────────────
def remove_background(image: Image.Image) -> Image.Image:
    buf = io.BytesIO()
    image.convert("RGBA").save(buf, format="PNG")
    result = remove(buf.getvalue())
    return Image.open(io.BytesIO(result)).convert("RGBA")


# ── Step 2: Detect emotion — run on ORIGINAL RGB (not bg-removed!) ────────────
def detect_emotion(original_image: Image.Image):
    """
    Always pass the ORIGINAL RGB image (before bg removal) to DeepFace.
    Transparent/RGBA images cause DeepFace to silently fall back to neutral.
    Returns (dominant_emotion, confidence 0-1, full_scores dict).
    """
    # Convert to plain RGB numpy array — DeepFace expects BGR
    img_rgb = np.array(original_image.convert("RGB"))
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)

    # Try multiple detector backends in order of accuracy
    backends = ["retinaface", "mtcnn", "opencv", "skip"]

    for backend in backends:
        try:
            results = DeepFace.analyze(
                img_path          = img_bgr,
                actions           = ["emotion"],
                enforce_detection = (backend != "skip"),
                detector_backend  = backend,
                silent            = True,
            )

            face       = results[0]
            emotion    = face["dominant_emotion"]
            all_scores = face["emotion"]                        # dict: emotion → float (0-100)
            confidence = all_scores[emotion] / 100.0

            print(f"[pipeline] Backend={backend} | Emotion={emotion.upper()} | Confidence={confidence:.2%}")
            print(f"[pipeline] All scores: { {k: f'{v:.1f}%' for k, v in sorted(all_scores.items(), key=lambda x: -x[1])} }")

            return emotion, confidence, all_scores

        except Exception as e:
            print(f"[pipeline] Backend '{backend}' failed: {e}")
            continue

    # True fallback — shouldn't normally reach here
    print("[pipeline] All backends failed, defaulting to neutral")
    fallback_scores = {e: 0.0 for e in CHAKRA_MAP}
    fallback_scores["neutral"] = 100.0
    return "neutral", 0.5, fallback_scores


# ── Step 3: Map to chakra ─────────────────────────────────────────────────────
def map_chakra_color(emotion: str) -> dict:
    return CHAKRA_MAP.get(emotion.lower().strip(), CHAKRA_MAP["neutral"])


# ── Step 4: Generate aura — unique per person using full emotion scores ────────
def generate_aura(
    fg_image: Image.Image,
    chakra_color: tuple,
    confidence: float,
    all_scores: dict,
    emotion: str,
) -> Image.Image:
    """
    Generates a truly unique aura:
    - Primary color: dominant emotion (scaled by confidence)
    - Secondary color: 2nd-highest emotion bleeds in
    - Tertiary accent: 3rd-highest adds depth
    - Layering, blur, halo all vary per-person based on scores
    """
    w, h   = fg_image.size
    cx, cy = w // 2, h // 2

    # Sort all emotions by score descending
    ranked = sorted(all_scores.items(), key=lambda x: -x[1])
    dom_name,  dom_score  = ranked[0]
    sec_name,  sec_score  = ranked[1] if len(ranked) > 1 else ("neutral", 0)
    tri_name,  tri_score  = ranked[2] if len(ranked) > 2 else ("neutral", 0)

    primary_rgb   = chakra_color
    secondary_rgb = SECONDARY_MAP.get(sec_name, (100, 100, 200))
    tertiary_rgb  = SECONDARY_MAP.get(tri_name, (200, 200, 100))

    sec_weight = sec_score / 100.0
    tri_weight = tri_score / 100.0

    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    draw   = ImageDraw.Draw(canvas)

    num_layers = 24
    max_alpha  = int(70 + confidence * 160)   # 70–230 range

    # ── Main radial layers (primary + secondary blend) ────────────────────────
    for i in range(num_layers, 0, -1):
        frac = i / num_layers
        alpha = int(max_alpha * (1 - frac) ** 1.4)

        # Blend primary → secondary based on secondary weight and ring position
        blend_t = frac * sec_weight                              # outer rings show secondary
        r = int(primary_rgb[0] * (1 - blend_t) + secondary_rgb[0] * blend_t)
        g = int(primary_rgb[1] * (1 - blend_t) + secondary_rgb[1] * blend_t)
        b = int(primary_rgb[2] * (1 - blend_t) + secondary_rgb[2] * blend_t)

        # Lighten towards centre
        lighten = (1 - frac) * 0.35
        r = int(r + (255 - r) * lighten)
        g = int(g + (255 - g) * lighten)
        b = int(b + (255 - b) * lighten)

        # Ellipse size varies slightly per layer for organic feel
        ew = int(w * 0.88 * frac)
        eh = int(h * 0.88 * frac)

        draw.ellipse([cx - ew, cy - eh, cx + ew, cy + eh], fill=(r, g, b, alpha))

    # ── Tertiary accent ring (off-centre, gives uniqueness) ───────────────────
    if tri_weight > 0.05:
        accent_alpha = int(tri_weight * 80)
        offset_x = int(w * 0.12 * (tri_weight - 0.05))
        offset_y = int(h * 0.08 * (tri_weight - 0.05))
        tr, tg, tb = tertiary_rgb
        draw.ellipse(
            [cx - int(w*0.55) + offset_x, cy - int(h*0.55) - offset_y,
             cx + int(w*0.55) + offset_x, cy + int(h*0.55) - offset_y],
            fill=(tr, tg, tb, accent_alpha)
        )

    # ── Gaussian blur — strength varies with confidence ───────────────────────
    blur_radius = int(18 + confidence * 45)
    canvas = canvas.filter(ImageFilter.GaussianBlur(radius=blur_radius))

    # ── Outer diffuse halo ────────────────────────────────────────────────────
    halo      = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    halo_draw = ImageDraw.Draw(halo)

    # Primary halo
    pr, pg, pb = primary_rgb
    halo_alpha = int(25 + confidence * 55)
    halo_draw.ellipse(
        [cx - int(w*0.9), cy - int(h*0.9),
         cx + int(w*0.9), cy + int(h*0.9)],
        fill=(pr, pg, pb, halo_alpha)
    )

    # Secondary halo (offset)
    if sec_weight > 0.1:
        sr, sg, sb = secondary_rgb
        sec_halo_alpha = int(sec_weight * 50)
        halo_draw.ellipse(
            [cx - int(w*0.7), cy - int(h*0.8),
             cx + int(w*0.7), cy + int(h*0.8)],
            fill=(sr, sg, sb, sec_halo_alpha)
        )

    halo   = halo.filter(ImageFilter.GaussianBlur(radius=55))
    canvas = Image.alpha_composite(canvas, halo)

    # ── Composite foreground onto aura ────────────────────────────────────────
    return Image.alpha_composite(canvas, fg_image)


# ── Full pipeline ─────────────────────────────────────────────────────────────
def run_pipeline(image_bytes: bytes) -> dict:
    # Load original image — keep this for DeepFace
    original = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    print(f"[pipeline] Image loaded: {original.size}")

    # Step 1: Remove background
    print("[pipeline] Removing background...")
    fg = remove_background(original)

    # Step 2: Detect emotion on ORIGINAL image (not bg-removed)
    print("[pipeline] Detecting emotion...")
    emotion, confidence, all_scores = detect_emotion(original)

    # Step 3: Map to chakra
    chakra = map_chakra_color(emotion)
    print(f"[pipeline] Chakra: {chakra['chakra']} | Color: {chakra['hex']}")

    # Step 4: Generate aura
    print("[pipeline] Generating aura...")
    final = generate_aura(fg, chakra["color"], confidence, all_scores, emotion)

    # Step 5: Encode output
    out = io.BytesIO()
    final.save(out, format="PNG")

    # Build ranked emotion list for frontend
    ranked_emotions = [
        {"emotion": k, "score": round(v, 2)}
        for k, v in sorted(all_scores.items(), key=lambda x: -x[1])
    ]

    return {
        "emotion":          emotion,
        "confidence":       round(confidence, 4),
        "chakra":           chakra["chakra"],
        "hex":              chakra["hex"],
        "all_scores":       all_scores,          # raw dict
        "ranked_emotions":  ranked_emotions,     # sorted list for UI
        "image_bytes":      out.getvalue(),
    }