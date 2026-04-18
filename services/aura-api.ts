import type { AuraFormData, AuraResult } from "@/lib/aura-store"

export async function submitAuraForm(
  formData: AuraFormData,
  name: string
): Promise<AuraResult> {
  if (!formData.image) throw new Error("No image provided")

  const fd = new FormData()
  fd.append("name",        name)
  fd.append("mood",        formData.mood)
  fd.append("personality", formData.personality)
  fd.append("energy",      String(formData.energy))
  fd.append("image",       formData.image)

  const res = await fetch("/api/aura", {
    method: "POST",
    body:   fd,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ?? `API error ${res.status}`)
  }

  const json = await res.json()

  if (!json.success || !json.data) {
    throw new Error("Invalid response from API")
  }

  const d = json.data

  // Build imageUrl from base64 if available
  let imageUrl = formData.imagePreview ?? ""

  return {
    name,
    colors:      d.colors,
    description: d.description,
    imageUrl,
    image:       d.image,   // base64 from Python (bg-removed aura image)
    emotion:     d.emotion,
    confidence:  d.confidence,
    chakra:      d.chakra,
    hex:         d.hex,
  }
}