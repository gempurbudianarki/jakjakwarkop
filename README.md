<div align="center">

```
     ██╗███████╗     ██╗ █████╗ ██╗  ██╗    ██╗    ██╗ █████╗ ██████╗ ██╗  ██╗ ██████╗ ██████╗
     ██║██╔════╝     ██║██╔══██╗██║ ██╔╝    ██║    ██║██╔══██╗██╔══██╗██║ ██╔╝██╔═══██╗██╔══██╗
     ██║█████╗       ██║███████║█████╔╝     ██║ █╗ ██║███████║██████╔╝█████╔╝ ██║   ██║██████╔╝
██   ██║██╔══╝  ██   ██║██╔══██║██╔═██╗     ██║███╗██║██╔══██║██╔══██╗██╔═██╗ ██║   ██║██╔═══╝
╚█████╔╝███████╗╚█████╔╝██║  ██║██║  ██╗    ╚███╔███╔╝██║  ██║██║  ██║██║  ██╗╚██████╔╝██║
 ╚════╝ ╚══════╝ ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝
```

**Peta interaktif warkop Banda Aceh — check-in, leaderboard, dan galeri komunitas**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2d3748?style=flat-square&logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/Lisensi-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Demo & Tampilan](#demo--tampilan)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Algoritma & Logika Inti](#algoritma--logika-inti)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Cara Menjalankan](#cara-menjalankan)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Dokumentasi API](#dokumentasi-api)
- [Skema Database](#skema-database)
- [Sistem Poin & Level](#sistem-poin--level)
- [Keamanan](#keamanan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)
- [Penulis](#penulis)

---

## Tentang Proyek

**JejakWarkop** adalah platform web interaktif berbasis peta untuk menelusuri, mengunjungi, dan mendokumentasikan pengalaman di warkop-warkop legendaris Kota Banda Aceh, Aceh, Indonesia.

Pengguna dapat menemukan warkop terdekat melalui peta GPS real-time, melakukan *check-in* dengan mengunggah foto, bersaing di leaderboard komunitas, serta menikmati galeri foto dari sesama penikmat kopi. Platform ini menggabungkan elemen **gamifikasi**, **geolokasi**, dan **komunitas** dalam satu antarmuka yang bersih dan modern.

> *"Warkop bukan sekadar tempat minum kopi — ia adalah ruang sosial, tempat cerita lahir, dan identitas budaya Aceh."*

---

## Fitur Utama

### Peta Interaktif GPS
- Peta gelap premium (CartoDB Dark Matter) dengan marker warkop berbentuk teardrop amber
- Deteksi lokasi pengguna secara real-time dengan animasi pulsing
- Auto-pan ke warkop yang dipilih dengan transisi mulus
- Popup informatif: nama, alamat, jumlah check-in, dan tombol detail
- Tooltip hover untuk nama warkop
- Filter warkop berdasarkan fasilitas (WiFi, Makanan, Parkir, Rokok)

### Sistem Check-in & Foto
- Upload foto saat check-in (drag & drop atau klik)
- Sistem moderasi otomatis: validasi magic bytes, dimensi gambar, dan filter konten
- Foto yang lolos moderasi langsung tampil di galeri tanpa persetujuan manual
- Poin +10 per check-in unik (maksimal 1x per warkop per 24 jam)
- Admin dapat menghapus konten bermasalah secara manual

### Leaderboard & Gamifikasi
- Peringkat real-time berdasarkan total poin
- Tiga level pengguna: Explorer → Regular → Legend
- Leaderboard global dan leaderboard per warkop
- Riwayat check-in di halaman profil

### Galeri Komunitas
- Grid foto dari seluruh warkop, hanya menampilkan foto yang sudah disetujui
- Lightbox full-screen dengan info pengunggah, tanggal, dan caption
- Navigasi ke halaman detail warkop dari lightbox

### Halaman Detail Warkop
- Hero image, deskripsi, alamat, dan nomor telepon
- Tiga tab: Leaderboard warkop, Galeri warkop, Info & peta mini
- Fasilitas (WiFi, Makanan, Parkir, Smoking) dengan badge visual
- Koordinat GPS dengan tautan Google Maps
- Tombol berbagi (copy URL ke clipboard)

### Autentikasi & Profil
- Login / Register dengan validasi Zod
- NextAuth v5 JWT — sesi persisten
- Halaman profil: poin, level, progress bar, riwayat check-in, foto unggahan
- Lupa sandi via email SMTP dengan token satu kali pakai (1 jam)

### Admin Panel
- CRUD warkop (tambah, ubah, hapus)
- Manajemen pengguna & foto
- Statistik platform (total warkop, user, foto, check-in)
- Hapus/reject foto bermasalah sebagai override moderasi

---

## Demo & Tampilan

```
+---------------------------------------------------------------------+
|  NAVBAR: [Logo] [Search Bar] [Stats Pills] [User Menu]              |
+----------------------------------+----------------------------------+
|                                  |  SIDEBAR                         |
|                                  |  [Ranking] [Galeri] [Statistik]  |
|        PETA INTERAKTIF           |  --------------------------------  |
|        (CartoDB Dark Matter)     |  Filter: WiFi Makanan Parkir     |
|                                  |  --------------------------------  |
|   *---- marker warkop (amber)    |  1. Rahma Dewi       210 pts     |
|         popup: nama + info       |  2. Zulfahmi         170 pts     |
|                                  |  3. Cut Nanda        130 pts     |
|   @ lokasi pengguna (biru)       |  4. Rizky Pratama     90 pts     |
|     pulsing animation            |  5. Budi Santoso      50 pts     |
|                                  |                                  |
|  [Hint: Klik pin untuk detail]   |                                  |
+----------------------------------+----------------------------------+

+-------------------------------------------+
|  WELCOME SCREEN (OLED black + glassmorphism)|
|                                           |
|     [Coffee Icon — amber border]          |
|     PETA WARKOP BANDA ACEH               |
|                                           |
|           Jejak                           |
|           Warkop (gradient amber)         |
|                                           |
|   8+ Warkop | 50+ Member | 200+ Check    |
|                                           |
|       [ Jelajahi Peta --> ]               |
|                                           |
|  GPS  Check-in  Leaderboard  Komunitas   |
+-------------------------------------------+
```

---

## Arsitektur Sistem

```
+----------------------------------------------------------------------+
|                         CLIENT (Browser)                             |
|                                                                      |
|  React 19 + Next.js App Router (Client Components)                  |
|  +------------+  +----------+  +------------+  +------------------+  |
|  | WelcomeScreen|  |  AppMap  |  |  Sidebar   |  | WarkopDetail     |  |
|  | (Framer    |  | (Leaflet)|  |  (Tabs +   |  | (Leaderboard +  |  |
|  |  Motion)   |  |          |  |   Filter)  |  |  Gallery + Info) |  |
|  +------------+  +----+-----+  +------------+  +------------------+  |
|                       |                                              |
|              CartoDB Dark Matter Tiles (CDN)                        |
+---------------------+-+----------------------------------------------+
                       | HTTP/HTTPS
+---------------------+-----------------------------------------------+
|                    SERVER (Next.js API Routes)                      |
|                                                                      |
|  +-------------+  +--------------+  +--------------+               |
|  |  /api/warkop |  | /api/checkin |  |  /api/auth   |               |
|  |  /api/photos |  | (upload+mod) |  |  (NextAuth)  |               |
|  |  /api/leader |  |              |  |              |               |
|  |  /api/stats  |  |              |  |              |               |
|  +------+-------+  +------+-------+  +------+-------+               |
|         |                 |                  |                       |
|  +------+-----------------+------------------+-------------------+  |
|  |               Prisma ORM 7.8 (MariaDB Adapter)                |  |
|  +----------------------------------+-----------------------------+  |
|                                    |                                  |
+------------------------------------+----------------------------------+
                                     |
               +--------------------+--------------------+
               |   MySQL 8 / MariaDB (Laragon)          |
               |                                        |
               |  Users ---- CheckIns ---- Photos       |
               |      +------- Warkops ----+            |
               +----------------------------------------+
```

### Alur Data Check-in

```
User Upload Foto
      |
      v
[Validasi Auth] --> 401 Unauthorized
      |
      v
[Validasi File: MIME, Ukuran <= 5MB]
      |
      v
[Validasi Magic Bytes: JPEG/PNG/WebP]
      |
      v
[Moderasi Otomatis]
  +-- Cek caption: filter kata kasar (ID+EN)
  +-- Cek dimensi gambar dari header byte
  +-- Hasil: approved/rejected
      |
  rejected --> 422 Unprocessable Entity
      |
      v approved
[Simpan file ke /public/uploads/]
      |
      v
[Buat Photo record: status=APPROVED]
      |
      v
[Cek CheckIn 24 jam terakhir]
  +-- Belum ada --> Buat CheckIn + Tambah 10 poin
  +-- Sudah ada --> Skip poin (foto tetap tersimpan)
      |
      v
[Response: 200 + pointsEarned]
```

---

## Algoritma & Logika Inti

### 1. Geolokasi & Sorting Jarak (Haversine Formula)

Warkop diurutkan berdasarkan jarak dari lokasi pengguna menggunakan rumus **Haversine** — formula yang memperhitungkan kelengkungan bumi (radius rata-rata 6.371 km).

```typescript
function calculateDistance(lat1, lon1, lat2, lon2): number {
  const R = 6371; // radius bumi dalam km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // jarak dalam km
}

// Penggunaan: warkops.sort((a, b) => dist(user, a) - dist(user, b))
```

**Akurasi GPS:** Menggunakan `enableHighAccuracy: true` + timeout 10 detik pada Geolocation API. Hasilnya bergantung pada perangkat (GPS hardware vs. WiFi triangulation).

### 2. Algoritma Leaderboard & Gamifikasi

```
Sistem Poin:
  +10 poin  per check-in unik (1 warkop = 1 check-in per 24 jam)
   0 poin   jika sudah check-in di warkop yang sama dalam 24 jam terakhir
            (foto tetap tersimpan, hanya poin yang tidak bertambah)

Level Pengguna:
  +----------+-----------+-------------------------+
  |  Level   |   Poin    |       Warna Badge        |
  +----------+-----------+-------------------------+
  | Explorer |   0-99    | Hijau  (#10b981)         |
  | Regular  | 100-199   | Ungu   (#818cf8)         |
  | Legend   |  200+     | Emas   (#fbbf24)         |
  +----------+-----------+-------------------------+

Ranking:
  ORDER BY user.points DESC, user.createdAt ASC
  (poin sama: yang lebih dulu bergabung lebih tinggi)
```

**Pencegahan farming poin:** Query ke database mengecek `CheckIn` dalam window 24 jam terakhir menggunakan `createdAt >= new Date(Date.now() - 86_400_000)`.

### 3. Sistem Moderasi Konten Otomatis

Moderasi berbasis heuristik tanpa API eksternal — gratis dan offline-capable.

```
moderateUpload(buffer: Buffer, caption: string)
  |
  +-- [1] Analisis Caption
  |     +-- Daftar kata terlarang (bahasa ID + EN, ~80 kata)
  |     +-- Deteksi spam URL berlebih (> 2 link dalam caption)
  |     +-- Hasil: { approved: false, reason: "..." } jika melanggar
  |
  +-- [2] Analisis Gambar (tanpa library eksternal)
  |     +-- Baca header byte untuk menentukan dimensi
  |     |     JPEG: bytes 0xFF 0xD8 --> scan SOF marker
  |     |     PNG:  bytes 16-23 --> width/height langsung
  |     |     WebP: bytes 24-27 --> width/height dari VP8 header
  |     +-- Tolak gambar terlalu kecil (< 100x100 px) -> kemungkinan noise/corrupt
  |     +-- Hasil: { approved: false, reason: "..." } jika mencurigakan
  |
  +-- [3] Lolos semua --> { approved: true }
```

**Admin override:** Foto yang sudah `APPROVED` dapat dihapus admin kapan saja dari panel admin. Ini memberi kontrol manusia sebagai lapisan terakhir.

### 4. Algoritma Pencarian Real-time

```typescript
// Pencarian client-side: tidak ada network request tambahan
const filteredWarkops = warkops.filter((w) => {
  // [1] Filter teks: nama atau alamat mengandung query
  const matchSearch =
    !query ||
    w.name.toLowerCase().includes(query) ||
    w.address.toLowerCase().includes(query);

  // [2] Filter fasilitas: AND logic (semua yang dipilih harus ada)
  const matchFacility = [...selectedFacilities].every(
    (key) => w.facilities?.[key] === true
  );

  return matchSearch && matchFacility;
});
```

Keunggulan: tanpa debounce karena seluruh data warkop (kurang dari 100 item) sudah ada di memori browser. Performa O(n x m) di mana n = jumlah warkop dan m = jumlah filter aktif — sangat efisien untuk skala lokal.

### 5. Reset Password via Email (Token Single-Use)

```
POST /api/auth/forgot-password
  |
  +-- Cek email di database (always respond 200 -- anti user enumeration)
  +-- Jika ada: generate cuid() token, simpan dengan expires = now + 1 jam
  +-- Kirim email: {APP_URL}/reset-password?token=...

POST /api/auth/reset-password
  |
  +-- Cari token di PasswordResetToken (status: tidak expired)
  +-- Validasi password baru (Zod + strength check)
  +-- Hash password dengan bcrypt cost 12
  +-- Update user.password
  +-- Hapus token (single-use guarantee)
```

### 6. Keamanan Input & Upload

```
Layer keamanan berlapis:
  1. Zod validation    -- schema validasi di semua API route
  2. CUID format check -- mencegah SQL/NoSQL injection via ID manipulation
  3. Magic bytes       -- validasi format file sesungguhnya, bukan hanya ekstensi
  4. File size limit   -- maksimal 5MB per upload
  5. Secure filename   -- nama file di-generate acak (crypto.randomUUID)
  6. Rate limiting     -- endpoint sensitif dibatasi per IP
  7. Input sanitize    -- HTML entity encode untuk caption/nama
  8. CSRF via NextAuth -- token otomatis di setiap form submission
```

---

## Tech Stack

| Kategori | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 |
| UI Library | React | 19.2.4 |
| Bahasa | TypeScript | ^5.0 |
| Styling | Tailwind CSS v4 | ^4.0 |
| Animasi | Framer Motion | ^12.0 |
| Icons | Lucide React | ^1.21 |
| Peta | Leaflet | 1.9.4 |
| Tile Provider | CartoDB Dark Matter | — |
| Font | Playfair Display + DM Sans | Google Fonts |
| ORM | Prisma | 7.8.0 |
| Database | MySQL 8 / MariaDB | via Laragon |
| DB Adapter | @prisma/adapter-mariadb | ^7.8 |
| Auth | NextAuth v5 (beta) | ^5.0.0-beta.31 |
| Validasi | Zod | ^4.0 |
| Enkripsi | bcryptjs (cost 12) | ^3.0 |
| Email | Nodemailer | ^7.0 |

---

## Struktur Proyek

```
jejak-warkop/
|
+-- app/                          # Next.js App Router
|   +-- (admin)/admin/            # Panel admin (protected)
|   +-- (auth)/                   # Login, register, forgot-password
|   |   +-- login/
|   |   +-- register/
|   |   +-- forgot-password/
|   |   +-- reset-password/
|   +-- api/                      # API Routes
|   |   +-- auth/                 # NextAuth + forgot/reset password
|   |   +-- checkin/              # Upload foto + moderasi
|   |   +-- leaderboard/          # Global ranking
|   |   +-- photos/               # Galeri foto approved
|   |   +-- profile/              # Data profil user
|   |   +-- stats/                # Statistik platform
|   |   +-- warkop/               # CRUD + detail + leaderboard warkop
|   +-- warkop/[id]/              # Halaman detail warkop
|   +-- profile/                  # Halaman profil user
|   +-- leaderboard/              # Halaman leaderboard penuh
|   +-- about/                    # Tentang aplikasi
|   +-- globals.css               # Design system + CSS variables
|   +-- layout.tsx                # Root layout + fonts
|   +-- page.tsx                  # Homepage (peta + sidebar)
|
+-- components/
|   +-- auth/AuthProvider.tsx     # NextAuth session wrapper
|   +-- map/AppMap.tsx            # Peta interaktif utama (Leaflet)
|   +-- map/WarkopMap.tsx         # Peta react-leaflet (legacy)
|   +-- ui/WelcomeScreen.tsx      # Splash screen animasi
|   +-- ui/CookieBanner.tsx       # Banner persetujuan cookie
|   +-- layout/Footer.tsx        # Footer global
|
+-- lib/
|   +-- auth.ts                   # Konfigurasi NextAuth
|   +-- prisma.ts                 # Instance Prisma singleton
|   +-- mailer.ts                 # Helper kirim email SMTP
|   +-- moderation.ts             # Moderasi konten otomatis
|   +-- security.ts               # Validasi file, sanitasi, rate limit
|   +-- utils.ts                  # getUserLevel, cn helper
|
+-- prisma/
|   +-- schema.prisma             # Skema database
|   +-- seed.ts                   # Data awal (warkop + user + foto)
|   +-- migrations/               # Riwayat migrasi database
|
+-- prisma.config.ts              # Konfigurasi Prisma (URL + seed)
+-- next.config.ts                # Konfigurasi Next.js
+-- .env                          # Variabel lingkungan (tidak di-commit)
```

---

## Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org) v20+
- [Laragon](https://laragon.org) (MySQL 8 / MariaDB) atau server MySQL mandiri
- [Bun](https://bun.sh) (untuk menjalankan seed)
- Akun email SMTP (Gmail, Mailtrap, dll.) untuk fitur reset password

### 1. Clone & Install

```bash
git clone https://github.com/gempurbudianarki/jakjakwarkop.git
cd jakjakwarkop
npm install
```

### 2. Buat Database

Buka MySQL client (HeidiSQL, phpMyAdmin, atau terminal):

```sql
CREATE DATABASE jejak_warkop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Konfigurasi Environment

Buat file `.env` di root proyek:

```env
# Database
DATABASE_URL="mysql://root:@127.0.0.1:3306/jejak_warkop"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti-dengan-string-acak-minimal-32-karakter"

# SMTP Email (untuk reset password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="emailkamu@gmail.com"
SMTP_PASS="app-password-gmail"
SMTP_FROM="JejakWarkop <emailkamu@gmail.com>"
APP_URL="http://localhost:3000"
```

> **Tips Gmail:** Aktifkan 2FA, lalu buat *App Password* di myaccount.google.com/apppasswords. Atau gunakan Mailtrap untuk development.

### 4. Migrasi Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed Data Awal

```bash
npx prisma db seed
```

Perintah ini membuat:
- **13 warkop** di seluruh penjuru Banda Aceh
- **6 akun pengguna** siap pakai
- **32 check-in** sample
- **30 foto** dengan status `APPROVED` (langsung tampil di galeri)

### 6. Jalankan Server

```bash
npm run dev
```

Buka `http://localhost:3000`

---

### Akun Bawaan

| Email | Password | Role | Poin |
|---|---|---|---|
| `admin@jejakwarkop.com` | `admin123` | Admin | 0 |
| `rahma@test.com` | `user123` | User | 210 |
| `fahmi@test.com` | `user123` | User | 170 |
| `nanda@test.com` | `user123` | User | 130 |
| `rizky@test.com` | `user123` | User | 90 |
| `budi@test.com` | `user123` | User | 50 |

---

## Variabel Lingkungan

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | Ya | Connection string MySQL |
| `NEXTAUTH_URL` | Ya | URL aplikasi (tanpa trailing slash) |
| `NEXTAUTH_SECRET` | Ya | String acak >= 32 karakter untuk JWT |
| `SMTP_HOST` | Opsional | Server SMTP untuk kirim email |
| `SMTP_PORT` | Opsional | Port SMTP (biasanya 587 atau 465) |
| `SMTP_USER` | Opsional | Username/email SMTP |
| `SMTP_PASS` | Opsional | Password / App Password SMTP |
| `SMTP_FROM` | Opsional | Nama dan alamat pengirim email |
| `APP_URL` | Opsional | URL publik aplikasi (untuk link di email) |

> Tanpa konfigurasi SMTP, link reset password akan dicetak ke console (mode development).

---

## Dokumentasi API

Semua endpoint menggunakan JSON kecuali `/api/checkin` yang menerima `multipart/form-data`.

### Warkop

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/warkop` | — | Daftar semua warkop aktif dengan jumlah check-in & foto |
| `GET` | `/api/warkop/:id` | — | Detail satu warkop |
| `GET` | `/api/warkop/:id/leaderboard` | — | Top 10 user yang paling sering check-in di warkop ini |
| `GET` | `/api/warkop/:id/photos` | — | Foto approved di warkop ini |
| `POST` | `/api/warkop` | Admin | Buat warkop baru |
| `PUT` | `/api/warkop/:id` | Admin | Update warkop |
| `DELETE` | `/api/warkop/:id` | Admin | Hapus warkop |

### Check-in & Foto

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/checkin` | User | Upload foto check-in (form-data: `photo`, `warkopId`, `caption`) |
| `GET` | `/api/photos` | — | 20 foto terbaru dari seluruh warkop (status APPROVED) |
| `DELETE` | `/api/photos/:id` | Admin | Hapus foto (admin override moderasi) |

### Leaderboard & Statistik

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/leaderboard` | — | Top 10 user global berdasarkan poin |
| `GET` | `/api/stats` | — | Jumlah total warkop, user, foto, check-in |

### Autentikasi

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/forgot-password` | — | Kirim link reset password ke email |
| `POST` | `/api/auth/reset-password` | — | Set password baru dengan token |
| `GET/POST` | `/api/auth/[...nextauth]` | — | Handler NextAuth (login, callback, dll.) |

### Profil

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/profile` | User | Data profil, stats, riwayat check-in & foto user yang login |

---

## Skema Database

```
+------------------+     +------------------+     +------------------+
|      User        |     |     Warkop       |     |     CheckIn      |
+------------------+     +------------------+     +------------------+
| id        cuid   |     | id        cuid   |     | id        cuid   |
| name      string |     | name      string |     | userId    fk     |
| email     unique |     | description text |     | warkopId  fk     |
| password  hash   |     | latitude  float  |     | points    int=10 |
| image     url?   |     | longitude float  |     | createdAt datetime|
| role      enum   |     | address   text   |     +------------------+
| points    int=0  |     | phone     string?|
| createdAt        |     | image     url?   |     +------------------+
| updatedAt        |     | facilities json? |     |      Photo       |
+------------------+     | isActive  bool   |     +------------------+
        |                | createdAt        |     | id        cuid   |
        |                | updatedAt        |     | userId    fk     |
        v                +------------------+     | warkopId  fk     |
   +---------+                   |                | url       string |
   | CheckIn |<------------------+                | caption   text?  |
   |  (n:m)  |                   |                | status    enum   |
   +---------+          +--------+-------+        |  PENDING         |
        |               |     Photo      |        |  APPROVED        |
        +---------------> (warkopId fk)  |        |  REJECTED        |
                        +----------------+        | aiModerated bool |
                                                  | createdAt        |
                                                  +------------------+

Enum Role: USER | ADMIN
Enum PhotoStatus: PENDING | APPROVED | REJECTED

Model tambahan:
  Account, Session        (NextAuth OAuth support)
  PasswordResetToken      (lupa sandi)
  VerificationToken       (email verification)
```

---

## Sistem Poin & Level

```
Aksi                              Poin
-----------------------------------------
Check-in + upload foto            +10
(max 1x per warkop per 24 jam)

Level Threshold
-----------------------------------------
  0  -  99  pts  -->  Explorer   (hijau)
100  - 199  pts  -->  Regular    (ungu)
200+         pts  -->  Legend     (emas)

Contoh perjalanan:
Hari 1: Check-in 3 warkop        --> 30 pts (Explorer)
Hari 2: Check-in 7 warkop baru   --> 100 pts (naik ke Regular!)
Hari 3: Check-in 10 warkop baru  --> 200 pts (naik ke Legend!)
```

---

## Keamanan

Proyek ini menerapkan beberapa lapisan keamanan untuk melindungi data pengguna dan mencegah penyalahgunaan:

- **JWT Encryption** — Token sesi dienkripsi dengan `NEXTAUTH_SECRET` (HS256)
- **Password Hashing** — bcryptjs dengan cost factor 12 (~300ms/hash, tahan brute-force)
- **Magic Bytes Validation** — File yang diupload diverifikasi dari header byte, bukan hanya ekstensi
- **CUID Validation** — Semua ID parameter divalidasi format sebelum query database
- **Input Sanitization** — HTML entity encode untuk semua input teks
- **Rate Limiting** — Endpoint forgot-password dan register dibatasi per IP
- **Anti Enumeration** — `/api/auth/forgot-password` selalu merespons 200 (tidak bocorkan apakah email terdaftar)
- **Secure Filename** — Nama file upload di-generate acak (`crypto.randomUUID + timestamp`)
- **Environment Secrets** — Semua kredensial di `.env` yang di-exclude dari version control

---

## Kontribusi

Pull request dan laporan bug sangat diterima!

```bash
# Fork repo ini, lalu:
git checkout -b fitur/nama-fitur-baru
# ... buat perubahan ...
git commit -m "feat: tambah fitur keren"
git push origin fitur/nama-fitur-baru
# Buka Pull Request ke branch main
```

**Konvensi commit:**
- `feat:` — fitur baru
- `fix:` — perbaikan bug
- `style:` — perubahan UI/CSS
- `refactor:` — refaktor kode
- `docs:` — perubahan dokumentasi

---

## Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan dengan menyertakan atribusi.

---

## Penulis

<div align="center">

### Dibuat oleh

# **Gempur Budi Anarki**

*Full-Stack Developer · Banda Aceh, Indonesia*

[![GitHub](https://img.shields.io/badge/GitHub-gempurbudianarki-181717?style=for-the-badge&logo=github)](https://github.com/gempurbudianarki)

---

*JejakWarkop — karena setiap tegukan kopi punya cerita yang layak diabadikan.*

**© 2025 Gempur Budi Anarki. All rights reserved.**

</div>
