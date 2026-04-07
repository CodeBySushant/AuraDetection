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

    // Validate required fields
    if (!name || !mood || !personality) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate emotion scores (mock AI processing)
    const emotions = {
      happy: mood === "happy" ? 0.8 : Math.random() * 0.4,
      calm: mood === "calm" ? 0.8 : Math.random() * 0.4,
      energetic: mood === "energetic" ? 0.8 : Math.random() * 0.4,
      creative: mood === "creative" ? 0.8 : Math.random() * 0.4,
    }

    // Determine aura colors
    const colors: string[] = []

    // Primary color from mood
    if (auraColorMap[mood]) {
      colors.push(auraColorMap[mood].name)
    }

    // Secondary color from personality
    const secondaryEmotion = personalityEmotionMap[personality]
    if (secondaryEmotion && auraColorMap[secondaryEmotion]) {
      const colorName = auraColorMap[secondaryEmotion].name
      if (!colors.includes(colorName)) {
        colors.push(colorName)
      }
    }

    // Third color based on energy level
    if (energy > 70) {
      if (!colors.includes("Orange")) colors.push("Orange")
    } else if (energy < 30) {
      if (!colors.includes("Green")) colors.push("Green")
    } else {
      if (!colors.includes("Indigo")) colors.push("Indigo")
    }

    // Ensure we have at least 2 colors
    if (colors.length < 2) {
      colors.push("Purple")
    }

    // Limit to 3 colors
    const finalColors = colors.slice(0, 3)

    // Generate description
    const description = generateDescription(finalColors, name, mood, personality)

    // In a production app, we would:
    // 1. Upload image to Cloudinary
    // 2. Call background removal API
    // 3. Return processed image URL
    // For now, we'll handle image processing on the client side

    return NextResponse.json({
      colors: finalColors,
      description,
      emotions,
      imageUrl: null, // Client handles image processing
    })
  } catch (error) {
    console.error("[v0] Aura API error:", error)
    return NextResponse.json(
      { error: "Failed to process aura" },
      { status: 500 }
    )
  }
}
