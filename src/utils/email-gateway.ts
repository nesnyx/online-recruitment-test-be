// email.service.ts
import * as nodemailer from "nodemailer";
import { ENV } from "../config/env";
import { magicLoginToken } from "../config/jwt";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: ENV.GMAIL_APP_EMAIL,
        pass: ENV.GMAIL_APP_PASSWORD
    }
});

export const sendExamInvitation = async (to: string, name: string, examTitle: string, username: string, password: string, startAt: Date, endAt: Date, durationMinutes: number) => {
    const generateMagicLoginToken = magicLoginToken(username, password)
    const url = new URL(`${ENV.MAGIC_LOGIN_URL}/api/v1/auth/magic-login`);
    url.searchParams.append('t', generateMagicLoginToken);
    const magicLink = url.toString();
    const formatDateWITA = (date: Date) => {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Makassar',
            timeZoneName: 'short'
        });
    };
    const mailOptions = {
        from: `"Admin Exam" <${ENV.GMAIL_APP_EMAIL}>`,
        to,
        subject: `📢 Undangan Tahap Seleksi: ${examTitle}`,
        attachments: [],
        html: `
    <div style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
            
                <td style="padding: 40px 0 40px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffcc00; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        
                        

                        <tr>
                        
                            <td style="padding: 0 30px 40px 30px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; padding: 40px;">
                                    
                                    <tr>
                                        <td align="center" style="padding-bottom: 30px;">
                                            <div style="font-size: 48px;">✉️</div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="color: #1f2937; font-size: 24px; font-weight: bold; text-align: center; padding-bottom: 20px;">
                                            Halo, ${name}!
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center; padding-bottom: 30px;">
                                            Anda telah terpilih untuk mengikuti tahap seleksi online untuk posisi <strong>${examTitle}</strong>. Silakan periksa detail jadwal dan kredensial akses Anda di bawah ini.
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <table width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                                                <tr>
                                                    <td style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px;">Jadwal Pelaksanaan (WITA)</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #111827; font-size: 15px;">
                                                        📅 <strong>Mulai:</strong> ${formatDateWITA(startAt)}<br>
                                                        🏁 <strong>Selesai:</strong> ${formatDateWITA(endAt)}<br>
                                                        ⏱️ <strong>Durasi:</strong> ${durationMinutes} Menit
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding-bottom: 30px;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="color: #6b7280; font-size: 14px; width: 40%;">Username</td>
                                                    <td style="color: #111827; font-size: 15px; font-family: monospace; font-weight: bold;">${username}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #6b7280; font-size: 14px; padding-top: 10px;">Password</td>
                                                    <td style="color: #111827; font-size: 15px; font-family: monospace; font-weight: bold; padding-top: 10px;">${password}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center">
                                            <a href="${magicLink}" style="background-color: #6366f1; color: #ffffff; padding: 18px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s;">
                                                Masuk ke Portal Ujian
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="color: #9ca3af; font-size: 12px; padding-top: 20px;">
                                            Link ini akan otomatis melakukan login ke akun Anda.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 40px 40px 40px; text-align: center;">
                                <p style="color: #25252500; font-size: 13px; line-height: 20px; margin-bottom: 20px;">
                                    <strong>Penting:</strong> Akses portal hanya akan terbuka pada waktu yang telah ditentukan. Gunakan koneksi internet stabil dan perangkat Laptop/PC.
                                </p>
                                
                                <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
                                    <p style="color: #ffffff; font-size: 14px; margin: 0;">&copy; ${new Date().getFullYear()} IT Recruitment Team</p>
                                    <p style="color: #c7d2fe; font-size: 12px; margin-top: 5px;">Email ini dikirim secara otomatis, mohon tidak membalas.</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email terkirim ke: ${to}`);
    } catch (error) {
        logger.error("Gagal mengirim email:", error);
        throw error;
    }
};