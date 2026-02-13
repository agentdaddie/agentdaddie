CREATE TYPE "public"."deployment_status" AS ENUM('started', 'failed', 'success');--> statement-breakpoint
CREATE TYPE "public"."llm_provider" AS ENUM('openai', 'openrouter', 'anthropic');--> statement-breakpoint
CREATE TABLE "do_deployment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deployment_id" text NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"llm" "llm_provider" NOT NULL,
	"status" "deployment_status" NOT NULL,
	"created_at" time DEFAULT now(),
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "do_deployment" ADD CONSTRAINT "do_deployment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;