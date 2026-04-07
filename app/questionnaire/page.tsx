"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Upload, User, Sparkles, Zap, Brain, ImageIcon, ArrowLeft, Check } from "lucide-react"
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
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }))
        return
      }
      const preview = URL.createObjectURL(file)
      setFormData({ image: file, imagePreview: preview })
      setErrors(prev => ({ ...prev, image: "" }))
    }
  }, [setFormData])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  })

  const steps = [
    { icon: User, title: "Your Name", field: "name" },
    { icon: Sparkles, title: "Current Mood", field: "mood" },
    { icon: Brain, title: "Personality", field: "personality" },
    { icon: Zap, title: "Energy Level", field: "energy" },
    { icon: ImageIcon, title: "Your Photo", field: "image" },
  ]

  const validateStep = () => {
    const currentField = steps[step].field
    const newErrors: Record<string, string> = {}

    if (currentField === "name" && !formData.name.trim()) {
      newErrors.name = "Please enter your name"
    }
    if (currentField === "mood" && !formData.mood) {
      newErrors.mood = "Please select your mood"
    }
    if (currentField === "personality" && !formData.personality) {
      newErrors.personality = "Please select your personality type"
    }
    if (currentField === "image" && !formData.image) {
      newErrors.image = "Please upload your photo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step < steps.length - 1) {
        setStep(step + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    router.push("/loading")
  }

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
            <Select value={formData.mood} onValueChange={(value) => setFormData({ mood: value })}>
              <SelectTrigger className="h-14 border-border/50 bg-card/50 text-lg backdrop-blur-sm">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
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
            <Select value={formData.personality} onValueChange={(value) => setFormData({ personality: value })}>
              <SelectTrigger className="h-14 border-border/50 bg-card/50 text-lg backdrop-blur-sm">
                <SelectValue placeholder="Select your personality type" />
              </SelectTrigger>
              <SelectContent>
                {personalityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
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
                onValueChange={(value) => setFormData({ energy: value[0] })}
                max={100}
                step={1}
                className="py-4"
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
            <Label className="text-foreground">Upload your photo</Label>
            <div
              {...getRootProps()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50"
              }`}
            >
              <input {...getInputProps()} />
              {formData.imagePreview ? (
                <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-xl">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
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
                    <p className="text-foreground">Drag & drop your photo here</p>
                    <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
                  </div>
                </div>
              )}
            </div>
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
            <p className="text-center text-xs text-muted-foreground">
              PNG, JPG or WEBP up to 5MB
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
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
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
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
              {/* Glassmorphism Card */}
              <div className="rounded-3xl border border-white/10 bg-card/30 p-8 shadow-2xl backdrop-blur-xl">
                {/* Step Icon */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    {(() => {
                      const Icon = steps[step].icon
                      return <Icon className="h-6 w-6 text-primary" />
                    })()}
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
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 border-border/50 bg-card/30 backdrop-blur-sm"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
          >
            {step === steps.length - 1 ? (
              <>
                Generate Aura <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
