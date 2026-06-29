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

    const warkop = await prisma.warkop.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            checkIns: true,
            photos: { where: { status: "APPROVED" } },
          },
        },
      },
    });

    if (!warkop || !warkop.isActive) {
      return NextResponse.json(
        { error: "Warkop tidak ditemukan atau tidak aktif" },
        { status: 404 }
      );
    }

    return NextResponse.json(warkop);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat data warkop" },
      { status: 500 }
    );
  }
}
