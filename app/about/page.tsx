import type { Metadata } from "next";
import Link from "next/link";
import {
  Coffee,
  MapPin,
  Users,
  Camera,
  ArrowLeft,
  Heart,
  Target,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali Jejak Warkop — platform komunitas yang menghubungkan pecinta kopi Banda Aceh.",
};

export default function AboutPage() {
  const features = [
    {
      icon: MapPin,
      title: "Peta Interaktif",
      desc: "Temukan warkop terdekat dengan peta real-time yang mencakup seluruh Banda Aceh",
    },
    {
      icon: Camera,
      title: "Check-in & Galeri",
      desc: "Abadikan momen terbaik di warkop favoritmu dan bagikan ke komunitas",
    },
    {
      icon: Users,
      title: "Komunitas Aktif",
      desc: "Bergabung dengan ribuan pecinta kopi Aceh dan bersaing di leaderboard",
    },
    {
      icon: Zap,
      title: "Sistem Poin",
      desc: "Kumpulkan poin setiap check-in dan jadilah Legend di komunitas",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Cinta Kopi Aceh",
      desc: "Kami percaya kopi Aceh adalah warisan budaya yang perlu dirayakan bersama",
    },
    {
      icon: Users,
      title: "Komunitas Inklusif",
      desc: "Setiap pecinta kopi, dari berbagai latar belakang, selamat bergabung",
    },
    {
      icon: Target,
      title: "Autentisitas",
      desc: "Ulasan jujur dari pengalaman nyata, bukan konten berbayar",
    },
  ];

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-20 text-center">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-2xl px-4">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/10 ring-1 ring-white/20">
                <Coffee className="h-10 w-10 text-amber-400" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white sm:text-5xl">
              Tentang{" "}
              <span className="text-amber-400">Jejak Warkop</span>
            </h1>
            <p className="mt-4 text-lg text-amber-200/70 leading-relaxed">
              Platform komunitas untuk menghubungkan, menemukan, dan merayakan
              warung kopi terbaik di Banda Aceh — Kota Kopi Indonesia.
            </p>
          </div>
        </section>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          {/* Story */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-4">
              Cerita Kami ☕
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Banda Aceh dikenal sebagai kota yang tidak pernah tidur, dan
                warung kopi adalah jantungnya. Di setiap sudut kota, warkop
                menjadi tempat berkumpul, berdiskusi, berbisnis, dan menjalin
                persahabatan.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Jejak Warkop</strong> lahir
                dari kecintaan kami terhadap budaya ngopi Aceh. Kami ingin
                menciptakan wadah digital yang memudahkan siapapun — warga
                lokal maupun wisatawan — untuk menemukan dan mengeksplorasi
                warkop-warkop terbaik di Banda Aceh.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Melalui platform ini, kami mengabadikan cerita di setiap cangkir
                kopi, setiap meja warkop, dan setiap tawa yang terdengar di
                sudut-sudut kota Serambi Mekkah.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6">
              Apa yang Kami Tawarkan 🚀
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="card-premium flex items-start gap-4 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-black text-foreground mb-6">
              Nilai-nilai Kami 💛
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                    <Icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="mb-12 rounded-2xl hero-gradient p-8 text-center">
            <h2 className="text-xl font-black text-white mb-6">
              Bersama Komunitas Jejak Warkop
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "20+", label: "Warkop Terdaftar" },
                { value: "500+", label: "Member Aktif" },
                { value: "1.200+", label: "Check-in" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-amber-400">{value}</p>
                  <p className="text-xs text-amber-200/60 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-black text-foreground mb-2">
              Bergabung Bersama Kami 🤝
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Jadilah bagian dari komunitas pecinta kopi Aceh. Gratis, mudah,
              dan menyenangkan!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-amber-600/30 transition-all"
              >
                <Users className="h-4 w-4" />
                Daftar Sekarang
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Jelajahi Peta
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
