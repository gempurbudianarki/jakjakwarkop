import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        points: true,
        image: true,
      },
      orderBy: { points: "desc" },
      take: 20,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.points,
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
