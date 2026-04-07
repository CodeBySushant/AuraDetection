import { create } from 'zustand'

export interface AuraResult {
  colors: string[]
  description: string
  imageUrl: string
  name: string
}

export interface FormData {
  name: string
  mood: string
  personality: string
  energy: number
  image: File | null
  imagePreview: string | null
}

interface AuraStore {
  formData: FormData
  result: AuraResult | null
  isLoading: boolean
  setFormData: (data: Partial<FormData>) => void
  setResult: (result: AuraResult | null) => void
  setIsLoading: (loading: boolean) => void
  reset: () => void
}

const initialFormData: FormData = {
  name: '',
  mood: '',
  personality: '',
  energy: 50,
  image: null,
  imagePreview: null,
}

export const useAuraStore = create<AuraStore>((set) => ({
  formData: initialFormData,
  result: null,
  isLoading: false,
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setResult: (result) => set({ result }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ formData: initialFormData, result: null, isLoading: false }),
}))

// Aura color mapping based on emotions
export const auraColorMap: Record<string, { name: string; color: string; glow: string }> = {
  happy: { name: 'Yellow', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.6)' },
  calm: { name: 'Blue', color: '#4169E1', glow: 'rgba(65, 105, 225, 0.6)' },
  energetic: { name: 'Red', color: '#FF4444', glow: 'rgba(255, 68, 68, 0.6)' },
  creative: { name: 'Purple', color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.6)' },
  peaceful: { name: 'Green', color: '#22C55E', glow: 'rgba(34, 197, 94, 0.6)' },
  intuitive: { name: 'Indigo', color: '#6366F1', glow: 'rgba(99, 102, 241, 0.6)' },
  passionate: { name: 'Pink', color: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)' },
  grounded: { name: 'Orange', color: '#F97316', glow: 'rgba(249, 115, 22, 0.6)' },
}

export const moodOptions = [
  { value: 'happy', label: 'Happy & Joyful' },
  { value: 'calm', label: 'Calm & Serene' },
  { value: 'energetic', label: 'Energetic & Excited' },
  { value: 'creative', label: 'Creative & Inspired' },
  { value: 'peaceful', label: 'Peaceful & Content' },
  { value: 'passionate', label: 'Passionate & Driven' },
]

export const personalityOptions = [
  { value: 'introvert', label: 'Introvert' },
  { value: 'extrovert', label: 'Extrovert' },
  { value: 'ambivert', label: 'Ambivert' },
  { value: 'analytical', label: 'Analytical Thinker' },
  { value: 'creative', label: 'Creative Soul' },
  { value: 'leader', label: 'Natural Leader' },
]

export function generateAuraDescription(colors: string[], name: string, mood: string, personality: string): string {
  const descriptions: Record<string, string> = {
    Yellow: 'radiates warmth and optimism',
    Blue: 'emanates tranquility and wisdom',
    Red: 'pulses with vitality and passion',
    Purple: 'shimmers with creativity and mysticism',
    Green: 'flows with harmony and growth',
    Indigo: 'glows with intuition and depth',
    Pink: 'sparkles with love and compassion',
    Orange: 'burns with enthusiasm and confidence',
  }

  const colorDescriptions = colors.map(c => descriptions[c] || 'glows mysteriously').join(', ')
  
  return `${name}, your aura ${colorDescriptions}. As a ${personality} with a ${mood} energy, you possess a unique blend of spiritual frequencies. Your dominant colors reveal a soul that seeks balance while embracing transformation. This combination suggests strong emotional intelligence and a natural ability to inspire others.`
}
