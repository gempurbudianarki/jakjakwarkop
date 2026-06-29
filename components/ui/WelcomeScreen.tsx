"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Camera, Trophy, Coffee } from "lucide-react";

const FEATURES = [
  { icon: MapPin,   label: "Peta GPS",       color: "#F0A020" },
  { icon: Camera,   label: "Check-in Foto",  color: "#22C55E" },
  { icon: Trophy,   label: "Leaderboard",    color: "#818CF8" },
  { icon: Coffee,   label: "Komunitas Kopi", color: "#F0A020" },
];

const STATS = [
  { value: "8+",   label: "Warkop" },
  { value: "50+",  label: "Member" },
  { value: "200+", label: "Check-in" },
];

/* ── eased stagger reveal ───────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const up = (delay = 0): any => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fade = (delay = 0): any => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay },
});

export default function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 700);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="welcome"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#07070A",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}
        >
          {/* ── Ambient warm glow (background only) ── */}
          <div style={{
            position: "absolute",
            top: "30%", left: "50%",
            width: "min(600px, 90vw)",
            height: "min(600px, 90vw)",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse, rgba(212,130,10,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* ── Subtle grain texture overlay ── */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            opacity: 0.025,
            pointerEvents: "none",
          }} />

          {/* ── Left thin amber line ── */}
          {ready && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "35vh" }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                left: "clamp(24px, 5vw, 80px)",
                top: "50%",
                transform: "translateY(-50%)",
                width: 1,
                background: "linear-gradient(to bottom, transparent, rgba(212,130,10,0.5), transparent)",
              }}
            />
          )}

          {/* ── Right thin amber line ── */}
          {ready && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "25vh" }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                right: "clamp(24px, 5vw, 80px)",
                top: "50%",
                transform: "translateY(-50%)",
                width: 1,
                background: "linear-gradient(to bottom, transparent, rgba(212,130,10,0.3), transparent)",
              }}
            />
          )}

          {/* ── Center layout ── */}
          <div style={{
            position: "relative", zIndex: 10,
            textAlign: "center",
            padding: "0 clamp(24px, 6vw, 80px)",
            maxWidth: 520,
            width: "100%",
          }}>

            {/* Logo mark */}
            <motion.div {...fade(0.15)} style={{
              display: "flex", justifyContent: "center", marginBottom: 32,
            }}>
              <div style={{
                width: 56, height: 56,
                borderRadius: 18,
                background: "linear-gradient(135deg, rgba(212,130,10,0.2) 0%, rgba(212,130,10,0.06) 100%)",
                border: "1px solid rgba(212,130,10,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 40px rgba(212,130,10,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}>
                <Coffee size={26} color="#D4820A" strokeWidth={1.8} />
              </div>
            </motion.div>

            {/* Eye-brow label */}
            <motion.p {...up(0.2)} style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4820A",
              marginBottom: 16,
            }}>
              Peta Warkop Banda Aceh
            </motion.p>

            {/* Main heading — Playfair Display */}
            <motion.h1 {...up(0.32)} style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(2.6rem, 8vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#F0EBE1",
              marginBottom: 20,
            }}>
              Jejak<br />
              <span style={{
                background: "linear-gradient(135deg, #F0A020 0%, #D4820A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Warkop</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p {...up(0.44)} style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
              color: "rgba(240,235,225,0.5)",
              lineHeight: 1.7,
              marginBottom: 36,
              fontWeight: 400,
            }}>
              Temukan, kunjungi, dan ceritakan pengalamanmu<br className="hide-mobile" />
              di warkop-warkop legendaris Banda Aceh.
            </motion.p>

            {/* Stats row */}
            <motion.div {...up(0.55)} style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(16px, 4vw, 40px)",
              marginBottom: 40,
            }}>
              {STATS.map(({ value, label }, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: "clamp(1.4rem, 4vw, 2rem)",
                    fontWeight: 900,
                    color: "#F0A020",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>{value}</div>
                  <div style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(240,235,225,0.35)",
                  }}>{label}</div>
                </div>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div {...fade(0.6)} style={{
              width: 40, height: 1,
              background: "rgba(212,130,10,0.3)",
              margin: "0 auto 36px",
            }} />

            {/* CTA button */}
            <motion.div {...up(0.65)} style={{ marginBottom: 40 }}>
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "15px 36px",
                  borderRadius: 99,
                  background: "linear-gradient(135deg, #D4820A 0%, #B86800 100%)",
                  border: "none",
                  color: "#07070A",
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(212,130,10,0.35), 0 2px 8px rgba(0,0,0,0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Shine sweep on hover */}
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "200%", opacity: 0.4 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg, transparent, white, transparent)",
                    pointerEvents: "none",
                  }}
                />
                <span>Jelajahi Peta</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>
            </motion.div>

            {/* Feature chips */}
            <motion.div {...fade(0.8)} style={{
              display: "flex", justifyContent: "center",
              gap: 8, flexWrap: "wrap",
            }}>
              {FEATURES.map(({ icon: Icon, label, color }, i) => (
                <div key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px",
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "rgba(240,235,225,0.45)",
                  letterSpacing: "0.02em",
                }}>
                  <Icon size={11} color={color} strokeWidth={2.5} />
                  {label}
                </div>
              ))}
            </motion.div>

          </div>

          {/* ── Footer ── */}
          <motion.p
            {...fade(1.0)}
            style={{
              position: "absolute", bottom: 28,
              fontSize: "0.62rem",
              color: "rgba(240,235,225,0.2)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Banda Aceh &nbsp;·&nbsp; Indonesia
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
