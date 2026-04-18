"use client";

import { useState, useEffect, useRef } from "react";
import { chakraQuestions } from "@/data/chakraQuestions";
import { useRouter } from "next/navigation";

/* ── Chakra metadata ── */
const CHAKRA_META: Record<string, { color: string; glyph: string; element: string; mantra: string }> = {
  Root:        { color: "#ef4444", glyph: "✦", element: "Earth",  mantra: "LAM" },
  Sacral:      { color: "#f97316", glyph: "✦", element: "Water",  mantra: "VAM" },
  "Solar Plexus": { color: "#eab308", glyph: "✦", element: "Fire",   mantra: "RAM" },
  Heart:       { color: "#22c55e", glyph: "✦", element: "Air",    mantra: "YAM" },
  Throat:      { color: "#3b82f6", glyph: "✦", element: "Sound",  mantra: "HAM" },
  "Third Eye": { color: "#8b5cf6", glyph: "✦", element: "Light",  mantra: "AUM" },
  Crown:       { color: "#a855f7", glyph: "✦", element: "Thought", mantra: "OM" },
};

const OPTIONS = ["Not at all", "Slightly", "Somewhat", "Mostly", "Completely"];

/* ── Progress ring SVG ── */
function ProgressRing({ pct, color, size = 44 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e3a" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
}

/* ── Individual question row ── */
function QuestionRow({
  question, index, globalIndex, value, onChange, color,
}: {
  question: string; index: number; globalIndex: number;
  value: number; onChange: (v: number) => void; color: string;
}) {
  return (
    <div className="group relative">
      <div className="flex gap-4 items-start p-4 rounded-xl transition-all duration-300"
        style={{ background: value > 0 ? `${color}08` : "transparent",
          border: `1px solid ${value > 0 ? color + "30" : "transparent"}` }}>

        {/* question number badge */}
        <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
          style={{ background: value > 0 ? color : "#1e1e3a",
            color: value > 0 ? "#fff" : "#6b7280", transition: "all 0.3s" }}>
          {globalIndex + 1}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed mb-3"
            style={{ color: value > 0 ? "#e2e8f0" : "#94a3b8", transition: "color 0.3s" }}>
            {question}
          </p>

          {/* option pills */}
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((label, val) => {
              const selected = value === val + 1;
              return (
                <button key={val} onClick={() => onChange(val + 1)}
                  className="relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background: selected ? color : "#0f0f23",
                    color: selected ? "#fff" : "#64748b",
                    border: `1px solid ${selected ? color : "#1e293b"}`,
                    transform: selected ? "scale(1.05)" : "scale(1)",
                    boxShadow: selected ? `0 0 12px ${color}55` : "none",
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* answered tick */}
        {value > 0 && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
            style={{ background: color }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Chakra section card ── */
function ChakraSection({
  chakra, questions, startIndex, answers, onChange, sectionIndex,
}: {
  chakra: string; questions: string[]; startIndex: number;
  answers: number[]; onChange: (i: number, v: number) => void; sectionIndex: number;
}) {
  const meta = CHAKRA_META[chakra] ?? { color: "#8b5cf6", glyph: "✦", element: "Spirit", mantra: "OM" };
  const answered = questions.filter((_, i) => answers[startIndex + i] > 0).length;
  const pct = Math.round((answered / questions.length) * 100);
  const [open, setOpen] = useState(sectionIndex === 0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        border: `1px solid ${pct === 100 ? meta.color + "55" : "#1e293b"}`,
        background: "linear-gradient(145deg, #0a0a1a 0%, #070712 100%)",
        boxShadow: open ? `0 0 40px ${meta.color}15` : "none",
        transition: `opacity 0.6s ${sectionIndex * 0.08}s, transform 0.6s ${sectionIndex * 0.08}s, box-shadow 0.4s`,
      }}>

      {/* section header — click to expand/collapse */}
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 text-left group/hdr">

        {/* color dot + ring */}
        <div className="relative flex-shrink-0">
          <ProgressRing pct={pct} color={meta.color} size={48} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full" style={{ background: meta.color + "33",
              boxShadow: `0 0 10px ${meta.color}66` }} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-display text-base font-semibold text-white">{chakra}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: meta.color + "20", color: meta.color }}>
              {meta.element}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono tracking-widest"
              style={{ background: "#ffffff08", color: "#6b7280" }}>
              {meta.mantra}
            </span>
          </div>
          <p className="text-xs" style={{ color: "#64748b" }}>
            {answered} / {questions.length} answered
          </p>
        </div>

        {/* right side: pct + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {pct === 100 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: meta.color + "20", color: meta.color }}>
              Complete ✓
            </span>
          )}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s",
              color: "#64748b" }}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* collapsible questions */}
      <div style={{ maxHeight: open ? "9999px" : "0px", overflow: "hidden",
          transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
        <div className="px-5 pb-5 space-y-2"
          style={{ borderTop: `1px solid ${meta.color}18` }}>
          <div className="pt-4 space-y-2">
            {questions.map((q, i) => (
              <QuestionRow key={i} question={q} index={i}
                globalIndex={startIndex + i} value={answers[startIndex + i]}
                onChange={(v) => onChange(startIndex + i, v)} color={meta.color} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function ChakraPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(49).fill(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalQ = answers.length;
  const answered = answers.filter(v => v > 0).length;
  const overallPct = Math.round((answered / totalQ) * 100);

  const handleChange = (index: number, value: number) => {
    setAnswers(prev => { const u = [...prev]; u[index] = value; return u; });
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (answers.includes(0)) {
      setError(`Please answer all ${totalQ} questions. ${totalQ - answered} remaining.`);
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
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  /* build start indices per chakra section */
  const sections: { chakra: string; questions: string[]; start: number }[] = [];
  let cursor = 0;
  for (const section of chakraQuestions) {
    sections.push({ chakra: section.chakra, questions: section.questions, start: cursor });
    cursor += section.questions.length;
  }

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Cinzel', serif; }
        body { font-family: 'DM Sans', sans-serif; }

        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-spin-slow { animation: spin-slow 18s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 12s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #c4b5fd, #818cf8, #a78bfa, #c084fc, #c4b5fd);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 4px; }
      `}</style>

      <main className="min-h-screen text-white"
        style={{ background: "radial-gradient(ellipse 120% 80% at 50% -20%, #0f0520 0%, #030308 60%)" }}>

        {/* ── decorative background orbs ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full animate-pulse-glow"
            style={{ background: "radial-gradient(circle, #7c3aed18 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full animate-pulse-glow"
            style={{ background: "radial-gradient(circle, #3b82f618 0%, transparent 70%)", animationDelay: "1.2s" }} />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full animate-pulse-glow"
            style={{ background: "radial-gradient(circle, #ec489918 0%, transparent 70%)", animationDelay: "2.4s" }} />
          {/* star dots */}
          {[...Array(24)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-pulse-glow"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                background: "#fff",
                opacity: Math.random() * 0.4 + 0.1,
                animationDelay: Math.random() * 4 + "s",
                animationDuration: Math.random() * 3 + 2 + "s",
              }} />
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-16 space-y-8">

          {/* ── HERO HEADER ── */}
          <div className="text-center space-y-5 mb-12">
            {/* floating glyph */}
            <div className="animate-float mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #4c1d9520, #1e1b4b40)",
                border: "1px solid #4c1d9540", boxShadow: "0 0 40px #7c3aed30" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L16.5 11.5H26L18.5 17.5L21 27L14 21L7 27L9.5 17.5L2 11.5H11.5L14 2Z"
                  fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </div>

            <div>
              <p className="text-xs tracking-[0.35em] uppercase mb-3"
                style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
                Energy Alignment Assessment
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                <span className="shimmer-text">Chakra Analysis</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed max-w-md mx-auto"
                style={{ color: "#94a3b8" }}>
                Answer honestly to reveal the true state of your seven energy centers.
                Each question reflects a facet of your inner world.
              </p>
            </div>
          </div>

          {/* ── STICKY PROGRESS BAR ── */}
          <div className="sticky top-4 z-50">
            <div className="rounded-2xl px-5 py-3 backdrop-blur-xl flex items-center gap-4"
              style={{ background: "rgba(5,5,18,0.85)", border: "1px solid #1e293b",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>

              {/* text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
                    {answered} <span style={{ color: "#475569" }}>/ {totalQ} answered</span>
                  </span>
                  <span className="text-xs font-bold tabular-nums"
                    style={{ color: overallPct === 100 ? "#22c55e" : "#a78bfa" }}>
                    {overallPct}%
                  </span>
                </div>
                {/* track */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#0f172a" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${overallPct}%`,
                      background: overallPct === 100
                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : "linear-gradient(90deg, #7c3aed, #a78bfa, #818cf8)",
                      boxShadow: overallPct === 100 ? "0 0 8px #22c55e88" : "0 0 8px #7c3aed88",
                    }} />
                </div>
              </div>

              {/* mini chakra dots */}
              <div className="flex gap-1 flex-shrink-0">
                {sections.map(({ chakra, questions, start }) => {
                  const meta = CHAKRA_META[chakra] ?? { color: "#8b5cf6" };
                  const done = questions.filter((_, i) => answers[start + i] > 0).length === questions.length;
                  return (
                    <div key={chakra} className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={{ background: done ? meta.color : "#1e293b",
                        boxShadow: done ? `0 0 6px ${meta.color}` : "none" }} />
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── CHAKRA SECTIONS ── */}
          <div className="space-y-4">
            {sections.map(({ chakra, questions, start }, idx) => (
              <ChakraSection key={chakra} chakra={chakra} questions={questions}
                startIndex={start} answers={answers} onChange={handleChange}
                sectionIndex={idx} />
            ))}
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div className="rounded-xl px-5 py-4 flex items-center gap-3 text-sm"
              style={{ background: "#1f0a0a", border: "1px solid #ef444430", color: "#f87171" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.2"/>
                <path d="M8 5V8.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="#ef4444"/>
              </svg>
              {error}
            </div>
          )}

          {/* ── SUBMIT ── */}
          <div className="pt-4 pb-16">
            <button onClick={handleSubmit} disabled={loading}
              className="w-full relative group overflow-hidden rounded-2xl py-4 font-semibold text-base transition-all duration-300"
              style={{
                background: loading
                  ? "#1e1e3a"
                  : "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)",
                color: loading ? "#6b7280" : "#fff",
                border: `1px solid ${loading ? "#1e293b" : "#7c3aed"}`,
                boxShadow: loading ? "none" : "0 0 32px #7c3aed44, 0 4px 24px rgba(0,0,0,0.4)",
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              {/* shimmer sweep on hover */}
              {!loading && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                    transform: "skewX(-20deg)" }} />
              )}

              <span className="relative flex items-center justify-center gap-2.5">
                {loading ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7" stroke="#4b5563" strokeWidth="2"/>
                      <path d="M9 2A7 7 0 0 1 16 9" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Analyzing your energy field…</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1L11 7H17L12.5 10.5L14.5 17L9 13L3.5 17L5.5 10.5L1 7H7L9 1Z"
                        fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-display tracking-wide">Reveal My Chakra Analysis</span>
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-xs mt-3" style={{ color: "#334155" }}>
              {overallPct < 100
                ? `${totalQ - answered} question${totalQ - answered !== 1 ? "s" : ""} remaining`
                : "All questions answered — you're ready!"}
            </p>
          </div>

        </div>
      </main>
    </>
  );
}