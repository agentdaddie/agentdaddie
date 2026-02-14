import { NextRequest, NextResponse } from "next/server"
import randomName from '@scaleway/random-name'
import { desc, eq } from "drizzle-orm"

import { auth } from "@/lib/auth";
import { doDeployment } from "@/db/schema/do-deploy";
import { getDb } from "@/db";

import type {
    DeployDialogFormValues,
    DeployItemsResponse,
    DeploySubmissionResponse,
    DigitalOceanErrorResponse,
    DropletCreationResponse
} from "@/lib/type"
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        })

        if (!session) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
        }

        const db = await getDb()
        const items = await db.query.doDeployment.findMany({
            where: eq(doDeployment.userId, session.user.id),
            orderBy: [desc(doDeployment.createdAt), desc(doDeployment.id)],
        })

        const response: DeployItemsResponse = {
            ok: true,
            items,
        }

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected server error"
        return NextResponse.json({ ok: false, error: message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const doAccessToken = request.cookies.get("do_oauth_access_token")?.value

        if (!doAccessToken) {
            return NextResponse.json({ error: "Digital Ocean Not connected" }, { status: 401 })
        }

        const db = await getDb()
        const deploymentCheckEndpoint = `${process.env.DEPLOYMENT_CHECK}/api/deploy/check`
        console.log("DEPLOYMENT URL CHECK", deploymentCheckEndpoint)
        if (!deploymentCheckEndpoint) {
            return NextResponse.json({ ok: false, error: "DEPLOYMENT_CHECK is not configured" }, { status: 500 })
        }

        const payload = (await request.json()) as DeployDialogFormValues
        const userId = session.user.id
        const deploymentItemPrimaryId = randomUUID() //hep to track the deplyment server

        if (
            payload.llmProvider !== "openai" &&
            payload.llmProvider !== "anthropic" &&
            payload.llmProvider !== "openrouter"
        ) {
            return NextResponse.json({ ok: false, error: "Invalid LLM provider" }, { status: 400 })
        }

        const serverName = randomName("agentdaddie")

        console.log("deploy_payload", payload)

        const apiKeyLine =
            payload.llmProvider === "openai"
                ? `OPENAI_API_KEY=${payload.apiKey}`
                : payload.llmProvider === "anthropic"
                    ? `ANTHROPIC_API_KEY=${payload.apiKey}`
                    : `OPENROUTER_API_KEY=${payload.apiKey}`

        const regionMap: Record<string, string> = {
            "new-york": "nyc1",
            "san-francisco": "sfo3",
            amsterdam: "ams3",
            singapore: "sgp1",
            london: "lon1",
            frankfurt: "fra1",
            toronto: "tor1",
            bangalore: "blr1",
            sydney: "syd1",
            atlanta: "atl1",
        }
        const region = regionMap[payload.regionId]
        if (!region) {
            return NextResponse.json({ ok: false, error: "Invalid region" }, { status: 400 })
        }

        const userData = `#!/bin/bash
set -euxo pipefail
exec > >(tee -a /var/log/user-data.log) 2>&1

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl git wget jq
echo "=== System packages installed ==="

cd /root
rm -rf openclaw
git clone https://github.com/agentdaddie/openclaw.git
cd openclaw
echo "=== Repository cloned ==="

cat > .env <<EOF
${apiKeyLine}
TELEGRAM_BOT_TOKEN=${payload.telegramBotToken}
TELEGRAM_DM_POLICY=open
TELEGRAM_ALLOW_FROM=*
AUTH_PASSWORD=${payload.openClawAuthPassword}
AUTH_USERNAME=${payload.openClawAuthUsername}
OPENCLAW_GATEWAY_TOKEN=${payload.openClawGatewayId}
OPENCLAW_GATEWAY_PORT=18789
OPENCLAW_PRIMARY_MODEL=openrouter/google/gemini-3-flash-preview
OPENCLAW_STATE_DIR=/data/.openclaw
OPENCLAW_WORKSPACE_DIR=/data/workspace
PORT=8888
EOF
echo "=== Environment file created ==="

curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
echo "=== Docker installed and started ==="

docker compose version || apt-get install -y docker-compose-plugin
docker compose up -d
echo "=== Docker containers started ==="

echo "=== Waiting for application on port 8888 ==="
for i in {1..60}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:8888 | grep -q "200\\|302\\|401"; then
    echo "=== Application is ready on port 8888 (attempt \$i) ==="
    break
  fi
  echo "Waiting for port 8888... attempt \$i/60"
  sleep 2
done

wget -O /tmp/cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i /tmp/cloudflared.deb
nohup cloudflared tunnel --url http://localhost:8888 > /root/tunnel.log 2>&1 &
echo "=== Cloudflare tunnel started ==="

echo "=== Waiting for tunnel URL in logs ==="
for i in {1..80}; do
  if grep -q "https://.*\\.trycloudflare\\.com" /root/tunnel.log 2>/dev/null; then
    echo "=== Tunnel URL found in logs (attempt \$i) ==="
    break
  fi
  echo "Waiting for tunnel URL... attempt \$i/60"
  sleep 2
done

sleep 10
TUNNEL_LOG_CONTENT=\$(cat /root/tunnel.log 2>/dev/null || echo '')

echo "=== Preparing deployment check payload ==="
PAYLOAD=\$(jq -n \\
  --arg id "${deploymentItemPrimaryId}" \\
  --arg log "\$TUNNEL_LOG_CONTENT" \\
  '{deploymentItemPrimaryId: \$id, tunnelLog: \$log}')

echo "=== Sending deployment check to ${deploymentCheckEndpoint} ==="
HTTP_CODE=\$(curl -w "%{http_code}" -o /tmp/deploy_response.txt -X POST "${deploymentCheckEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d "\$PAYLOAD")

echo "=== HTTP Response Code: \$HTTP_CODE ==="
echo "=== Response Body: ==="
cat /tmp/deploy_response.txt

if [ "\$HTTP_CODE" = "200" ]; then
  echo "=== Deployment check completed successfully ==="
else
  echo "=== Deployment check failed with HTTP \$HTTP_CODE ==="
fi
`;


        const doConfig = {
            name: serverName,
            region,
            size: "s-2vcpu-4gb",
            image: "ubuntu-24-04-x64",
            user_data: userData,
            backups: false,
            ipv6: true,
            monitoring: true,
        }

        const createServerResponse = await fetch("https://api.digitalocean.com/v2/droplets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${doAccessToken}`,
            },
            body: JSON.stringify(doConfig),
        })

        if (!createServerResponse.ok) {
            const errorData = (await createServerResponse.json().catch(() => ({}))) as DigitalOceanErrorResponse
            const errorMessage = errorData.message ?? "DigitalOcean request failed"

            switch (createServerResponse.status) {
                case 401:
                    return NextResponse.json(
                        { ok: false, error: "DigitalOcean token is invalid or expired. Reconnect your account." },
                        { status: 401 }
                    )
                case 429:
                    return NextResponse.json(
                        { ok: false, error: "Rate limit reached on DigitalOcean. Please try again in a few minutes." },
                        { status: 429 }
                    )
                case 500:
                    return NextResponse.json(
                        { ok: false, error: "DigitalOcean server error. Please try again later." },
                        { status: 500 }
                    )
                default:
                    return NextResponse.json(
                        { ok: false, error: errorMessage, code: errorData.id ?? "Digital Ocean error" },
                        { status: createServerResponse.status }
                    )
            }
        }

        if (createServerResponse.status !== 200 && createServerResponse.status !== 202) {
            return NextResponse.json(
                { ok: false, error: `Unexpected success status from DigitalOcean: ${createServerResponse.status}` },
                { status: 500 }
            )
        }

        const data = (await createServerResponse.json()) as DropletCreationResponse
        console.log("~~SERVER DATA~~~", data)

        await db.insert(doDeployment).values({
            id: deploymentItemPrimaryId,
            deploymentId: String(data.droplet.id),
            name: serverName,
            region,
            llmProvider: payload.llmProvider,
            status: "started",
            userId: userId
        })

        const response: DeploySubmissionResponse = {
            ok: true,
        }

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected server error"
        return NextResponse.json({ ok: false, error: message }, { status: 500 })
    }
}
