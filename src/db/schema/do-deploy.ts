// Digital Ocean Deployment Schema
import { pgTable, text, time, uuid, pgEnum} from "drizzle-orm/pg-core"
import { user } from "./auth"

export const llmProviderEnum = pgEnum('llm_provider', ['openai', 'openrouter', 'anthropic']);
export const deploymentStatusEnum = pgEnum("deployment_status", ['started', 'failed', 'success'])


export const doDeployment = pgTable("do_deployment", {
  id: uuid("id").defaultRandom().primaryKey(),
  deploymentId: text("deployment_id").notNull(), //we will get this just after do server deployment // it should be number but we alreading usijg text so not gonna change it so in server useParseInt
  name: text("name").notNull().notNull(), //server name 
  region: text("region").notNull().notNull(),
  llmProvider: llmProviderEnum("llm").notNull(),
  status: deploymentStatusEnum("status").notNull(),
  deployedUrl: text("deployed_url"), // if status success then tehre will the the deployedUrl
  tunnelLog: text("tunnel_log"),
  createdAt: time("created_at").defaultNow(),
  userId: text("user_id").notNull().references(()=>user.id, { onDelete: "cascade" })
});
