# ai/pipeline.py
import io, numpy as np
from PIL import Image, ImageFilter, ImageDraw
import cv2
from rembg import remove
from deepface import DeepFace

CHAKRA_MAP = {
    "happy":    {"color": (255,223,0),   "chakra": "Solar Plexus", "hex": "#FFDF00"},
    "sad":      {"color": (30,100,210),  "chakra": "Throat",       "hex": "#1E64D2"},
    "angry":    {"color": (220,30,30),   "chakra": "Root",         "hex": "#DC1E1E"},
    "fear":     {"color": (128,0,200),   "chakra": "Crown",        "hex": "#8000C8"},
    "disgust":  {"color": (100,170,30),  "chakra": "Heart",        "hex": "#64AA1E"},
    "surprise": {"color": (255,140,0),   "chakra": "Sacral",       "hex": "#FF8C00"},
    "neutral":  {"color": (50,200,120),  "chakra": "Heart",        "hex": "#32C878"},
}

def remove_background(image: Image.Image) -> Image.Image:
    buf = io.BytesIO()
    image.save(buf, format="PNG")
    return Image.open(io.BytesIO(remove(buf.getvalue()))).convert("RGBA")

def detect_emotion(image: Image.Image):
    img_bgr = cv2.cvtColor(np.array(image.convert("RGB")), cv2.COLOR_RGB2BGR)
    try:
        results = DeepFace.analyze(img_path=img_bgr, actions=["emotion"],
                                   enforce_detection=False, detector_backend="opencv")
        emotion = results[0]["dominant_emotion"]
        confidence = results[0]["emotion"][emotion] / 100.0
        return emotion, confidence
    except:
        return "neutral", 0.5

def map_chakra_color(emotion: str) -> dict:
    return CHAKRA_MAP.get(emotion.lower(), CHAKRA_MAP["neutral"])

def generate_aura(image: Image.Image, chakra_color, confidence=0.75) -> Image.Image:
    w, h = image.size
    cx, cy = w // 2, h // 2
    r, g, b = chakra_color
    canvas = Image.new("RGBA", (w, h), (0,0,0,255))
    draw = ImageDraw.Draw(canvas)
    for i in range(20, 0, -1):
        f = i / 20
        alpha = int((80 + confidence * 150) * (1 - f) ** 1.5)
        ri = int(r + (255-r)*(1-f)*0.4)
        gi = int(g + (255-g)*(1-f)*0.4)
        bi = int(b + (255-b)*(1-f)*0.4)
        ew, eh = int(w*0.85*f), int(h*0.85*f)
        draw.ellipse([cx-ew, cy-eh, cx+ew, cy+eh], fill=(ri,gi,bi,alpha))
    canvas = canvas.filter(ImageFilter.GaussianBlur(int(20 + confidence*40)))
    aura_resized = canvas.resize(image.size, Image.LANCZOS)
    return Image.alpha_composite(aura_resized, image)

def run_pipeline(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    fg = remove_background(image)
    emotion, confidence = detect_emotion(fg)
    chakra = map_chakra_color(emotion)
    final = generate_aura(fg, chakra["color"], confidence)
    # Return final image as bytes
    out = io.BytesIO()
    final.save(out, format="PNG")
    return {
        "emotion": emotion,
        "confidence": round(confidence, 4),
        "chakra": chakra["chakra"],
        "hex": chakra["hex"],
        "image_bytes": out.getvalue()
    }