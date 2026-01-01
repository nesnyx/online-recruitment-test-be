import * as nodemailer from "nodemailer"


export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "",
            pass: ""
        }
    })

    const mailOptions = {
        from: "",
        to,
        subject,
        text
    }

    await transporter.sendMail(mailOptions)
}
(async () => {
    await sendEmail("baraaris64@gmail.com", "test", "test")
})()