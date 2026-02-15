import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { getDb } from "@/db/index";
import * as authSchema from "../db/schema/auth"

const db = await getDb()
const betterAuthSecret = getRequiredEnv("BETTER_AUTH_SECRET");

function getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const auth = betterAuth({
    appName: "Agent Daddie",
    secret: betterAuthSecret,
    baseURL: getRequiredEnv("BETTER_AUTH_URL"),
    plugins: [nextCookies()],
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
            clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
        }
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: authSchema
    })
});
