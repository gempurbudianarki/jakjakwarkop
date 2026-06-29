import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";
import { validateCoordinate, sanitizeInput, isValidCuid } from "@/lib/security";

const warkopCreateSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  address: z.string().min(5).max(500),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().max(20).optional().nullable(),
  facilities: z
    .object({
      wifi: z.boolean().optional(),
      smoking: z.boolean().optional(),
      food: z.boolean().optional(),
      parking: z.boolean().optional(),
    })
    .optional(),
});

// Only these fields can be updated via PATCH
const warkopUpdateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  address: z.string().min(5).max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().max(20).optional().nullable(),
  facilities: z
    .object({
      wifi: z.boolean().optional(),
      smoking: z.boolean().optional(),
      food: z.boolean().optional(),
      parking: z.boolean().optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
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

    const warkops = await prisma.warkop.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { checkIns: true, photos: true },
        },
      },
    });

    return NextResponse.json(warkops);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat warkop" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = warkopCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const { latitude, longitude } = parsed.data;
    const coordCheck = validateCoordinate(latitude, longitude);
    if (!coordCheck.valid) {
      return NextResponse.json({ error: coordCheck.message }, { status: 400 });
    }

    const warkop = await prisma.warkop.create({
      data: {
        name: sanitizeInput(parsed.data.name),
        description: sanitizeInput(parsed.data.description),
        address: sanitizeInput(parsed.data.address),
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        phone: parsed.data.phone ? sanitizeInput(parsed.data.phone) : null,
        facilities: parsed.data.facilities,
      },
    });

    return NextResponse.json(warkop, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal menambah warkop" },
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
        { error: "ID warkop tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    // Whitelist fields — prevent mass assignment
    const parsed = warkopUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    // Sanitize string fields
    const updateData: Record<string, unknown> = {};
    if (parsed.data.name !== undefined)
      updateData.name = sanitizeInput(parsed.data.name);
    if (parsed.data.description !== undefined)
      updateData.description = sanitizeInput(parsed.data.description);
    if (parsed.data.address !== undefined)
      updateData.address = sanitizeInput(parsed.data.address);
    if (parsed.data.latitude !== undefined)
      updateData.latitude = parsed.data.latitude;
    if (parsed.data.longitude !== undefined)
      updateData.longitude = parsed.data.longitude;
    if (parsed.data.phone !== undefined)
      updateData.phone = parsed.data.phone
        ? sanitizeInput(parsed.data.phone)
        : null;
    if (parsed.data.facilities !== undefined)
      updateData.facilities = parsed.data.facilities;
    if (parsed.data.isActive !== undefined)
      updateData.isActive = parsed.data.isActive;

    if (
      updateData.latitude !== undefined &&
      updateData.longitude !== undefined
    ) {
      const coordCheck = validateCoordinate(
        updateData.latitude as number,
        updateData.longitude as number
      );
      if (!coordCheck.valid) {
        return NextResponse.json(
          { error: coordCheck.message },
          { status: 400 }
        );
      }
    }

    const warkop = await prisma.warkop.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(warkop);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengupdate warkop" },
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
        { error: "ID warkop tidak valid" },
        { status: 400 }
      );
    }

    await prisma.warkop.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus warkop" },
      { status: 500 }
    );
  }
}
