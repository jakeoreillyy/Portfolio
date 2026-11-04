import { useEffect, useRef, useState } from "react";
import type { ComponentProps, SubmitEvent } from "react";
import { LinkedInIcon, MailIcon, XIcon } from "../components/icons";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
const RECAPTCHA_SCRIPT_ID = "recaptcha-script";
// How long a submit waits for reCAPTCHA to load and return a token. Long
// enough for a slow phone connection, short enough not to strand "Sending…".
const RECAPTCHA_TIMEOUT_MS = 10_000;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// The script is about 340 KiB and a second of CPU on a phone, so it's added
// once someone starts on the form rather than when the page loads. An
// existing tag is found by id: window.grecaptcha only exists once the script
// has run, so checking that would add a second copy during the download.
function loadRecaptcha(siteKey: string) {
  const existing = document.getElementById(RECAPTCHA_SCRIPT_ID);
  if (existing instanceof HTMLScriptElement) return existing;

  const script = document.createElement("script");
  script.id = RECAPTCHA_SCRIPT_ID;
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  script.async = true;
  // Drop a tag that failed to load (an ad blocker, say), so the next submit
  // adds a fresh one instead of waiting on it.
  script.addEventListener("error", () => script.remove());
  document.head.appendChild(script);
  return script;
}

function useRecaptchaBadge() {
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    // Reveal the reCAPTCHA badge only while this page is mounted so it never
    // shows on the landing page (the badge otherwise persists across routes).
    document.body.classList.add("show-recaptcha");
    return () => document.body.classList.remove("show-recaptcha");
  }, []);
}

// Waits for the script, adding it if the form hasn't yet, then asks for a
// token. Resolves undefined rather than hanging if the script fails to load
// or the whole exchange outlasts the timeout.
async function getRecaptchaToken(): Promise<string | undefined> {
  if (!RECAPTCHA_SITE_KEY) return undefined;

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), RECAPTCHA_TIMEOUT_MS);
    const finish = (token?: string) => {
      clearTimeout(timer);
      resolve(token);
    };
    const execute = () =>
      window.grecaptcha?.ready(async () => {
        try {
          finish(await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "contact" }));
        } catch {
          finish();
        }
      });

    if (window.grecaptcha) {
      execute();
    } else {
      const script = loadRecaptcha(RECAPTCHA_SITE_KEY);
      script.addEventListener("load", execute);
      script.addEventListener("error", () => finish());
    }
  });
}

const EMAIL = "oreillyjake16@gmail.com";

// mailto entries open in place; the rest are external links; the last has no
// href and renders dimmer so it doesn't read as clickable.
const details = [
  { Icon: MailIcon, label: EMAIL, href: `mailto:${EMAIL}` },
  { Icon: LinkedInIcon, label: "jake-o-reilly", href: "https://www.linkedin.com/in/jake-o-reilly" },
  { Icon: XIcon, label: "@jakeorei", href: "https://x.com/jakeorei" },
];

const fieldClass =
  "w-full rounded border border-faint bg-background px-3.5 pt-4 pb-2 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent";

// Floating label notched into the field's top border.
function Field({
  name,
  label,
  textarea,
  ...props
}: { name: string; label: string; textarea?: boolean } & ComponentProps<"input"> &
  ComponentProps<"textarea">) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="pointer-events-none absolute -top-2 left-2.5 bg-background px-1 font-mono text-[10px] tracking-[0.15em] text-accent uppercase"
      >
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        required
        className={`${fieldClass} ${textarea ? "resize-none" : ""}`}
        {...props}
      />
    </div>
  );
}

type Status = "idle" | "sending" | "sent" | "error" | "blocked";

export default function Contact() {
  useRecaptchaBadge();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const recaptchaRequested = useRef(false);

  // Start fetching reCAPTCHA on the form's first focus or input, so it's
  // usually ready by the time someone sends. If this fetch fails, the
  // submit tries again.
  function requestRecaptcha() {
    if (recaptchaRequested.current || !RECAPTCHA_SITE_KEY) return;
    recaptchaRequested.current = true;
    loadRecaptcha(RECAPTCHA_SITE_KEY);
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const recaptchaToken = await getRecaptchaToken();

    // No token means reCAPTCHA was blocked or failed to load, and the server
    // would refuse the message. Point to email instead of sending it.
    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      setStatus("blocked");
      return;
    }

    const data = { ...Object.fromEntries(new FormData(form)), recaptchaToken };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="px-6 pt-32 pb-24 sm:pt-40">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.98] tracking-[-0.04em] text-balance">
          Get in touch.
        </h1>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-8">
          {details.map(({ Icon, label, href }) => {
            const inner = (
              <>
                <Icon size={16} className="shrink-0" />
                {label}
              </>
            );
            const base = "flex items-center gap-2 font-mono text-sm";
            return href ? (
              <a
                key={label}
                href={href}
                {...(href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className={`${base} text-muted transition-colors hover:text-accent`}
              >
                {inner}
              </a>
            ) : (
              <span key={label} className={`${base} text-faint`}>
                {inner}
              </span>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          onFocus={requestRecaptcha}
          onInput={requestRecaptcha}
          className="mt-8 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Name" autoComplete="name" placeholder="Andrej Karpathy" />
            <Field
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="andrejkarpathy@gmail.com"
            />
          </div>

          <Field name="subject" label="Subject" placeholder="A question about your work" />

          <Field
            name="message"
            label="Message"
            textarea
            rows={6}
            placeholder="Hey Jake, I'd love to hear more about how you approached one of your projects."
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex cursor-pointer items-center gap-2 rounded border border-accent px-4 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-background disabled:cursor-default disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send message"}
            {status !== "sending" && <span aria-hidden="true">→</span>}
          </button>

          <p className="font-mono text-xs text-faint">Protected by reCAPTCHA.</p>

          <div aria-live="polite" className="empty:hidden">
            {status === "sent" && (
              <p className="font-mono text-xs text-accent">Thanks, I'll get back to you soon.</p>
            )}
            {status === "error" && error && (
              <p className="font-mono text-xs text-danger">{error}</p>
            )}
            {status === "blocked" && (
              <p className="font-mono text-xs text-danger">
                Your message wasn't sent because reCAPTCHA couldn't load. Please email me at{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="underline transition-colors hover:text-accent"
                >
                  {EMAIL}
                </a>{" "}
                instead.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
