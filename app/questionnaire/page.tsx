"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import {
  Upload, User, Sparkles, Zap, Brain, ImageIcon,
  ArrowLeft, Check, Camera, SwitchCamera, X, Circle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuraStore, moodOptions, personalityOptions } from "@/lib/aura-store"
import Link from "next/link"

export default function QuestionnairePage() {
  const router = useRouter()
  const { formData, setFormData, setIsLoading } = useAuraStore()
  const [step, setStep]   = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ── Camera state ──────────────────────────────────────────────────────────
  const [photoMode, setPhotoMode]         = useState<"upload" | "camera">("upload")
  const [cameraActive, setCameraActive]   = useState(false)
  const [facingMode, setFacingMode]       = useState<"user" | "environment">("user")
  const [cameraError, setCameraError]     = useState<string | null>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const streamRef   = useRef<MediaStream | null>(null)

  // Stop camera when leaving step 4 or unmounting
  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (step !== 4) stopCamera()
  }, [step])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const startCamera = async (facing: "user" | "environment" = facingMode) => {
    stopCamera()
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
    } catch (e: any) {
      setCameraError(
        e?.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access."
          : "Could not access camera. Try uploading instead."
      )
    }
  }

  const flipCamera = async () => {
    const next = facingMode === "user" ? "environment" : "user"
    setFacingMode(next)
    await startCamera(next)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video  = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")!
    // Mirror front camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file    = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
      const preview = URL.createObjectURL(blob)
      setFormData({ image: file, imagePreview: preview })
      setErrors(prev => ({ ...prev, image: "" }))
      stopCamera()
    }, "image/jpeg", 0.92)
  }

  // ── Dropzone ──────────────────────────────────────────────────────────────
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }))
      return
    }
    const preview = URL.createObjectURL(file)
    setFormData({ image: file, imagePreview: preview })
    setErrors(prev => ({ ...prev, image: "" }))
  }, [setFormData])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  })

  // ── Steps ─────────────────────────────────────────────────────────────────
  const steps = [
    { icon: User,      title: "Your Name",    field: "name" },
    { icon: Sparkles,  title: "Current Mood", field: "mood" },
    { icon: Brain,     title: "Personality",  field: "personality" },
    { icon: Zap,       title: "Energy Level", field: "energy" },
    { icon: ImageIcon, title: "Your Photo",   field: "image" },
  ]

  const validateStep = () => {
    const field = steps[step].field
    const errs: Record<string, string> = {}
    if (field === "name"        && !formData.name.trim())    errs.name        = "Please enter your name"
    if (field === "mood"        && !formData.mood)           errs.mood        = "Please select your mood"
    if (field === "personality" && !formData.personality)    errs.personality = "Please select your personality type"
    if (field === "image"       && !formData.image)          errs.image       = "Please add your photo"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step < steps.length - 1) setStep(step + 1)
      else handleSubmit()
    }
  }

  const handleSubmit = () => {
    setIsLoading(true)
    router.push("/loading")
  }

  // ── Step content ──────────────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <Label htmlFor="name" className="text-foreground">What should we call you?</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="h-14 border-border/50 bg-card/50 text-lg backdrop-blur-sm focus:border-primary"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <Label className="text-foreground">How are you feeling right now?</Label>
            <Select value={formData.mood} onValueChange={(v) => setFormData({ mood: v })}>
              <SelectTrigger className="h-14 border-border/50 bg-card/50 text-lg backdrop-blur-sm">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mood && <p className="text-sm text-destructive">{errors.mood}</p>}
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <Label className="text-foreground">What describes you best?</Label>
            <Select value={formData.personality} onValueChange={(v) => setFormData({ personality: v })}>
              <SelectTrigger className="h-14 border-border/50 bg-card/50 text-lg backdrop-blur-sm">
                <SelectValue placeholder="Select your personality type" />
              </SelectTrigger>
              <SelectContent>
                {personalityOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.personality && <p className="text-sm text-destructive">{errors.personality}</p>}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Label className="text-foreground">What&apos;s your energy level today?</Label>
            <div className="space-y-4">
              <Slider
                value={[formData.energy]}
                onValueChange={(v) => setFormData({ energy: v[0] })}
                max={100} step={1} className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Low Energy</span>
                <span className="font-semibold text-primary">{formData.energy}%</span>
                <span>High Energy</span>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <Label className="text-foreground">Add your photo</Label>

            {/* Mode toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 bg-black/20 p-1 gap-1">
              {(["upload", "camera"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setPhotoMode(mode)
                    if (mode === "camera") startCamera()
                    else stopCamera()
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: photoMode === mode ? "rgba(139,92,246,0.3)" : "transparent",
                    border: photoMode === mode ? "1px solid rgba(139,92,246,0.5)" : "1px solid transparent",
                    color: photoMode === mode ? "#c4b5fd" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {mode === "upload" ? <Upload className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                  {mode === "upload" ? "Upload" : "Camera"}
                </button>
              ))}
            </div>

            {/* ── Upload mode ── */}
            {photoMode === "upload" && (
              <div
                {...getRootProps()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                  isDragActive ? "border-primary bg-primary/10" : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50"
                }`}
              >
                <input {...getInputProps()} />
                {formData.imagePreview ? (
                  <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-xl">
                    <img src={formData.imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                      <p className="text-sm text-white">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground">Drag &amp; drop your photo here</p>
                      <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Camera mode ── */}
            {photoMode === "camera" && (
              <div className="space-y-3">
                {cameraError ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                    <p className="text-sm text-red-400">{cameraError}</p>
                    <button
                      onClick={() => startCamera()}
                      className="mt-3 text-xs text-primary underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : formData.imagePreview && !cameraActive ? (
                  /* Captured photo preview */
                  <div className="relative mx-auto overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                    <img src={formData.imagePreview} alt="Captured" className="h-full w-full object-cover" />
                    <button
                      onClick={() => {
                        setFormData({ image: null, imagePreview: "" })
                        startCamera()
                      }}
                      className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{ background: "rgba(0,0,0,0.6)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <X className="h-3 w-3" /> Retake
                    </button>
                  </div>
                ) : (
                  /* Live viewfinder */
                  <div className="relative overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "4/3" }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                      style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                    />

                    {/* Face guide overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="rounded-full"
                        style={{
                          width: "55%", aspectRatio: "1",
                          border: "2px dashed rgba(139,92,246,0.6)",
                          boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
                        }}
                      />
                    </div>

                    {/* Corner brackets */}
                    {[
                      { top: "12%", left: "18%",  borderTop: "2px solid #8B5CF6", borderLeft:  "2px solid #8B5CF6" },
                      { top: "12%", right: "18%", borderTop: "2px solid #8B5CF6", borderRight: "2px solid #8B5CF6" },
                      { bottom: "12%", left: "18%",  borderBottom: "2px solid #8B5CF6", borderLeft:  "2px solid #8B5CF6" },
                      { bottom: "12%", right: "18%", borderBottom: "2px solid #8B5CF6", borderRight: "2px solid #8B5CF6" },
                    ].map((style, i) => (
                      <div key={i} className="absolute pointer-events-none" style={{ ...style, width: 20, height: 20 }} />
                    ))}

                    {/* Hint text */}
                    <p className="absolute bottom-16 inset-x-0 text-center text-xs pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.6)" }}>
                      Centre your face in the circle
                    </p>

                    {/* Controls bar */}
                    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-6 py-4"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                      {/* Flip camera */}
                      <button
                        onClick={flipCamera}
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
                      >
                        <SwitchCamera className="h-5 w-5 text-white" />
                      </button>

                      {/* Capture button */}
                      <button
                        onClick={capturePhoto}
                        className="flex h-16 w-16 items-center justify-center rounded-full transition-transform active:scale-95"
                        style={{ background: "white", boxShadow: "0 0 0 4px rgba(255,255,255,0.3)" }}
                      >
                        <Circle className="h-10 w-10" style={{ color: "#1a0533" }} />
                      </button>

                      {/* Placeholder to balance layout */}
                      <div className="h-10 w-10" />
                    </div>
                  </div>
                )}

                {/* Start camera button if not yet active and no preview */}
                {!cameraActive && !formData.imagePreview && !cameraError && (
                  <button
                    onClick={() => startCamera()}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-medium transition-all"
                    style={{
                      background: "rgba(139,92,246,0.15)",
                      border: "2px dashed rgba(139,92,246,0.4)",
                      color: "#c4b5fd",
                    }}
                  >
                    <Camera className="h-5 w-5" />
                    Open Camera
                  </button>
                )}
              </div>
            )}

            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
            <p className="text-center text-xs text-muted-foreground">
              {photoMode === "upload" ? "PNG, JPG or WEBP up to 5MB" : "Photo taken with camera · JPEG"}
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0d1b3c] to-[#1a0533]">
        <motion.div
          className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-[100px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 h-64 w-64 rounded-full bg-accent/20 blur-[80px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.3, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-3xl border border-white/10 bg-card/30 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    {(() => { const Icon = steps[step].icon; return <Icon className="h-6 w-6 text-primary" /> })()}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Step {step + 1} of {steps.length}</p>
                    <h2 className="text-xl font-semibold text-foreground">{steps[step].title}</h2>
                  </div>
                </div>
                {renderStepContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 border-border/50 bg-card/30 backdrop-blur-sm">
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
            {step === steps.length - 1 ? (<>Generate Aura <Check className="ml-2 h-4 w-4" /></>) : "Continue"}
          </Button>
        </div>
      </div>
    </main>
  )
}