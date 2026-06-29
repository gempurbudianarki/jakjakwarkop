import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        url: true,
        caption: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        warkop: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const formatted = photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      userName: photo.user.name,
      warkopName: photo.warkop.name,
      createdAt: photo.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat foto" },
      { status: 500 }
    );
  }
}
