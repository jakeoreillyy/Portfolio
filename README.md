# Jake O'Reilly Portfolio

My personal portfolio site: projects, experience, and a contact form.

**Live:** [jakeoreilly.dev](https://www.jakeoreilly.dev/)

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for build/dev tooling
- **Tailwind CSS v4** for styling
- **React Router** for routing
- **Lenis** for smooth scrolling
- **Resend** for the contact form, running as a **Vercel** serverless function (`api/contact.ts`)
- **Google reCAPTCHA v3** to guard the contact form
- Deployed on **Vercel**

## Running locally

**Prerequisites:** Node 20.19+ (or 22+) and npm.

```bash
git clone https://github.com/jakeoreillyy/portfolio.git
cd portfolio
npm install
npm run dev
```

The site runs at `http://localhost:5173`.

> **Note:** `npm run dev` runs the Vite frontend only, so the `/api/contact` route (a Vercel serverless function) won't respond. Everything else works. To exercise the contact endpoint locally, run `vercel dev` instead.

### Environment variables

The site runs fine without these; they're only needed for the contact form to actually send email. Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key that sends the email |
| `CONTACT_TO_EMAIL` | Address the contact form delivers to |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key (optional; leave blank to disable) |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret key (optional) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## License

The source is public for reference and study, but it is **not** licensed for reuse or redeployment as your own site. See [LICENSE](LICENSE) for details.
