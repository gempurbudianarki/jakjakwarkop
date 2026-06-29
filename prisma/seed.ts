import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "jejak_warkop",
});
const prisma = new PrismaClient({ adapter });

/* ── Warkop data ─────────────────────────────────────────────── */
const WARKOPS = [
  {
    name: "Warkop Solong",
    description: "Warkop legendaris di Banda Aceh sejak tahun 1974. Terkenal dengan kopi saring dan suasana yang hangat. Tempat nongkrong favorit mahasiswa dan pekerja.",
    latitude: 5.5577,
    longitude: 95.3222,
    address: "Jl. T. Nyak Arief, Lamnyong, Banda Aceh",
    phone: "0651-123456",
    image: "https://picsum.photos/seed/solong/800/500",
    facilities: { wifi: true, smoking: true, food: true, parking: true },
  },
  {
    name: "Warkop 27",
    description: "Warkop modern dengan konsep industrial, menyediakan berbagai jenis kopi Aceh dan makanan ringan. Cocok untuk meeting santai dan kerja remote.",
    latitude: 5.5483,
    longitude: 95.3238,
    address: "Jl. Tgk. Chik Di Tiro, Banda Aceh",
    phone: "0651-234567",
    image: "https://picsum.photos/seed/warkop27/800/500",
    facilities: { wifi: true, smoking: false, food: true, parking: true },
  },
  {
    name: "Warkop Kopi Klasik",
    description: "Warkop dengan nuansa vintage dan autentik. Menyajikan kopi tradisional Aceh dengan cara penyeduhan klasik turun-temurun. Suasana hangat dan akrab.",
    latitude: 5.5421,
    longitude: 95.3312,
    address: "Jl. Sultan Iskandar Muda, Banda Aceh",
    phone: "0651-345678",
    image: "https://picsum.photos/seed/klasik/800/500",
    facilities: { wifi: true, smoking: true, food: true, parking: false },
  },
  {
    name: "Warkop Aceh Rayeuk",
    description: "Warkop besar dengan area outdoor yang luas dan suasana keluarga. Terkenal dengan mie Aceh dan kopi tubruknya yang mantap. Buka 24 jam.",
    latitude: 5.5612,
    longitude: 95.3189,
    address: "Jl. Teuku Umar, Banda Aceh",
    phone: "0651-456789",
    image: "https://picsum.photos/seed/rayeuk/800/500",
    facilities: { wifi: true, smoking: true, food: true, parking: true },
  },
  {
    name: "Warkop Meuligoe",
    description: "Warkop premium dengan interior modern dan kopi specialty single origin. Tempat yang ideal untuk kerja remote, belajar, atau sekadar bersantai.",
    latitude: 5.5534,
    longitude: 95.3267,
    address: "Jl. A. Yani, Banda Aceh",
    phone: "0651-567890",
    image: "https://picsum.photos/seed/meuligoe/800/500",
    facilities: { wifi: true, smoking: false, food: true, parking: true },
  },
  {
    name: "Warkop Tugu",
    description: "Warkop strategis di dekat Tugu Aceh, ramai dikunjungi warga dan wisatawan lokal. Kopi terjangkau dengan cita rasa yang tidak mengecewakan.",
    latitude: 5.5589,
    longitude: 95.3156,
    address: "Jl. Mohd. Jam, Banda Aceh",
    phone: "0651-678901",
    image: "https://picsum.photos/seed/tugu/800/500",
    facilities: { wifi: true, smoking: true, food: true, parking: false },
  },
  {
    name: "Warkop Lamjabat",
    description: "Warkop dengan view sungai yang asri dan tenang. Tempat sempurna untuk menikmati kopi pagi sambil melihat aktivitas sungai.",
    latitude: 5.5398,
    longitude: 95.3289,
    address: "Jl. Lamjabat, Banda Aceh",
    phone: "0651-789012",
    image: "https://picsum.photos/seed/lamjabat/800/500",
    facilities: { wifi: true, smoking: true, food: true, parking: true },
  },
  {
    name: "Warkop Peunayong",
    description: "Warkop di jantung kawasan kuliner Peunayong yang selalu ramai, buka sampai larut malam. Favorit anak muda Banda Aceh untuk begadang.",
    latitude: 5.5501,
    longitude: 95.3198,
    address: "Jl. Peunayong, Banda Aceh",
    phone: "0651-890123",
    image: "https://picsum.photos/seed/peunayong/800/500",
    facilities: { wifi: true, smoking: true, food: true, parking: true },
  },
  {
    name: "Warkop Darussalam",
    description: "Warkop dekat kampus Unsyiah, selalu penuh mahasiswa. Harga ramah di kantong, koneksi WiFi cepat, tempat nongkrong paling hits para pelajar.",
    latitude: 5.5720,
    longitude: 95.3590,
    address: "Jl. Darussalam, Banda Aceh",
    phone: "0651-901234",
    image: "https://picsum.photos/seed/darussalam/800/500",
    facilities: { wifi: true, smoking: false, food: true, parking: true },
  },
  {
    name: "Warkop Meuraxa",
    description: "Warkop tepi pantai dengan suasana angin sepoi-sepoi. Ngopi sambil menikmati panorama laut lepas — pengalaman yang tak terlupakan.",
    latitude: 5.5802,
    longitude: 95.2821,
    address: "Jl. Pantai Meuraxa, Banda Aceh",
    phone: "0651-012345",
    image: "https://picsum.photos/seed/meuraxa/800/500",
    facilities: { wifi: false, smoking: true, food: true, parking: true },
  },
  {
    name: "Warkop Kuta Alam",
    description: "Warkop di kawasan bisnis Kuta Alam. Pilihan utama para profesional untuk meeting informal dan diskusi sambil menikmati kopi Gayo.",
    latitude: 5.5461,
    longitude: 95.3341,
    address: "Jl. Kuta Alam, Banda Aceh",
    phone: "0651-112233",
    image: "https://picsum.photos/seed/kutaalam/800/500",
    facilities: { wifi: true, smoking: false, food: false, parking: true },
  },
  {
    name: "Warkop Blang Oi",
    description: "Warkop community hub di Blang Oi. Sering mengadakan live music dan pertandingan domino. Tempat paling meriah untuk menghabiskan malam Minggu.",
    latitude: 5.5680,
    longitude: 95.3450,
    address: "Jl. Blang Oi, Banda Aceh",
    phone: "0651-445566",
    image: "https://picsum.photos/seed/blangoi/800/500",
    facilities: { wifi: true, smoking: true, food: true, parking: true },
  },
  {
    name: "Warkop Ulee Lheue",
    description: "Warkop dekat pelabuhan dengan pemandangan selat yang memukau. Favorit nelayan dan wisatawan. Kopi saring tradisional dengan cara terbaik.",
    latitude: 5.5891,
    longitude: 95.2967,
    address: "Jl. Ulee Lheue, Banda Aceh",
    phone: "0651-778899",
    image: "https://picsum.photos/seed/uleelheue/800/500",
    facilities: { wifi: false, smoking: true, food: true, parking: false },
  },
];

