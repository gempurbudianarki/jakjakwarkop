"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";

interface WarkopPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  image?: string | null;
  _count?: { checkIns?: number };
}

// Premium animated marker with pulse ring
function createWarkopIcon(isActive = true) {
  return new L.DivIcon({
    html: `
      <div style="position:relative;width:40px;height:40px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:rgba(217,119,6,0.2);animation:markerPulse 2s infinite;"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);border:2.5px solid #fff;box-shadow:0 3px 12px rgba(217,119,6,0.5);display:flex;align-items:center;justify-content:center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 2v2"/><path d="M14 2v2"/>
            <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>
            <path d="M6 2v2"/>
          </svg>
        </div>
      </div>`,
    className: "warkop-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42],
  });
}

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    map.setView(center, zoom, { animate: true, duration: 0.8 });
  }, [map, center, zoom]);
  return null;
}

export default function WarkopMap({ warkops }: { warkops: WarkopPin[] }) {
  const router = useRouter();
  const center: [number, number] = [
    parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LAT || "5.5483"),
    parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LNG || "95.3238"),
  ];
  const zoom = parseInt(process.env.NEXT_PUBLIC_MAP_ZOOM || "13");

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapUpdater center={center} zoom={zoom} />

      {warkops.map((warkop) => (
        <Marker
          key={warkop.id}
          position={[warkop.latitude, warkop.longitude]}
          icon={createWarkopIcon()}
        >
          <Popup minWidth={220} maxWidth={280}>
            <div style={{ padding: "12px", fontFamily: "Inter, system-ui, sans-serif" }}>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#1a1510",
                  margin: "0 0 4px",
                  lineHeight: 1.3,
                }}
              >
                {warkop.name}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(240,235,225,0.45)",
                  margin: "0 0 8px",
                  lineHeight: 1.4,
                }}
              >
                {warkop.address}
              </p>
              {warkop._count?.checkIns !== undefined && (
                <p style={{ fontSize: "11px", color: "#D4820A", margin: "0 0 10px", fontWeight: 700, letterSpacing: "0.02em" }}>
                  {warkop._count.checkIns} check-in
                </p>
              )}
              <button
                onClick={() => router.push(`/warkop/${warkop.id}`)}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #d97706, #f59e0b)",
                  border: "none",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "white",
                  boxShadow: "0 3px 10px rgba(217,119,6,0.3)",
                  transition: "transform 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Lihat Detail →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
