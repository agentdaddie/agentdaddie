export interface DeployRegion {
  id: string
  name: string
  flag: string
}

export interface DeployDialogFormValues {
  regionId: string
  password: string
  llmProvider: "openai" | "claude" | "openrouter" | ""
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
