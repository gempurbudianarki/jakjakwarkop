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

    const users = await prisma.user.findMany({
      where: {
        checkIns: {
          some: { warkopId: id },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: {
            checkIns: {
              where: { warkopId: id },
            },
          },
        },
      },
      orderBy: {
        checkIns: {
          _count: "desc",
        },
      },
      take: 20,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user._count.checkIns * 10,
      image: user.image,
    }));

    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat leaderboard" },
      { status: 500 }
    );
  }
}
