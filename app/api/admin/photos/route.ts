import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";
import { isValidCuid } from "@/lib/security";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

const photoUpdateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const photos = await prisma.photo.findMany({
      select: {
        id: true,
        url: true,
        caption: true,
        status: true,
        createdAt: true,
        user: {
          select: { name: true },
        },
        warkop: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const formatted = photos.map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.caption,
      status: p.status,
      userName: p.user.name,
      warkopName: p.warkop.name,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat foto" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !isValidCuid(id)) {
      return NextResponse.json(
        { error: "ID foto tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    // Whitelist — only status can be updated
    const parsed = photoUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Status tidak valid. Gunakan APPROVED atau REJECTED" },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });

    return NextResponse.json(photo);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengupdate foto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !isValidCuid(id)) {
      return NextResponse.json(
        { error: "ID foto tidak valid" },
        { status: 400 }
      );
    }

    await prisma.photo.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}
