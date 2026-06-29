import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [warkops, users, photos, checkins, pendingPhotos, activeWarkops] =
      await Promise.all([
        prisma.warkop.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.photo.count(),
        prisma.checkIn.count(),
        prisma.photo.count({ where: { status: "PENDING" } }),
        prisma.warkop.count({ where: { isActive: true } }),
      ]);

    return NextResponse.json({
      warkops,
      users,
      photos,
      checkins,
      pendingPhotos,
      activeWarkops,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
