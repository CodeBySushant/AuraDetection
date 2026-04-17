"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { AuraResult } from "@/lib/aura-store";
import { getAuraImageSrc } from "@/lib/aura-store";

interface AuraCardProps {
  result: AuraResult;
  auraColors: { name: string; color: string; glow: string }[];
}

export const AuraCard = forwardRef<HTMLDivElement, AuraCardProps>(
  ({ result, auraColors }, ref) => {
    const gradientColors = auraColors.map((c) => c.color).join(", ");
    const glowColor =
      auraColors[0]?.glow || "rgba(139, 92, 246, 0.6)";

    return (
      <div
        ref={ref}
        className="relative w-[350px] overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1a0533] to-[#0d1b3c] p-6 shadow-2xl"
        style={{
          boxShadow: `0 0 60px ${glowColor}, 0 0 120px ${glowColor}`,
        }}
      >
        {/* 🌈 Background Aura Glow */}
        <div className="absolute inset-0 overflow-hidden">
          {auraColors.map((color, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: "200%",
                height: "200%",
                left: "-50%",
                top: "-50%",
                background: `radial-gradient(circle at ${
                  50 + (i - 1) * 20
                }% ${50 + (i - 1) * 10}%, ${
                  color.glow
                } 0%, transparent 50%)`,
                filter: "blur(40px)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* 📦 Card Content */}
        <div className="relative z-10">
          {/* Title */}
          <div className="mb-4 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-white/60">
              Your Aura
            </p>
            <h2
              className="mt-1 bg-gradient-to-r bg-clip-text text-lg font-bold tracking-wider text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${gradientColors})`,
              }}
            >
              {result.colors.join(" • ")}
            </h2>
          </div>

          {/* 🧑 Image with Aura */}
          <div className="relative mx-auto mb-4 h-56 w-56">
            {/* Glow Rings */}
            {auraColors.map((color, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${color.glow} 0%, transparent 70%)`,
                  transform: `scale(${1.3 + i * 0.2})`,
                  filter: "blur(20px)",
                }}
                animate={{
                  scale: [
                    1.3 + i * 0.2,
                    1.5 + i * 0.2,
                    1.3 + i * 0.2,
                  ],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Image */}
            <div className="absolute inset-4 overflow-hidden rounded-full ring-2 ring-white/20">
              <img
                src={getAuraImageSrc(result)}
                alt="Aura"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* 📄 Description */}
          <p className="mb-4 text-center text-sm leading-relaxed text-white/70">
            {result.description}
          </p>

          {/* 🔥 AI Info (NEW) */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">
              {result.emotion}
            </span>

            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">
              {result.chakra} chakra
            </span>

            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">
              {Math.round(result.confidence * 100)}% confidence
            </span>
          </div>

          {/* 🎨 Color indicators */}
          <div className="mt-4 flex justify-center gap-2">
            {auraColors.map((color, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full ring-1 ring-white/20"
                style={{
                  backgroundColor: color.color,
                  boxShadow: `0 0 10px ${color.glow}`,
                }}
              />
            ))}
          </div>

          {/* Branding */}
          <div className="mt-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/30">
              Generated by Aura AI
            </p>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute left-4 top-4 h-20 w-20 rounded-full border border-white/5" />
        <div className="absolute bottom-4 right-4 h-16 w-16 rounded-full border border-white/5" />
      </div>
    );
  }
);

AuraCard.displayName = "AuraCard";