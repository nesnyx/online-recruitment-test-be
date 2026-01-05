import * as nodemailer from "nodemailer"
import { ENV } from "../config/env"


export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: ENV.GMAIL_APP_EMAIL,
            pass: ENV.GMAIL_APP_PASSWORD
        }
    })
    const mailOptions = {
        from: ENV.GMAIL_APP_EMAIL,
        to,
        subject,
        text
    }

    await transporter.sendMail(mailOptions)
}
(async () => {
    await sendEmail("baraaris64@gmail.com", "test", "test")
})()