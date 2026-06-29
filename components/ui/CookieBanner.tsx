"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Settings, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "jejak-warkop-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const fullConsent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConsent));
    setVisible(false);
  };

  const acceptSelected = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  const declineAll = () => {
    const minConsent: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minConsent));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="cookie-banner"
        >
          <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  Kami menggunakan cookie 🍪
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Kami menggunakan cookie untuk meningkatkan pengalaman browsing,
                  analitik situs, dan keamanan. Baca{" "}
                  <Link
                    href="/cookies"
                    className="font-medium text-amber-600 hover:underline"
                  >
                    Kebijakan Cookie
                  </Link>{" "}
                  kami untuk info lengkap.
                </p>

                {/* Detail settings */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 space-y-2"
                    >
                      {(
                        [
                          {
                            key: "necessary" as const,
                            label: "Cookie Wajib",
                            desc: "Diperlukan untuk fungsi dasar situs",
                            disabled: true,
                          },
                          {
                            key: "analytics" as const,
                            label: "Cookie Analitik",
                            desc: "Membantu kami memahami cara penggunaan situs",
                            disabled: false,
                          },
                          {
                            key: "marketing" as const,
                            label: "Cookie Marketing",
                            desc: "Digunakan untuk konten yang dipersonalisasi",
                            disabled: false,
                          },
                        ] as const
                      ).map(({ key, label, desc, disabled }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2"
                        >
                          <div>
                            <p className="text-xs font-medium text-foreground">
                              {label}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {desc}
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={consent[key]}
                              disabled={disabled}
                              onChange={(e) =>
                                !disabled &&
                                setConsent((prev) => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div
                              className={`h-5 w-9 rounded-full border transition-colors peer-checked:border-amber-500 peer-checked:bg-amber-500 ${
                                disabled
                                  ? "opacity-50 bg-amber-200 border-amber-300 cursor-not-allowed"
                                  : "border-border bg-muted"
                              }`}
                            >
                              <div
                                className={`mt-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                  consent[key] ? "ml-4" : "ml-0.5"
                                }`}
                              />
                            </div>
                          </label>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={acceptAll}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    Terima Semua
                  </button>
                  {showDetails ? (
                    <button
                      onClick={acceptSelected}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Simpan Pilihan
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowDetails(true)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="h-3 w-3" />
                      Atur Preferensi
                    </button>
                  )}
                  <button
                    onClick={declineAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Tolak
                  </button>
                </div>
              </div>
              <button
                onClick={declineAll}
                className="cursor-pointer shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
