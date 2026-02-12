import { NextRequest, NextResponse } from "next/server";
import { DO_STATE_COOKIE } from "@/lib/digitalocean-oauth";

const AUTH_URL = "https://cloud.digitalocean.com/v1/oauth/authorize";

export async function GET(request: NextRequest) {
  const clientId = process.env.DIGITALOCEAN_CLIENT_ID;
  const configuredRedirectUri = process.env.DIGITALOCEAN_REDIRECT_URI?.trim();
  const redirectUri =
    configuredRedirectUri || new URL("/api/integrations/digitalocean/callback", request.url).toString();
  const scope = process.env.DIGITALOCEAN_OAUTH_SCOPE ?? "read write";

  if (!clientId) {
    return NextResponse.redirect(new URL("/deploy?do_error=oauth_config", request.url));
  }

  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state,
  });

  const response = NextResponse.redirect(`${AUTH_URL}?${params.toString()}`);

  response.cookies.set({
    name: DO_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