/* ── User data ───────────────────────────────────────────────── */
const USERS = [
  { name: "Admin Jejak Warkop", email: "admin@jejakwarkop.com", password: "admin123", role: "ADMIN" as const, points: 0 },
  { name: "Budi Santoso",       email: "budi@test.com",         password: "user123",  role: "USER"  as const, points: 280 },
  { name: "Rahma Dewi",         email: "rahma@test.com",        password: "user123",  role: "USER"  as const, points: 210 },
  { name: "Zulfahmi",           email: "fahmi@test.com",        password: "user123",  role: "USER"  as const, points: 170 },
  { name: "Cut Nanda",          email: "nanda@test.com",        password: "user123",  role: "USER"  as const, points: 130 },
  { name: "Rizky Pratama",      email: "rizky@test.com",        password: "user123",  role: "USER"  as const, points: 90  },
];

/* ── Photo placeholder seeds ─────────────────────────────────── */
const PHOTO_SEEDS = [
  { seed: "coffee1",    caption: "Kopi saring pagi yang sempurna" },
  { seed: "coffee2",    caption: "Suasana warkop yang cozy" },
  { seed: "coffee3",    caption: "Ngopi bareng teman-teman" },
  { seed: "interior1",  caption: "Interior yang instagramable banget" },
  { seed: "interior2",  caption: "Tempat duduk outdoor yang nyaman" },
  { seed: "food1",      caption: "Mie Aceh dan kopi - pasangan sempurna" },
  { seed: "food2",      caption: "Sarapan pagi di warkop favorit" },
  { seed: "food3",      caption: "Menu andalan warkop ini" },
  { seed: "people1",   caption: "Seru diskusi di warkop" },
  { seed: "people2",   caption: "Kopi sore bersama teman kuliah" },
  { seed: "night1",    caption: "Suasana malam yang ramai" },
  { seed: "view1",     caption: "View dari tempat duduk favorit saya" },
];

