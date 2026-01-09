// email.service.ts
import * as nodemailer from "nodemailer";
import { ENV } from "../config/env";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true untuk port 465, false untuk port lain
    auth: {
        user: ENV.GMAIL_APP_EMAIL,
        pass: ENV.GMAIL_APP_PASSWORD
    }
});

export const sendExamInvitation = async (to: string, name: string, examTitle: string, username: string, password: string, startAt: Date, endAt: Date, durationMinutes: number) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };
    const mailOptions = {
        from: `"Admin Exam" <${ENV.GMAIL_APP_EMAIL}>`,
        to,
        subject: `📢 Undangan Ujian: ${examTitle}`,
        html: `
    <div style="background-color: #f4f4f7; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            
            <div style="background-color: #2563eb; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Undangan Ujian Online</h1>
            </div>

            <div style="padding: 30px; color: #333333;">
                <h2 style="color: #1f2937;">Halo, ${name}!</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                    Anda telah diundang untuk mengikuti ujian: <br>
                    <strong style="font-size: 18px; color: #2563eb;">${examTitle}</strong>
                </p>

                <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #1e40af;"><strong>Jadwal Pelaksanaan:</strong></p>
                    <p style="margin: 5px 0; font-size: 15px;">📅 <b>Mulai:</b> ${formatDate(startAt)}</p>
                    <p style="margin: 5px 0; font-size: 15px;">🏁 <b>Berakhir:</b> ${formatDate(endAt)}</p>
                    <p style="margin: 5px 0; font-size: 15px;">⏱️ <b>Duration:</b> ${durationMinutes} minutes</p>
                </div>

                <p style="margin-top: 20px; color: #6b7280;">Silakan gunakan kredensial di bawah ini untuk login:</p>
                
                <div style="background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 6px; padding: 20px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px; text-align: right; color: #6b7280; width: 40%;"><strong>Username:</strong></td>
                            <td style="padding: 5px; text-align: left; font-family: monospace; font-size: 18px; color: #111827;">${username}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; text-align: right; color: #6b7280;"><strong>Password:</strong></td>
                            <td style="padding: 5px; text-align: left; font-family: monospace; font-size: 18px; color: #111827;">${password}</td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px;">
                    <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.4;">
                        <strong>Penting:</strong> Akses ujian hanya akan terbuka secara otomatis pada waktu yang telah ditentukan di atas.
                    </p>
                </div>

                <p style="font-size: 16px;">Semoga berhasil!</p>
            </div>

            <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">Email ini dikirim secara otomatis oleh Sistem Admin Exam.</p>
                <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()}</p>
            </div>
        </div>
    </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email terkirim ke: ${to}`);
    } catch (error) {
        console.error("Gagal mengirim email:", error);
        throw error;
    }
};