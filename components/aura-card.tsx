"use client";

import { forwardRef, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { AuraResult } from "@/lib/aura-store";
import { auraColorMap } from "@/lib/aura-store";

interface AuraCardProps {
  result: AuraResult;
}

const EMOTION_LABELS: Record<string, string> = {
  happy: "Joy",
  sad: "Melancholy",
  angry: "Fire",
  fear: "Mystic",
  disgust: "Earth",
  surprise: "Spark",
  neutral: "Serenity",
};

export const AuraCard = forwardRef<HTMLDivElement, AuraCardProps>(
  ({ result }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const primaryColorKey = result.emotion.toLowerCase();
    const primaryAura = auraColorMap[primaryColorKey] ?? auraColorMap["neutral"];
    const secondaryAura =
      auraColorMap[result.colors[1]?.toLowerCase()] ??
      auraColorMap[result.colors[0]?.toLowerCase()] ??
      primaryAura;
    const tertiaryAura =
      auraColorMap[result.colors[2]?.toLowerCase()] ?? secondaryAura;

    const hex1 = primaryAura.color;
    const hex2 = secondaryAura.color;
    const hex3 = tertiaryAura.color;

    // Animated particle canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 350;
      canvas.height = 560;

      const particles: {
        x: number;
        y: number;
        r: number;
        vx: number;
        vy: number;
        alpha: number;
        color: string;
      }[] = [];

      const colors = [hex1, hex2, hex3];

      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * 350,
          y: Math.random() * 560,
          r: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      let animId: number;

      const tick = () => {
        ctx.clearRect(0, 0, 350, 560);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = 350;
          if (p.x > 350) p.x = 0;
          if (p.y < 0) p.y = 560;
          if (p.y > 560) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle =
            p.color +
            Math.round(p.alpha * 255)
              .toString(16)
              .padStart(2, "0");
          ctx.fill();
        }
        animId = requestAnimationFrame(tick);
      };

      tick();
      return () => cancelAnimationFrame(animId);
    }, [hex1, hex2, hex3]);

    const confidencePct = Math.round(result.confidence * 100);
    const emotionLabel = EMOTION_LABELS[result.emotion] ?? result.emotion;

    const imageSrc = result.imageUrl
      ? result.imageUrl
      : result.image
      ? `data:image/png;base64,${result.image}`
      : null;

    return (
      <div
        ref={ref}
        className="relative w-[350px] overflow-hidden"
        style={{
          borderRadius: "28px",
          background: "linear-gradient(160deg, #0d0118 0%, #050d1e 60%, #0d0118 100%)",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06),
            0 30px 80px rgba(0,0,0,0.6),
            0 0 60px ${hex1}33,
            0 0 120px ${hex2}22`,
          minHeight: "560px",
        }}
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.6, borderRadius: "28px" }}
        />

        {/* Radial gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: "28px" }}>
          {[
            { color: hex1, x: "20%", y: "15%", size: "300px" },
            { color: hex2, x: "75%", y: "55%", size: "250px" },
            { color: hex3, x: "40%", y: "85%", size: "200px" },
          ].map((blob, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: blob.x,
                top: blob.y,
                width: blob.size,
                height: blob.size,
                background: blob.color,
                filter: "blur(80px)",
                transform: "translate(-50%, -50%)",
                opacity: 0.15,
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
              transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Glass overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)",
            borderRadius: "28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-8 pb-7">
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              {[hex1, hex2, hex3].map((c, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === 0 ? 10 : i === 1 ? 8 : 6,
                    height: i === 0 ? 10 : i === 1 ? 8 : 6,
                    background: c,
                    boxShadow: `0 0 8px ${c}`,
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </div>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}
            >
              Aura · AI
            </span>
            <div
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: `${hex1}22`,
                border: `1px solid ${hex1}44`,
                color: hex1,
                letterSpacing: "0.05em",
              }}
            >
              {emotionLabel}
            </div>
          </div>

          {/* Portrait */}
          <div className="relative mb-6" style={{ width: 180, height: 180 }}>
            {/* Spinning ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${hex1}, ${hex2}, ${hex3}, ${hex1})`,
                padding: "2px",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ background: "#0d0118" }}
              />
            </motion.div>

            {/* Glow rings */}
            {[1.2, 1.4, 1.6].map((scale, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${hex1}${["30", "20", "10"][i]} 0%, transparent 70%)`,
                  transform: `scale(${scale})`,
                }}
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [scale, scale + 0.05, scale] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            {/* Portrait image */}
            <div
              className="absolute rounded-full overflow-hidden"
              style={{ inset: "8px" }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Your aura portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${hex1}33, ${hex2}33)`,
                    fontSize: 48,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  ✦
                </div>
              )}
            </div>
          </div>

          {/* Name + Aura Name */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center mb-1"
            style={{
              background: `linear-gradient(90deg, ${hex1}, ${hex2}, ${hex3})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em",
            }}
          >
            {result.name}
          </motion.h2>

          <p
            className="text-sm text-center mb-5"
            style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", fontFamily: "monospace" }}
          >
            {result.colors.join(" · ").toUpperCase()}
          </p>

          {/* Description */}
          <p
            className="text-sm text-center leading-relaxed mb-6 px-1"
            style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}
          >
            {result.description}
          </p>

          {/* Stats row */}
          <div
            className="w-full grid grid-cols-3 gap-2 mb-5"
          >
            {[
              { label: "Chakra", value: result.chakra },
              { label: "Frequency", value: `${confidencePct}%` },
              { label: "Energy", value: result.emotion.charAt(0).toUpperCase() + result.emotion.slice(1) },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-3 px-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                }}
              >
                <span
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}
                >
                  {stat.label}
                </span>
                <span
                  className="text-xs font-semibold text-center"
                  style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.02em" }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Confidence bar */}
          <div className="w-full mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}
              >
                Aura Intensity
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: hex1 }}
              >
                {confidencePct}%
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: "4px", background: "rgba(255,255,255,0.08)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${hex1}, ${hex2})` }}
                initial={{ width: 0 }}
                animate={{ width: `${confidencePct}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </div>

          {/* Aura hex chip */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{
              background: `${hex1}15`,
              border: `1px solid ${hex1}30`,
            }}
          >
            <div
              className="rounded-full"
              style={{ width: 10, height: 10, background: hex1, boxShadow: `0 0 6px ${hex1}` }}
            />
            <span
              className="text-xs font-mono"
              style={{ color: hex1, letterSpacing: "0.1em" }}
            >
              {result.hex} · {result.chakra} Chakra
            </span>
          </div>

          {/* Footer */}
          <p
            className="mt-5 text-[9px] uppercase tracking-[0.25em]"
            style={{ color: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}
          >
            Generated by Aura AI
          </p>
        </div>
      </div>
    );
  }
);

AuraCard.displayName = "AuraCard";