import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const warkops = await prisma.warkop.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        address: true,
        image: true,
        description: true,
        phone: true,
        facilities: true,
        _count: {
          select: {
            checkIns: true,
            photos: {
              where: { status: "APPROVED" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(warkops);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat data warkop" },
      { status: 500 }
    );
  }
}
