import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { strictRateLimit } from "@/lib/rate-limit";
import { validatePassword } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const limited = strictRateLimit(request, 5, 60000);
    if (limited) return limited;

    const body = await request.json().catch(() => ({}));
    const token = String(body?.token || "").trim();
    const password = String(body?.password || "");

    if (!token) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 });
    }

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record || record.expires < new Date()) {
      // Bersihkan token kedaluwarsa jika ada
      if (record) {
        await prisma.passwordResetToken.delete({ where: { id: record.id } });
      }
      return NextResponse.json(
        { error: "Tautan reset tidak valid atau sudah kedaluwarsa. Minta tautan baru." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: record.email },
      data: { password: hashed },
    });

    // Hapus semua token reset untuk email ini (sekali pakai)
    await prisma.passwordResetToken.deleteMany({ where: { email: record.email } });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui. Silakan login dengan password baru.",
    });
  } catch (error) {
    console.error("reset-password error:", error);
    return NextResponse.json(
      { error: "Gagal mereset password. Coba lagi." },
      { status: 500 }
    );
  }
}
