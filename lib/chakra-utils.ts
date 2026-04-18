export const chakraInfo: Record<string, { color: string; description: string }> = {
  "Root Chakra": {
    color: "#DC2626",
    description: "Represents stability, grounding, and basic survival needs.",
  },
  "Sacral Chakra": {
    color: "#F97316",
    description: "Controls creativity, emotions, and pleasure.",
  },
  "Solar Plexus Chakra": {
    color: "#EAB308",
    description: "Represents confidence, power, and self-esteem.",
  },
  "Heart Chakra": {
    color: "#22C55E",
    description: "Controls love, compassion, and emotional balance.",
  },
  "Throat Chakra": {
    color: "#3B82F6",
    description: "Represents communication and truth expression.",
  },
  "Third Eye Chakra": {
    color: "#6366F1",
    description: "Controls intuition and inner awareness.",
  },
  "Crown Chakra": {
    color: "#A855F7",
    description: "Represents spiritual connection and higher consciousness.",
  },
};

export function calculateChakras(answers: number[]) {
  const chakras = [
    "Root Chakra",
    "Sacral Chakra",
    "Solar Plexus Chakra",
    "Heart Chakra",
    "Throat Chakra",
    "Third Eye Chakra",
    "Crown Chakra",
  ];

  const result: any = {};

  for (let i = 0; i < chakras.length; i++) {
    const start = i * 7;
    const scores = answers.slice(start, start + 7);

    const avg =
      scores.reduce((sum, val) => sum + val, 0) / scores.length;

    let state = "Balanced";

    if (avg < 2.5) state = "Blocked";
    else if (avg < 3.5) state = "Imbalanced";

    result[chakras[i]] = {
      score: Math.round((avg / 5) * 100),
      state,
    };
  }

  return result;
}