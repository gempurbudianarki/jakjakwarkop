import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;
if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Kirim email. Jika SMTP belum dikonfigurasi (.env kosong), email tidak benar
 * dikirim — sebagai gantinya isinya di-log ke console agar tetap bisa diuji
 * saat development tanpa SMTP.
 */
export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  if (!transporter) {
    console.warn(
      "\n[MAILER] SMTP belum dikonfigurasi. Email TIDAK terkirim.\n" +
        `  To: ${to}\n  Subject: ${subject}\n  Body:\n${text || html}\n`
    );
    return { delivered: false };
  }

  await transporter.sendMail({
    from: SMTP_FROM || `Jejak Warkop <${SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
  return { delivered: true };
}

export function passwordResetEmail(resetUrl: string, name: string) {
  const subject = "Reset Password — Jejak Warkop";
  const text =
    `Halo ${name},\n\n` +
    `Kami menerima permintaan untuk mereset password akun Jejak Warkop kamu.\n` +
    `Klik tautan berikut untuk membuat password baru (berlaku 1 jam):\n\n` +
    `${resetUrl}\n\n` +
    `Jika kamu tidak meminta ini, abaikan saja email ini.\n\n— Tim Jejak Warkop`;

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0d0b09;border-radius:16px;color:#f5f0e8;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:28px;">☕</span>
      <h1 style="font-size:20px;font-weight:800;margin:8px 0 0;">Jejak <span style="color:#f59e0b;">Warkop</span></h1>
    </div>
    <p style="font-size:14px;line-height:1.6;color:#cbb89a;">Halo <strong style="color:#f5f0e8;">${name}</strong>,</p>
    <p style="font-size:14px;line-height:1.6;color:#cbb89a;">Kami menerima permintaan reset password untuk akunmu. Klik tombol di bawah untuk membuat password baru. Tautan ini berlaku <strong>1 jam</strong>.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#1a0a00;text-decoration:none;font-weight:800;font-size:14px;border-radius:12px;">Reset Password</a>
    </div>
    <p style="font-size:12px;line-height:1.6;color:#8a7a5e;">Jika tombol tidak berfungsi, salin tautan ini:<br><span style="color:#f59e0b;word-break:break-all;">${resetUrl}</span></p>
    <p style="font-size:12px;line-height:1.6;color:#8a7a5e;margin-top:24px;">Jika kamu tidak meminta ini, abaikan email ini — password kamu tetap aman.</p>
  </div>`;

  return { subject, text, html };
}
