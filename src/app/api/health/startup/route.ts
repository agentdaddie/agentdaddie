import { NextResponse } from "next/server";

interface EnvCheckResult {
  key: string;
  present: boolean;
}

const REQUIRED_ENV_KEYS: string[] = [
  "BETTER_AUTH_URL",
  "BETTER_AUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];

function checkRequiredEnv(keys: string[]): EnvCheckResult[] {
  return keys.map((key) => ({
    key,
    present: Boolean(process.env[key]),
  }));
}

export async function GET() {
  const checks = checkRequiredEnv(REQUIRED_ENV_KEYS);
  const missing = checks.filter((item) => !item.present).map((item) => item.key);
  const ok = missing.length === 0;

  return NextResponse.json(
    {
      ok,
      missing,
      checkedKeys: REQUIRED_ENV_KEYS,
      checkedAt: new Date().toISOString(),
    },
    {
      status: ok ? 200 : 500,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
