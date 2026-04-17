import { NextRequest, NextResponse } from "next/server"

// Aura color mapping
const auraColorMap: Record<string, { name: string; color: string; glow: string }> = {
  happy: { name: "Yellow", color: "#FFD700", glow: "rgba(255, 215, 0, 0.6)" },
  calm: { name: "Blue", color: "#4169E1", glow: "rgba(65, 105, 225, 0.6)" },
  energetic: { name: "Red", color: "#FF4444", glow: "rgba(255, 68, 68, 0.6)" },
  creative: { name: "Purple", color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.6)" },
  peaceful: { name: "Green", color: "#22C55E", glow: "rgba(34, 197, 94, 0.6)" },
  intuitive: { name: "Indigo", color: "#6366F1", glow: "rgba(99, 102, 241, 0.6)" },
  passionate: { name: "Pink", color: "#EC4899", glow: "rgba(236, 72, 153, 0.6)" },
  grounded: { name: "Orange", color: "#F97316", glow: "rgba(249, 115, 22, 0.6)" },
}

// Personality to emotion mapping
const personalityEmotionMap: Record<string, string> = {
  introvert: "calm",
  extrovert: "energetic",
  ambivert: "peaceful",
  analytical: "intuitive",
  creative: "creative",
  leader: "passionate",
}

// Generate description based on colors
function generateDescription(colors: string[], name: string, mood: string, personality: string): string {
  const descriptions: Record<string, string> = {
    Yellow: "radiates warmth and optimism",
    Blue: "emanates tranquility and wisdom",
    Red: "pulses with vitality and passion",
    Purple: "shimmers with creativity and mysticism",
    Green: "flows with harmony and growth",
    Indigo: "glows with intuition and depth",
    Pink: "sparkles with love and compassion",
    Orange: "burns with enthusiasm and confidence",
  }

  const colorDescriptions = colors.map((c) => descriptions[c] || "glows mysteriously").join(", ")

  return `${name}, your aura ${colorDescriptions}. As a ${personality} with a ${mood} energy, you possess a unique blend of spiritual frequencies. Your dominant colors reveal a soul that seeks balance while embracing transformation.`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const mood = formData.get("mood") as string
    const personality = formData.get("personality") as string
    const energy = parseInt(formData.get("energy") as string) || 50
    const image = formData.get("image") as File | null

    if (!name || !mood || !personality || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 🔥 STEP 1: Call AI backend
    const aiForm = new FormData()
    aiForm.append("file", image)

    const aiRes = await fetch("http://localhost:8001/api/aura/process", {
      method: "POST",
      body: aiForm,
    })

    if (!aiRes.ok) {
      return NextResponse.json(
        { error: "AI pipeline failed" },
        { status: 500 }
      )
    }

    const aiData = await aiRes.json()

    // 🔥 STEP 2: Build color logic properly
    const colors: string[] = []

    // Primary → AI emotion mapped to your colors
    if (auraColorMap[aiData.emotion]) {
      colors.push(auraColorMap[aiData.emotion].name)
    }

    // Secondary → user mood
    if (auraColorMap[mood]) {
      const moodColor = auraColorMap[mood].name
      if (!colors.includes(moodColor)) {
        colors.push(moodColor)
      }
    }

    // Third → personality
    const personalityEmotion = personalityEmotionMap[personality]
    if (personalityEmotion && auraColorMap[personalityEmotion]) {
      const pColor = auraColorMap[personalityEmotion].name
      if (!colors.includes(pColor)) {
        colors.push(pColor)
      }
    }

    // Fourth → energy adjustment
    if (energy > 70 && !colors.includes("Orange")) {
      colors.push("Orange")
    } else if (energy < 30 && !colors.includes("Green")) {
      colors.push("Green")
    }

    // Ensure at least 2 colors
    if (colors.length < 2) {
      colors.push("Purple")
    }

    const finalColors = colors.slice(0, 3)

    // 🔥 STEP 3: Use your original smart description
    const description = generateDescription(
      finalColors,
      name,
      aiData.emotion || mood,
      personality
    )

    // 🔥 FINAL RESPONSE
    return NextResponse.json({
      colors: finalColors,
      description,
      emotion: aiData.emotion,
      confidence: aiData.confidence,
      chakra: aiData.chakra,
      image: aiData.image,
    })

  } catch (error) {
    console.error("Aura API error:", error)

    return NextResponse.json(
      { error: "Failed to process aura" },
      { status: 500 }
    )
  }
}