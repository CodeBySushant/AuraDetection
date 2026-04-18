"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCw, Download } from "lucide-react"
import { useAuraStore, auraColorMap } from "@/lib/aura-store"
import { AuraCard } from "@/components/aura-card"
import { Button } from "@/components/ui/button"

export default function ResultPage() {
  const router = useRouter()
  const { result, reset } = useAuraStore()
  const cardRef = useRef<HTMLDivElement>(null)

  if (!result) {
    if (typeof window !== "undefined") router.replace("/")
    return null
  }

  const handleReset = () => {
    reset()
    router.push("/")
  }

  const handleDownload = async () => {
    try {
      // Use html2canvas if available, else fall back to a simple message
      const { default: html2canvas } = await import("html2canvas").catch(() => ({ default: null }))
      if (!html2canvas || !cardRef.current) {
        alert("Install html2canvas for download support: npm i html2canvas")
        return
      }
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement("a")
      link.download = `aura-${result.name.toLowerCase().replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch {
      console.error("Download failed")
    }
  }

  const primaryKey = result.emotion.toLowerCase()
  const primaryAura = auraColorMap[primaryKey] ?? auraColorMap["neutral"]
  const glowColor = primaryAura.glow

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0118] via-[#050d1e] to-[#0d0118]">
        {result.colors.slice(0, 3).map((colorName, i) => {
          const aura = auraColorMap[colorName.toLowerCase()] ?? auraColorMap["neutral"]
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left:   ["20%", "70%", "45%"][i],
                top:    ["25%", "55%", "80%"][i],
                width:  400,
                height: 400,
                background: aura.color,
                filter: "blur(120px)",
                opacity: 0.12,
                transform: "translate(-50%, -50%)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )
        })}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-white/40 hover:text-white/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span
            className="text-xs uppercase tracking-[0.2em] font-medium"
            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}
          >
            Your Aura Reading
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-white/40 hover:text-white/80"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <AuraCard ref={cardRef} result={result} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 flex flex-col gap-3"
        >
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${primaryAura.color}cc, ${primaryAura.color}88)`,
              color: "#fff",
              boxShadow: `0 4px 24px ${glowColor}`,
              border: "none",
            }}
          >
            <Download className="h-4 w-4" />
            Save Aura Card
          </button>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Read Another Aura
          </button>
        </motion.div>
      </div>
    </main>
  )
}