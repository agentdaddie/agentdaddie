import { NextRequest, NextResponse } from "next/server";
import {
  DIGITALOCEAN_TOKEN_URL,
  DO_STATE_COOKIE,
  clearDigitalOceanTokenCookies,
  setDigitalOceanTokenCookies,
} from "@/lib/digitalocean-oauth";

export async function GET(request: NextRequest) {
  const clientId = process.env.DIGITALOCEAN_CLIENT_ID;
  const clientSecret = process.env.DIGITALOCEAN_CLIENT_SECRET;
  const configuredRedirectUri = process.env.DIGITALOCEAN_REDIRECT_URI?.trim();
  const redirectUri =
    configuredRedirectUri || new URL("/api/integrations/digitalocean/callback", request.url).toString();

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/deploy?do_error=oauth_config", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const cookieState = request.cookies.get(DO_STATE_COOKIE)?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/deploy?do_error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(new URL("/deploy?do_error=invalid_oauth_state", request.url));
  }

  const tokenResponse = await fetch(DIGITALOCEAN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/deploy?do_error=token_exchange_failed", request.url));
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  if (!tokenData.access_token) {
    return NextResponse.redirect(new URL("/deploy?do_error=missing_access_token", request.url));
  }

  const response = NextResponse.redirect(new URL("/deploy?do_connected=1", request.url));
  clearDigitalOceanTokenCookies(response);
  setDigitalOceanTokenCookies(response, {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_in: tokenData.expires_in,
  });
  response.cookies.delete(DO_STATE_COOKIE);

  return response;
}
