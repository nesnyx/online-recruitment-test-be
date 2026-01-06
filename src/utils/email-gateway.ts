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

export const sendExamInvitation = async (to: string, name: string, examTitle: string, username: string, password: string) => {
    const mailOptions = {
        from: `"Admin Exam" <${ENV.GMAIL_APP_EMAIL}>`,
        to,
        subject: `Undangan Ujian: ${examTitle}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.5;">
                <h2>Halo, ${name}!</h2>
                <p>Anda telah diundang untuk mengikuti ujian <b>${examTitle}</b>.</p>
                <p>Dibawah ini adalah Akun untuk masuk ke dalam ujian</p> <br />
                <p>Username: ${username}</p> 
                <p>Password: ${password}</p> <br /><br />

                <p>Kerjakan sesuai jadwal yang diberikan</p>
                
                <p>Semoga berhasil!</p>
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