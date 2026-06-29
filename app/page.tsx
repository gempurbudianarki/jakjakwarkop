"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Coffee,
  Search,
  Trophy,
  LayoutDashboard,
  MapPin,
  Users,
  Camera,
  LogIn,
  LogOut,
  ChevronRight,
  X,
  User,
  Calendar,
  Loader2,
  Wifi,
  Car,
  Cigarette,
  UtensilsCrossed,
  CheckCircle2,
  BarChart3,
  ImageIcon,
  Info,
} from "lucide-react";
import AuthProvider from "@/components/auth/AuthProvider";
import CookieBanner from "@/components/ui/CookieBanner";
import WelcomeScreen from "@/components/ui/WelcomeScreen";
import { motion, AnimatePresence } from "framer-motion";

const AppMap = dynamic(() => import("@/components/map/AppMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#07070A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={26} style={{ color: "#D4820A", animation: "spin 1s linear infinite" }} />
    </div>
  ),
});

interface Warkop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  _count?: { checkIns: number; photos: number };
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  image?: string | null;
}

interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string | null;
  userName: string;
  warkopName: string;
  createdAt: string;
}

type SidebarTab = "leaderboard" | "gallery" | "dashboard";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}

/* ── Rank badge ──────────────────────────────────────────────── */
function RankBadge({ rank }: { rank: number }) {
  const COLORS = ["#F0A020", "#94A3B8", "#CD7C3E"];
  if (rank <= 3) {
    return (
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: `${COLORS[rank - 1]}18`,
        border: `1.5px solid ${COLORS[rank - 1]}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 900, color: COLORS[rank - 1] }}>{rank}</span>
      </div>
    );
  }
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: "rgba(255,255,255,0.04)",
      border: "1.5px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(240,235,225,0.35)" }}>{rank}</span>
    </div>
  );
}

function HomeContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;
  const menuRef = useRef<HTMLDivElement>(null);

  const [showWelcome, setShowWelcome]       = useState(true);
  const [warkops, setWarkops]               = useState<Warkop[]>([]);
  const [leaderboard, setLeaderboard]       = useState<LeaderboardEntry[]>([]);
  const [photos, setPhotos]                 = useState<GalleryPhoto[]>([]);
  const [stats, setStats]                   = useState({ warkops: 0, users: 0, photos: 0, checkins: 0 });
  const [search, setSearch]                 = useState("");
  const [sidebarTab, setSidebarTab]         = useState<SidebarTab>("leaderboard");
  const [userLocation, setUserLocation]     = useState<{ lat: number; lng: number } | null>(null);
  const [selectedWarkopId, setSelectedWarkopId] = useState<string | null>(null);
  const [lightbox, setLightbox]             = useState<GalleryPhoto | null>(null);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const [facilityFilter, setFacilityFilter] = useState<Set<string>>(new Set());

  /* Welcome screen */
  useEffect(() => {
    const visited = localStorage.getItem("jejak-warkop-visited-v2");
    if (visited) setShowWelcome(false);
  }, []);

  const handleWelcomeDone = () => {
    localStorage.setItem("jejak-warkop-visited-v2", "1");
    setShowWelcome(false);
  };

  /* Fetch data */
  useEffect(() => {
    fetch("/api/warkop").then(r => r.json()).then(d => Array.isArray(d) && setWarkops(d)).catch(() => {});
    fetch("/api/leaderboard").then(r => r.json()).then(d => Array.isArray(d) && setLeaderboard(d)).catch(() => {});
    fetch("/api/photos").then(r => r.json()).then(d => Array.isArray(d) && setPhotos(d)).catch(() => {});
    fetch("/api/stats").then(r => r.json()).then(d => d && !d.error && setStats(d)).catch(() => {});
  }, []);

  /* Close user menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Sorted by distance */
  const sortedWarkops = useCallback(() => {
    if (!userLocation) return warkops;
    return [...warkops]
      .map(w => ({ ...w, distance: calculateDistance(userLocation.lat, userLocation.lng, w.latitude, w.longitude) }))
      .sort((a, b) => (a as { distance: number }).distance - (b as { distance: number }).distance);
  }, [warkops, userLocation])();

  const toggleFacility = (key: string) =>
    setFacilityFilter(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const filteredWarkops = sortedWarkops.filter(w => {
    if (search.trim() && !w.name.toLowerCase().includes(search.toLowerCase()) && !w.address.toLowerCase().includes(search.toLowerCase())) return false;
    if (facilityFilter.size > 0) {
      const f = (w as { facilities?: Record<string, boolean> }).facilities ?? {};
      for (const key of facilityFilter) if (!f[key]) return false;
    }
    return true;
  });

  if (showWelcome) return <WelcomeScreen onEnter={handleWelcomeDone} />;

  /* ── Sidebar tab config ─────────────────────────────────────── */
  const TABS: { id: SidebarTab; Icon: React.ElementType; label: string }[] = [
    { id: "leaderboard", Icon: Trophy,    label: "Ranking"   },
    { id: "gallery",     Icon: ImageIcon, label: "Galeri"    },
    { id: "dashboard",   Icon: BarChart3, label: "Statistik" },
  ];

  return (
    <div className="app-shell">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="app-shell-navbar">

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, rgba(212,130,10,0.2) 0%, rgba(212,130,10,0.07) 100%)",
            border: "1px solid rgba(212,130,10,0.32)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(212,130,10,0.14)",
          }}>
            <Coffee size={16} color="#D4820A" strokeWidth={1.8} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "0.95rem", fontWeight: 900,
              letterSpacing: "-0.01em", color: "#F0EBE1",
            }}>
              Jejak<span style={{ color: "#D4820A" }}>Warkop</span>
            </div>
            <div style={{
              fontSize: "0.52rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(240,235,225,0.28)",
            }}>Banda Aceh</div>
          </div>
        </Link>

        {/* Search */}
        <div className="warkop-search-bar" style={{ flex: 1, maxWidth: 460 }}>
          <Search size={14} style={{ color: "rgba(255,255,255,0.32)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Cari warkop di Banda Aceh..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0, display: "flex" }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Stats pills */}
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }} className="hide-mobile">
          {[
            { Icon: MapPin, val: stats.warkops, label: "Warkop" },
            { Icon: Users,  val: stats.users,   label: "Member" },
            { Icon: Camera, val: stats.photos,  label: "Foto"   },
          ].map(({ Icon, val, label }) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 9px", borderRadius: 99,
              background: "rgba(212,130,10,0.07)",
              border: "1px solid rgba(212,130,10,0.16)",
              color: "#D4820A", fontSize: "0.65rem", fontWeight: 700,
            }}>
              <Icon size={10} strokeWidth={2} />{val} {label}
            </span>
          ))}
        </div>

        {/* User menu */}
        <div style={{ flexShrink: 0, position: "relative" }} ref={menuRef}>
          {session?.user ? (
            <>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(212,130,10,0.07)",
                  border: "1px solid rgba(212,130,10,0.18)",
                  borderRadius: 99, padding: "4px 12px 4px 4px",
                  cursor: "pointer", color: "#F0EBE1",
                  transition: "all 0.18s",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #D4820A, #B86800)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 800, color: "#07070A",
                }}>
                  {user?.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <span style={{ fontSize: "0.77rem", fontWeight: 600, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.name?.split(" ")[0]}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute", top: "calc(100% + 10px)", right: 0,
                      background: "rgba(10,10,16,0.98)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14, minWidth: 188, padding: "5px",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.65)",
                      zIndex: 999, backdropFilter: "blur(20px)",
                    }}
                  >
                    <div style={{ padding: "9px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 5 }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F0EBE1", marginBottom: 2 }}>{user?.name}</p>
                      <p style={{ fontSize: "0.63rem", color: "rgba(240,235,225,0.3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {user?.role === "ADMIN" ? "Administrator" : "Member"}
                      </p>
                    </div>
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, color: "rgba(240,235,225,0.7)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                      <User size={13} /> Profil Saya
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, color: "#F0A020", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                        <LayoutDashboard size={13} /> Admin Panel
                      </Link>
                    )}
                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, color: "rgba(220,80,80,0.85)", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, width: "100%", textAlign: "left" }}>
                      <LogOut size={13} /> Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 18px", borderRadius: 99,
              background: "linear-gradient(135deg, #D4820A, #B86800)",
              color: "#07070A", textDecoration: "none",
              fontSize: "0.77rem", fontWeight: 800,
              boxShadow: "0 4px 14px rgba(212,130,10,0.3)",
            }}>
              <LogIn size={13} strokeWidth={2.5} /> Masuk
            </Link>
          )}
        </div>
      </nav>

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <div className="app-shell-main">

        {/* MAP */}
        <div className="app-shell-map">
          <AppMap
            warkops={filteredWarkops}
            selectedId={selectedWarkopId}
            onSelectWarkop={w => setSelectedWarkopId(w.id)}
          />

          {/* Search results overlay */}
          {search.trim() && filteredWarkops.length > 0 && (
            <div style={{
              position: "absolute", top: 12, left: 12, right: 12, zIndex: 800,
              background: "rgba(10,10,16,0.97)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
              maxHeight: 280, overflowY: "auto",
            }}>
              {filteredWarkops.slice(0, 8).map(w => (
                <button key={w.id}
                  onClick={() => { router.push(`/warkop/${w.id}`); setSearch(""); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 11,
                    width: "100%", padding: "10px 14px",
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.04)",
                    color: "#F0EBE1", transition: "background 0.15s ease",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "rgba(212,130,10,0.07)")}
                  onMouseOut={e => (e.currentTarget.style.background = "none")}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(212,130,10,0.1)", border: "1px solid rgba(212,130,10,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Coffee size={14} color="#D4820A" strokeWidth={1.8} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.83rem", fontWeight: 700 }}>{w.name}</div>
                    <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.address}</div>
                  </div>
                  <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0, marginLeft: "auto" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="app-shell-sidebar">

          {/* Tabs */}
          <div className="sidebar-tabs">
            {TABS.map(({ id, Icon, label }) => (
              <button
                key={id}
                className={`sidebar-tab ${sidebarTab === id ? "active" : ""}`}
                onClick={() => setSidebarTab(id)}
              >
                <Icon size={13} strokeWidth={2} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />

          {/* Facility filter */}
          <div style={{ padding: "8px 14px 9px", display: "flex", gap: 5, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
            {[
              { key: "wifi",    label: "WiFi",    Icon: Wifi          },
              { key: "food",    label: "Makanan", Icon: UtensilsCrossed },
              { key: "parking", label: "Parkir",  Icon: Car            },
              { key: "smoking", label: "Rokok",   Icon: Cigarette      },
            ].map(({ key, label, Icon: Ic }) => {
              const active = facilityFilter.has(key);
              return (
                <button key={key} onClick={() => toggleFacility(key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 99,
                    background: active ? "rgba(212,130,10,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "rgba(212,130,10,0.32)" : "rgba(255,255,255,0.06)"}`,
                    color: active ? "#D4820A" : "rgba(240,235,225,0.32)",
                    fontSize: "0.64rem", fontWeight: 700, cursor: "pointer",
                    transition: "all 0.17s",
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: "0.03em",
                  }}>
                  <Ic size={10} strokeWidth={2.2} /> {label}
                </button>
              );
            })}
            {facilityFilter.size > 0 && (
              <button onClick={() => setFacilityFilter(new Set())}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 9px", borderRadius: 99, background: "transparent", border: "1px solid rgba(220,80,80,0.2)", color: "rgba(220,80,80,0.55)", fontSize: "0.62rem", fontWeight: 700, cursor: "pointer" }}>
                <X size={9} strokeWidth={2.5} /> Reset
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className="sidebar-content">
            <AnimatePresence mode="wait">

              {/* ── LEADERBOARD ─────────────────────────────────── */}
              {sidebarTab === "leaderboard" && (
                <motion.div key="lb"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(240,235,225,0.38)", textTransform: "uppercase", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 6 }}>
                      <Trophy size={11} color="#D4820A" strokeWidth={2} /> Top Explorer
                    </p>
                    <Link href="/leaderboard" style={{ fontSize: "0.63rem", color: "#D4820A", textDecoration: "none", fontWeight: 700 }}>Lihat semua</Link>
                  </div>

                  {leaderboard.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "44px 0", color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
                      <Trophy size={30} style={{ margin: "0 auto 10px", display: "block", opacity: 0.2 }} />
                      Belum ada data peringkat
                    </div>
                  ) : leaderboard.map((entry, i) => (
                    <div key={entry.name + i}
                      className={`lb-row ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : ""}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <RankBadge rank={i + 1} />
                        <div>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F0EBE1", lineHeight: 1.3 }}>{entry.name}</p>
                          <p style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                            {entry.points >= 200 ? "Legend" : entry.points >= 100 ? "Regular" : "Explorer"}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#F0A020" }}>{entry.points} pts</span>
                    </div>
                  ))}

                  {!session && (
                    <div style={{ marginTop: 16, padding: "14px", borderRadius: 14, background: "rgba(212,130,10,0.04)", border: "1px solid rgba(212,130,10,0.14)", textAlign: "center" }}>
                      <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 10, lineHeight: 1.5 }}>
                        Login untuk check-in dan masuk leaderboard
                      </p>
                      <Link href="/register" style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "8px 18px", borderRadius: 20,
                        background: "linear-gradient(135deg, #D4820A, #B86800)",
                        color: "#07070A", textDecoration: "none", fontSize: "0.77rem", fontWeight: 800,
                      }}>
                        Daftar Gratis
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── GALLERY ─────────────────────────────────────── */}
              {sidebarTab === "gallery" && (
                <motion.div key="gallery"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(240,235,225,0.38)", textTransform: "uppercase", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 6 }}>
                      <Camera size={11} color="#D4820A" strokeWidth={2} /> Momen Terbaru
                    </p>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.02em" }}>{photos.length} foto</span>
                  </div>

                  {photos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "44px 0", color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
                      <Camera size={30} style={{ margin: "0 auto 10px", display: "block", opacity: 0.2 }} />
                      Belum ada foto check-in
                    </div>
                  ) : (
                    <div className="gallery-grid-dark">
                      {photos.map(photo => (
                        <div key={photo.id} className="gallery-item-dark" onClick={() => setLightbox(photo)}>
                          <img src={photo.url} alt={photo.caption || photo.warkopName} />
                          <div className="gallery-item-overlay">
                            <span style={{ fontWeight: 700, fontSize: "0.7rem" }}>{photo.warkopName}</span>
                            <span style={{ opacity: 0.65, fontSize: "0.63rem" }}>{photo.userName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── DASHBOARD ───────────────────────────────────── */}
              {sidebarTab === "dashboard" && (
                <motion.div key="dash"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(240,235,225,0.38)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <BarChart3 size={11} color="#D4820A" strokeWidth={2} /> Statistik Kota
                  </p>

                  {/* Stat cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 18 }}>
                    {[
                      { Icon: Coffee,         label: "Warkop Aktif",   value: stats.warkops              },
                      { Icon: Users,          label: "Member",         value: stats.users                },
                      { Icon: CheckCircle2,   label: "Total Check-in", value: stats.checkins ?? 0        },
                      { Icon: Camera,         label: "Foto Terkirim",  value: stats.photos               },
                    ].map(({ Icon, label, value }) => (
                      <div key={label} style={{ padding: "13px 12px", borderRadius: 13, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)", textAlign: "center" }}>
                        <Icon size={14} color="#D4820A" strokeWidth={1.8} style={{ margin: "0 auto 6px", display: "block" }} />
                        <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#F0A020", lineHeight: 1, marginBottom: 4 }}>{value.toLocaleString("id-ID")}</div>
                        <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em" }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Popular warkops */}
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(240,235,225,0.38)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={10} strokeWidth={2} style={{ color: "#D4820A" }} /> Warkop Terpopuler
                  </p>
                  {sortedWarkops.slice(0, 5).map(w => (
                    <div key={w.id} className="warkop-list-card" onClick={() => router.push(`/warkop/${w.id}`)}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(212,130,10,0.1)", border: "1px solid rgba(212,130,10,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Coffee size={15} color="#D4820A" strokeWidth={1.8} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#F0EBE1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{w.name}</p>
                        <p style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.35)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <CheckCircle2 size={9} strokeWidth={2} style={{ color: "#F0A020" }} />
                            {w._count?.checkIns ?? 0}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <Camera size={9} strokeWidth={2} style={{ color: "#818CF8" }} />
                            {w._count?.photos ?? 0}
                          </span>
                        </p>
                      </div>
                      <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.22)", flexShrink: 0 }} />
                    </div>
                  ))}

                  {/* Info tip */}
                  <div style={{ marginTop: 14, padding: "11px 12px", borderRadius: 11, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <Info size={13} color="rgba(255,255,255,0.25)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: "0.69rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>
                      Klik pin di peta untuk melihat detail warkop. Check-in untuk mendapatkan poin dan masuk leaderboard.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </aside>
      </div>

      {/* ── LIGHTBOX ───────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lightbox-dark"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={18} />
            </button>

            <motion.div
              initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: "90vw", maxHeight: "65vh", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
            >
              <img src={lightbox.url} alt={lightbox.caption || ""} style={{ display: "block", width: "auto", height: "auto", maxWidth: "100%", maxHeight: "65vh", objectFit: "contain" }} />
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              style={{ marginTop: 14, background: "rgba(10,11,18,0.92)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, padding: "13px 18px", textAlign: "center", maxWidth: 360 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.83rem", fontWeight: 700, color: "#F0EBE1", marginBottom: 3 }}>
                <User size={13} color="#F0A020" /> {lightbox.userName}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                <Calendar size={11} />
                {new Date(lightbox.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              {lightbox.caption && (
                <p style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.55)", fontStyle: "italic", marginBottom: 10 }}>
                  &quot;{lightbox.caption}&quot;
                </p>
              )}
              <button onClick={() => { router.push(`/warkop/${lightbox.id}`); setLightbox(null); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: "rgba(212,130,10,0.1)", border: "1px solid rgba(212,130,10,0.22)", color: "#D4820A", fontSize: "0.73rem", fontWeight: 700, cursor: "pointer" }}>
                <MapPin size={11} /> {lightbox.warkopName}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookieBanner />
    </div>
  );
}
