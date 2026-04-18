import { create } from "zustand"

export interface AuraFormData {
  name: string
  mood: string
  personality: string
  energy: number
  image: File | null
  imagePreview: string
}

export interface EmotionScore {
  emotion: string
  score: number
}

export interface AuraResult {
  name: string
  colors: string[]
  description: string
  imageUrl: string
  image?: string
  emotion: string
  confidence: number
  chakra: string
  hex: string
  all_scores?: Record<string, number>
  ranked_emotions?: EmotionScore[]
}

interface AuraStore {
  formData: AuraFormData
  result: AuraResult | null
  isLoading: boolean
  setFormData:  (data: Partial<AuraFormData>) => void
  setResult:    (result: AuraResult) => void
  setIsLoading: (loading: boolean) => void
  reset:        () => void
}

export const auraColorMap: Record<string, { name: string; color: string; glow: string }> = {
  happy:      { name: "Yellow",  color: "#FFD700", glow: "rgba(255,215,0,0.6)"   },
  calm:       { name: "Blue",    color: "#4169E1", glow: "rgba(65,105,225,0.6)"  },
  energetic:  { name: "Red",     color: "#FF4444", glow: "rgba(255,68,68,0.6)"   },
  creative:   { name: "Purple",  color: "#8B5CF6", glow: "rgba(139,92,246,0.6)"  },
  peaceful:   { name: "Green",   color: "#22C55E", glow: "rgba(34,197,94,0.6)"   },
  intuitive:  { name: "Indigo",  color: "#6366F1", glow: "rgba(99,102,241,0.6)"  },
  passionate: { name: "Pink",    color: "#EC4899", glow: "rgba(236,72,153,0.6)"  },
  grounded:   { name: "Orange",  color: "#F97316", glow: "rgba(249,115,22,0.6)"  },
  sad:        { name: "Blue",    color: "#4169E1", glow: "rgba(65,105,225,0.6)"  },
  angry:      { name: "Red",     color: "#FF4444", glow: "rgba(255,68,68,0.6)"   },
  fear:       { name: "Purple",  color: "#8B5CF6", glow: "rgba(139,92,246,0.6)"  },
  disgust:    { name: "Green",   color: "#22C55E", glow: "rgba(34,197,94,0.6)"   },
  surprise:   { name: "Orange",  color: "#F97316", glow: "rgba(249,115,22,0.6)"  },
  neutral:    { name: "Indigo",  color: "#6366F1", glow: "rgba(99,102,241,0.6)"  },
  yellow:     { name: "Yellow",  color: "#FFD700", glow: "rgba(255,215,0,0.6)"   },
  blue:       { name: "Blue",    color: "#4169E1", glow: "rgba(65,105,225,0.6)"  },
  red:        { name: "Red",     color: "#FF4444", glow: "rgba(255,68,68,0.6)"   },
  purple:     { name: "Purple",  color: "#8B5CF6", glow: "rgba(139,92,246,0.6)"  },
  green:      { name: "Green",   color: "#22C55E", glow: "rgba(34,197,94,0.6)"   },
  indigo:     { name: "Indigo",  color: "#6366F1", glow: "rgba(99,102,241,0.6)"  },
  pink:       { name: "Pink",    color: "#EC4899", glow: "rgba(236,72,153,0.6)"  },
  orange:     { name: "Orange",  color: "#F97316", glow: "rgba(249,115,22,0.6)"  },
}

export function getAuraImageSrc(result: AuraResult): string {
  if (result.image) return `data:image/png;base64,${result.image}`
  if (result.imageUrl) return result.imageUrl
  return ""
}

export const moodOptions = [
  { value: "happy",      label: "😊 Happy" },
  { value: "calm",       label: "😌 Calm" },
  { value: "energetic",  label: "⚡ Energetic" },
  { value: "creative",   label: "🎨 Creative" },
  { value: "peaceful",   label: "🕊️ Peaceful" },
  { value: "intuitive",  label: "🔮 Intuitive" },
  { value: "passionate", label: "🔥 Passionate" },
  { value: "grounded",   label: "🌿 Grounded" },
]

export const personalityOptions = [
  { value: "introvert",  label: "🤫 Introvert" },
  { value: "extrovert",  label: "🎉 Extrovert" },
  { value: "ambivert",   label: "⚖️ Ambivert" },
  { value: "analytical", label: "🔬 Analytical" },
  { value: "creative",   label: "✨ Creative" },
  { value: "leader",     label: "👑 Leader" },
]

const defaultFormData: AuraFormData = {
  name: "", mood: "", personality: "", energy: 50, image: null, imagePreview: "",
}

export const useAuraStore = create<AuraStore>((set) => ({
  formData:  defaultFormData,
  result:    null,
  isLoading: false,
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setResult:   (result) => set({ result, isLoading: false }),
  setIsLoading:(loading) => set({ isLoading: loading }),
  reset:       () => set({ formData: defaultFormData, result: null, isLoading: false }),
}))