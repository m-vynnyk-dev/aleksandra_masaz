# Aleksandra Massage & Spa

Landing page for Aleksandra Massage & Spa.

## Live website

[View the deployed website](https://m-vynnyk-dev.github.io/aleksandra_masaz/)

## Local development

```bash
npm install
npm run dev
```

## Contact form

The contact dialog runs in demo mode when no endpoint is configured. In this mode validation works,
but no form data leaves the browser.

After the client approves Telegram delivery, copy `.env.example` to `.env.local` and add the public
Cloudflare Worker URL:

```bash
VITE_CONTACT_FORM_ENDPOINT=https://example.workers.dev
```

The Telegram bot token and chat ID must remain Cloudflare Worker secrets and must never be added to
this repository or exposed through a `VITE_` variable.
