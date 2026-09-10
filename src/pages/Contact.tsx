import { useEffect, useState } from "react";
import type { ComponentProps, SubmitEvent } from "react";
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

// mailto entries open in place; the rest are external links; the last has no
// href and renders dimmer so it doesn't read as clickable.
const details = [
  { Icon: MailIcon, label: EMAIL, href: `mailto:${EMAIL}` },
  { Icon: LinkedInIcon, label: "jake-o-reilly", href: "https://www.linkedin.com/in/jake-o-reilly" },
  { Icon: GitHubIcon, label: "jakeoreillyy", href: "https://github.com/jakeoreillyy" },
  { Icon: PinIcon, label: "Dublin, Ireland" },
];

const fieldClass =
  "w-full rounded border border-line bg-background px-3.5 pt-4 pb-2 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent";

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
        <Reveal>
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
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="name" label="Name" placeholder="Andrej Karpathy" />
              <Field
                name="email"
                label="Email"
                type="email"
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
              className="inline-flex items-center gap-2 rounded border border-accent px-4 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send message"}
              {status !== "sending" && <span aria-hidden="true">→</span>}
            </button>

            <p className="font-mono text-xs text-faint">Protected by reCAPTCHA.</p>

            <div aria-live="polite" className="empty:hidden">
              {status === "sent" && (
                <p className="font-mono text-xs text-accent">
                  Thanks, I'll get back to you soon.
                </p>
              )}
              {status === "error" && error && (
                <p className="font-mono text-xs text-danger">{error}</p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
