# AgentDaddie

## Deploy Open Claw to your own server in minutes. No code, no stress, just a few clicks.

### Why You'll Love AgentDaddie

We believe everyone should have control over their OpenClaw. Here's how AgentDaddie makes it easy:

*   **No More Tech Headaches:** Forget complicated setups and confusing command lines. We handle all the heavy lifting, so you can deploy OpenClaw to your server with ease. Just connect your DigitalOcean account, and we'll do the rest!
*   **Your Server, Your Rules:** This is a big one! When OpenClaw runs on your server, you're in complete control. Customize it, scale it, and make it work exactly how you need it, 24/7.
*   **Keep Your Data Safe & Sound:** OpenClaw works by using API keys and tokens for AI models. The problem? It stores these in plain text. Handing them over to a random online service means trusting *them* with your digital keys. With AgentDaddie, your credentials stay on *your* server, under *your* control, away from prying eyes. Security and ownership matter!
*   **Works with Your Favorite AI Models:** Whether you prefer OpenAI (like GPT models), Anthropic (Claude), or the flexibility of OpenRouter (access to many LLMs), AgentDaddie supports them. Plus, it integrates seamlessly with Telegram for easy communication.
*   **Always Know What's Happening:** Once you hit deploy, AgentDaddie tracks the progress, so you can see exactly when your personal AI server is up and ready to go.

### How DigitalOcean Makes it Happen (The Magic Behind the Scenes)

AgentDaddie uses user's DigitalOcean, a super reliable and affordable cloud provider, to bring your OpenClaw server to life. Here's the simple breakdown:

