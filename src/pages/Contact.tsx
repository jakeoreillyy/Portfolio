import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Reveal } from "../components/Reveal";
import { GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from "../components/icons";

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

const icons = { mail: MailIcon, github: GitHubIcon, linkedin: LinkedInIcon, pin: PinIcon };

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
                    <Icon size={17} />
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
