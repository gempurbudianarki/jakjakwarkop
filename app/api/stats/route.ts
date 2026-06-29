import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Public stats endpoint — no auth required
export async function GET() {
  try {
    const [warkops, users, photos, checkins] = await Promise.all([
      prisma.warkop.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.photo.count({ where: { status: "APPROVED" } }),
      prisma.checkIn.count(),
    ]);

    return NextResponse.json({ warkops, users, photos, checkins });
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
