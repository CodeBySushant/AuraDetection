"use client";

import { forwardRef, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { AuraResult } from "@/lib/aura-store";
import { auraColorMap } from "@/lib/aura-store";

interface AuraCardProps {
  result: AuraResult;
}

const EMOTION_ICONS: Record<string, string> = {
  happy: "☀", sad: "🌊", angry: "🔥", fear: "🌑",
  disgust: "🌿", surprise: "⚡", neutral: "🌀",
};

const EMOTION_LABELS: Record<string, string> = {
  happy: "Joy", sad: "Melancholy", angry: "Fire",
  fear: "Mystic", disgust: "Earth", surprise: "Spark", neutral: "Serenity",
};

export const AuraCard = forwardRef<HTMLDivElement, AuraCardProps>(({ result }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const primaryKey  = result.emotion.toLowerCase();
  const primaryAura = auraColorMap[primaryKey] ?? auraColorMap["neutral"];

  const hex1 = primaryAura.color;
  const hex2 = auraColorMap[result.colors[1]?.toLowerCase()]?.color ?? hex1;
  const hex3 = auraColorMap[result.colors[2]?.toLowerCase()]?.color ?? hex2;

  // Floating particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 370;
    canvas.height = 680;

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * 370,
      y: Math.random() * 680,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
      color: [hex1, hex2, hex3][Math.floor(Math.random() * 3)],
    }));

    let animId: number;
    const tick = () => {
      ctx.clearRect(0, 0, 370, 680);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 370; if (p.x > 370) p.x = 0;
        if (p.y < 0) p.y = 680; if (p.y > 680) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }
      animId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [hex1, hex2, hex3]);

  const confidencePct = Math.round(result.confidence * 100);
  const emotionLabel  = EMOTION_LABELS[result.emotion] ?? result.emotion;
  const emotionIcon   = EMOTION_ICONS[result.emotion] ?? "✦";
  const imageSrc      = result.image
    ? `data:image/png;base64,${result.image}`
    : result.imageUrl || null;

  // Ranked emotions for the breakdown bar
  const ranked = result.ranked_emotions?.slice(0, 5) ?? [];

  return (
    <div
      ref={ref}
      className="relative w-[370px] overflow-hidden"
      style={{
        borderRadius: "28px",
        background: "linear-gradient(160deg, #0d0118 0%, #050d1e 55%, #0a0d20 100%)",
        boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.65), 0 0 70px ${hex1}2e, 0 0 140px ${hex2}1a`,
        minHeight: "680px",
      }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.55, borderRadius: "28px" }} />

      {/* Blob glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: "28px" }}>
        {[
          { color: hex1, x: "18%",  y: "12%",  size: "320px", dur: 5 },
          { color: hex2, x: "78%",  y: "50%",  size: "260px", dur: 7 },
          { color: hex3, x: "38%",  y: "88%",  size: "220px", dur: 6 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ left: b.x, top: b.y, width: b.size, height: b.size, background: b.color, filter: "blur(90px)", transform: "translate(-50%,-50%)", opacity: 0.13 }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Glass overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.025) 0%,transparent 35%,rgba(0,0,0,0.18) 100%)", borderRadius: "28px" }} />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-7 pb-7">

        {/* Header row */}
        <div className="w-full flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            {[hex1, hex2, hex3].map((c, i) => (
              <motion.div key={i} className="rounded-full"
                style={{ width: i === 0 ? 9 : i === 1 ? 7 : 5, height: i === 0 ? 9 : i === 1 ? 7 : 5, background: c, boxShadow: `0 0 6px ${c}` }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
              />
            ))}
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase" }}>Aura · AI</span>
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${hex1}20`, border: `1px solid ${hex1}40`, color: hex1, letterSpacing: "0.04em" }}>
            {emotionIcon} {emotionLabel}
          </div>
        </div>

        {/* Portrait */}
        <div className="relative mb-5" style={{ width: 168, height: 168 }}>
          <motion.div className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(from 0deg, ${hex1}, ${hex2}, ${hex3}, ${hex1})`, padding: "2.5px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full" style={{ background: "#0d0118" }} />
          </motion.div>
          {[1.25, 1.45, 1.65].map((s, i) => (
            <motion.div key={i} className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(circle, ${hex1}28 0%, transparent 70%)`, transform: `scale(${s})` }}
              animate={{ opacity: [0.35, 0.65, 0.35], scale: [s, s + 0.06, s] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div className="absolute rounded-full overflow-hidden" style={{ inset: "9px" }}>
            {imageSrc ? (
              <img src={imageSrc} alt="Aura portrait" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${hex1}33,${hex2}33)`, fontSize: 40, color: "rgba(255,255,255,0.4)" }}>✦</div>
            )}
          </div>
        </div>

        {/* Name */}
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center mb-1"
          style={{ background: `linear-gradient(90deg,${hex1},${hex2},${hex3})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.01em" }}
        >
          {result.name}
        </motion.h2>

        <p className="text-xs text-center mb-4" style={{ color: "rgba(255,255,255,0.38)", letterSpacing: "0.14em", fontFamily: "monospace", textTransform: "uppercase" }}>
          {result.colors.join(" · ")}
        </p>

        {/* Description */}
        <p className="text-sm text-center leading-relaxed mb-5 px-1" style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.75 }}>
          {result.description}
        </p>

        {/* Stats grid */}
        <div className="w-full grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Chakra",     value: result.chakra },
            { label: "Intensity",  value: `${confidencePct}%` },
            { label: "Frequency",  value: emotionLabel },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center py-3 px-1"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}
            >
              <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 3 }}>{s.label}</span>
              <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 11, fontWeight: 600, letterSpacing: "0.03em", textAlign: "center" }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* ── Emotion Breakdown — the actual DeepFace scores ── */}
        {ranked.length > 0 && (
          <div className="w-full mb-5 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "14px 16px" }}>
            <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
              Emotion Analysis · DeepFace
            </p>
            <div className="flex flex-col gap-2">
              {ranked.map(({ emotion, score }, i) => {
                const aura = auraColorMap[emotion] ?? auraColorMap["neutral"];
                const pct  = Math.round(score);
                const isTop = i === 0;
                return (
                  <div key={emotion} className="flex items-center gap-2">
                    <span style={{ color: isTop ? aura.color : "rgba(255,255,255,0.4)", fontSize: 10, width: 58, fontFamily: "monospace", letterSpacing: "0.05em", textTransform: "capitalize", fontWeight: isTop ? 600 : 400 }}>
                      {emotion}
                    </span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.08)" }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: isTop ? `linear-gradient(90deg,${aura.color},${hex2})` : aura.color + "99" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                    <span style={{ color: isTop ? aura.color : "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "monospace", width: 30, textAlign: "right", fontWeight: isTop ? 600 : 400 }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confidence bar */}
        <div className="w-full mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.18em", textTransform: "uppercase" }}>Aura Intensity</span>
            <span style={{ color: hex1, fontSize: 11, fontWeight: 600 }}>{confidencePct}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.08)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg,${hex1},${hex2})` }}
              initial={{ width: 0 }}
              animate={{ width: `${confidencePct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            />
          </div>
        </div>

        {/* Hex chip */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-5"
          style={{ background: `${hex1}12`, border: `1px solid ${hex1}2e` }}>
          <div className="rounded-full" style={{ width: 9, height: 9, background: hex1, boxShadow: `0 0 6px ${hex1}` }} />
          <span style={{ color: hex1, fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em" }}>
            {result.hex} · {result.chakra} Chakra
          </span>
        </div>

        {/* Footer */}
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.24em", textTransform: "uppercase" }}>
          Generated by Aura AI
        </p>
      </div>
    </div>
  );
});

AuraCard.displayName = "AuraCard";