import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod/v4";
import { strictRateLimit } from "@/lib/rate-limit";
import {
  sanitizeInput,
  validateEmail,
  validatePassword,
} from "@/lib/security";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const rateLimitResponse = strictRateLimit(
      request as any,
      3,
      60000
    );
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const sanitizedName = sanitizeInput(name);

    await prisma.user.create({
      data: {
        name: sanitizedName,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
