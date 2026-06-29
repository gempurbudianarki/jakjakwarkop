import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { strictRateLimit } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/security";
import { sendMail, passwordResetEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    // Cegah brute force: maksimal 3 permintaan / menit / IP
    const limited = strictRateLimit(request, 3, 60000);
    if (limited) return limited;

    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();

    // Respons selalu sama (anti user-enumeration)
    const genericResponse = NextResponse.json({
      success: true,
      message:
        "Jika email terdaftar, kami telah mengirim tautan reset ke email tersebut.",
    });

    if (!validateEmail(email)) return genericResponse;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return genericResponse;

    // Bersihkan token lama untuk email ini, lalu buat token baru (berlaku 1 jam)
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    const mail = passwordResetEmail(resetUrl, user.name);

    await sendMail({ to: email, subject: mail.subject, html: mail.html, text: mail.text });

    return genericResponse;
  } catch (error) {
    console.error("forgot-password error:", error);
    // Tetap balas generik agar tidak membocorkan info
    return NextResponse.json({
      success: true,
      message:
        "Jika email terdaftar, kami telah mengirim tautan reset ke email tersebut.",
    });
  }
}
