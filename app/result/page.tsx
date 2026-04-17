"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Download, Share2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuraStore, auraColorMap } from "@/lib/aura-store";
import { AuraCard } from "@/components/aura-card";
import { toPng } from "html-to-image";

export default function ResultPage() {
  const router = useRouter();
  const { result, formData, reset } = useAuraStore(); // ✅ include formData
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) {
      router.push("/questionnaire");
    }
  }, [result, router]);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#1a0533",
      });

      const link = document.createElement("a");
      link.download = `${formData.name || "aura"}-aura-card.png`; // ✅ fixed
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download card:", error);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#1a0533",
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "aura-card.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Aura Card",
          text: "Check out my personalized aura card!",
          files: [file],
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        alert("Card copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to share card:", error);
    }
  };

  const handleStartOver = () => {
    reset();
    router.push("/");
  };

  if (!result) {
    return null;
  }

  // ✅ Map color names → actual color objects
  const auraColors = result.colors.map((colorName) => {
    const colorKey = Object.keys(auraColorMap).find(
      (key) => auraColorMap[key].name === colorName
    );
    return colorKey ? auraColorMap[colorKey] : auraColorMap.creative;
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0d1b3c] to-[#1a0533]">
        {auraColors.map((color, i) => (
          <motion.div
            key={i}
            className="absolute h-80 w-80 rounded-full blur-[120px]"
            style={{
              backgroundColor: color.glow,
              left: `${20 + i * 30}%`,
              top: `${30 + i * 15}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="bg-gradient-to-r from-white via-primary-foreground to-accent bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Your Aura Revealed
          </h1>
          <p className="mt-2 text-muted-foreground">
            {formData.name
              ? `${formData.name}, here's your unique energy signature`
              : "Here’s your unique energy signature"}
          </p>
        </motion.div>

        {/* Aura Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <AuraCard
            ref={cardRef}
            result={result}
            auraColors={auraColors}
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>

          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button onClick={handleStartOver} variant="ghost">
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </motion.div>

        {/* Color Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 max-w-md text-center"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            About Your Aura Colors
          </h2>

          <div className="flex flex-wrap justify-center gap-2">
            {auraColors.map((color, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color.color }}
                />
                <span>{color.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}