async function seed() {
  console.log("Seeding database...");

  /* ── Users ────────────────────────────────────────────────── */
  const createdUsers: Record<string, string> = {};
  for (const u of USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 12);
      const created = await prisma.user.create({
        data: { name: u.name, email: u.email, password: hashed, role: u.role, points: u.points },
      });
      createdUsers[u.email] = created.id;
      console.log(`  User: ${u.email}`);
    } else {
      createdUsers[u.email] = existing.id;
    }
  }

  /* ── Warkops ──────────────────────────────────────────────── */
  const createdWarkops: string[] = [];
  for (const w of WARKOPS) {
    const existing = await prisma.warkop.findFirst({ where: { name: w.name } });
    if (!existing) {
      const created = await prisma.warkop.create({ data: w });
      createdWarkops.push(created.id);
      console.log(`  Warkop: ${w.name}`);
    } else {
      createdWarkops.push(existing.id);
    }
  }

  /* ── Check-ins ────────────────────────────────────────────── */
  const checkinCount = await prisma.checkIn.count();
  if (checkinCount === 0) {
    const regularUsers = USERS.filter(u => u.role === "USER").map(u => createdUsers[u.email]);
    const checkInData: { userId: string; warkopId: string; points: number }[] = [];

    for (const userId of regularUsers) {
      // Each user checks in to 4-8 warkops
      const shuffled = [...createdWarkops].sort(() => 0.5 - Math.random());
      const count = 4 + Math.floor(Math.random() * 5);
      for (const warkopId of shuffled.slice(0, count)) {
        checkInData.push({ userId, warkopId, points: 10 });
      }
    }

    await prisma.checkIn.createMany({ data: checkInData });
    console.log(`  ${checkInData.length} check-ins created`);
  }

  /* ── Photos ───────────────────────────────────────────────── */
  const photoCount = await prisma.photo.count();
  if (photoCount === 0) {
    const regularUsers = USERS.filter(u => u.role === "USER").map(u => createdUsers[u.email]);
    const photoData: {
      userId: string; warkopId: string; url: string;
      caption: string; status: "APPROVED"; aiModerated: boolean;
    }[] = [];

    let photoIdx = 0;
    for (const warkopId of createdWarkops) {
      // 1-3 photos per warkop
      const photoCount2 = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < photoCount2; i++) {
        const userId = regularUsers[Math.floor(Math.random() * regularUsers.length)];
        const p = PHOTO_SEEDS[photoIdx % PHOTO_SEEDS.length];
        photoData.push({
          userId,
          warkopId,
          url: `https://picsum.photos/seed/${p.seed}${photoIdx}/400/400`,
          caption: p.caption,
          status: "APPROVED",
          aiModerated: true,
        });
        photoIdx++;
      }
    }

    await prisma.photo.createMany({ data: photoData });
    console.log(`  ${photoData.length} photos created (APPROVED)`);
  }

  console.log("Seeding completed!");
}

seed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
