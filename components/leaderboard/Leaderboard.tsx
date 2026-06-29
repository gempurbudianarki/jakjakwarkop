import { Trophy, Medal, Award, Flame, Star, Zap } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  image?: string | null;
  checkIns?: number;
}

function getBadge(points: number) {
  if (points >= 200) return { label: "Legend", color: "badge-legend" };
  if (points >= 100) return { label: "Regular", color: "badge-regular" };
  return { label: "Explorer", color: "badge-explorer" };
}

const rankIcons = [
  <Trophy key="gold" className="h-5 w-5 text-amber-400" />,
  <Medal key="silver" className="h-5 w-5 text-slate-400" />,
  <Award key="bronze" className="h-5 w-5 text-amber-700" />,
];

const podiumColors = [
  "from-amber-400/30 to-amber-600/20 border-amber-400/40",
  "from-slate-400/20 to-slate-500/10 border-slate-400/30",
  "from-amber-700/20 to-amber-800/10 border-amber-700/30",
];

export default function Leaderboard({
  entries,
  title,
}: {
  entries: LeaderboardEntry[];
  title: string;
}) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
        <div className="flex items-center gap-1 text-amber-500">
          <Flame className="h-4 w-4" />
          <span className="text-xs font-semibold text-amber-600">Top {entries.length}</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada data</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Check-in pertama untuk masuk leaderboard!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 2 && (
            <div className="mb-4 flex items-end justify-center gap-2">
              {/* 2nd place */}
              {top3[1] && (
                <div className={`flex flex-1 flex-col items-center rounded-xl border bg-gradient-to-b ${podiumColors[1]} px-2 py-3`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300/50 bg-slate-100/20 text-sm font-black text-slate-300">
                    {top3[1].name.charAt(0).toUpperCase()}
                  </div>
                  <Medal className="mt-1.5 h-4 w-4 text-slate-400" />
                  <p className="mt-1 text-center text-[11px] font-semibold text-card-foreground truncate w-full">
                    {top3[1].name.split(" ")[0]}
                  </p>
                  <p className="text-xs font-bold text-amber-600">{top3[1].points} pts</p>
                  <div className="mt-1 h-5 w-full rounded-t-sm bg-slate-400/10 border-t border-slate-400/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">#2</span>
                  </div>
                </div>
              )}

              {/* 1st place — tallest */}
              <div className={`flex flex-1 flex-col items-center rounded-xl border bg-gradient-to-b ${podiumColors[0]} px-2 py-4 -mb-2`}>
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-400/60 bg-amber-100/30 text-base font-black text-amber-200">
                    {top3[0].name.charAt(0).toUpperCase()}
                  </div>
                  <Trophy className="absolute -top-2 -right-2 h-5 w-5 text-amber-400" />
                </div>
                <p className="mt-2 text-center text-xs font-bold text-card-foreground truncate w-full">
                  {top3[0].name.split(" ")[0]}
                </p>
                <p className="text-sm font-black text-amber-600">{top3[0].points} pts</p>
                <div className="mt-1 h-8 w-full rounded-t-sm bg-amber-400/10 border-t border-amber-400/20 flex items-center justify-center">
                  <span className="text-[10px] font-black text-amber-400">#1</span>
                </div>
              </div>

              {/* 3rd place */}
              {top3[2] && (
                <div className={`flex flex-1 flex-col items-center rounded-xl border bg-gradient-to-b ${podiumColors[2]} px-2 py-3`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-700/30 bg-amber-900/20 text-sm font-black text-amber-700">
                    {top3[2].name.charAt(0).toUpperCase()}
                  </div>
                  <Award className="mt-1.5 h-4 w-4 text-amber-700" />
                  <p className="mt-1 text-center text-[11px] font-semibold text-card-foreground truncate w-full">
                    {top3[2].name.split(" ")[0]}
                  </p>
                  <p className="text-xs font-bold text-amber-600">{top3[2].points} pts</p>
                  <div className="mt-1 h-3 w-full rounded-t-sm bg-amber-700/10 border-t border-amber-700/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-700">#3</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rest of list */}
          {rest.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {rest.map((entry) => {
                const badge = getBadge(entry.points);
                return (
                  <div
                    key={entry.rank}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="w-6 text-center text-xs font-bold text-muted-foreground">
                      #{entry.rank}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-xs font-bold text-amber-800">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {entry.name}
                      </p>
                      <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600">
                      <Zap className="h-3 w-3" />
                      <span className="text-xs font-bold">{entry.points}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Single entry case (no podium) */}
          {entries.length === 1 && (
            <div className="flex items-center gap-3 rounded-xl px-2.5 py-2 bg-amber-50/50">
              <Trophy className="h-5 w-5 text-amber-500" />
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                {entries[0].name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{entries[0].name}</p>
              </div>
              <span className="text-xs font-bold text-amber-600">{entries[0].points} pts</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
