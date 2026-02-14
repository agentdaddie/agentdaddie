export interface DeployRegion {
  id: string
  name: string
  flag: string
}

export interface DeployDialogFormValues {
  regionId: string
  llmProvider: "openai" | "anthropic" | "openrouter" | ""
  apiKey: string
  telegramBotToken: string
  openClawAuthPassword: string
  openClawAuthUsername: string
  openClawGatewayId: string
}

export interface DeployDialogScreen {
  id: "region" | "llm" | "telegram" | "openclaw-auth" | "confirm"
  title: string
  description: string
}

export interface DeploySubmissionResponse {
  ok: boolean
}

export interface DropletCreationResponse {
  droplet: {
    id: number;
  };
};

export interface DigitalOceanErrorResponse {
  message?: string
  id?: string
}

export interface DeployCheckRequestBody {
  deploymentItemPrimaryId: string
  tunnelLog: string
}

export interface DeployCheckResponse {
  ok: boolean
  status: "failed" | "success"
}

export interface DeployItem {
  id: string
  deploymentId: string
  name: string
  region: string
  llmProvider: "openai" | "anthropic" | "openrouter"
  status: "started" | "failed" | "success"
  deployedUrl: string | null
  tunnelLog: string | null
  deployAt: string | null
  userId: string
}

export interface DeployItemsResponse {
  ok: boolean
  items: DeployItem[]
}

export interface DeployItemResponse {
  ok: boolean
  item: DeployItem
}
