# OpenNext Starter

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## DigitalOcean OAuth Setup

To enable DigitalOcean connection in `/deploy`, set these environment variables:

```bash
DIGITALOCEAN_CLIENT_ID=your_digitalocean_oauth_client_id
DIGITALOCEAN_CLIENT_SECRET=your_digitalocean_oauth_client_secret
DIGITALOCEAN_REDIRECT_URI=http://localhost:3000/api/integrations/digitalocean/callback
# optional, defaults to "read write"
DIGITALOCEAN_OAUTH_SCOPE=read write
```

In your DigitalOcean OAuth app settings, configure the same callback URL as `DIGITALOCEAN_REDIRECT_URI`.

Token handling behavior:
- Access and refresh tokens are stored in secure HTTP-only cookies.
- Connection state is derived from token validity (not a separate connected flag).
- When an access token is expired, the app attempts `grant_type=refresh_token` automatically.
