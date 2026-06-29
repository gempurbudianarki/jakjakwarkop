"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Coffee,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Check,
  X,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

function getPasswordStrength(password: string): {
  score: number; // 0-4
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
} {
  const checks = [
    { label: "Minimal 8 karakter", passed: password.length >= 8 },
    { label: "Huruf besar (A-Z)", passed: /[A-Z]/.test(password) },
    { label: "Huruf kecil (a-z)", passed: /[a-z]/.test(password) },
    { label: "Angka (0-9)", passed: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.passed).length;
  const labels = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const colors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  return { score, label: labels[score] || "", color: colors[score] || "", checks };
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Kamu harus menyetujui Syarat & Ketentuan");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (strength.score < 4) {
      setError("Password harus memenuhi semua persyaratan keamanan");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrasi gagal");
      } else {
        // Auto sign in after register
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });
        if (result?.error) {
          router.push("/login?registered=true");
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hero-gradient relative hidden flex-col items-center justify-center overflow-hidden lg:flex lg:w-[45%]">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex max-w-sm flex-col items-center px-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-white/10 ring-1 ring-white/20 shadow-2xl"
          >
            <Coffee className="h-12 w-12 text-amber-400" />
          </motion.div>

          <h2 className="text-4xl font-black text-white">
            Bergabung <span className="text-amber-400">Sekarang</span>
          </h2>
          <p className="mt-3 text-amber-200/70 text-sm leading-relaxed">
            Buat akun gratis dan mulai jelajahi warkop terbaik di Banda Aceh bersama ribuan pecinta kopi.
          </p>

          <div className="mt-8 w-full rounded-2xl bg-white/5 p-5 text-left ring-1 ring-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-bold text-amber-200">Keamanan Akun</p>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-200/60">
              <li>✓ Password dienkripsi dengan bcrypt</li>
              <li>✓ Sesi aman dengan JWT</li>
              <li>✓ Data privat terlindungi</li>
              <li>✓ Tidak ada iklan atau spam</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="mb-6 flex flex-col items-center lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg">
              <Coffee className="h-7 w-7 text-white" />
            </div>
            <h1 className="mt-3 text-2xl font-black text-foreground">
              Jejak <span className="gradient-text">Warkop</span>
            </h1>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-black text-foreground">
              Buat akun baru 🚀
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gratis selamanya. Tidak perlu kartu kredit.
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
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="input-premium"
                placeholder="Nama kamu"
              />
            </div>

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
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="input-premium pr-10"
                  placeholder="Buat password yang kuat"
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

              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`strength-bar flex-1 ${
                          i <= strength.score ? strength.color : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Kekuatan:{" "}
                    <span
                      className={
                        strength.score <= 1
                          ? "text-red-500"
                          : strength.score === 2
                          ? "text-yellow-500"
                          : strength.score === 3
                          ? "text-blue-500"
                          : "text-green-600"
                      }
                    >
                      {strength.label}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {strength.checks.map(({ label, passed }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-1 text-[11px] ${
                          passed
                            ? "text-green-600"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {passed ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={`input-premium ${
                    confirmPassword &&
                    (confirmPassword === password
                      ? "border-green-400 focus:border-green-500"
                      : "border-red-400 focus:border-red-500")
                  }`}
                  placeholder="Ulangi password"
                />
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirmPassword === password ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="h-4 w-4 rounded border-2 border-border bg-background peer-checked:border-amber-600 peer-checked:bg-amber-600 transition-colors">
                  {acceptTerms && (
                    <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Saya menyetujui{" "}
                <Link href="/terms" className="font-medium text-amber-600 hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/privacy" className="font-medium text-amber-600 hover:underline">
                  Kebijakan Privasi
                </Link>{" "}
                Jejak Warkop
              </p>
            </label>

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-3 text-sm font-bold text-white shadow-md shadow-amber-600/25 hover:shadow-amber-600/40 hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Buat Akun
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-amber-600 hover:text-amber-500 transition-colors"
            >
              Masuk di sini →
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
