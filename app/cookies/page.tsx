import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ArrowLeft, Check, X, Settings } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Kebijakan Cookie",
  description: "Penjelasan lengkap tentang penggunaan cookie di platform Jejak Warkop.",
};

export default function CookiesPage() {
  const cookieTypes = [
    {
      name: "Cookie Wajib",
      icon: Check,
      iconColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      canDisable: false,
      description:
        "Cookie ini diperlukan agar website dapat berfungsi dengan benar dan tidak dapat dinonaktifkan.",
      examples: [
        { name: "next-auth.session-token", purpose: "Menyimpan sesi login pengguna", duration: "30 hari" },
        { name: "__Host-next-auth.csrf-token", purpose: "Perlindungan CSRF", duration: "Session" },
      ],
    },
    {
      name: "Cookie Analitik",
      icon: Settings,
      iconColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      canDisable: true,
      description:
        "Cookie ini membantu kami memahami cara pengguna berinteraksi dengan website untuk meningkatkan pengalaman.",
      examples: [
        { name: "jejak-warkop-visited", purpose: "Deteksi kunjungan pertama (Welcome screen)", duration: "Session" },
      ],
    },
    {
      name: "Cookie Preferensi",
      icon: Settings,
      iconColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      canDisable: true,
      description:
        "Cookie ini menyimpan preferensi Anda seperti pilihan cookie dan pengaturan tampilan.",
      examples: [
        { name: "jejak-warkop-cookie-consent", purpose: "Menyimpan pilihan persetujuan cookie", duration: "1 tahun" },
      ],
    },
  ];

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
              <Cookie className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">
                Kebijakan Cookie
              </h1>
              <p className="text-sm text-muted-foreground">
                Terakhir diperbarui: 28 Juni 2026
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">Apa itu Cookie?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cookie adalah file teks kecil yang disimpan di perangkat Anda ketika
                mengunjungi sebuah website. Cookie membantu website berfungsi dengan
                baik, mengingat preferensi Anda, dan memberikan pengalaman yang lebih
                personal. Cookie tidak dapat mengakses informasi lain di perangkat Anda
                selain apa yang telah diberikan kepada website.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Jenis Cookie yang Kami Gunakan</h2>
              <div className="space-y-4">
                {cookieTypes.map(
                  ({
                    name,
                    icon: Icon,
                    iconColor,
                    bgColor,
                    borderColor,
                    canDisable,
                    description,
                    examples,
                  }) => (
                    <div
                      key={name}
                      className={`rounded-xl border ${borderColor} ${bgColor} p-4`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${iconColor}`} />
                          <h3 className="font-bold text-sm text-foreground">{name}</h3>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            canDisable
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {canDisable ? "Dapat dinonaktifkan" : "Selalu aktif"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {description}
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-black/10">
                              <th className="pb-1.5 text-left font-semibold text-foreground">
                                Nama Cookie
                              </th>
                              <th className="pb-1.5 text-left font-semibold text-foreground">
                                Tujuan
                              </th>
                              <th className="pb-1.5 text-left font-semibold text-foreground">
                                Durasi
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {examples.map((ex) => (
                              <tr key={ex.name}>
                                <td className="py-1.5 pr-3 font-mono text-[10px] text-foreground/80">
                                  {ex.name}
                                </td>
                                <td className="py-1.5 pr-3 text-muted-foreground">
                                  {ex.purpose}
                                </td>
                                <td className="py-1.5 text-muted-foreground">
                                  {ex.duration}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">Cara Mengelola Cookie</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">Melalui banner cookie:</strong> Saat pertama
                    kunjungan, pilih preferensi cookie Anda melalui banner yang muncul di bagian bawah
                    halaman.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">Melalui browser:</strong> Anda dapat mengatur
                    cookie di pengaturan browser Anda. Namun, menonaktifkan semua cookie mungkin
                    mempengaruhi fungsi login.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <X className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">Perhatian:</strong> Menonaktifkan cookie
                    wajib akan membuat Anda tidak bisa login ke platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">Cookie Pihak Ketiga</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami menggunakan OpenStreetMap dan CARTO untuk layanan peta. Layanan
                ini mungkin menetapkan cookie mereka sendiri. Kami tidak mengontrol
                cookie dari pihak ketiga ini. Untuk informasi lebih lanjut, lihat
                kebijakan privasi mereka masing-masing.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">Pertanyaan?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jika Anda memiliki pertanyaan tentang penggunaan cookie kami,
                kunjungi{" "}
                <Link href="/about" className="text-amber-600 hover:underline font-medium">
                  halaman Tentang Kami
                </Link>{" "}
                atau baca{" "}
                <Link href="/privacy" className="text-amber-600 hover:underline font-medium">
                  Kebijakan Privasi
                </Link>{" "}
                kami untuk informasi lebih lengkap.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
