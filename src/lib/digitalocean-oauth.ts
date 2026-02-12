import { NextResponse } from "next/server";

export const DIGITALOCEAN_TOKEN_URL = "https://cloud.digitalocean.com/v1/oauth/token";
export const DIGITALOCEAN_REFRESH_URL = "https://cloud.digitalocean.com/v1/oauth/refresh";
export const DO_ACCESS_TOKEN_COOKIE = "do_oauth_access_token";
export const DO_REFRESH_TOKEN_COOKIE = "do_oauth_refresh_token";
export const DO_EXPIRES_AT_COOKIE = "do_oauth_expires_at";
export const DO_STATE_COOKIE = "do_oauth_state";

type OAuthTokenPayload = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
};

function getCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

export function setDigitalOceanTokenCookies(response: NextResponse, tokenData: OAuthTokenPayload) {
  response.cookies.set({
    name: DO_ACCESS_TOKEN_COOKIE,
    value: tokenData.access_token,
    ...getCookieOptions(tokenData.expires_in),
  });

  if (tokenData.refresh_token) {
    response.cookies.set({
      name: DO_REFRESH_TOKEN_COOKIE,
      value: tokenData.refresh_token,
      ...getCookieOptions(60 * 60 * 24 * 90),
    });
  }

  if (typeof tokenData.expires_in === "number") {
    const expiresAt = Date.now() + tokenData.expires_in * 1000;
    response.cookies.set({
      name: DO_EXPIRES_AT_COOKIE,
      value: String(expiresAt),
      ...getCookieOptions(tokenData.expires_in),
    });
  } else {
    response.cookies.delete(DO_EXPIRES_AT_COOKIE);
  }
}

export function clearDigitalOceanTokenCookies(response: NextResponse) {
  response.cookies.delete(DO_ACCESS_TOKEN_COOKIE);
  response.cookies.delete(DO_REFRESH_TOKEN_COOKIE);
  response.cookies.delete(DO_EXPIRES_AT_COOKIE);
}
