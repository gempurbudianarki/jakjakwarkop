"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthProvider from "@/components/auth/AuthProvider";
import { motion } from "framer-motion";
import {
  ArrowLeft, Coffee, Trophy, Camera, MapPin, Star,
  Calendar, CheckCircle, Clock, Image as ImageIcon,
  TrendingUp, Award
} from "lucide-react";
import { getUserLevel } from "@/lib/utils";

interface ProfileData {
  user: {
    id: string; name: string; email: string; role: string;
    points: number; createdAt: string; rank: number | null;
  };
  stats: { checkIns: number; photos: number; warkopsVisited: number };
  checkIns: { id: string; points: number; createdAt: string; warkopId: string; warkopName: string }[];
  photos: { id: string; url: string; caption: string | null; status: string; createdAt: string; warkopId: string; warkopName: string }[];
}

function ProfileContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"checkins" | "photos">("checkins");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.push("/login"); return; }
    fetch("/api/profile")
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, status, router]);

  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#08090e" }}>
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const level = getUserLevel(data.user.points);
  const joined = new Date(data.user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const nextPts = level.next ? level.next - data.user.points : 0;
  const progress = level.next ? ((data.user.points % (level.next > 200 ? 200 : level.next)) / (level.next > 200 ? 200 : level.next)) * 100 : 100;

  return (
    <div style={{ minHeight: "100dvh", background: "#08090e", color: "#f1f5f9" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", gap: 12, height: 58, padding: "0 16px", background: "rgba(10,11,18,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 12px", color: "#f1f5f9", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
          <ArrowLeft size={14} /> Peta
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#f1f5f9" }}>Profil Saya</p>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 40px" }}>
        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20,
            background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(10,11,18,0.98) 60%)" }}>
          {/* Top gradient bar */}
          <div style={{ height: 4, background: "linear-gradient(90deg, #f59e0b, #d97706, #92400e)" }} />

          <div style={{ padding: "24px 24px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              {/* Avatar */}
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 900, color: "#1a0a00", flexShrink: 0, boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}>
                {data.user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#f1f5f9", marginBottom: 4 }}>{data.user.name}</h1>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>{data.user.email}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20,
                  background: `${level.color}18`, border: `1px solid ${level.color}40`, color: level.color, fontSize: "0.72rem", fontWeight: 700 }}>
                  {level.label}
                </div>
              </div>
              {data.user.rank && (
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f59e0b" }}>#{data.user.rank}</div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ranking</div>
                </div>
              )}
            </div>

            {/* Poin + progress */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <TrendingUp size={11} style={{ display: "inline", marginRight: 4 }} />Total Poin
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: level.color }}>
                  {level.next ? `${nextPts} pts lagi ke ${level.next >= 200 ? "Legend" : "Regular"}` : "Level Tertinggi"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${level.color}, ${level.color}cc)` }} />
                </div>
                <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#f59e0b", minWidth: 60, textAlign: "right" }}>{data.user.points} pts</span>
              </div>
            </div>

            {/* Info row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} /> Bergabung {joined}</span>
              {data.user.role === "ADMIN" && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 10, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b", fontWeight: 700 }}>
                  <Award size={10} /> Admin
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { icon: CheckCircle, label: "Check-in", value: data.stats.checkIns, color: "#22c55e" },
            { icon: MapPin, label: "Warkop Dikunjungi", value: data.stats.warkopsVisited, color: "#f59e0b" },
            { icon: Camera, label: "Foto Diupload", value: data.stats.photos, color: "#818cf8" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ padding: "16px 12px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p style={{ fontSize: "1.4rem", fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", marginTop: 4, lineHeight: 1.3 }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: "flex", gap: 2, marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.06)" }}>
            {([
              { id: "checkins", label: "Riwayat Check-in", icon: CheckCircle, count: data.stats.checkIns },
              { id: "photos", label: "Foto Saya", icon: Camera, count: data.stats.photos },
            ] as const).map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, transition: "all 0.2s",
                  background: tab === id ? "rgba(245,158,11,0.12)" : "transparent",
                  color: tab === id ? "#f59e0b" : "rgba(255,255,255,0.45)",
                  boxShadow: tab === id ? "inset 0 0 0 1px rgba(245,158,11,0.25)" : "none" }}>
                <Icon size={13} />
                {label}
                <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: 10, background: tab === id ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)", color: tab === id ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>{count}</span>
              </button>
            ))}
          </div>

          {tab === "checkins" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.checkIns.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
                  <CheckCircle size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                  <p style={{ fontSize: "0.85rem" }}>Belum ada check-in</p>
                  <p style={{ fontSize: "0.75rem", marginTop: 6 }}>Temukan warkop dan check-in pertamamu!</p>
                  <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "8px 20px", borderRadius: 20, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0a00", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700 }}>
                    <MapPin size={13} /> Jelajahi Peta
                  </Link>
                </div>
              ) : data.checkIns.map((ci, i) => (
                <motion.div key={ci.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={`/warkop/${ci.warkopId}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.2)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(212,130,10,0.1)", border: "1px solid rgba(212,130,10,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Coffee size={16} color="#D4820A" strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ci.warkopName}</p>
                      <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Clock size={10} />
                        {new Date(ci.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#f59e0b", flexShrink: 0 }}>+{ci.points} pts</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "photos" && (
            <div>
              {data.photos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
                  <Camera size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                  <p style={{ fontSize: "0.85rem" }}>Belum ada foto</p>
                  <p style={{ fontSize: "0.75rem", marginTop: 6 }}>Check-in dan upload foto pertamamu!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                  {data.photos.map((photo, i) => (
                    <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                      <Link href={`/warkop/${photo.warkopId}`} style={{ textDecoration: "none", display: "block" }}>
                        <div style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", position: "relative" }}>
                          <img src={photo.url} alt={photo.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s" }} />
                          <div style={{ position: "absolute", top: 6, right: 6 }}>
                            <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 6, backdropFilter: "blur(8px)",
                              background: photo.status === "APPROVED" ? "rgba(34,197,94,0.9)" : photo.status === "REJECTED" ? "rgba(239,68,68,0.9)" : "rgba(245,158,11,0.9)",
                              color: "white" }}>
                              {photo.status === "APPROVED" ? "✓" : photo.status === "REJECTED" ? "✗" : "⏳"}
                            </span>
                          </div>
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 8px 8px", background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photo.warkopName}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Admin link */}
        {data.user.role === "ADMIN" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ marginTop: 20, padding: "14px 18px", borderRadius: 16, border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b" }}>Panel Admin</p>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Kelola warkop, user, dan konten</p>
            </div>
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 12, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0a00", textDecoration: "none", fontSize: "0.8rem", fontWeight: 800 }}>
              Buka Panel →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <ProfileContent />
    </AuthProvider>
  );
}
