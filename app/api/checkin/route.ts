import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  sanitizeInput,
  validateFileUpload,
  validateMagicBytes,
  generateSecureFilename,
  isValidCuid,
} from "@/lib/security";
import { moderateUpload } from "@/lib/moderation";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("photo") as File;
    const warkopId = formData.get("warkopId") as string;
    const caption = formData.get("caption") as string;

    if (!file || !warkopId) {
      return NextResponse.json(
        { error: "Foto dan warkop wajib diisi" },
        { status: 400 }
      );
    }

    // Validate warkopId format (prevent injection)
    if (!isValidCuid(warkopId)) {
      return NextResponse.json(
        { error: "ID warkop tidak valid" },
        { status: 400 }
      );
    }

    // Validate file size + MIME type
    const fileValidation = validateFileUpload(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.message },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes (prevent MIME spoofing)
    const magicValidation = validateMagicBytes(buffer);
    if (!magicValidation.valid) {
      return NextResponse.json(
        { error: magicValidation.message },
        { status: 400 }
      );
    }

    // Verify warkop exists
    const warkop = await prisma.warkop.findUnique({
      where: { id: warkopId },
    });

    if (!warkop || !warkop.isActive) {
      return NextResponse.json(
        { error: "Warkop tidak ditemukan atau tidak aktif" },
        { status: 404 }
      );
    }

    // Limit: max 10 uploads per user per day across all warkops
    const todayUploads = await prisma.photo.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (todayUploads >= 10) {
      return NextResponse.json(
        { error: "Batas upload harian (10 foto) telah tercapai" },
        { status: 429 }
      );
    }

    const sanitizedCaption = caption
      ? sanitizeInput(caption).slice(0, 500)
      : null;

    // ===== MODERASI HYBRID OTOMATIS (sebelum file disimpan) =====
    // Cek caption (kata kasar/spam) + dimensi gambar. Jika gagal, buang foto
    // dan kembalikan peringatan tanpa menyimpan apa pun ke disk/DB.
    const moderation = moderateUpload(buffer, sanitizedCaption);
    if (!moderation.approved) {
      return NextResponse.json(
        { error: moderation.reason || "Foto ditolak oleh sistem moderasi" },
        { status: 422 }
      );
    }

    // Determine extension from validated magic bytes
    const extMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    const ext = extMap[magicValidation.type || ""] || "jpg";
    const filename = generateSecureFilename(ext);

    const uploadDir = join(process.cwd(), "public", "uploads");
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;

    // Foto lolos moderasi otomatis → langsung tampil. Admin tetap bisa hapus
    // manual sebagai override di panel admin.
    const photo = await prisma.photo.create({
      data: {
        userId: session.user.id,
        warkopId,
        url: imageUrl,
        caption: sanitizedCaption,
        status: "APPROVED",
        aiModerated: true,
      },
    });

    // Check if user already checked in at this warkop in the last 24 hours
    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: session.user.id,
        warkopId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    let pointsEarned = 0;
    if (!existingCheckIn) {
      await prisma.checkIn.create({
        data: {
          userId: session.user.id,
          warkopId,
          points: 10,
        },
      });

      await prisma.user.update({
        where: { id: session.user.id },
        data: { points: { increment: 10 } },
      });
      pointsEarned = 10;
    }

    return NextResponse.json({
      success: true,
      photo,
      pointsEarned,
      message:
        pointsEarned > 0
          ? `Check-in berhasil! +${pointsEarned} poin. Fotomu sudah tampil di galeri.`
          : "Foto berhasil diupload dan langsung tampil di galeri!",
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan check-in" },
      { status: 500 }
    );
  }
}
