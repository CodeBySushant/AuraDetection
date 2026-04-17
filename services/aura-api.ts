export const detectAura = async (image: string) => {
  const res = await fetch("http://localhost:5000/api/aura/detect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });

  if (!res.ok) throw new Error("API failed");

  return res.json();
};