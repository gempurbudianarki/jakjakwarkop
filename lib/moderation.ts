/**
 * Hybrid content moderation (gratis, tanpa API eksternal).
 *
 * Strategi:
 *  - Caption: tolak kata kasar (ID + EN), spam/URL berlebih.
 *  - Gambar: magic-bytes sudah divalidasi di lib/security.ts. Di sini kita baca
 *    dimensi gambar langsung dari header byte (tanpa dependensi) untuk menolak
 *    gambar terlalu kecil / rasio janggal (indikasi screenshot/junk/blank).
 *
 * Foto yang lolos → langsung APPROVED. Admin tetap bisa hapus manual sebagai
 * lapis pengaman (override) di panel admin.
 */

// Daftar kata yang dilarang (dasar) — bisa diperluas sesuai kebutuhan.
const BANNED_WORDS = [
  // Indonesia (kasar / seksual / SARA)
  "anjing", "anjg", "asu", "bangsat", "bajingan", "kontol", "memek", "ngentot",
  "ngentd", " entot", "pepek", "tytyd", "jancok", "jancuk", "jembut", "kampret",
  "babi", "tolol", "goblok", "bego", "bgst", "pelacur", "lonte", "bokep",
  "porno", "porn", "telanjang", "bugil", "perek",
  // English
  "fuck", "fuk", "shit", "bitch", "asshole", "dick", "pussy", "cunt",
  "nude", "naked", "nsfw", "xxx", "sex", "sexy", "boobs", "tits",
];

const URL_REGEX = /(https?:\/\/|www\.)\S+/gi;

export interface ModerationResult {
  approved: boolean;
  reason?: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    // ganti leetspeak umum supaya filter tidak gampang dibypass
    .replace(/[0@]/g, "o")
    .replace(/1|!/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5|\$/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z\s]/g, " ");
}

export function moderateCaption(caption: string | null | undefined): ModerationResult {
  if (!caption) return { approved: true };

  const normalized = normalize(caption);
  const words = normalized.split(/\s+/).filter(Boolean);

  for (const banned of BANNED_WORDS) {
    // cek sebagai kata utuh atau substring (untuk kata gabungan)
    if (words.includes(banned) || normalized.includes(banned)) {
      return {
        approved: false,
        reason: "Caption mengandung kata yang tidak pantas. Mohon gunakan bahasa yang sopan.",
      };
    }
  }

  // Spam: terlalu banyak link
  const urls = caption.match(URL_REGEX);
  if (urls && urls.length >= 2) {
    return {
      approved: false,
      reason: "Caption terdeteksi sebagai spam (terlalu banyak tautan).",
    };
  }

  return { approved: true };
}

/**
 * Membaca dimensi (width, height) gambar dari header byte.
 * Mendukung JPEG, PNG, dan WebP (VP8/VP8L/VP8X). Mengembalikan null jika gagal.
 */
export function readImageDimensions(
  buffer: Buffer
): { width: number; height: number } | null {
  try {
    // PNG: width/height di byte 16-24 (IHDR)
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    // JPEG: scan marker SOF0..SOF15
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        // SOFn markers (kecuali DHT/DAC/RSTn)
        if (
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc
        ) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const segLen = buffer.readUInt16BE(offset + 2);
        offset += 2 + segLen;
      }
      return null;
    }

    // WebP
    if (
      buffer[0] === 0x52 && // R
      buffer[1] === 0x49 && // I
      buffer[2] === 0x46 && // F
      buffer[3] === 0x46 && // F
      buffer[8] === 0x57 // W
    ) {
      const format = buffer.toString("ascii", 12, 16);
      if (format === "VP8 ") {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        return { width, height };
      }
      if (format === "VP8L") {
        const b = buffer.readUInt32LE(21);
        const width = (b & 0x3fff) + 1;
        const height = ((b >> 14) & 0x3fff) + 1;
        return { width, height };
      }
      if (format === "VP8X") {
        const width = 1 + (buffer.readUIntLE(24, 3) & 0xffffff);
        const height = 1 + (buffer.readUIntLE(27, 3) & 0xffffff);
        return { width, height };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function moderateImage(buffer: Buffer): ModerationResult {
  const dims = readImageDimensions(buffer);

  // Jika dimensi tidak terbaca, tetap loloskan (magic-bytes sudah valid)
  if (!dims) return { approved: true };

  const { width, height } = dims;
  const MIN = 200; // px — tolak gambar terlalu kecil
  if (width < MIN || height < MIN) {
    return {
      approved: false,
      reason: `Resolusi foto terlalu kecil (min ${MIN}x${MIN}px). Unggah foto yang lebih jelas.`,
    };
  }

  // Rasio aspek ekstrem (indikasi banner/screenshot panjang, bukan foto warkop)
  const ratio = width / height;
  if (ratio > 4 || ratio < 0.25) {
    return {
      approved: false,
      reason: "Rasio foto tidak wajar. Gunakan foto suasana warkop yang normal.",
    };
  }

  return { approved: true };
}

/**
 * Moderasi gabungan untuk upload check-in.
 */
export function moderateUpload(
  buffer: Buffer,
  caption: string | null | undefined
): ModerationResult {
  const captionResult = moderateCaption(caption);
  if (!captionResult.approved) return captionResult;

  const imageResult = moderateImage(buffer);
  if (!imageResult.approved) return imageResult;

  return { approved: true };
}
