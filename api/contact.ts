import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function verifyRecaptcha(token: unknown) {
  if (!RECAPTCHA_SECRET) return true; // not configured yet — skip in dev

  if (!isNonEmptyString(token)) return false;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token }),
  });

  const data = (await res.json()) as { success: boolean; score?: number };
  return data.success && (data.score === undefined || data.score >= 0.5);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await handleContact(req, res);
  } catch {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function handleContact(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.RESEND_API_KEY || !TO_EMAIL) {
    res.status(500).json({ error: "Contact form is not configured yet." });
    return;
  }

  const { name, email, subject, message, recaptchaToken } = req.body ?? {};

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(subject) ||
    !isNonEmptyString(message)
  ) {
    res.status(400).json({ error: "Please fill in every field." });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  if (name.length > 200 || email.length > 320 || subject.length > 200 || message.length > 5000) {
    res.status(400).json({ error: "Message is too long." });
    return;
  }

  const recaptchaOk = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaOk) {
    res.status(400).json({ error: "reCAPTCHA verification failed. Please try again." });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `Portfolio: ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    res.status(502).json({ error: "Failed to send message. Please try again." });
    return;
  }

  res.status(200).json({ ok: true });
}
