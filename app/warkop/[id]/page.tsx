"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, MapPin, Phone, Wifi, Cigarette, UtensilsCrossed,
  Car, Camera, Upload, X, Check, Trophy, Loader2, Share2, Coffee,
  Users, User, Calendar, ChevronRight, Clock, CheckCircle2, ImageIcon, Info,
} from "lucide-react";
import AuthProvider from "@/components/auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { getUserLevel } from "@/lib/utils";

const MiniMap = dynamic(() => import("@/components/map/AppMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#0d0e14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={20} style={{ color: "#f59e0b", animation: "spin 1s linear infinite" }} />
    </div>
  ),
});

interface Warkop {
  id: string; name: string; description: string;
  latitude: number; longitude: number; address: string;
  phone?: string | null; image?: string | null;
  facilities?: { wifi?: boolean; smoking?: boolean; food?: boolean; parking?: boolean } | null;
  _count?: { checkIns: number; photos: number };
}

interface LeaderboardEntry {
  rank: number; name: string; points: number; image?: string | null;
}

interface GalleryPhoto {
  id: string; url: string; caption?: string | null;
  userName: string; warkopName: string; createdAt: string;
}

type DetailTab = "leaderboard" | "gallery" | "info";

const rankColors = ["#fbbf24", "#94a3b8", "#cd7c3e"];

/* ─── Skeleton shimmer ─────────────────────────────────────── */
function Shimmer({ width, height, radius = 8 }: { width: string; height: number; radius?: number }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}

