"use client";

import { useAuraStore } from "@/lib/aura-store";

export default function ResultPage() {
  const { auraResult, loading, error } = useAuraStore();

  if (loading) return <p>Analyzing aura...</p>;
  if (error) return <p>Error occurred</p>;
  if (!auraResult) return <p>No result found</p>;

  return (
    <div>
      <h1>{auraResult.aura}</h1>
      <p>{auraResult.chakra}</p>
      <p>{auraResult.confidence}</p>
    </div>
  );
}