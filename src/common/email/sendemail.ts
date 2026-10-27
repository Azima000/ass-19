import nodemailer from "nodemailer"
import type { SendMailOptions } from "nodemailer";
import { env } from "process";

const Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.google_account_email,
        pass: env.google_app_password
    }
});


export const Send_Email = async ({ to, subject, html }: SendMailOptions) => {
    const info = await Transporter.sendMail({
        from: `Social media app ${env.google_account_email}`,
        to,
        subject,
        html
    })
}