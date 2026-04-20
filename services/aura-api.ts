import type { AuraFormData, AuraResult } from "@/lib/aura-store";

export async function submitAuraForm(
  formData: AuraFormData,
  name: string
): Promise<AuraResult> {
  if (!formData.image) throw new Error("No image provided");

  const fd = new FormData();
  fd.append("name", name);
  fd.append("mood", formData.mood);
  fd.append("personality", formData.personality);
  fd.append("energy", String(formData.energy));
  fd.append("image", formData.image); // IMPORTANT: keep "image" here

  const res = await fetch("/api/aura", {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `API error ${res.status}`);
  }

  const json = await res.json();

  // ✅ FIX HERE
  if (!json.success || !json.data) {
    console.error("API RESPONSE:", json);
    throw new Error("Invalid response from API");
  }

  const d = json.data;

  return {
    name,
    colors: d.colors,
    description: d.description,
    imageUrl: formData.imagePreview ?? "",
    image: d.image,
    emotion: d.emotion,
    confidence: d.confidence,
    chakra: d.chakra,
    hex: d.hex,
    all_scores: d.all_scores,
    ranked_emotions: d.ranked_emotions,
  };
}