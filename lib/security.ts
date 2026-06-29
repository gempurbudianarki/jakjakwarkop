import { randomBytes } from "crypto";

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, 10000);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return { valid: false, message: "Password minimal 8 karakter" };
  }
  if (password.length > 128) {
    return { valid: false, message: "Password maksimal 128 karakter" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password harus mengandung huruf besar" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password harus mengandung huruf kecil" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password harus mengandung angka" };
  }
  return { valid: true };
}

export function validateCoordinate(
  lat: number,
  lng: number
): { valid: boolean; message?: string } {
  if (lat < -90 || lat > 90) {
    return { valid: false, message: "Latitude tidak valid" };
  }
  if (lng < -180 || lng > 180) {
    return { valid: false, message: "Longitude tidak valid" };
  }
  return { valid: true };
}

export function validateFileUpload(file: File): {
  valid: boolean;
  message?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > maxSize) {
    return { valid: false, message: "Ukuran file maksimal 5MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: "Format file harus JPG, PNG, atau WebP",
    };
  }

  return { valid: true };
}

/**
 * Validates file magic bytes to prevent MIME-type spoofing attacks.
 * Checks the actual binary content, not just the reported MIME type.
 */
export function validateMagicBytes(buffer: Buffer): {
  valid: boolean;
  type?: string;
  message?: string;
} {
  if (buffer.length < 12) {
    return { valid: false, message: "File terlalu kecil atau rusak" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, type: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, type: "image/png" };
  }

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 && // F
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P
  ) {
    return { valid: true, type: "image/webp" };
  }

  // GIF: GIF87a or GIF89a (allowed to detect but reject)
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return { valid: false, message: "Format GIF tidak didukung" };
  }

  return {
    valid: false,
    message: "File bukan gambar yang valid. Hanya JPEG, PNG, atau WebP.",
  };
}

/**
 * Generate a secure random filename with the given extension.
 */
export function generateSecureFilename(extension: string): string {
  const random = randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const safeExt = extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return `${timestamp}-${random}.${safeExt}`;
}

/**
 * Sanitize a user-provided filename (strip path traversal, special chars).
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, "")
    .replace(/\.{2,}/g, ".")
    .slice(0, 100);
}

/**
 * Validate that a string is a valid CUID format (used for IDs from Prisma).
 */
export function isValidCuid(id: string): boolean {
  return /^c[a-z0-9]{24,}$/.test(id);
}
