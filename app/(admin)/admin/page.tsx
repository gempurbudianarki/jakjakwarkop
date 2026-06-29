"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Coffee,
  Users,
  Camera,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Shield,
  BarChart3,
  Search,
  RefreshCw,
  Eye,
  Ban,
  ChevronRight,
  Loader2,
  Filter,
  TrendingUp,
  Activity,
} from "lucide-react";
import AuthProvider from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "dashboard" | "warkop" | "users" | "photos";

interface Warkop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  phone?: string | null;
  facilities?: {
    wifi?: boolean;
    smoking?: boolean;
    food?: boolean;
    parking?: boolean;
  };
  _count?: { checkIns: number; photos: number };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  checkIns?: number;
  photos?: number;
  createdAt: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  status: string;
  userName: string;
  warkopName: string;
  createdAt: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="card-premium p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
      </div>
      <p className="text-3xl font-black text-foreground">{value.toLocaleString("id-ID")}</p>
      <p className="mt-0.5 text-sm font-medium text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-1">{sub}</p>}
    </div>
  );
}

function AdminContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [warkops, setWarkops] = useState<Warkop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stats, setStats] = useState({ warkops: 0, users: 0, photos: 0, checkins: 0 });
  const [showWarkopForm, setShowWarkopForm] = useState(false);
  const [editingWarkop, setEditingWarkop] = useState<Warkop | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [photoFilter, setPhotoFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchWarkops(), fetchUsers(), fetchPhotos()]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch {}
  };
  const fetchWarkops = async () => {
    try {
      const res = await fetch("/api/admin/warkop");
      const data = await res.json();
      if (Array.isArray(data)) setWarkops(data);
    } catch {}
  };
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch {}
  };
  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/admin/photos");
      const data = await res.json();
      if (Array.isArray(data)) setPhotos(data);
    } catch {}
  };

  const deleteWarkop = async (id: string) => {
    if (!confirm("Hapus warkop ini secara permanen?")) return;
    await fetch(`/api/admin/warkop?id=${id}`, { method: "DELETE" });
    fetchWarkops(); fetchStats();
  };

  const toggleWarkop = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/warkop?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchWarkops();
  };

  const changeUserRole = async (id: string, role: "USER" | "ADMIN") => {
    if (!confirm(`Ubah role user menjadi ${role}?`)) return;
    await fetch(`/api/admin/users?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Hapus user ini secara permanen?")) return;
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    fetchUsers(); fetchStats();
  };

  const moderatePhoto = async (id: string, status: "APPROVED" | "REJECTED") => {
    await fetch(`/api/admin/photos?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchPhotos(); fetchStats();
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Hapus foto ini?")) return;
    await fetch(`/api/admin/photos?id=${id}`, { method: "DELETE" });
    fetchPhotos(); fetchStats();
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
    { id: "warkop" as Tab, label: "Warkop", icon: Coffee, badge: stats.warkops },
    { id: "users" as Tab, label: "Users", icon: Users, badge: stats.users },
    { id: "photos" as Tab, label: "Foto", icon: Camera, badge: photos.filter((p) => p.status === "PENDING").length },
  ];

  const filteredWarkops = warkops.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.address.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPhotos =
    photoFilter === "ALL"
      ? photos
      : photos.filter((p) => p.status === photoFilter);

  const pendingCount = photos.filter((p) => p.status === "PENDING").length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md shadow-amber-600/25">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">Super Admin</h1>
              <p className="text-xs text-muted-foreground">
                Jejak Warkop Control Panel
              </p>
            </div>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSearch(""); }}
              className={`relative flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                tab === id
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-600/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {badge !== undefined && badge > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                    tab === id
                      ? "bg-white/20 text-white"
                      : id === "photos" && pendingCount > 0
                      ? "bg-red-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon={Coffee}
                  label="Total Warkop"
                  value={stats.warkops}
                  sub={`${warkops.filter((w) => w.isActive).length} aktif`}
                  color="bg-amber-100 text-amber-700"
                />
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.users}
                  color="bg-blue-100 text-blue-700"
                />
                <StatCard
                  icon={Camera}
                  label="Total Foto"
                  value={stats.photos}
                  sub={`${pendingCount} menunggu review`}
                  color="bg-green-100 text-green-700"
                />
                <StatCard
                  icon={Activity}
                  label="Total Check-in"
                  value={stats.checkins}
                  color="bg-purple-100 text-purple-700"
                />
              </div>

              {/* Pending photos alert */}
              {pendingCount > 0 && (
                <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200">
                      <Camera className="h-4 w-4 text-amber-800" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-900">
                        {pendingCount} foto menunggu moderasi
                      </p>
                      <p className="text-xs text-amber-700/70">
                        Review dan approve foto dari user
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTab("photos")}
                    className="flex cursor-pointer items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition-colors"
                  >
                    Review <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Recent warkops */}
              <div className="card-premium overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h2 className="font-bold text-foreground">Warkop Terbaru</h2>
                  <button
                    onClick={() => setTab("warkop")}
                    className="text-xs text-amber-600 hover:underline cursor-pointer"
                  >
                    Lihat semua
                  </button>
                </div>
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Check-in</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warkops.slice(0, 5).map((w) => (
                      <tr key={w.id}>
                        <td className="font-medium">{w.name}</td>
                        <td className="text-muted-foreground">{w._count?.checkIns || 0}</td>
                        <td>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${w.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {w.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* WARKOP */}
          {tab === "warkop" && (
            <motion.div
              key="warkop"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari nama atau alamat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-premium pl-9"
                  />
                </div>
                <button
                  onClick={() => { setEditingWarkop(null); setShowWarkopForm(true); }}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-amber-600/30 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Warkop
                </button>
              </div>

              <div className="card-premium overflow-hidden">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th className="hidden sm:table-cell">Alamat</th>
                      <th className="hidden md:table-cell">Check-in</th>
                      <th>Status</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWarkops.map((w) => (
                      <tr key={w.id}>
                        <td className="font-semibold">{w.name}</td>
                        <td className="hidden sm:table-cell max-w-[200px] truncate text-muted-foreground text-xs">
                          {w.address}
                        </td>
                        <td className="hidden md:table-cell text-muted-foreground">
                          {w._count?.checkIns || 0}
                        </td>
                        <td>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              w.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {w.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => toggleWarkop(w.id, w.isActive)}
                              title={w.isActive ? "Nonaktifkan" : "Aktifkan"}
                              className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                              {w.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => { setEditingWarkop(w); setShowWarkopForm(true); }}
                              className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteWarkop(w.id)}
                              className="cursor-pointer rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredWarkops.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted-foreground py-8">
                          {search ? `Tidak ditemukan hasil untuk "${search}"` : "Belum ada warkop"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-premium pl-9"
                />
              </div>

              <div className="card-premium overflow-hidden">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th className="hidden md:table-cell">Role</th>
                      <th className="hidden sm:table-cell">Poin</th>
                      <th className="hidden lg:table-cell">Check-in</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-xs font-bold text-amber-800">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{u.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              u.role === "ADMIN"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell font-semibold text-amber-600">
                          {u.points}
                        </td>
                        <td className="hidden lg:table-cell text-muted-foreground">
                          {u.checkIns || 0}
                        </td>
                        <td>
                          <div className="flex justify-end gap-1">
                            {u.role !== "ADMIN" && (
                              <>
                                <button
                                  onClick={() => changeUserRole(u.id, "USER")}
                                  title="Reset ke USER"
                                  className="cursor-pointer rounded-lg p-1.5 text-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                >
                                  <Ban className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteUser(u.id)}
                                  title="Hapus user"
                                  className="cursor-pointer rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted-foreground py-8">
                          Tidak ada user ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* PHOTOS */}
          {tab === "photos" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-4"
            >
              {/* Filter tabs */}
              <div className="flex gap-2 flex-wrap">
                {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => {
                  const count =
                    f === "ALL"
                      ? photos.length
                      : photos.filter((p) => p.status === f).length;
                  return (
                    <button
                      key={f}
                      onClick={() => setPhotoFilter(f)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        photoFilter === f
                          ? "bg-amber-600 text-white shadow-md"
                          : "border border-border bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Filter className="h-3 w-3" />
                      {f}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                          photoFilter === f ? "bg-white/20" : "bg-muted"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPhotos.map((p) => (
                  <div
                    key={p.id}
                    className="card-premium overflow-hidden"
                  >
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={p.url}
                        alt={p.caption || ""}
                        className="h-full w-full object-cover"
                      />
                      <span
                        className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold backdrop-blur-sm ${
                          p.status === "APPROVED"
                            ? "bg-green-500/90 text-white"
                            : p.status === "REJECTED"
                            ? "bg-red-500/90 text-white"
                            : "bg-amber-500/90 text-white"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-foreground truncate">{p.userName}</p>
                        <p className="text-xs text-muted-foreground shrink-0">
                          {new Date(p.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <p className="text-xs text-amber-600 font-medium mb-1">{p.warkopName}</p>
                      {p.caption && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {p.caption}
                        </p>
                      )}
                      <div className="flex gap-1.5">
                        {p.status !== "APPROVED" && (
                          <button
                            onClick={() => moderatePhoto(p.id, "APPROVED")}
                            className="flex cursor-pointer flex-1 items-center justify-center gap-1 rounded-lg bg-green-600 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            Approve
                          </button>
                        )}
                        {p.status !== "REJECTED" && (
                          <button
                            onClick={() => moderatePhoto(p.id, "REJECTED")}
                            className="flex cursor-pointer flex-1 items-center justify-center gap-1 rounded-lg bg-orange-500 py-1.5 text-xs font-bold text-white hover:bg-orange-400 transition-colors"
                          >
                            <X className="h-3 w-3" />
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => deletePhoto(p.id)}
                          className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-red-600 px-2 py-1.5 text-xs font-bold text-white hover:bg-red-500 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPhotos.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <Camera className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {photoFilter === "PENDING"
                        ? "Tidak ada foto yang menunggu review"
                        : "Belum ada foto"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warkop form modal */}
      <AnimatePresence>
        {showWarkopForm && (
          <WarkopForm
            warkop={editingWarkop}
            onClose={() => { setShowWarkopForm(false); setEditingWarkop(null); }}
            onSave={() => {
              setShowWarkopForm(false);
              setEditingWarkop(null);
              fetchWarkops();
              fetchStats();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WarkopForm({
  warkop,
  onClose,
  onSave,
}: {
  warkop: Warkop | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      address: formData.get("address"),
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      phone: formData.get("phone") || null,
      facilities: {
        wifi: formData.get("wifi") === "on",
        smoking: formData.get("smoking") === "on",
        food: formData.get("food") === "on",
        parking: formData.get("parking") === "on",
      },
    };

    try {
      const url = warkop ? `/api/admin/warkop?id=${warkop.id}` : "/api/admin/warkop";
      const method = warkop ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Gagal menyimpan");
      } else {
        onSave();
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-foreground">
            {warkop ? "Edit Warkop" : "Tambah Warkop Baru"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { name: "name", label: "Nama", defaultValue: warkop?.name, required: true },
            { name: "address", label: "Alamat", defaultValue: warkop?.address, required: true },
            { name: "phone", label: "Telepon", defaultValue: warkop?.phone || "" },
          ].map(({ name, label, defaultValue, required }) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                name={name}
                defaultValue={defaultValue}
                required={required}
                className="input-premium"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              required
              className="input-premium resize-none"
              defaultValue={warkop ? "" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "latitude", label: "Latitude", defaultValue: warkop?.latitude },
              { name: "longitude", label: "Longitude", defaultValue: warkop?.longitude },
            ].map(({ name, label, defaultValue }) => (
              <div key={name}>
                <label className="mb-1 block text-sm font-semibold text-foreground">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  name={name}
                  type="number"
                  step="any"
                  defaultValue={defaultValue}
                  required
                  className="input-premium"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Fasilitas
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["wifi", "smoking", "food", "parking"] as const).map((f) => (
                <label
                  key={f}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    name={f}
                    defaultChecked={warkop?.facilities?.[f] ?? false}
                    className="rounded accent-amber-600"
                  />
                  <span className="capitalize font-medium">{f}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-2.5 text-sm font-bold text-white hover:shadow-md disabled:opacity-50 transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
}