1.  **Connect Your Account:** You securely link your DigitalOcean account to AgentDaddie using their official sign-in. We *never* see or store your DigitalOcean password. This link simply gives us permission to create a server (they call it a "droplet") for you.
2.  **One-Click Deployment:** Once connected, you tell AgentDaddie a few things about your desired OpenClaw setup (like your API keys, but don't worry, these go straight to *your* new server, not ours!). Then, with a single click, AgentDaddie automates the entire process:
    *   It provisions a brand new server on DigitalOcean.
    *   It installs all the necessary software (like Docker).
    *   It sets up OpenClaw and configures it with your settings.
    *   It even creates a secure link (a "Cloudflare tunnel") so you can access your OpenClaw from anywhere.
3.  **Monitor & Enjoy:** AgentDaddie keeps you updated on the deployment progress. Once it's done, you get a link to your very own, fully functional OpenClaw instance!

### Important Heads Up!

This project is still in its early stages. We're constantly adding exciting new features and refining things, which occasionally might lead to changes. We'll always do our best to make transitions smooth!

---

## For the Tech-Savvy

If you're a developer or just curious about what makes AgentDaddie tick, this section is for you!

### Tech Stack

AgentDaddie is built with modern, robust technologies:

*   **Next.js + React + TypeScript:** For a fast, responsive, and type-safe web application.
*   **OpenNext Cloudflare adapter + Wrangler:** To efficiently build and deploy our frontend as a Cloudflare Worker.
*   **Drizzle ORM + PostgreSQL:** For reliable database management and migrations.
*   **Better Auth:** For secure and flexible authentication.
*   **SWR + Axios:** For efficient client-side data fetching.

### Quick Start

Want to run AgentDaddie locally? Here's how:

1.  **Clone and install:**

    ```bash
    git clone https://github.com/agentdaddie/agentdaddie.git
    cd agentdaddie
    pnpm install
    ```

2.  **Configure environment:**
    Copy the example environment file and fill in the required values (details below).

    ```bash
    cp .env.example .env
    ```

3.  **Run in development:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

    ```bash
    pnpm dev
    ```

4.  **Preview in Cloudflare runtime:**
    This command uses `opennextjs-cloudflare build --noMinify` to avoid noisy third-party minification warnings.

    ```bash
    pnpm preview
    ```

### Scripts

Handy commands for development and deployment:

*   `pnpm dev`: Starts the Next.js development server.
*   `pnpm build`: Creates a production-ready Next.js build.
*   `pnpm start`: Runs the Next.js production server.
*   `pnpm wbuild`: Builds for Cloudflare using OpenNext.
*   `pnpm preview`: Runs a local Cloudflare Worker preview.
*   `pnpm deploy`: Builds and deploys the application to Cloudflare.
*   `pnpm upload`: Builds and uploads worker artifacts.
*   `pnpm cf-typegen`: Generates Cloudflare environment types.
*   `pnpm db:generate`: Generates Drizzle database migrations.
*   `pnpm db:migrate`: Applies pending Drizzle database migrations.
*   `pnpm db:studio`: Opens Drizzle Studio for database inspection.

### Environment Variables

Check `.env.example` for the full template. Key variables include:

*   `ENV`: App mode (set `DEV` for local development).
*   `NEXT_ALLOWED_DEV_ORIGIN`: Optional dev tunnel origin.
*   `LOCAL_DB_URL`: Your local PostgreSQL connection string.
*   `PROD_DB_*`: Production database credentials for PostgreSQL.
*   `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`: For authentication.
*   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: For Google OAuth.
*   `DIGITALOCEAN_CLIENT_ID`, `DIGITALOCEAN_CLIENT_SECRET`, `DIGITALOCEAN_REDIRECT_URI`: For DigitalOcean OAuth.
*   `DIGITALOCEAN_OAUTH_SCOPE`: Optional OAuth scopes (defaults to `read write`).
*   `DEPLOYMENT_CHECK`: Optional callback URL override for deployment status checks (useful in development with tunnels).
*   `NODE_ENV`: Standard runtime mode (`development` or `production`).

### Deployment Check Callback (`DEPLOYMENT_CHECK`)

This is how AgentDaddie tracks your OpenClaw server's setup progress. When a new server is created, a special script runs on it. This script:

1.  Bootstraps OpenClaw and starts a Cloudflare tunnel.
2.  Collects the tunnel's logs.
3.  Sends a `POST` request back to AgentDaddie's `/api/deploy/check` endpoint with the deployment ID and the collected logs.

AgentDaddie then parses these logs to find your server's unique URL and updates its status to "success" (or "failed" if something went wrong).

*   **Production:** No override needed if your app is on a public domain.
*   **Development:** If using a tunnel (e.g., ngrok) for local development, set `DEPLOYMENT_CHECK=https://<your-ngrok-domain>`.

### Hyperdrive Setup (Cloudflare)

This project is set up to use Cloudflare Hyperdrive for database connections in `wrangler.jsonc`:

1.  Create a Hyperdrive resource in Cloudflare.
2.  Update the `id` in `wrangler.jsonc` with your Hyperdrive ID.
3.  Ensure your `.env` database credentials match your target environment.
4.  Run `pnpm cf-typegen` after any binding changes.

### DigitalOcean OAuth Setup (For Developers)

To enable DigitalOcean integration in your development environment:

1.  **Create an OAuth app** in your DigitalOcean account.
2.  Set the **Callback URL** to `/api/integrations/digitalocean/callback` on your application's domain (e.g., `http://localhost:3000/api/integrations/digitalocean/callback` for local development).
3.  Add the following to your `.env` file:
    *   `DIGITALOCEAN_CLIENT_ID=<Your_DO_Client_ID>`
    *   `DIGITALOCEAN_CLIENT_SECRET=<Your_DO_Client_Secret>`
    *   `DIGITALOCEAN_REDIRECT_URI=<Your_Callback_URL>` (Optional, but good practice to explicitly define)
    *   `DIGITALOCEAN_OAUTH_SCOPE="read write"` (Optional, default is `read write`)

### Database and Migrations

Drizzle ORM manages our database. It switches credentials based on the `ENV` variable:

*   `ENV=DEV`: Uses `LOCAL_DB_URL`.
*   Otherwise: Uses production `PROD_DB_*` credentials.

**Workflow:**

```bash
pnpm db:generate   # Generate new migration files based on schema changes
pnpm db:migrate    # Apply pending migrations to the database
pnpm db:studio     # Open Drizzle Studio to browse your database
```

Migration files are located in `src/db/migration`.

### Open Source

Contributions, issues, and feature requests are welcome!

1.  Fork the repository.
2.  Create a new branch for your feature or fix.
3.  Submit a pull request with a clear description and any relevant testing notes.

When reporting issues, please include:

*   Your runtime environment (development, preview, or deployed).
*   Steps to reproduce the issue.
*   Expected vs. actual behavior.
*   Any relevant logs.

### License

This project is licensed under the MIT License.