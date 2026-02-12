import { NextRequest, NextResponse } from "next/server";
import {
  DIGITALOCEAN_REFRESH_URL,
  DO_ACCESS_TOKEN_COOKIE,
  DO_EXPIRES_AT_COOKIE,
  DO_REFRESH_TOKEN_COOKIE,
  clearDigitalOceanTokenCookies,
  setDigitalOceanTokenCookies,
} from "@/lib/digitalocean-oauth";

const EXPIRY_SKEW_MS = 30_000;

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(DO_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(DO_REFRESH_TOKEN_COOKIE)?.value;
  const expiresAtRaw = request.cookies.get(DO_EXPIRES_AT_COOKIE)?.value;
  const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : null;
  const isExpired = typeof expiresAt === "number" && Number.isFinite(expiresAt)
    ? Date.now() >= expiresAt - EXPIRY_SKEW_MS
    : false;

  if (accessToken && !isExpired) {
    return NextResponse.json({ connected: true });
  }

  if (!refreshToken) {
    const response = NextResponse.json({ connected: false });
    clearDigitalOceanTokenCookies(response);
    return response;
  }

  const clientId = process.env.DIGITALOCEAN_CLIENT_ID;
  const clientSecret = process.env.DIGITALOCEAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const response = NextResponse.json({ connected: false });
    clearDigitalOceanTokenCookies(response);
    return response;
  }

  const refreshResponse = await fetch(DIGITALOCEAN_REFRESH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!refreshResponse.ok) {
    const response = NextResponse.json({ connected: false });
    clearDigitalOceanTokenCookies(response);
    return response;
  }

  const tokenData = (await refreshResponse.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  if (!tokenData.access_token) {
    const response = NextResponse.json({ connected: false });
    clearDigitalOceanTokenCookies(response);
    return response;
  }

  const response = NextResponse.json({ connected: true });
  setDigitalOceanTokenCookies(response, {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token ?? refreshToken,
    expires_in: tokenData.expires_in,
  });
  return response;
}
