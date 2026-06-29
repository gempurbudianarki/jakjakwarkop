"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import AuthProvider from "@/components/auth/AuthProvider";
import { Trophy, Zap, Users } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  image?: string | null;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setLeaderboard(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-600/25">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-foreground">Leaderboard</h1>
            <p className="mt-2 text-muted-foreground">
              Siapa yang paling rajin check-in di warkop Banda Aceh?
            </p>
          </div>

          {/* Badge legend */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: "Explorer", desc: "0–99 poin", color: "badge-explorer" },
              { label: "Regular", desc: "100–199 poin", color: "badge-regular" },
              { label: "Legend", desc: "200+ poin", color: "badge-legend" },
            ].map(({ label, desc, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>
                  {label}
                </span>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="shimmer h-14 rounded-2xl" />
              ))}
            </div>
          ) : (
            <Leaderboard entries={leaderboard} title={`🏆 Top ${leaderboard.length} Pecinta Kopi`} />
          )}

          <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-amber-600">
              <Zap className="h-5 w-5" />
              <p className="font-bold text-sm">Cara Mendapatkan Poin</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Check-in di warkop dan upload foto untuk mendapatkan{" "}
              <strong className="text-amber-600">+10 poin</strong> per hari per warkop.
              Semakin banyak warkop yang dikunjungi, semakin tinggi peringkatmu!
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
