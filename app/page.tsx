"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-6">
        Aura & Chakra Analyzer
      </h1>

      <p className="text-gray-400 mb-8">
        Discover your energy through aura and chakra analysis
      </p>

      <div className="flex gap-4">

        {/* Aura */}
        <Link href="/questionnaire">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg">
            Aura Detection
          </button>
        </Link>

        {/* Chakra */}
        <Link href="/chakra">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg">
            Chakra Analysis
          </button>
        </Link>

      </div>

    </main>
  );
}