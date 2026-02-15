import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as authSchema from "./schema/auth";
import * as doSchema from "./schema/do-deploy";


export const getDb = cache(async () => {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const connectionString = env.HYPERDRIVE.connectionString;
    const client = new Client({
      connectionString,
    });
    await client.connect();

    return drizzle({ client, schema: { ...authSchema, ...doSchema } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database initialization failed";
    throw new Error(`Failed to initialize database client: ${message}`);
  }
});
