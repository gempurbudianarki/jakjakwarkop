import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi Jejak Warkop — bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
};

export default function PrivacyPage() {
  const lastUpdated = "28 Juni 2026";
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <Shield className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">
                Kebijakan Privasi
              </h1>
              <p className="text-sm text-muted-foreground">
                Terakhir diperbarui: {lastUpdated}
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-foreground">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">1. Pendahuluan</h2>
              <p className="text-muted-foreground leading-relaxed">
                Selamat datang di <strong>Jejak Warkop</strong> (&quot;kami&quot;, &quot;kita&quot;, atau &quot;platform&quot;).
                Kami menghormati privasi Anda dan berkomitmen untuk melindungi
                informasi pribadi yang Anda bagikan kepada kami. Kebijakan Privasi
                ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
                menyimpan, dan melindungi data Anda saat menggunakan layanan
                Jejak Warkop.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">2. Data yang Kami Kumpulkan</h2>
              <div className="space-y-3 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">a. Data Akun</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed">
                    <li>Nama lengkap</li>
                    <li>Alamat email</li>
                    <li>Password (disimpan dalam bentuk hash menggunakan bcrypt)</li>
                    <li>Foto profil (opsional)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">b. Data Aktivitas</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed">
                    <li>Riwayat check-in di warkop</li>
                    <li>Foto yang Anda upload</li>
                    <li>Caption dan komentar</li>
                    <li>Poin yang dikumpulkan</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">c. Data Teknis</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed">
                    <li>Alamat IP (untuk keamanan dan rate limiting)</li>
                    <li>Informasi browser dan perangkat</li>
                    <li>Waktu akses dan halaman yang dikunjungi</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">3. Bagaimana Kami Menggunakan Data</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>✅ Menyediakan dan mengoperasikan layanan platform</li>
                <li>✅ Mengelola akun dan autentikasi pengguna</li>
                <li>✅ Menampilkan leaderboard dan riwayat check-in</li>
                <li>✅ Memoderasi konten (foto) sebelum dipublish</li>
                <li>✅ Mencegah penyalahgunaan dan aktivitas berbahaya</li>
                <li>✅ Meningkatkan pengalaman pengguna</li>
                <li>❌ Kami TIDAK menjual data Anda kepada pihak ketiga</li>
                <li>❌ Kami TIDAK menggunakan data untuk iklan bertarget</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">4. Keamanan Data</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kami menerapkan langkah-langkah keamanan industry-standard untuk melindungi data Anda:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🔐 Password dienkripsi dengan bcrypt (salt rounds: 12)</li>
                <li>🔐 Sesi menggunakan JWT yang aman</li>
                <li>🔐 HTTPS untuk semua koneksi</li>
                <li>🔐 Rate limiting untuk mencegah brute force</li>
                <li>🔐 Validasi magic bytes untuk upload file</li>
                <li>🔐 Content Security Policy (CSP) headers</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">5. Penyimpanan dan Retensi Data</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Data Anda disimpan di server yang berlokasi di Indonesia.
                Kami menyimpan data selama akun Anda aktif. Jika Anda
                menghapus akun, data pribadi Anda akan dihapus dalam
                waktu 30 hari, kecuali data yang diperlukan untuk kepatuhan
                hukum.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">6. Hak-hak Anda</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📋 Hak akses — minta salinan data Anda</li>
                <li>✏️ Hak koreksi — perbaiki data yang tidak akurat</li>
                <li>🗑️ Hak penghapusan — minta penghapusan akun dan data</li>
                <li>📤 Hak portabilitas — ekspor data Anda</li>
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                Untuk menggunakan hak-hak ini, hubungi kami melalui halaman{" "}
                <Link href="/about" className="text-amber-600 hover:underline font-medium">
                  Tentang Kami
                </Link>.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">7. Cookie</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami menggunakan cookie untuk autentikasi sesi dan preferensi pengguna.
                Baca{" "}
                <Link href="/cookies" className="text-amber-600 hover:underline font-medium">
                  Kebijakan Cookie
                </Link>{" "}
                kami untuk informasi lebih lengkap.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">8. Perubahan Kebijakan</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu.
                Perubahan signifikan akan diberitahukan melalui email atau
                notifikasi di platform. Penggunaan lanjutan setelah perubahan
                dianggap sebagai persetujuan.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
