"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Coffee,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  MapPin,
  Camera,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah. Coba lagi.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: MapPin, text: "Temukan warkop terbaik di Banda Aceh" },
    { icon: Camera, text: "Check-in dan upload foto pengalamanmu" },
    { icon: Trophy, text: "Bersaing di leaderboard komunitas" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand art */}
      <div className="hero-gradient relative hidden flex-col items-center justify-center overflow-hidden lg:flex lg:w-[45%]">
        {/* Grid dots */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex max-w-sm flex-col items-center px-8 text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/10 ring-1 ring-white/20 shadow-2xl"
          >
            <Coffee className="h-12 w-12 text-amber-400" />
          </motion.div>

          <h2 className="text-4xl font-black text-white">
            Jejak <span className="text-amber-400">Warkop</span>
          </h2>
          <p className="mt-3 text-amber-200/70 text-sm leading-relaxed">
            Platform komunitas pecinta kopi Banda Aceh. Temukan, check-in, dan bagikan ceritamu.
          </p>

          <div className="mt-8 w-full space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                  <Icon className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-sm text-amber-100/80">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg">
              <Coffee className="h-7 w-7 text-white" />
            </div>
            <h1 className="mt-3 text-2xl font-black text-foreground">
              Jejak <span className="gradient-text">Warkop</span>
            </h1>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-foreground">
              Selamat datang kembali 👋
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Masuk untuk melanjutkan petualangan kopi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input-premium"
                placeholder="kamu@email.com"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-semibold text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="input-premium pr-10"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-3 text-sm font-bold text-white shadow-md shadow-amber-600/25 hover:shadow-amber-600/40 hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 transition-all"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-amber-600 hover:text-amber-500 transition-colors"
            >
              Daftar sekarang →
            </Link>
          </p>

          <div className="mt-4 border-t border-border pt-4 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Kembali ke beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
