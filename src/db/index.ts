import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as authSchema from "./schema/auth";
import * as doSchema from "./schema/do-deploy";


export const getDb = cache(async () => {
  const { env } = await getCloudflareContext({ async: true });
  const connectionString = env.HYPERDRIVE.connectionString;
  const pool = new Pool({
    connectionString,
    // You don't want to reuse the same connection for multiple requests
    maxUses: 1,
  });

  return drizzle({ client: pool, schema: { ...authSchema, ...doSchema} });
});
