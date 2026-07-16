import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Reveal } from "../components/Reveal";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function useRecaptchaScript() {
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.head.appendChild(script);
    }

    // Reveal the reCAPTCHA badge only while this page is mounted so it never
    // shows on the landing page (the badge otherwise persists across routes).
    document.body.classList.add("show-recaptcha");
    return () => document.body.classList.remove("show-recaptcha");
  }, []);
}

async function getRecaptchaToken(): Promise<string | undefined> {
  if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return undefined;

  return new Promise((resolve) => {
    window.grecaptcha!.ready(async () => {
      try {
        const token = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "contact" });
        resolve(token);
      } catch {
        resolve(undefined);
      }
    });
  });
}

const EMAIL = "oreillyjake16@gmail.com";

const details: { icon: "mail" | "github" | "linkedin" | "pin"; label: string; href?: string }[] = [
  { icon: "mail", label: EMAIL, href: `mailto:${EMAIL}` },
  {
    icon: "linkedin",
    label: "jake-o-reilly",
    href: "https://www.linkedin.com/in/jake-o-reilly",
  },
  { icon: "github", label: "jakeoreillyy", href: "https://github.com/jakeoreillyy" },
  { icon: "pin", label: "Dublin, Ireland" },
];

function MailIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 5.02 3.26 9.28 7.77 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.11 0 1.52-.01 2.75-.01 3.13 0 .3.2.66.79.55 4.5-1.5 7.76-5.76 7.76-10.78C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const icons = { mail: MailIcon, github: GithubIcon, linkedin: LinkedinIcon, pin: PinIcon };

const fieldClass =
  "w-full rounded-lg border border-line bg-background px-3.5 pt-4 pb-2 text-sm text-foreground placeholder:text-faint focus:border-accent focus:outline-none";
const fieldLabelClass =
  "pointer-events-none absolute -top-2 left-2.5 bg-background px-1 font-mono text-[10px] tracking-[0.15em] text-accent uppercase";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  useRecaptchaScript();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const recaptchaToken = await getRecaptchaToken();
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      recaptchaToken,
    };

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
    <section className="flex min-h-screen items-center px-6 py-32">
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <h1 className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
            Get in touch.
          </h1>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-6">
            {details.map((item) => {
              const Icon = icons[item.icon];
              const content = (
                <span className="flex items-center gap-2 font-mono text-sm text-muted">
                  <span className={item.icon === "mail" ? "text-accent" : "text-faint"}>
                    <Icon />
                  </span>
                  {item.label}
                </span>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  {...(item.icon !== "mail"
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="transition-colors hover:text-accent [&:hover_span]:text-accent"
                >
                  {content}
                </a>
              ) : (
                <span key={item.label}>{content}</span>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="relative">
                <label htmlFor="name" className={fieldLabelClass}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Andrej Karpathy"
                  className={fieldClass}
                />
              </div>
              <div className="relative">
                <label htmlFor="email" className={fieldLabelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="andrejkarpathy@gmail.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="subject" className={fieldLabelClass}>
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="A question about your work"
                className={fieldClass}
              />
            </div>

            <div className="relative">
              <label htmlFor="message" className={fieldLabelClass}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="Hey Jake, I'd love to hear more about how you approached one of your projects."
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-4 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
              {status !== "sending" && <span aria-hidden="true">→</span>}
            </button>

            <p className="font-mono text-xs text-faint">Protected by reCAPTCHA.</p>

            {status === "sent" && (
              <p className="font-mono text-xs text-accent">Thanks, I'll get back to you soon.</p>
            )}
            {status === "error" && error && (
              <p className="font-mono text-xs text-red-400">{error}</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
