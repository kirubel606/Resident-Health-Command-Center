import nodemailer from "nodemailer";
import { env } from "@/core/config/env";

// Configure transport for Mailpit (local SMTP server)
const transporter = nodemailer.createTransport({
  host: "rhcc-mailpit", // Defined in docker-compose.yml
  port: 1025,
  secure: false, // Mailpit doesn't use SSL by default
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    await transporter.sendMail({
      from: '"Resident Health Command Center" <noreply@rhcc.com>',
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
