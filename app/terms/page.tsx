import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan platform Jejak Warkop.",
};

export default function TermsPage() {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
              <FileText className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">
                Syarat &amp; Ketentuan
              </h1>
              <p className="text-sm text-muted-foreground">
                Berlaku sejak 28 Juni 2026
              </p>
            </div>
          </div>

          <div className="space-y-6 text-foreground">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Penting:</strong> Dengan mendaftar dan menggunakan
                platform Jejak Warkop, Anda menyetujui Syarat dan Ketentuan
                ini. Harap baca dengan seksama sebelum menggunakan layanan kami.
              </p>
            </div>

            {[
              {
                title: "1. Penerimaan Syarat",
                content:
                  "Dengan mengakses atau menggunakan platform Jejak Warkop, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui, harap jangan gunakan platform kami.",
              },
              {
                title: "2. Deskripsi Layanan",
                content:
                  "Jejak Warkop adalah platform komunitas digital yang memungkinkan pengguna untuk menemukan, mendokumentasikan, dan berbagi pengalaman tentang warung kopi di Banda Aceh. Layanan meliputi peta interaktif, check-in, upload foto, dan leaderboard komunitas.",
              },
            ].map(({ title, content }) => (
              <section key={title} className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold mb-3">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
              </section>
            ))}

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">3. Ketentuan Akun</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Anda harus berusia minimal 13 tahun untuk mendaftar</li>
                <li>• Satu orang hanya boleh memiliki satu akun</li>
                <li>• Anda bertanggung jawab atas keamanan password akun Anda</li>
                <li>• Informasi yang Anda berikan harus akurat dan terkini</li>
                <li>• Akun yang tidak aktif lebih dari 2 tahun dapat dihapus</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">4. Aturan Penggunaan</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Yang Diperbolehkan ✅</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>• Menggunakan platform untuk tujuan personal dan komunitas</li>
                    <li>• Check-in di warkop yang Anda kunjungi</li>
                    <li>• Upload foto original dari warkop</li>
                    <li>• Berbagi pengalaman melalui caption</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Yang Dilarang ❌</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>• Upload konten yang tidak senonoh, provokatif, atau berbau SARA</li>
                    <li>• Melakukan fake check-in (check-in tanpa benar-benar hadir)</li>
                    <li>• Spam, bot, atau manipulasi leaderboard</li>
                    <li>• Menggunakan platform untuk kegiatan komersial tanpa izin</li>
                    <li>• Upaya hacking, scraping, atau akses tidak sah</li>
                    <li>• Mengunggah foto yang bukan milik Anda atau melanggar hak cipta</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">5. Konten yang Diunggah</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Dengan mengupload foto atau caption, Anda memberikan kami lisensi
                non-eksklusif untuk menampilkan konten tersebut di platform.
                Anda tetap memiliki hak cipta atas konten Anda.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Semua foto akan melalui proses moderasi admin sebelum
                dipublikasikan. Kami berhak menolak atau menghapus konten
                yang melanggar ketentuan ini.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">6. Sistem Poin dan Leaderboard</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Poin diberikan untuk check-in valid (satu check-in per warkop per hari)</li>
                <li>• Poin tidak dapat ditukar dengan uang atau hadiah apapun</li>
                <li>• Kami berhak mengubah sistem poin sewaktu-waktu</li>
                <li>• Manipulasi poin akan mengakibatkan pemblokiran akun</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">7. Pembatasan Tanggung Jawab</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Platform Jejak Warkop disediakan &quot;sebagaimana adanya&quot; tanpa jaminan
                apapun. Kami tidak bertanggung jawab atas kerugian yang timbul dari
                penggunaan atau ketidakmampuan menggunakan layanan, informasi warkop
                yang tidak akurat, atau konten yang diunggah oleh pengguna lain.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">8. Penangguhan dan Penghentian</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami berhak menangguhkan atau menghapus akun yang melanggar Syarat
                dan Ketentuan ini tanpa pemberitahuan terlebih dahulu. Pengguna
                yang diblokir tidak boleh mendaftar ulang tanpa izin.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">9. Hukum yang Berlaku</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Syarat dan Ketentuan ini diatur oleh hukum Negara Republik Indonesia.
                Setiap sengketa yang timbul akan diselesaikan melalui jalur musyawarah,
                dan jika tidak tercapai kesepakatan, melalui pengadilan yang berwenang
                di Banda Aceh, Aceh, Indonesia.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">10. Hubungi Kami</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
                kunjungi halaman{" "}
                <Link href="/about" className="text-amber-600 hover:underline font-medium">
                  Tentang Kami
                </Link>{" "}
                untuk informasi kontak.
              </p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
