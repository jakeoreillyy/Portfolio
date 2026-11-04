import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL;
// Without a verified domain this falls back to Resend's testing sender, which
// only delivers to the account's own address and is more likely to be
// filtered as spam. A blank value (as in .env.example) also falls back.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_TIMEOUT_MS = 5000;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function verifyRecaptcha(token: unknown) {
  // Fail closed in production: a missing secret there means the env var was
  // dropped. Skipping the check would let bots spam the inbox and use up the
  // Resend quota. Locally it's fine to run without reCAPTCHA configured.
  if (!RECAPTCHA_SECRET) return process.env.NODE_ENV !== "production";

  if (!isNonEmptyString(token)) return false;

  let data: { success: boolean; score?: number; action?: string };
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token }),
      // A slow or hung call would otherwise hold the request open until the
      // function itself times out.
      signal: AbortSignal.timeout(RECAPTCHA_TIMEOUT_MS),
    });
    data = await res.json();
  } catch (error) {
    // Count a timeout as a failed check. The visitor gets the usual reCAPTCHA
    // error and can try again.
    if (error instanceof DOMException && error.name === "TimeoutError") {
      console.error(`contact: reCAPTCHA verification timed out after ${RECAPTCHA_TIMEOUT_MS} ms`);
      return false;
    }
    throw error;
  }

  // Google recommends checking the action too, so only tokens minted for this
  // form (the action Contact.tsx passes to grecaptcha.execute) get through.
  return (
    data.success && data.action === "contact" && (data.score === undefined || data.score >= 0.5)
  );
}

export async function POST(request: Request): Promise<Response> {
  try {
    return await handleContact(request);
  } catch (error) {
    // Vercel keeps only what the function logs, so without this a 500 leaves
    // nothing to debug from.
    console.error("contact: unexpected error", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// Vercel answers a method the module doesn't export with an empty 405. These
// exports keep the JSON error body for every other method.
function methodNotAllowed() {
  return Response.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed;

async function handleContact(request: Request): Promise<Response> {
  if (!process.env.RESEND_API_KEY || !TO_EMAIL) {
    return Response.json({ error: "Contact form is not configured yet." }, { status: 500 });
  }

  // Parsed on its own so a malformed body is a 400 (the client's mistake)
  // rather than the generic 500.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { name, email, subject, message, recaptchaToken } = (body ?? {}) as Record<string, unknown>;

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(subject) ||
    !isNonEmptyString(message)
  ) {
    return Response.json({ error: "Please fill in every field." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (name.length > 200 || email.length > 320 || subject.length > 200 || message.length > 5000) {
    return Response.json({ error: "Message is too long." }, { status: 400 });
  }

  const recaptchaOk = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaOk) {
    return Response.json(
      { error: "reCAPTCHA verification failed. Please try again." },
      { status: 400 },
    );
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
    // Resend's SDK only logs failures outside production, so on Vercel this
    // line is the only record of why a send failed.
    console.error(`contact: Resend failed to send (${error.name}): ${error.message}`);
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
