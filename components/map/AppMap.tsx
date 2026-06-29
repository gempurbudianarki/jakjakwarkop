"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Warkop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  _count?: { checkIns: number; photos: number };
}

interface AppMapProps {
  warkops: Warkop[];
  selectedId?: string | null;
  onSelectWarkop?: (warkop: Warkop) => void;
}

/* ── SVG icon strings (no emoji) ────────────────────────────── */
const COFFEE_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`;
const PIN_SVG    = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

export default function AppMap({ warkops, selectedId, onSelectWarkop }: AppMapProps) {
  const router = useRouter();
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<L.Map | null>(null);
  const markersRef    = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const warkopsRef    = useRef(warkops);
  const [locating, setLocating] = useState(false);

  useEffect(() => { warkopsRef.current = warkops; }, [warkops]);

  /* ── Init map ──────────────────────────────────────────────── */
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [5.5582, 95.3283],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [[5.40, 95.15], [5.70, 95.50]],
      minZoom: 11,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, subdomains: "abcd" }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  /* ── Marker icon factory ───────────────────────────────────── */
  const makeIcon = useCallback((isActive: boolean, checkIns: number) => {
    const sz    = isActive ? 40 : 34;
    const color = isActive ? "#F0A020" : "#D4820A";
    const dark  = isActive ? "#B86800" : "#8C5500";
    const badge = checkIns > 0
      ? `<div style="position:absolute;top:-3px;right:-5px;background:#EF4444;color:#fff;font-size:8px;font-weight:800;border-radius:10px;min-width:15px;height:15px;display:flex;align-items:center;justify-content:center;padding:0 3px;box-shadow:0 1px 4px rgba(0,0,0,0.5);">${checkIns > 99 ? "99+" : checkIns}</div>`
      : "";

    return L.divIcon({
      html: `
        <div style="position:relative;width:${sz}px;height:${sz + 8}px;">
          <div style="
            position:absolute;bottom:0;left:50%;
            width:${sz}px;height:${sz}px;
            border-radius:50% 50% 50% 0;
            transform:translateX(-50%) rotate(-45deg);
            background:linear-gradient(135deg,${color},${dark});
            box-shadow:${isActive ? `0 0 0 6px rgba(240,160,32,0.18),0 6px 20px rgba(240,160,32,0.55)` : `0 4px 12px rgba(212,130,10,0.42),0 2px 6px rgba(0,0,0,0.35)`};
            display:flex;align-items:center;justify-content:center;
          ">
            <div style="transform:rotate(45deg);color:#07070A;display:flex;align-items:center;justify-content:center;line-height:0;">
              ${COFFEE_SVG}
            </div>
          </div>
          ${badge}
        </div>
      `,
      className: "",
      iconSize:   [sz, sz + 8],
      iconAnchor: [sz / 2, sz + 8],
      popupAnchor: [0, -(sz + 10)],
    });
  }, []);

  /* ── Popup HTML (no emoji) ────────────────────────────────── */
  const makePopupHTML = (w: Warkop) => `
    <div style="padding:14px 16px;min-width:224px;font-family:'DM Sans',system-ui,sans-serif;">
      <div style="font-size:0.88rem;font-weight:800;color:#F0EBE1;margin-bottom:6px;line-height:1.3;">${w.name}</div>
      <div style="font-size:0.7rem;color:rgba(240,235,225,0.4);margin-bottom:10px;line-height:1.5;display:flex;align-items:flex-start;gap:5px;">
        <span style="flex-shrink:0;margin-top:1px;color:rgba(240,235,225,0.3);">${PIN_SVG}</span>
        ${w.address.length > 55 ? w.address.slice(0, 55) + "…" : w.address}
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px;">
        <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;background:rgba(240,160,32,0.1);border:1px solid rgba(240,160,32,0.2);color:#F0A020;font-size:0.65rem;font-weight:700;letter-spacing:0.02em;">
          ${w._count?.checkIns ?? 0} check-in
        </span>
        <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;background:rgba(129,140,248,0.1);border:1px solid rgba(129,140,248,0.18);color:#818CF8;font-size:0.65rem;font-weight:700;letter-spacing:0.02em;">
          ${w._count?.photos ?? 0} foto
        </span>
      </div>
      <button id="popup-btn-${w.id}" style="width:100%;padding:9px;border-radius:10px;background:linear-gradient(135deg,#D4820A,#B86800);border:none;color:#07070A;font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:800;cursor:pointer;letter-spacing:0.03em;">
        Lihat Detail Warkop
      </button>
    </div>
  `;

  /* ── Update markers ─────────────────────────────────────────── */
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const ids = new Set(warkops.map((w) => w.id));

    Object.keys(markersRef.current).forEach((id) => {
      if (!ids.has(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    warkops.forEach((w) => {
      const isActive = selectedId === w.id;
      const icon = makeIcon(isActive, w._count?.checkIns ?? 0);

      if (markersRef.current[w.id]) {
        markersRef.current[w.id].setIcon(icon);
      } else {
        const marker = L.marker([w.latitude, w.longitude], { icon })
          .addTo(map)
          .bindPopup(makePopupHTML(w), { maxWidth: 268 })
          .on("popupopen", () => {
            const btn = document.getElementById(`popup-btn-${w.id}`);
            if (btn) {
              btn.addEventListener("click", () => {
                const latest = warkopsRef.current.find((x) => x.id === w.id);
                if (onSelectWarkop && latest) onSelectWarkop(latest);
                router.push(`/warkop/${w.id}`);
              });
            }
          });

        marker.bindTooltip(
          `<div style="font-weight:700;font-size:0.78rem;color:#F0EBE1;font-family:'DM Sans',sans-serif;padding:2px 0;">${w.name}</div>`,
          { direction: "top", offset: [0, -38], opacity: 1, className: "dark-tooltip" }
        );

        marker.on("click", () => { if (onSelectWarkop) onSelectWarkop(w); });
        markersRef.current[w.id] = marker;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warkops, selectedId, makeIcon, onSelectWarkop, router]);

  /* ── Pan to selected ────────────────────────────────────────── */
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const w = warkops.find((x) => x.id === selectedId);
    if (w) mapRef.current.setView([w.latitude, w.longitude], 16, { animate: true, duration: 0.8 });
  }, [selectedId, warkops]);

  /* ── User location ──────────────────────────────────────────── */
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        mapRef.current?.setView([latitude, longitude], 15, { animate: true });

        if (userMarkerRef.current) mapRef.current?.removeLayer(userMarkerRef.current);

        const userIcon = L.divIcon({
          html: `
            <div style="position:relative;width:24px;height:24px;">
              <div style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.25);animation:userPulse 2s ease-in-out infinite;"></div>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#3B82F6;border:2.5px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.55);"></div>
            </div>
          `,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(mapRef.current!)
          .bindPopup(`<div style="padding:8px 10px;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:700;color:#F0EBE1;">Lokasi Kamu</div>`);

        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(locateUser, 1500);
    return () => clearTimeout(t);
  }, [locateUser]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Locate me button */}
      <button
        onClick={locateUser}
        disabled={locating}
        className="map-locate-btn"
        title="Temukan lokasi saya"
      >
        {locating
          ? <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
          : <Navigation size={17} />
        }
      </button>

      {/* Map hint */}
      <div style={{
        position: "absolute", bottom: 16, left: 16, zIndex: 800,
        background: "rgba(7,7,10,0.82)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "7px 12px",
        fontSize: "0.7rem",
        color: "rgba(240,235,225,0.4)",
        pointerEvents: "none",
        fontFamily: '"DM Sans", sans-serif',
        letterSpacing: "0.01em",
      }}>
        Klik pin di peta untuk melihat detail warkop
      </div>
    </div>
  );
}