/* ─── Facility badge ───────────────────────────────────────── */
function FacilityBadge({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 11px", borderRadius: 99,
      background: active ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${active ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}`,
      color: active ? "#f59e0b" : "rgba(255,255,255,0.25)",
      fontSize: "0.72rem", fontWeight: 600,
      opacity: active ? 1 : 0.5,
    }}>
      <Icon size={12} />
      {label}
    </div>
  );
}

/* ─── Check-in modal ───────────────────────────────────────── */
function CheckinModal({ warkop, onClose, onSuccess }: {
  warkop: Warkop; onClose: () => void; onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (!session) { router.push("/login"); return; }
    setUploading(true); setMsg(null);
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("warkopId", warkop.id);
    fd.append("caption", caption.trim());
    try {
      const res = await fetch("/api/checkin", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: `Check-in berhasil! +${data.pointsEarned ?? 0} poin` });
        setTimeout(() => { onSuccess(); onClose(); }, 1800);
      } else {
        setMsg({ type: "error", text: data.error || "Gagal upload foto" });
      }
    } catch {
      setMsg({ type: "error", text: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0 0 0 0",
      }}
    >
      <motion.div
        initial={{ y: "100%", scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: "100%", scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480,
          background: "#0c0d12",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Handle */}
        <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.12)" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "12px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 7 }}><Camera size={16} color="#D4820A" /> Check-in di {warkop.name}</h2>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Upload foto · Dapat +10 poin · Masuk leaderboard</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "16px 20px 20px" }}>
          {/* Message */}
          <AnimatePresence>
            {msg && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: msg.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${msg.type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                  color: msg.type === "success" ? "#4ade80" : "#f87171",
                  fontSize: "0.82rem", fontWeight: 600,
                }}
              >{msg.text}</motion.div>
            )}
          </AnimatePresence>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            style={{
              height: 200, borderRadius: 16,
              border: `2px dashed ${preview ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)"}`,
              background: preview ? "transparent" : "rgba(255,255,255,0.02)",
              cursor: "pointer", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", marginBottom: 12,
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            {preview ? (
              <>
                <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.opacity = "0"}>
                  <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 700, background: "rgba(0,0,0,0.5)", padding: "6px 14px", borderRadius: 20 }}>Ganti foto</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <Camera size={22} style={{ color: "#f59e0b" }} />
                </div>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Klik atau seret foto ke sini</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>JPG · PNG · WebP · Maks 5 MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFile} />

          {/* Caption */}
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Ceritakan pengalamanmu di sini... (opsional)"
            maxLength={300}
            rows={2}
            style={{
              width: "100%", padding: "10px 12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, color: "#f1f5f9",
              fontSize: "0.82rem", resize: "none", outline: "none",
              marginBottom: 14, fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(245,158,11,0.35)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", textAlign: "right", marginTop: -10, marginBottom: 14 }}>{caption.length}/300</p>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "12px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
              Batal
            </button>
            <motion.button
              type="submit"
              disabled={uploading || !file}
              whileHover={!uploading && file ? { scale: 1.02 } : {}}
              whileTap={!uploading && file ? { scale: 0.98 } : {}}
              style={{
                flex: 2, padding: "12px", borderRadius: 14,
                background: !file || uploading ? "rgba(245,158,11,0.3)" : "linear-gradient(135deg, #f59e0b, #d97706)",
                border: "none", color: !file || uploading ? "rgba(255,255,255,0.4)" : "#1a0800",
                fontSize: "0.88rem", fontWeight: 800,
                cursor: !file || uploading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {uploading ? (
                <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Mengupload...</>
              ) : (
                <><Upload size={16} /> Check-in Sekarang!</>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ photo, onClose }: { photo: GalleryPhoto; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lightbox-dark"
      onClick={onClose}
    >
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={20} />
      </button>
      <motion.img
        initial={{ scale: 0.88, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 20 }}
        onClick={e => e.stopPropagation()}
        src={photo.url} alt={photo.caption || ""}
        style={{ maxWidth: "92vw", maxHeight: "65vh", borderRadius: 18, objectFit: "contain", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}
      />
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        style={{ marginTop: 16, background: "rgba(10,11,18,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 20px", textAlign: "center", maxWidth: 360 }}
      >
        <p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.85rem", marginBottom: 3 }}>{photo.userName}</p>
        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", marginBottom: photo.caption ? 8 : 0 }}>
          <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
          {new Date(photo.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        {photo.caption && (
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>"{photo.caption}"</p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Detail Content ──────────────────────────────────── */
function WarkopDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const [warkop, setWarkop] = useState<Warkop | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<DetailTab>("leaderboard");
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [wRes, lbRes, phRes] = await Promise.all([
        fetch(`/api/warkop/${id}`),
        fetch(`/api/warkop/${id}/leaderboard`),
        fetch(`/api/warkop/${id}/photos`),
      ]);
      if (wRes.status === 404) { setNotFound(true); setLoading(false); return; }
      const [wData, lbData, phData] = await Promise.all([wRes.json(), lbRes.json(), phRes.json()]);
      setWarkop(wData);
      setLeaderboard(Array.isArray(lbData) ? lbData : []);
      setPhotos(Array.isArray(phData) ? phData : []);
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  /* Loading skeleton */
  if (loading) {
    return (
      <div style={{ height: "100dvh", background: "#08090e", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 58, background: "rgba(10,11,18,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
          <Shimmer width="80px" height={32} radius={20} />
          <Shimmer width="200px" height={20} />
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: 360, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <Shimmer width="100%" height={160} radius={16} />
            <Shimmer width="60%" height={20} />
            <Shimmer width="100%" height={60} />
            <Shimmer width="80%" height={16} />
          </div>
          <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <Shimmer width="100%" height={44} radius={12} />
            {[1,2,3].map(i => <Shimmer key={i} width="100%" height={60} radius={12} />)}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !warkop) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#08090e", color: "#f1f5f9" }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center" }}>
          <Coffee size={56} style={{ color: "rgba(245,158,11,0.2)", marginBottom: 16 }} />
          <h1 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Warkop tidak ditemukan</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24, fontSize: "0.85rem" }}>ID tidak valid atau sudah dihapus</p>
          <button onClick={() => router.push("/")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 20, background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", color: "#1a0800", fontWeight: 700, cursor: "pointer" }}>
            <ArrowLeft size={14} /> Kembali ke Peta
          </button>
        </motion.div>
      </div>
    );
  }

  const facilities = warkop.facilities ?? {};

  return (
    <div className="warkop-detail-shell">
      {/* ─── NAVBAR ─── */}
      <nav className="app-shell-navbar" style={{ gap: 10 }}>
        <button onClick={() => router.push("/")}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 12px", color: "#f1f5f9", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, flexShrink: 0 }}>
          <ArrowLeft size={13} /> Peta
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
            <Coffee size={14} color="#D4820A" strokeWidth={1.8} style={{ flexShrink: 0 }} />{warkop.name}
          </p>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 3 }}>
            <MapPin size={9} style={{ display: "inline", flexShrink: 0 }} /> {warkop.address}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={handleShare} title="Salin link"
            style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: copied ? "#22c55e" : "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s" }}>
            {copied ? <Check size={14} /> : <Share2 size={14} />}
          </button>
          {session ? (
            <motion.button
              onClick={() => setShowCheckin(true)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", color: "#1a0800", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}>
              <Camera size={13} /> Check-in
            </motion.button>
          ) : (
            <Link href="/login"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0800", textDecoration: "none", fontWeight: 800, fontSize: "0.78rem" }}>
              <Camera size={13} /> Check-in
            </Link>
          )}
        </div>
      </nav>

      <div className="warkop-detail-main">
        {/* ─── LEFT PANEL ─── */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="warkop-detail-left"
        >
          {/* Hero */}
          <div style={{ position: "relative", height: 200, flexShrink: 0, overflow: "hidden" }}>
            {warkop.image ? (
              <img src={warkop.image} alt={warkop.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(10,11,18,0.98) 100%)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <Coffee size={52} style={{ color: "rgba(245,158,11,0.25)" }} />
              </div>
            )}
            {/* Gradient overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,11,18,1) 0%, rgba(10,11,18,0.4) 50%, transparent 100%)" }} />
            {/* Title overlay */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px" }}>
              <h1 style={{ fontSize: "1.15rem", fontWeight: 900, color: "#f1f5f9", lineHeight: 1.2, marginBottom: 6 }}>{warkop.name}</h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b", fontSize: "0.68rem", fontWeight: 700 }}>
                  <CheckCircle2 size={10} strokeWidth={2.5} /> {warkop._count?.checkIns ?? 0} check-in
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.2)", color: "#818cf8", fontSize: "0.68rem", fontWeight: 700 }}>
                  <Camera size={10} strokeWidth={2.5} /> {warkop._count?.photos ?? 0} foto
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Description */}
            <div>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{warkop.description}</p>
            </div>

            {/* Location */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <MapPin size={13} style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Alamat</p>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{warkop.address}</p>
              </div>
            </div>

            {warkop.phone && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={13} style={{ color: "#22c55e" }} />
                </div>
                <a href={`tel:${warkop.phone}`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>{warkop.phone}</a>
              </div>
            )}

            {/* Facilities */}
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Fasilitas</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <FacilityBadge icon={Wifi} label="WiFi" active={!!facilities.wifi} />
                <FacilityBadge icon={UtensilsCrossed} label="Makanan" active={!!facilities.food} />
                <FacilityBadge icon={Car} label="Parkir" active={!!facilities.parking} />
                <FacilityBadge icon={Cigarette} label="Smoking" active={!!facilities.smoking} />
              </div>
            </div>

            {/* Mini map */}
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Lokasi</p>
              <div style={{ height: 150, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                <MiniMap warkops={[warkop]} selectedId={warkop.id} />
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: "auto" }}>
              {session ? (
                <motion.button
                  onClick={() => setShowCheckin(true)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 16,
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "none", color: "#1a0800", fontWeight: 800, fontSize: "0.9rem",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 6px 24px rgba(245,158,11,0.3)",
                  }}
                >
                  <Camera size={16} /> Check-in Sekarang (+10 poin)
                </motion.button>
              ) : (
                <Link href="/login"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px", borderRadius: 16, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0800", textDecoration: "none", fontWeight: 800, fontSize: "0.9rem" }}>
                  <Camera size={16} /> Login untuk Check-in
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* ─── RIGHT PANEL ─── */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="warkop-detail-right"
        >
          {/* Tabs */}
          <div style={{ display: "flex", padding: "12px 16px 0", gap: 4, background: "rgba(8,9,14,0.8)", flexShrink: 0 }}>
            {([
              { id: "leaderboard" as DetailTab, Icon: Trophy,    label: "Leaderboard", count: leaderboard.length },
              { id: "gallery"     as DetailTab, Icon: ImageIcon, label: "Galeri",      count: photos.length      },
              { id: "info"        as DetailTab, Icon: Info,      label: "Info",        count: null               },
            ]).map(({ id, Icon, label, count }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px",
                  background: "transparent", border: "none", cursor: "pointer",
                  fontSize: "0.73rem", fontWeight: 700,
                  color: tab === id ? "#F0A020" : "rgba(255,255,255,0.38)",
                  borderBottom: `2px solid ${tab === id ? "#F0A020" : "transparent"}`,
                  transition: "all 0.2s",
                  borderRadius: "10px 10px 0 0",
                  whiteSpace: "nowrap",
                  fontFamily: '"DM Sans", sans-serif',
                  letterSpacing: "0.02em",
                }}
              >
                <Icon size={13} strokeWidth={2} />
                <span>{label}</span>
                {count !== null && (
                  <span style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: 99, background: tab === id ? "rgba(240,160,32,0.14)" : "rgba(255,255,255,0.06)", color: tab === id ? "#F0A020" : "rgba(255,255,255,0.28)", fontWeight: 800 }}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

          {/* Tab content */}
          <div className="sidebar-content" style={{ padding: 16 }}>
            <AnimatePresence mode="wait">

              {/* LEADERBOARD */}
              {tab === "leaderboard" && (
                <motion.div key="lb" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                    Top kontributor di <strong style={{ color: "#f59e0b" }}>{warkop.name}</strong>
                  </p>
                  {leaderboard.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)" }}>
                      <Trophy size={44} style={{ margin: "0 auto 14px", display: "block", opacity: 0.25 }} />
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 6 }}>Belum ada check-in</p>
                      <p style={{ fontSize: "0.75rem" }}>Jadilah yang pertama!</p>
                      {session && (
                        <motion.button
                          onClick={() => setShowCheckin(true)}
                          whileHover={{ scale: 1.04 }}
                          style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 20, background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", color: "#1a0800", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}>
                          <Camera size={13} /> Check-in Sekarang
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 520 }}>
                      {leaderboard.map((entry, i) => {
                        const lvl = getUserLevel(entry.points);
                        return (
                          <motion.div
                            key={entry.name + i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "12px 14px", borderRadius: 14,
                              background: i === 0 ? "linear-gradient(90deg, rgba(251,191,36,0.08) 0%, transparent 100%)" : i === 1 ? "rgba(148,163,184,0.04)" : i === 2 ? "rgba(205,124,62,0.04)" : "rgba(255,255,255,0.02)",
                              border: `1px solid ${i === 0 ? "rgba(251,191,36,0.2)" : i === 1 ? "rgba(148,163,184,0.12)" : i === 2 ? "rgba(205,124,62,0.12)" : "rgba(255,255,255,0.05)"}`,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: i < 3 ? `${rankColors[i]}18` : "rgba(255,255,255,0.04)",
                                border: `2px solid ${i < 3 ? rankColors[i] + "50" : "rgba(255,255,255,0.08)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.78rem", fontWeight: 900,
                                color: i < 3 ? rankColors[i] : "rgba(255,255,255,0.35)",
                              }}>
                                {i + 1}
                              </div>
                              <div>
                                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f1f5f9" }}>{entry.name}</p>
                                <p style={{ fontSize: "0.65rem", color: lvl.color, fontWeight: 600 }}>{lvl.label}</p>
                              </div>
                            </div>
                            <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "#f59e0b" }}>{entry.points} pts</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* GALLERY */}
              {tab === "gallery" && (
                <motion.div key="gal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                      Foto check-in di <strong style={{ color: "#f59e0b" }}>{warkop.name}</strong>
                    </p>
                    {session && (
                      <button onClick={() => setShowCheckin(true)}
                        style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "5px 11px", borderRadius: 20, cursor: "pointer" }}>
                        <Camera size={11} /> + Upload
                      </button>
                    )}
                  </div>
                  {photos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)" }}>
                      <Camera size={44} style={{ margin: "0 auto 14px", display: "block", opacity: 0.25 }} />
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 6 }}>Belum ada foto</p>
                      <p style={{ fontSize: "0.75rem" }}>Check-in dan jadi yang pertama!</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                      {photos.map((photo, i) => (
                        <motion.div
                          key={photo.id}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="gallery-item-dark"
                          style={{ aspectRatio: "1" }}
                          onClick={() => setLightbox(photo)}
                        >
                          <img src={photo.url} alt={photo.caption || ""} />
                          <div className="gallery-item-overlay">
                            <span style={{ fontWeight: 700, fontSize: "0.72rem" }}>{photo.userName}</span>
                            <span style={{ opacity: 0.7, fontSize: "0.62rem" }}>
                              {new Date(photo.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* INFO */}
              {tab === "info" && (
                <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 520 }}>
                    {/* Map card */}
                    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", height: 220 }}>
                      <MiniMap warkops={[warkop]} selectedId={warkop.id} />
                    </div>

                    {/* Detail card */}
                    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
                      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Informasi Warkop</p>
                        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{warkop.description}</p>
                      </div>
                      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <MapPin size={14} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
                          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>{warkop.address}</p>
                        </div>
                        {warkop.phone && (
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <Phone size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                            <a href={`tel:${warkop.phone}`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{warkop.phone}</a>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
                          <FacilityBadge icon={Wifi} label="WiFi" active={!!facilities.wifi} />
                          <FacilityBadge icon={UtensilsCrossed} label="Makanan" active={!!facilities.food} />
                          <FacilityBadge icon={Car} label="Parkir" active={!!facilities.parking} />
                          <FacilityBadge icon={Cigarette} label="Smoking" active={!!facilities.smoking} />
                        </div>
                      </div>
                    </div>

                    {/* Koordinat */}
                    <div style={{ padding: "12px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Koordinat GPS</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>
                        {warkop.latitude.toFixed(6)}, {warkop.longitude.toFixed(6)}
                      </p>
                      <a
                        href={`https://maps.google.com?q=${warkop.latitude},${warkop.longitude}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: "0.72rem", fontWeight: 700, color: "#f59e0b", textDecoration: "none" }}>
                        Buka di Google Maps <ChevronRight size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCheckin && warkop && (
          <CheckinModal
            warkop={warkop}
            onClose={() => setShowCheckin(false)}
            onSuccess={loadData}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default function WarkopDetailPage() {
  return (
    <AuthProvider>
      <WarkopDetailContent />
    </AuthProvider>
  );
}
