"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuraStore } from "@/lib/aura-store"
import { submitAuraForm } from "@/services/aura-api"

const PHASES = [
  "Scanning your energy field...",
  "Detecting facial resonance...",
  "Mapping chakra frequencies...",
  "Synthesizing aura layers...",
  "Crystallising your spectrum...",
]

export default function LoadingPage() {
  const router  = useRouter()
  const { formData, setResult, setIsLoading } = useAuraStore()
  const [phase, setPhase] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const called = useRef(false)

  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  // Submit to API exactly once
  useEffect(() => {
    if (called.current) return
    called.current = true

    if (!formData.image || !formData.name) {
      router.replace("/questionnaire")
      return
    }

    setIsLoading(true)

    submitAuraForm(formData, formData.name)
      .then((result) => {
        setResult(result)
        router.push("/result")
      })
      .catch((err) => {
        console.error("[loading] API failed:", err)
        setError(err?.message ?? "Something went wrong")
        setIsLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0d1b3c] to-[#1a0533]">
        {[
          { color: "#8B5CF6", x: "25%", y: "30%", dur: 6 },
          { color: "#6366F1", x: "70%", y: "60%", dur: 8 },
          { color: "#EC4899", x: "50%", y: "80%", dur: 7 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: b.x, top: b.y,
              width: 320, height: 320,
              background: b.color,
              filter: "blur(100px)",
              opacity: 0.15,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 px-8 text-center">
        {error ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-400 text-lg font-medium">{error}</p>
            <button
              onClick={() => router.push("/questionnaire")}
              className="px-6 py-3 rounded-full text-white text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Animated orb */}
            <div className="relative" style={{ width: 160, height: 160 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1.5px solid rgba(139,92,246,0.4)",
                  }}
                  animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut",
                  }}
                />
              ))}
              <motion.div
                className="absolute inset-4 rounded-full"
                style={{
                  background: "radial-gradient(circle, #8B5CF6 0%, #4F46E5 60%, #1E1B4B 100%)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.6)",
                }}
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Inner symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  style={{ fontSize: 36, color: "rgba(255,255,255,0.9)" }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  ✦
                </motion.span>
              </div>
            </div>

            {/* Phase text */}
            <div style={{ height: 32 }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-base font-medium"
                  style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.03em" }}
                >
                  {PHASES[phase]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
              {PHASES.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: i === phase ? "#8B5CF6" : "rgba(255,255,255,0.2)",
                  }}
                  animate={{ scale: i === phase ? 1.4 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}