import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jejak Warkop — Peta Warkop Banda Aceh",
    template: "%s | Jejak Warkop",
  },
  description:
    "Temukan warkop terbaik di Banda Aceh. Check-in, upload foto, dan jadilah bagian dari komunitas pecinta kopi Aceh.",
  keywords: [
    "warkop",
    "warung kopi",
    "Banda Aceh",
    "kopi Aceh",
    "cafe Aceh",
    "peta warkop",
    "check-in",
  ],
  authors: [{ name: "Jejak Warkop" }],
  creator: "Jejak Warkop",
  publisher: "Jejak Warkop",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jejakwarkop.id",
    siteName: "Jejak Warkop",
    title: "Jejak Warkop — Peta Warkop Banda Aceh",
    description:
      "Temukan warkop terbaik di Banda Aceh. Check-in, upload foto, dan jadilah bagian dari komunitas pecinta kopi Aceh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jejak Warkop",
    description: "Peta warkop terbaik di Banda Aceh",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0b09" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
