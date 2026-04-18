import { NextRequest, NextResponse } from "next/server"

const emotionColorMap: Record<string, string> = {
  happy:    "Yellow",
  sad:      "Blue",
  angry:    "Red",
  fear:     "Purple",
  disgust:  "Green",
  surprise: "Orange",
  neutral:  "Indigo",
}

const personalityEmotionMap: Record<string, string> = {
  introvert:  "calm",
  extrovert:  "energetic",
  ambivert:   "peaceful",
  analytical: "intuitive",
  creative:   "creative",
  leader:     "passionate",
}

const emotionToColorName: Record<string, string> = {
  calm:       "Blue",
  energetic:  "Red",
  peaceful:   "Green",
  intuitive:  "Indigo",
  creative:   "Purple",
  passionate: "Pink",
  grounded:   "Orange",
}

function generateDescription(
  colors: string[],
  name: string,
  emotion: string,
  personality: string,
  chakra: string,
  confidence: number,
  rankedEmotions?: { emotion: string; score: number }[]
): string {
  const desc: Record<string, string> = {
    Yellow: "radiates warmth, joy, and solar vitality",
    Blue:   "flows with tranquility, depth, and inner wisdom",
    Red:    "pulses with raw passion, strength, and fire",
    Purple: "shimmers with mysticism, intuition, and creativity",
    Green:  "breathes with harmony, healing, and natural growth",
    Indigo: "glows with deep intuition, clarity, and cosmic connection",
    Pink:   "sparkles with love, compassion, and gentle power",
    Orange: "burns with enthusiasm, confidence, and creative spark",
  }

  const colorText = colors
    .map((c) => desc[c] ?? "pulses with mysterious energy")
    .join(", and ")

  // Add secondary emotion nuance if available
  let nuance = ""
  if (rankedEmotions && rankedEmotions.length > 1) {
    const second = rankedEmotions[1]
    if (second.score > 10) {
      nuance = ` Traces of ${second.emotion} weave through your field at ${Math.round(second.score)}%.`
    }
  }

  const intensityWord =
    confidence > 0.8 ? "powerfully" :
    confidence > 0.6 ? "strongly" :
    confidence > 0.4 ? "clearly" : "gently"

  return `${name}, your aura ${intensityWord} ${colorText}. Your ${personality} spirit, anchored in the ${chakra} Chakra, resonates at a frequency of transformation.${nuance}`
}

export async function POST(request: NextRequest) {
  try {
    const formData   = await request.formData()
    const name       = formData.get("name")        as string
    const mood       = formData.get("mood")        as string
    const personality= formData.get("personality") as string
    const energy     = parseInt(formData.get("energy") as string) || 50
    const image      = formData.get("image")       as File | null

    if (!name || !mood || !personality || !image) {
      return NextResponse.json(
        { error: "Missing required fields: name, mood, personality, image" },
        { status: 400 }
      )
    }

    // ── Forward to Python backend ─────────────────────────────────────────────
    let aiData: {
      emotion: string
      confidence: number
      chakra: string
      hex: string
      image: string
      all_scores: Record<string, number>
      ranked_emotions: { emotion: string; score: number }[]
    }

    try {
      const pyForm = new FormData()
      pyForm.append("file", image)

      const pyRes = await fetch("http://localhost:8001/api/aura/process", {
        method: "POST",
        body:   pyForm,
      })

      if (!pyRes.ok) {
        const err = await pyRes.json().catch(() => ({}))
        console.error("[route] Python backend error:", err)
        throw new Error(`Backend error: ${JSON.stringify(err)}`)
      }

      aiData = await pyRes.json()
    } catch (backendErr) {
      console.warn("[route] Backend unavailable, using fallback:", backendErr)
      // Fallback — never silently same-output; vary by mood at least
      aiData = {
        emotion:    mood in emotionColorMap ? mood : "neutral",
        confidence: 0.5,
        chakra:     "Heart",
        hex:        "#32C878",
        image:      "",
        all_scores: { neutral: 100 },
        ranked_emotions: [{ emotion: "neutral", score: 100 }],
      }
    }

    // ── Build color array ──────────────────────────────────────────────────────
    const colors: string[] = []

    // 1. Primary — AI-detected emotion
    const primaryColor = emotionColorMap[aiData.emotion] ?? "Indigo"
    colors.push(primaryColor)

    // 2. Secondary — 2nd highest DeepFace score (if >10%)
    if (aiData.ranked_emotions?.length > 1) {
      const second = aiData.ranked_emotions[1]
      if (second.score > 10) {
        const secColor = emotionColorMap[second.emotion]
        if (secColor && !colors.includes(secColor)) colors.push(secColor)
      }
    }

    // 3. User mood if different
    const moodColor = emotionColorMap[mood]
    if (moodColor && !colors.includes(moodColor)) colors.push(moodColor)

    // 4. Personality
    const persEmotion = personalityEmotionMap[personality]
    const persColor   = persEmotion ? emotionToColorName[persEmotion] : null
    if (persColor && !colors.includes(persColor)) colors.push(persColor)

    // 5. Energy modifier
    if (energy > 80 && !colors.includes("Orange")) colors.push("Orange")
    else if (energy < 30 && !colors.includes("Green")) colors.push("Green")

    const finalColors = [...new Set(colors)].slice(0, 3)
    if (finalColors.length < 2) finalColors.push("Purple")

    const description = generateDescription(
      finalColors,
      name,
      aiData.emotion,
      personality,
      aiData.chakra,
      aiData.confidence,
      aiData.ranked_emotions,
    )

    return NextResponse.json({
      success: true,
      data: {
        colors:          finalColors,
        description,
        emotion:         aiData.emotion,
        confidence:      aiData.confidence,
        chakra:          aiData.chakra,
        hex:             aiData.hex,
        image:           aiData.image,
        all_scores:      aiData.all_scores,
        ranked_emotions: aiData.ranked_emotions,
      },
    })
  } catch (error) {
    console.error("[route] Aura API error:", error)
    return NextResponse.json({ error: "Failed to process aura" }, { status: 500 })
  }
}