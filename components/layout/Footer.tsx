"use client";

import Link from "next/link";
import { Coffee, MapPin, Shield, FileText, Info, Cookie } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md shadow-amber-600/20">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight">
                  Jejak <span className="gradient-text">Warkop</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Banda Aceh
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Platform komunitas untuk menjelajahi dan mendokumentasikan warung
              kopi terbaik di Banda Aceh. Kota kopi, kota sejuta cerita.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <span>Banda Aceh, Aceh, Indonesia</span>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Navigasi
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Beranda" },
                { href: "/about", label: "Tentang Kami" },
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/register", label: "Daftar Akun" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-amber-600 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Legal & Kebijakan
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/privacy", label: "Kebijakan Privasi", icon: Shield },
                { href: "/terms", label: "Syarat & Ketentuan", icon: FileText },
                { href: "/cookies", label: "Kebijakan Cookie", icon: Cookie },
                { href: "/about", label: "Tentang Kami", icon: Info },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-600 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Jejak Warkop. Hak cipta dilindungi undang-undang.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibuat dengan <Coffee size={11} style={{ display:"inline", verticalAlign:"middle", margin:"0 2px" }} /> untuk komunitas Aceh
          </p>
        </div>
      </div>
    </footer>
  );
}
