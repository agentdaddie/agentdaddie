import { NextRequest, NextResponse } from "next/server"

import type { DeployDialogFormValues, DeploySubmissionResponse } from "@/lib/type"

function toSingleQuotedShellValue(value: string): string {
    return `'${value.replace(/'/g, `'\"'\"'`)}'`
}

export async function POST(request: NextRequest) {
    const accessToken = request.cookies.get("do_oauth_access_token")?.value

    if (!accessToken) {
        return NextResponse.json({ error: "Not connected" }, { status: 401 })
    }

    const payload = (await request.json()) as DeployDialogFormValues
    console.log("deploy_payload", payload)

    const apiKeyLine =
        payload.llmProvider === "openai"
            ? `OPENAI_API_KEY=${payload.apiKey}`
            : payload.llmProvider === "claude"
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

const userData = `#!/bin/bash
set -euxo pipefail
exec > >(tee -a /var/log/user-data.log) 2>&1

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl git wget

cd /root
rm -rf openclaw
git clone https://github.com/agentdaddie/openclaw.git
cd openclaw

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

curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

docker compose version || apt-get install -y docker-compose-plugin
docker compose up -d

wget -O /tmp/cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i /tmp/cloudflared.deb
nohup cloudflared tunnel --url http://localhost:8888 > /root/tunnel.log 2>&1 &
`;


    const doConfig = {
        name: "agentdaddie-droplet",
        region: regionMap[payload.regionId] ?? "blr1",
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
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(doConfig),
    })

    const data = await createServerResponse.json()
    console.log("~~SERVER DATA~~~", data)

    if (!createServerResponse.ok) {
        return NextResponse.json({ ok: false, error: data }, { status: createServerResponse.status })
    }

    const response: DeploySubmissionResponse = {
        ok: true,
    }

    return NextResponse.json(response, { status: 200 })
}
