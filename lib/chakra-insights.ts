export function generateChakraReport(result: any) {
  if (!result) return null;

  const entries = Object.entries(result);

  // 🔥 FIX: safe numeric sorting
  const sorted = [...entries].sort(
    (a: any, b: any) => Number(b[1].score) - Number(a[1].score)
  );

  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const avg =
    entries.reduce((sum: number, item: any) => sum + Number(item[1].score), 0) /
    entries.length;

  // 🔥 categorize
  const strongChakras = sorted.filter((c: any) => c[1].score >= 75);
  const weakChakras = sorted.filter((c: any) => c[1].score < 45);

  const names = strongChakras.map((c: any) => c[0]);

  // 🔥 FIXED: correct chakra names
  let personalityInsight = "";

  if (
    names.includes("Solar Plexus Chakra") &&
    names.includes("Throat Chakra")
  ) {
    personalityInsight =
      "You have a strong sense of confidence and communication, making you naturally expressive and leadership-oriented.";
  } else if (
    names.includes("Heart Chakra") &&
    names.includes("Crown Chakra")
  ) {
    personalityInsight =
      "You are deeply compassionate and spiritually aware, often guided by empathy and higher understanding.";
  } else if (
    names.includes("Root Chakra") &&
    names.includes("Solar Plexus Chakra")
  ) {
    personalityInsight =
      "You are grounded, disciplined, and action-driven, with strong control over your life direction.";
  } else {
    personalityInsight =
      "Your energy reflects a unique blend of strengths that shape your personality and life approach.";
  }

  // 🔥 summary
  let summary = "";

  if (avg > 75) {
    summary =
      "Your energy system is highly balanced, indicating strong alignment across your chakras.";
  } else if (avg > 55) {
    summary =
      "Your chakras are moderately balanced, with some areas needing attention.";
  } else {
    summary =
      "Your energy system shows imbalance, suggesting the need for grounding and healing.";
  }

  // 🔥 strength
  const strength = `Your strongest chakra is ${strongest[0]}, representing a natural strength in this energy area.`;

  // 🔥 weakness
  const weakness = `Your weakest chakra is ${weakest[0]}, indicating a potential imbalance or blockage.`;

  // 🔥 FIXED: recommendation keys
  const recommendationMap: Record<string, string[]> = {
    "Root Chakra": [
      "Walk barefoot on natural ground",
      "Build a stable daily routine",
      "Focus on security and stability",
    ],
    "Sacral Chakra": [
      "Engage in creative activities",
      "Allow emotional expression",
      "Enjoy life experiences",
    ],
    "Solar Plexus Chakra": [
      "Set small achievable goals",
      "Build confidence through action",
      "Avoid overthinking",
    ],
    "Heart Chakra": [
      "Practice gratitude",
      "Open emotionally",
      "Forgive past experiences",
    ],
    "Throat Chakra": [
      "Speak your truth",
      "Write your thoughts",
      "Communicate clearly",
    ],
    "Third Eye Chakra": [
      "Meditate regularly",
      "Trust your intuition",
      "Reflect deeply",
    ],
    "Crown Chakra": [
      "Practice mindfulness",
      "Connect spiritually",
      "Let go of control",
    ],
  };

  const recommendations =
    recommendationMap[weakest[0]] || ["Focus on self-awareness and balance"];

  return {
    summary,
    personalityInsight,
    strength,
    weakness,
    recommendations,
    strongest: strongest[0],
    weakest: weakest[0],
    strongChakras: strongChakras.map((c: any) => c[0]),
    weakChakras: weakChakras.map((c: any) => c[0]),
  };
}