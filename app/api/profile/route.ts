import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const [checkIns, photos] = await Promise.all([
      prisma.checkIn.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          points: true,
          createdAt: true,
          warkop: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.photo.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          url: true,
          caption: true,
          status: true,
          createdAt: true,
          warkop: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // Peringkat global user (berdasarkan poin)
    const higher = await prisma.user.count({
      where: { points: { gt: user.points }, role: "USER" },
    });
    const rank = user.role === "USER" ? higher + 1 : null;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        points: user.points,
        createdAt: user.createdAt.toISOString(),
        rank,
      },
      stats: {
        checkIns: checkIns.length,
        photos: photos.length,
        warkopsVisited: new Set(checkIns.map((c) => c.warkop.id)).size,
      },
      checkIns: checkIns.map((c) => ({
        id: c.id,
        points: c.points,
        createdAt: c.createdAt.toISOString(),
        warkopId: c.warkop.id,
        warkopName: c.warkop.name,
      })),
      photos: photos.map((p) => ({
        id: p.id,
        url: p.url,
        caption: p.caption,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        warkopId: p.warkop.id,
        warkopName: p.warkop.name,
      })),
    });
  } catch (error) {
    console.error("profile error:", error);
    return NextResponse.json({ error: "Gagal memuat profil" }, { status: 500 });
  }
}
