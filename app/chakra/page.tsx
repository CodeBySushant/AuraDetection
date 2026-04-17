"use client";

import { useState } from "react";
import { chakraQuestions } from "@/data/chakraQuestions";
import { useRouter } from "next/navigation";

export default function ChakraPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(49).fill(0));
  const [loading, setLoading] = useState(false);

  const options = [
    "Not at all",
    "Slightly",
    "Somewhat",
    "Mostly",
    "Completely",
  ];

  const handleChange = (index: number, value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.includes(0)) {
      alert("Please answer all questions");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chakra", {
        method: "POST",
        body: JSON.stringify({ answers }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      localStorage.setItem("chakraResult", JSON.stringify(data.data));

      router.push("/chakra-result");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  let qIndex = 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-10">

        <h1 className="text-3xl font-bold text-center">
          Chakra Analysis
        </h1>

        {chakraQuestions.map((chakra, cIndex) => (
          <div key={cIndex} className="space-y-6 border-b pb-6">
            <h2 className="text-xl font-semibold underline">
              {chakra.chakra} Evaluation
            </h2>

            {chakra.questions.map((q, i) => {
              const index = qIndex++;

              return (
                <div key={i} className="space-y-2">
                  <p className="text-sm">
                    {index + 1}. {q}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs">
                    {options.map((label, val) => (
                      <label key={val} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q-${index}`}
                          checked={answers[index] === val + 1}
                          onChange={() =>
                            handleChange(index, val + 1)
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Analyze Chakra"}
          </button>
        </div>
      </div>
    </main>
  );
}