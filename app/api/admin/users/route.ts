import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";
import { isValidCuid } from "@/lib/security";

const userUpdateSchema = z.object({
  // Only allow safe role changes via whitelist
  role: z.enum(["USER", "ADMIN"]).optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            checkIns: true,
            photos: true,
          },
        },
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      points: u.points,
      image: u.image,
      createdAt: u.createdAt.toISOString(),
      checkIns: u._count.checkIns,
      photos: u._count.photos,
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat users" },
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
        { error: "ID user tidak valid" },
        { status: 400 }
      );
    }

    // Prevent admin from modifying their own account via this endpoint
    const adminId = (session.user as { id: string }).id;
    if (id === adminId) {
      return NextResponse.json(
        { error: "Tidak dapat mengubah akun sendiri" },
        { status: 400 }
      );
    }

    const body = await request.json();
    // Strict whitelist — prevents mass assignment / role escalation
    const parsed = userUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    // Build safe update object
    const updateData: Record<string, unknown> = {};
    if (parsed.data.role !== undefined) {
      updateData.role = parsed.data.role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengupdate user" },
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
        { error: "ID user tidak valid" },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    const adminId = (session.user as { id: string }).id;
    if (id === adminId) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus akun sendiri" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
