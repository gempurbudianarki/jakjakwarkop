"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Coffee,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setError(data.error || "Gagal mereset password.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-black text-foreground">Tautan tidak valid</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tautan reset tidak lengkap. Silakan minta tautan baru.
        </p>
        <Link
          href="/forgot-password"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500"
        >
          <ArrowLeft className="h-4 w-4" /> Minta tautan reset
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-6 text-center"
      >
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-500" />
        <h2 className="text-lg font-black text-foreground">Password diperbarui!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mengarahkan ke halaman login...
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-foreground">Buat password baru</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Minimal 8 karakter, ada huruf besar, kecil, dan angka.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            Password Baru
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="input-premium pl-9 pr-10"
              placeholder="Password baru"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            Konfirmasi Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="input-premium pl-9"
              placeholder="Ulangi password baru"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-3 text-sm font-bold text-white shadow-md shadow-amber-600/25 hover:shadow-amber-600/40 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              Simpan Password Baru
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg">
            <Coffee className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-3 text-2xl font-black text-foreground">
            Jejak <span className="gradient-text">Warkop</span>
          </h1>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Memuat...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
