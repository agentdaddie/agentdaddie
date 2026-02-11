/**
 * Modify this file according to your needs
 * ssl, no ssl url etc..
 * Hperdrive from cloudflare only support ssl/tsl connections
*/
const prod = false;

import { defineConfig } from "drizzle-kit";


const localConfig = {
  url: process.env.LOCAL_DB_URL!
};

export const prodConfig = {
  user: process.env.PROD_DB_USER!,
  password: process.env.PROD_DB_PASSWORD!,
  host: process.env.PROD_DB_HOST!,
  port: parseInt(process.env.PROD_DB_PORT!),
  database: process.env.PROD_DB_DATABASE!,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.PROD_DB_CA!,
  },
};

export default defineConfig({
  out: "./src/db/migration",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: prod ? prodConfig : localConfig,
});