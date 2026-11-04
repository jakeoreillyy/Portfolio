// The .js extension is required, as explained in api/contact.ts.
import { MAX_LENGTH } from "../../src/lib/contactLimits.js";

type ContactFields = { name: string; email: string; subject: string; message: string };

type ContactValidation = { ok: true; fields: ContactFields } | { ok: false; error: string };

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Takes the parsed request body and returns the four form fields, or the
// error to show. Kept free of the request and Resend so it can be unit tested.
export function validateContact(body: unknown): ContactValidation {
  const { name, email, subject, message } = (body ?? {}) as Record<string, unknown>;

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(subject) ||
    !isNonEmptyString(message)
  ) {
    return { ok: false, error: "Please fill in every field." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (
    name.length > MAX_LENGTH.name ||
    email.length > MAX_LENGTH.email ||
    subject.length > MAX_LENGTH.subject ||
    message.length > MAX_LENGTH.message
  ) {
    return { ok: false, error: "Message is too long." };
  }

  return { ok: true, fields: { name, email, subject, message } };
}
