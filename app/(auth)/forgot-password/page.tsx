"use client";

import { useState } from "react";
import Link from "next/link";
import { Coffee, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

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

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-border bg-card p-6 text-center"
          >
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-500" />
            <h2 className="text-lg font-black text-foreground">Cek email kamu</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Jika <strong className="text-foreground">{email}</strong> terdaftar,
              kami telah mengirim tautan untuk reset password. Tautan berlaku 1 jam.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke login
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-foreground">Lupa password?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Masukkan email kamu, kami kirim tautan reset.
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
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="input-premium pl-9"
                    placeholder="kamu@email.com"
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
                    Kirim Tautan Reset
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ingat password kamu?{" "}
              <Link
                href="/login"
                className="font-semibold text-amber-600 hover:text-amber-500 transition-colors"
              >
                Masuk
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
