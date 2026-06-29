import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isValidCuid } from "@/lib/security";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidCuid(id)) {
      return NextResponse.json(
        { error: "ID warkop tidak valid" },
        { status: 400 }
      );
    }

    const photos = await prisma.photo.findMany({
      where: {
        warkopId: id,
        status: "APPROVED",
      },
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
      take: 50,
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
