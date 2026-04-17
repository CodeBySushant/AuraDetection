export async function analyzeChakra(answers: number[]) {
  const res = await fetch("/api/chakra", {
    method: "POST",
    body: JSON.stringify({ answers }),
    headers: { "Content-Type": "application/json" },
  });

  return res.json();
}