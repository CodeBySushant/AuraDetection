"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuraStore, auraColorMap, generateAuraDescription } from "@/lib/aura-store"
import { removeBackground } from "@imgly/background-removal"

const loadingMessages = [
  "Scanning your energy field...",
  "Analyzing aura patterns...",
  "Detecting spiritual frequencies...",
  "Mapping your chakra alignment...",
  "Synthesizing color signatures...",
  "Generating your unique aura...",
]

export default function LoadingPage() {
  const router = useRouter()
  const { formData, setResult, setIsLoading } = useAuraStore()
  const [currentMessage, setCurrentMessage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Redirect if no form data
    if (!formData.image || !formData.name) {
      router.push("/questionnaire")
      return
    }

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 10
      })
    }, 300)

    // Process the image and generate aura
    processAura()

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const processAura = async () => {
    try {
      // Remove background from image
      let processedImageUrl = formData.imagePreview || ""
      
      if (formData.image) {
        try {
          const blob = await removeBackground(formData.image, {
            // Use single-threaded mode to avoid WASM multi-threading warnings
            // in environments without cross-origin isolation
            device: "cpu",
            model: "small",
          })
          processedImageUrl = URL.createObjectURL(blob)
        } catch (error) {
          console.log("[v0] Background removal failed, using original image:", error)
          // If background removal fails, use original image
          processedImageUrl = formData.imagePreview || ""
        }
      }

      // Generate aura colors based on mood and personality
      const moodColors = getMoodColors(formData.mood, formData.personality, formData.energy)
      
      // Generate description
      const description = generateAuraDescription(
        moodColors.map(c => c.name),
        formData.name,
        formData.mood,
        formData.personality
      )

      // Set result
      setResult({
        colors: moodColors.map(c => c.name),
        description,
        imageUrl: processedImageUrl,
        name: formData.name,
      })

      // Complete progress and navigate
      setProgress(100)
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsLoading(false)
      router.push("/result")
    } catch (error) {
      console.error("[v0] Error processing aura:", error)
      setIsLoading(false)
      router.push("/questionnaire")
    }
  }

  const getMoodColors = (mood: string, personality: string, energy: number) => {
    const colors: { name: string; color: string; glow: string }[] = []
    
    // Primary color based on mood
    if (auraColorMap[mood]) {
      colors.push(auraColorMap[mood])
    }
    
    // Secondary color based on personality
    const personalityColorMap: Record<string, string> = {
      introvert: "calm",
      extrovert: "energetic",
      ambivert: "peaceful",
      analytical: "intuitive",
      creative: "creative",
      leader: "passionate",
    }
    
    const secondaryMood = personalityColorMap[personality]
    if (secondaryMood && auraColorMap[secondaryMood] && auraColorMap[secondaryMood] !== colors[0]) {
      colors.push(auraColorMap[secondaryMood])
    }
    
    // Third color based on energy level
    if (energy > 70) {
      colors.push(auraColorMap.grounded)
    } else if (energy < 30) {
      colors.push(auraColorMap.peaceful)
    } else {
      colors.push(auraColorMap.intuitive)
    }
    
    // Return unique colors (max 3)
    const uniqueColors = colors.filter((c, i, arr) => 
      arr.findIndex(x => x.name === c.name) === i
    ).slice(0, 3)
    
    return uniqueColors.length > 0 ? uniqueColors : [auraColorMap.creative, auraColorMap.calm, auraColorMap.peaceful]
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0d1b3c] to-[#1a0533]">
        {/* Animated orbs */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/40 blur-[80px]"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Animated rings */}
        <div className="relative mb-12 h-48 w-48">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{
                scale: [1, 1.5 + i * 0.3],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
          
          {/* Center pulse */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50" />
          </motion.div>
        </div>

        {/* Loading text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-8 text-center text-xl text-foreground"
          >
            {loadingMessages[currentMessage]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </main>
  )
}
