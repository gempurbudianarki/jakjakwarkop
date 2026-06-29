"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, User, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string | null;
  userName: string;
  warkopName: string;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const photo = photos[current];

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : photos.length - 1));
  const next = () => setCurrent((c) => (c < photos.length - 1 ? c + 1 : 0));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lightbox-overlay"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next */}
      {photos.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-h-[80vh] max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl bg-white/5">
          <img
            src={photo.url}
            alt={photo.caption || `Foto dari ${photo.warkopName}`}
            className="max-h-[70vh] w-full object-contain"
          />
          <div className="bg-black/60 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {photo.userName}
                </p>
                <p className="text-xs text-white/60">{photo.warkopName} · {formatDate(photo.createdAt)}</p>
              </div>
              {photos.length > 1 && (
                <p className="text-xs text-white/40">
                  {current + 1} / {photos.length}
                </p>
              )}
            </div>
            {photo.caption && (
              <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
                {photo.caption}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery({
  photos,
  title,
}: {
  photos: GalleryPhoto[];
  title: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
        {photos.length > 0 && (
          <span className="stat-badge">{photos.length} foto</span>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <ZoomIn className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Belum ada foto
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Jadilah yang pertama check-in!
          </p>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="photo-grid-item group relative overflow-hidden rounded-xl cursor-pointer bg-muted"
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `Foto dari ${photo.warkopName}`}
                width={400}
                height={300}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="flex items-center gap-1 truncate text-xs font-semibold text-white">
                  <User className="h-3 w-3" />
                  {photo.userName}
                </p>
                {photo.caption && (
                  <p className="mt-0.5 truncate text-[10px] text-white/70">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
