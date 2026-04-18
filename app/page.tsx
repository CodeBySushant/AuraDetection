"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ── Floating particle ── */
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="absolute rounded-full pointer-events-none" style={style} />;
}

/* ── Animated orbiting ring ── */
function OrbitRing({
  size, duration, color, reverse = false, dotSize = 5,
}: {
  size: number; duration: number; color: string; reverse?: boolean; dotSize?: number;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: `1px solid ${color}22`,
        animation: `${reverse ? "spinR" : "spinF"} ${duration}s linear infinite`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: -dotSize / 2, left: "50%",
          marginLeft: -dotSize / 2, width: dotSize, height: dotSize,
          borderRadius: "50%", background: color,
          boxShadow: `0 0 ${dotSize * 2}px ${color}`,
        }} />
      </div>
    </div>
  );
}

/* ── Card for each feature ── */
function FeatureCard({
  href, label, sub, color, accent, icon, delay,
}: {
  href: string; label: string; sub: string; color: string;
  accent: string; icon: React.ReactNode; delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <Link href={href}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative overflow-hidden rounded-3xl cursor-pointer select-none"
        style={{
          width: 280, padding: "2px",
          background: hovered
            ? `linear-gradient(135deg, ${color}, ${accent})`
            : `linear-gradient(135deg, ${color}44, ${accent}22)`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          transition: `opacity 0.7s ${delay}ms, transform 0.7s ${delay}ms cubic-bezier(.16,1,.3,1), background 0.4s`,
          boxShadow: hovered ? `0 0 60px ${color}44, 0 20px 60px rgba(0,0,0,0.6)` : "0 8px 40px rgba(0,0,0,0.5)",
        }}>
        <div className="relative rounded-[22px] p-7 h-full flex flex-col gap-5 overflow-hidden"
          style={{ background: hovered ? "#08081a" : "#060614" }}>

          {/* background glow blob */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none transition-all duration-500"
            style={{ background: `radial-gradient(circle, ${color}${hovered ? "22" : "0d"} 0%, transparent 70%)` }} />

          {/* icon bubble */}
          <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}${hovered ? "55" : "22"}`,
              boxShadow: hovered ? `0 0 20px ${color}44` : "none",
              transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
            }}>
            {icon}
          </div>

          {/* text */}
          <div className="space-y-2 flex-1">
            <h2 className="font-display text-xl font-bold text-white tracking-wide">{label}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{sub}</p>
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-2 text-sm font-semibold transition-all duration-300"
            style={{ color: hovered ? color : "#334155" }}>
            <span>Begin session</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s" }}>
              <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* bottom shimmer line */}
          <div className="absolute bottom-0 left-0 h-px w-full transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity: hovered ? 0.7 : 0,
            }} />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  /* stable particles — generated once */
  const particles = [
    { top:"8%",  left:"12%", w:2, h:2, op:0.5, dur:"3s" },
    { top:"15%", left:"78%", w:1.5,h:1.5,op:0.3,dur:"4.5s" },
    { top:"32%", left:"5%",  w:3, h:3, op:0.2, dur:"5s" },
    { top:"55%", left:"90%", w:2, h:2, op:0.4, dur:"3.5s" },
    { top:"70%", left:"20%", w:1.5,h:1.5,op:0.35,dur:"4s" },
    { top:"85%", left:"65%", w:2.5,h:2.5,op:0.25,dur:"6s" },
    { top:"22%", left:"42%", w:1, h:1, op:0.5, dur:"2.8s" },
    { top:"62%", left:"50%", w:2, h:2, op:0.2, dur:"5.5s" },
    { top:"45%", left:"75%", w:1.5,h:1.5,op:0.4,dur:"3.2s" },
    { top:"78%", left:"38%", w:1, h:1, op:0.3, dur:"4.2s" },
    { top:"5%",  left:"55%", w:2, h:2, op:0.4, dur:"3.8s" },
    { top:"92%", left:"15%", w:1.5,h:1.5,op:0.3,dur:"4.8s" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        .font-display { font-family: 'Cinzel', serif; }
        body { font-family: 'DM Sans', sans-serif; }

        @keyframes spinF { to { transform: rotate(360deg); } }
        @keyframes spinR { to { transform: rotate(-360deg); } }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.06); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes shimmerText {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes particlePulse {
          0%, 100% { opacity: var(--op); transform: scale(1); }
          50%       { opacity: calc(var(--op) * 0.4); transform: scale(0.5); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1);    opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1;   }
        }
        @keyframes revealUp {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0);    }
        }
        @keyframes rotateSlow {
          to { transform: rotate(360deg); }
        }

        .shimmer-title {
          background: linear-gradient(90deg,
            #c4b5fd 0%, #818cf8 20%, #f0abfc 40%,
            #fbbf24 55%, #f0abfc 70%, #818cf8 85%, #c4b5fd 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 6s linear infinite;
        }

        .reveal-1 { animation: revealUp 0.8s 0.1s both cubic-bezier(.16,1,.3,1); }
        .reveal-2 { animation: revealUp 0.8s 0.3s both cubic-bezier(.16,1,.3,1); }
        .reveal-3 { animation: revealUp 0.8s 0.5s both cubic-bezier(.16,1,.3,1); }
        .reveal-4 { animation: revealUp 0.8s 0.7s both cubic-bezier(.16,1,.3,1); }

        .mandala {
          animation: rotateSlow 40s linear infinite;
          transform-origin: center;
        }
        .mandala-r { animation: rotateSlow 28s linear infinite reverse; transform-origin:center; }
      `}</style>

      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white"
        style={{ background: "radial-gradient(ellipse 160% 100% at 50% -10%, #0d0520 0%, #020208 55%)" }}>

        {/* ── deep space background ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* large ambient blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse, #3b0764 0%, transparent 65%)", opacity: 0.35 }} />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(ellipse, #1e1b4b 0%, transparent 65%)", opacity: 0.3 }} />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse, #0c4a6e 0%, transparent 65%)", opacity: 0.2 }} />

          {/* star particles */}
          {particles.map((p, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                top: p.top, left: p.left, width: p.w, height: p.h,
                background: "#fff",
                ["--op" as string]: p.op,
                opacity: p.op,
                animation: `particlePulse ${p.dur} ease-in-out ${i * 0.4}s infinite`,
              }} />
          ))}
        </div>

        {/* ── central mandala / orbit system ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* outer decorative rings */}
          <div style={{ position:"absolute", width:600, height:600 }}>
            <OrbitRing size={600} duration={60} color="#7c3aed" dotSize={4} />
            <OrbitRing size={480} duration={45} color="#3b82f6" reverse dotSize={3} />
            <OrbitRing size={360} duration={30} color="#ec4899" dotSize={3} />
            <OrbitRing size={260} duration={20} color="#f59e0b" reverse dotSize={4} />
          </div>

          {/* SVG mandala pattern */}
          <svg width="220" height="220" viewBox="0 0 220 220" style={{ position:"absolute", opacity:0.06 }}>
            <g className="mandala" transform="translate(110,110)">
              {[0,45,90,135,180,225,270,315].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <ellipse rx="50" ry="8" fill="none" stroke="#c4b5fd" strokeWidth="0.5" />
                  <line x1="0" y1="-95" x2="0" y2="-55" stroke="#c4b5fd" strokeWidth="0.5" />
                  <circle cx="0" cy="-95" r="2" fill="#c4b5fd" />
                </g>
              ))}
              <circle r="20" fill="none" stroke="#c4b5fd" strokeWidth="0.5" />
              <circle r="55" fill="none" stroke="#c4b5fd" strokeWidth="0.3" strokeDasharray="4 6" />
            </g>
            <g className="mandala-r" transform="translate(110,110)">
              {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <line x1="0" y1="-30" x2="0" y2="-80" stroke="#818cf8" strokeWidth="0.4" strokeOpacity="0.6"/>
                </g>
              ))}
              <circle r="36" fill="none" stroke="#818cf8" strokeWidth="0.4" strokeOpacity="0.5"/>
            </g>
          </svg>

          {/* pulsing core */}
          <div style={{ position:"absolute", width:40, height:40,
            borderRadius:"50%", background:"radial-gradient(circle, #a78bfa 0%, #7c3aed44 60%, transparent 100%)",
            animation:"breathe 3s ease-in-out infinite", boxShadow:"0 0 40px #7c3aed88" }} />
        </div>

        {/* ── content ── */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-2xl">

          {/* eyebrow */}
          <div className="reveal-1 mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-[0.25em] uppercase"
            style={{ background:"#ffffff08", border:"1px solid #ffffff12", color:"#94a3b8" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#a78bfa" }} />
            Spiritual Energy Assessment
          </div>

          {/* headline */}
          <h1 className="reveal-2 font-display font-bold leading-none mb-2" style={{ fontSize:"clamp(2.4rem,7vw,4.5rem)" }}>
            <span className="shimmer-title">Aura &amp; Chakra</span>
          </h1>
          <h1 className="reveal-2 font-display font-bold leading-none mb-7 text-white"
            style={{ fontSize:"clamp(2.4rem,7vw,4.5rem)", opacity:0.9 }}>
            Analyzer
          </h1>

          {/* sub */}
          <p className="reveal-3 text-base leading-relaxed max-w-sm mb-12"
            style={{ color:"#64748b", fontWeight:300 }}>
            Unveil the luminous field surrounding your being and align your
            seven energy centers for{" "}
            <em style={{ color:"#94a3b8", fontStyle:"italic" }}>complete harmony</em>.
          </p>

          {/* cards */}
          <div className="reveal-4 flex flex-col sm:flex-row gap-5 items-center">
            <FeatureCard
              href="/questionnaire"
              label="Aura Detection"
              sub="Upload or capture your photo to reveal the color and energy of your personal aura field."
              color="#f59e0b"
              accent="#ef4444"
              delay={800}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" stroke="#f59e0b" strokeWidth="1.5"/>
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                    stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />

            <FeatureCard
              href="/chakra"
              label="Chakra Analysis"
              sub="Answer 49 mindful questions to assess the balance of your seven sacred energy centers."
              color="#8b5cf6"
              accent="#3b82f6"
              delay={1000}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.5 9.5H22L16 13.5L18.5 21L12 17L5.5 21L8 13.5L2 9.5H9.5L12 2Z"
                    stroke="#8b5cf6" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>

          {/* bottom micro-copy */}
          <p className="reveal-4 mt-10 text-xs tracking-wide" style={{ color:"#1e293b" }}>
            No account required &nbsp;·&nbsp; Results in seconds &nbsp;·&nbsp; 100% private
          </p>
        </div>

        {/* ── bottom fade vignette ── */}
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{ background:"linear-gradient(to top, #020208, transparent)" }} />
      </main>
    </>
  );
}