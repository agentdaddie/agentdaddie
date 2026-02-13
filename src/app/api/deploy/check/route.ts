import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { getDb } from "@/db"
import { doDeployment } from "@/db/schema/do-deploy"

import type { DeployCheckRequestBody, DeployCheckResponse } from "@/lib/type"

const tunnelUrlRegex = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/i

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as DeployCheckRequestBody
    console.log("deploy_check_payload", payload)

    const deploymentItemPrimaryId = payload.deploymentItemPrimaryId?.trim()
    const tunnelLog = payload.tunnelLog?.trim() ?? ""
    console.log(deploymentItemPrimaryId, tunnelLog)

    if (!deploymentItemPrimaryId) {
      return NextResponse.json(
        { ok: false, status: "failed", error: "deploymentItemPrimaryId is required" },
        { status: 400 }
      )
    }

    const db = await getDb()

    if (!tunnelLog) {
      const failedUpdate = await db
        .update(doDeployment)
        .set({ status: "failed", tunnelLog: "" })
        .where(eq(doDeployment.id, deploymentItemPrimaryId))
        .returning({ id: doDeployment.id })

      if (failedUpdate.length === 0) {
        return NextResponse.json(
          { ok: false, status: "failed", error: "Deployment item not found" },
          { status: 404 }
        )
      }

      const response: DeployCheckResponse = { ok: false, status: "failed" }
      return NextResponse.json(response, { status: 200 })
    }

    const tunnelUrlMatch = tunnelLog.match(tunnelUrlRegex)
    if (!tunnelUrlMatch) {
      const failedUpdate = await db
        .update(doDeployment)
        .set({ status: "failed", tunnelLog })
        .where(eq(doDeployment.id, deploymentItemPrimaryId))
        .returning({ id: doDeployment.id })

      if (failedUpdate.length === 0) {
        return NextResponse.json(
          { ok: false, status: "failed", error: "Deployment item not found" },
          { status: 404 }
        )
      }

      const response: DeployCheckResponse = { ok: false, status: "failed" }
      return NextResponse.json(response, { status: 200 })
    }

    const deployedUrl = tunnelUrlMatch[0]
    console.log("~~DEPLOY URL~~~~~", deployedUrl)
    const successUpdate = await db
      .update(doDeployment)
      .set({
        status: "success",
        deployedUrl,
        tunnelLog,
      })
      .where(eq(doDeployment.id, deploymentItemPrimaryId))
      .returning({ id: doDeployment.id })

    if (successUpdate.length === 0) {
      return NextResponse.json(
        { ok: false, status: "failed", error: "Deployment item not found" },
        { status: 404 }
      )
    }

    const response: DeployCheckResponse = { ok: true, status: "success" }
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log(error)
    const message = error instanceof Error ? error.message : "Unexpected deploy check server error"
    return NextResponse.json({ ok: false, status: "failed", error: message }, { status: 500 })
  }
}
