import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { getDb } from "@/db"
import { doDeployment } from "@/db/schema/do-deploy"

import type { DeployItemResponse } from "@/lib/type"

function normalizeDeployAtToIso(value: string | null): string | null {
  if (!value) return null
  const timeOnlyPattern = /^\d{2}:\d{2}:\d{2}(?:\.\d+)?$/
  if (timeOnlyPattern.test(value)) {
    return value
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }

  return null
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id: deploymentPrimaryId } = await context.params
    if (!deploymentPrimaryId) {
      return NextResponse.json({ ok: false, error: "Deployment id is required" }, { status: 400 })
    }

    const db = await getDb()
    const item = await db.query.doDeployment.findFirst({
      where: and(
        eq(doDeployment.id, deploymentPrimaryId),
        eq(doDeployment.userId, session.user.id)
      ),
    })

    if (!item) {
      return NextResponse.json({ ok: false, error: "Deployment not found" }, { status: 404 })
    }

    const response: DeployItemResponse = {
      ok: true,
      item: {
        ...item,
        deployAt: normalizeDeployAtToIso(item.deployAt),
      },
    }
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
