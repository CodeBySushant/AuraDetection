"use client";

import { useEffect, useState } from "react";
import { chakraInfo } from "@/lib/chakra-utils";
import { generateChakraReport } from "@/lib/chakra-insights";
import Link from "next/link";

type ChakraData = {
  score: number;
  state: string;
};

export default function ChakraResultPage() {
  const [result, setResult] = useState<Record<string, ChakraData> | null>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("chakraResult");

    if (data) {
      const parsed = JSON.parse(data);
      setResult(parsed);

      const generatedReport = generateChakraReport(parsed);
      setReport(generatedReport);
    }
  }, []);

  // 🔴 EMPTY STATE
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="mb-4">No chakra result found</p>
        <Link href="/chakra">
          <button className="bg-purple-600 px-4 py-2 rounded">
            Take Test Again
          </button>
        </Link>
      </div>
    );
  }

  const entries = Object.entries(result);

  // ✅ SAFE SORT
  const sorted = [...entries].sort(
    (a, b) => Number(b[1].score) - Number(a[1].score)
  );

  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const avgScore =
    entries.reduce((sum, item) => sum + Number(item[1].score), 0) /
    entries.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Your Chakra Analysis</h1>
          <p className="text-gray-400">
            Discover your energy balance across all chakras
          </p>
        </div>

        {/* OVERALL SCORE */}
        <div className="text-center">
          <p className="text-gray-400">Overall Balance</p>
          <h2 className="text-3xl font-bold text-purple-400">
            {avgScore.toFixed(1)}%
          </h2>
        </div>

        {/* HIGHLIGHTS */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <h3 className="font-semibold">🌟 Strongest Chakra</h3>
            <p className="text-lg">{strongest[0]}</p>
            <p className="text-sm text-gray-400">
              Score: {strongest[1].score}%
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <h3 className="font-semibold">⚠️ Needs Attention</h3>
            <p className="text-lg">{weakest[0]}</p>
            <p className="text-sm text-gray-400">
              Score: {weakest[1].score}%
            </p>
          </div>
        </div>

        {/* CHAKRA CARDS */}
        <div className="grid md:grid-cols-2 gap-6">
          {entries.map(([chakra, data]) => {
            const info = chakraInfo[chakra] || {
              color: "#999",
              description: "No description available",
            };

            return (
              <div
                key={chakra}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:scale-[1.02] transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">
                    {chakra}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      data.state === "Balanced"
                        ? "bg-green-500/20 text-green-400"
                        : data.state === "Imbalanced"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {data.state}
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${data.score}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>

                <p className="text-sm text-gray-400 mb-2">
                  Score: {data.score}%
                </p>

                <p className="text-sm">{info.description}</p>
              </div>
            );
          })}
        </div>

        {/* 🧠 INSIGHT REPORT */}
        {report ? (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              🧠 Insight Report
            </h2>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
              <p>
                <strong>Summary:</strong> {report.summary}
              </p>

              <p>
                <strong>Personality Insight:</strong>{" "}
                {report.personalityInsight}
              </p>

              <p>
                <strong>Strength:</strong> {report.strength}
              </p>

              <p>
                <strong>Weakness:</strong> {report.weakness}
              </p>

              <div>
                <strong>Recommendations:</strong>
                <ul className="list-disc ml-5 mt-2">
                  {(report.recommendations || []).map(
                    (rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Generating insights...
          </p>
        )}

        {/* ACTION BUTTON */}
        <div className="text-center pt-6">
          <Link href="/chakra">
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg">
              Retake Chakra Test
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}