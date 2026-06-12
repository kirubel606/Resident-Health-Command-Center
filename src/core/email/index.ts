import nodemailer from "nodemailer";
import { env } from "@/core/config/env";
import { getLogger } from "@/core/logging";

const logger = getLogger("core.email");

// Configure transport
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
    : undefined,
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
      from: env.SMTP_FROM,
      to,
      subject,
      text,
    });
    logger.info({ to, subject }, "email.sent_successfully");
  } catch (error) {
    logger.error({ error, to, subject }, "email.send_failed");
    throw error;
  }
}

export async function sendReminder(patient: {
  name: string;
  email: string;
  appointmentTime: string;
}): Promise<void> {
  await sendEmail({
    to: patient.email,
    subject: "Appointment Reminder",
    text: `Hello ${patient.name}, this is a reminder for your appointment at ${patient.appointmentTime}.`,
  });
}
