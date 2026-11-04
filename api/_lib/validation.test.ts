import { describe, expect, it } from "vitest";
import { MAX_LENGTH } from "../../src/lib/contactLimits.js";
import { validateContact } from "./validation.js";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "A question about your work",
  message: "Hi Jake, I'd love to hear how you approached one of your projects.",
};

const fields = ["name", "email", "subject", "message"] as const;

const missingFields = { ok: false, error: "Please fill in every field." };

describe("validateContact", () => {
  it("returns only the four form fields for valid input", () => {
    expect(validateContact({ ...valid, recaptchaToken: "token" })).toEqual({
      ok: true,
      fields: valid,
    });
  });

  it("accepts every field at exactly its maximum length", () => {
    const domain = "@example.com";
    const atLimit = {
      name: "n".repeat(MAX_LENGTH.name),
      email: "e".repeat(MAX_LENGTH.email - domain.length) + domain,
      subject: "s".repeat(MAX_LENGTH.subject),
      message: "m".repeat(MAX_LENGTH.message),
    };
    expect(validateContact(atLimit)).toEqual({ ok: true, fields: atLimit });
  });

  it.each(fields)("rejects a missing %s", (field) => {
    const body = Object.fromEntries(Object.entries(valid).filter(([key]) => key !== field));
    expect(validateContact(body)).toEqual(missingFields);
  });

  it.each(fields)("rejects a blank %s", (field) => {
    expect(validateContact({ ...valid, [field]: "   " })).toEqual(missingFields);
  });

  it.each(fields)("rejects a non-string %s", (field) => {
    expect(validateContact({ ...valid, [field]: 42 })).toEqual(missingFields);
  });

  it.each([
    ["null", null],
    ["a string", "text"],
    ["a number", 42],
    ["an array", [valid]],
  ])("rejects %s as the body", (_label, body) => {
    expect(validateContact(body)).toEqual(missingFields);
  });

  it.each(["ada", "ada@example", "ada@@example.com", "ada lovelace@example.com"])(
    "rejects the email %j",
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({
        ok: false,
        error: "Please enter a valid email address.",
      });
    },
  );

  it.each(fields)("rejects an over-length %s", (field) => {
    // The email has to stay well formed to get past the format check.
    const tooLong =
      field === "email"
        ? "e".repeat(MAX_LENGTH.email) + "@example.com"
        : "x".repeat(MAX_LENGTH[field] + 1);
    expect(validateContact({ ...valid, [field]: tooLong })).toEqual({
      ok: false,
      error: "Message is too long.",
    });
  });
});
