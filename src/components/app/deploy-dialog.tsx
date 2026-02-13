"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Plus, Send } from "lucide-react"
import useSWRMutation from "swr/mutation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { submitDeployConfiguration } from "@/lib/fetchers"
import { cn } from "@/lib/utils"
import type {
  DeployDialogFormValues,
  DeployDialogScreen,
  DeployRegion,
  DeploySubmissionResponse,
} from "@/lib/type"

const deployRegions: DeployRegion[] = [
  { id: "new-york", name: "New York", flag: "🇺🇸" },
  { id: "san-francisco", name: "San Francisco", flag: "🇺🇸" },
  { id: "amsterdam", name: "Amsterdam", flag: "🇳🇱" },
  { id: "singapore", name: "Singapore", flag: "🇸🇬" },
  { id: "london", name: "London", flag: "🇬🇧" },
  { id: "frankfurt", name: "Frankfurt", flag: "🇩🇪" },
  { id: "toronto", name: "Toronto", flag: "🇨🇦" },
  { id: "bangalore", name: "Bangalore", flag: "🇮🇳" },
  { id: "sydney", name: "Sydney", flag: "🇦🇺" },
  { id: "atlanta", name: "Atlanta", flag: "🇺🇸" },
]

const deployDialogScreens: DeployDialogScreen[] = [
  {
    id: "region",
    title: "Deploy Configuration",
    description: "Select region which is closer to you.",
  },
  {
    id: "llm",
    title: "LLM Configuration",
    description: "Select one model provider and add its API key.",
  },
  {
    id: "telegram",
    title: "Connect Telegram",
    description: "How to get your Telegram bot token.",
  },
  {
    id: "openclaw-auth",
    title: "Open Claw Auth Setup",
    description: "Set up access values for your deployed Open Claw.",
  },
  {
    id: "confirm",
    title: "Confirm Deployment",
    description:
      "It will take some time. After deployment, you will get your OpenClaw URL, dashboard, and access guide in dashboard.",
  },
]

const llmProviders: Array<{ id: "openai" | "anthropic" | "openrouter"; label: string }> = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "openrouter", label: "Open Router" },
]

export function DeployDialog() {
  const [open, setOpen] = useState<boolean>(false)
  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(0)
  const [submitError, setSubmitError] = useState<string>("")

  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeployDialogFormValues>({
    defaultValues: {
      regionId: "",
      llmProvider: "",
      apiKey: "",
      telegramBotToken: "",
      openClawAuthPassword: "",
      openClawAuthUsername: "",
      openClawGatewayId: "",
    },
  })

  const selectedRegionId = watch("regionId")
  const selectedLlmProvider = watch("llmProvider")
  const activeScreen = deployDialogScreens[currentScreenIndex]
  const totalScreens = deployDialogScreens.length
  const isLastScreen = currentScreenIndex === deployDialogScreens.length - 1
  const { trigger: triggerDeploy, isMutating: isSubmittingDeploy } =
    useSWRMutation<
      DeploySubmissionResponse,
      Error,
      string,
      DeployDialogFormValues
    >("/api/deploy", async (_key, { arg }) => submitDeployConfiguration(arg))

  const onSubmit = async (values: DeployDialogFormValues) => {
    setSubmitError("")

    try {
      const response = await triggerDeploy(values)
      console.log(response)
      if (!response.ok) {
        setSubmitError("Unable to create deployment. Please try again.")
        return
      }

      setOpen(false)
      setCurrentScreenIndex(0)
      reset()
    } catch {
      setSubmitError("Unable to create deployment. Please try again.")
    }
  }
  const submitDeployment = handleSubmit(onSubmit)

  const handleNextScreen = async () => {
    const currentScreenId = activeScreen.id
    let isValid = false

    if (currentScreenId === "region") {
      isValid = await trigger(["regionId"])
    } else if (currentScreenId === "llm") {
      isValid = await trigger(["llmProvider", "apiKey"])
    } else if (currentScreenId === "telegram") {
      isValid = await trigger("telegramBotToken")
    } else if (currentScreenId === "openclaw-auth") {
      isValid = await trigger([
        "openClawAuthPassword",
        "openClawAuthUsername",
        "openClawGatewayId",
      ])
    }

    if (isValid) {
      setCurrentScreenIndex((previousIndex) => previousIndex + 1)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setCurrentScreenIndex(0)
      setSubmitError("")
      reset()
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="rounded-full text-teal-300 hover:text-teal-400 text-xs font-[550] tracking-wider"
      >
       <Plus/> Deploy Claw
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
          <DialogHeader className="text-left">
            <DialogTitle>{activeScreen.title}</DialogTitle>
            <DialogDescription className="">{activeScreen.description}</DialogDescription>
            <p className="text-xs text-muted-foreground font-semibold">
              Step {currentScreenIndex + 1} of {totalScreens}
            </p>
          </DialogHeader>

          <input
            type="hidden"
            {...register("regionId", { required: "Region is required" })}
          />
          <input
            type="hidden"
            {...register("llmProvider", {
              required: "Model provider is required",
            })}
          />

          {deployDialogScreens.map((screen, index) =>
            index === currentScreenIndex && screen.id === "region" ? (
              <div key={screen.id} className="space-y-4">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3 py-1">
                  {deployRegions.map((region) => {
                    const isSelected = selectedRegionId === region.id

                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() =>
                          setValue("regionId", region.id, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          "flex h-9 items-center gap-3 rounded-full border px-3 text-left text-sm transition-colors",
                          isSelected
                            ? "ring ring-secondary bg-accent text-secondary"
                            : "border-border hover:bg-accent/60"
                        )}
                      >
                        <span className="text-xl">{region.flag}</span>
                        <span>{region.name}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.regionId ? (
                  <p className="text-sm text-destructive">
                    {errors.regionId.message}
                  </p>
                ) : null}
              </div>
            ) : index === currentScreenIndex && screen.id === "llm" ? (
              <div key={screen.id} className="space-y-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 py-0.5">
                  {llmProviders.map((provider) => {
                    const isSelected = selectedLlmProvider === provider.id

                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() =>
                          setValue("llmProvider", provider.id, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          "flex h-9 items-center justify-center rounded-full border px-3 text-sm transition-colors",
                          isSelected
                            ? "ring ring-secondary bg-accent text-secondary"
                            : "border-border hover:bg-accent/60"
                        )}
                      >
                        {provider.label}
                      </button>
                    )
                  })}
                </div>
                {errors.llmProvider ? (
                  <p className="text-xs text-destructive">
                    {errors.llmProvider.message}
                  </p>
                ) : null}
                {selectedLlmProvider ? (
                  <div className="space-y-2">
                    <label htmlFor="apiKey" className="text-sm font-medium">
                      API Key
                    </label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter API key"
                      {...register("apiKey", {
                        required: "API key is required",
                      })}
                      aria-invalid={errors.apiKey ? "true" : "false"}
                    />
                    {errors.apiKey ? (
                      <p className="text-xs text-destructive">
                        {errors.apiKey.message}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a model provider to show API key input.
                  </p>
                )}
              </div>
            ) : index === currentScreenIndex && screen.id === "telegram" ? (
              <div key={screen.id} className="space-y-4">
                <div className="rounded-md border bg-muted/30 p-4">
                  <div className="mb-4 flex items-center gap-2 text-base font-semibold">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white">
                      <Send className="h-3.5 w-3.5" />
                    </span>
                    <span>Connect Telegram</span>
                  </div>
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                    <li>
                      Open Telegram and go to <span className="font-medium">@BotFather</span>.
                    </li>
                    <li>
                      Start chat and type{" "}
                      <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                        /newbot
                      </code>.
                    </li>
                    <li>Follow prompts to set bot name and username.</li>
                    <li>Copy the full token BotFather gives you.</li>
                    <li>Paste token below and continue.</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <label htmlFor="telegramBotToken" className="text-sm font-medium">
                    Enter bot token
                  </label>
                  <Input
                    id="telegramBotToken"
                    placeholder="1234567890:ABCdef..."
                    {...register("telegramBotToken", {
                      required: "Telegram bot token is required",
                    })}
                    aria-invalid={errors.telegramBotToken ? "true" : "false"}
                  />
                  {errors.telegramBotToken ? (
                    <p className="text-xs text-destructive">
                      {errors.telegramBotToken.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : index === currentScreenIndex && screen.id === "openclaw-auth" ? (
              <div key={screen.id} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="openClawAuthPassword"
                    className="text-sm font-medium"
                  >
                    OpenClaw Auth Password
                  </label>
                  <Input
                    id="openClawAuthPassword"
                    type="password"
                    placeholder="Enter auth password"
                    {...register("openClawAuthPassword", {
                      required: "OpenClaw auth password is required",
                    })}
                    aria-invalid={errors.openClawAuthPassword ? "true" : "false"}
                  />
                  {errors.openClawAuthPassword ? (
                    <p className="text-xs text-destructive">
                      {errors.openClawAuthPassword.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="openClawAuthUsername"
                    className="text-sm font-medium"
                  >
                    OpenClaw Auth Username
                  </label>
                  <Input
                    id="openClawAuthUsername"
                    placeholder="Enter auth username"
                    {...register("openClawAuthUsername", {
                      required: "Open Claw auth username is required",
                    })}
                    aria-invalid={errors.openClawAuthUsername ? "true" : "false"}
                  />
                  {errors.openClawAuthUsername ? (
                    <p className="text-xs text-destructive">
                      {errors.openClawAuthUsername.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor="openClawGatewayId" className="text-sm font-medium">
                    OpenClaw Gateway ID (Random string) 
                  </label>
                  <Input
                    id="openClawGatewayId"
                    placeholder="Enter some random string (65d9f8aa-d3cb-427d-958d-56c262117e67)"
                    {...register("openClawGatewayId", {
                      required: "OpenClaw gateway ID is required",
                    })}
                    aria-invalid={errors.openClawGatewayId ? "true" : "false"}
                  />
                  {errors.openClawGatewayId ? (
                    <p className="text-xs text-destructive">
                      {errors.openClawGatewayId.message}
                    </p>
                  ) : null}
                </div>

                <p className="text-sm text-secondary">
                  Save these somewhere because you will need them to access your
                  deployed Open Claw.
                </p>
              </div>
            ) : index === currentScreenIndex && screen.id === "confirm" ? (
              <div key={screen.id} className="space-y-3 rounded-md border p-4 text-sm text-muted-foreground">
                <p>Confirm deployment to start provisioning.</p>
                <p>
                 It will take some time. After deployment is successful (around 5–10 minutes), you will receive your Open Claw URL on the dashboard along with an access guide via your Telegram.
                </p>
              </div>
            ) : null
          )}

          {submitError ? (
            <p className="text-xs text-destructive" role="alert" aria-live="polite">
              {submitError}
            </p>
          ) : null}

          <DialogFooter>
            {currentScreenIndex === 0 ? (
              <Button
                type="button"
                variant={"outline"}
                size={"sm"}
                className=""
                onClick={handleNextScreen}
                disabled={isSubmittingDeploy}
              >
                Move Forward
              </Button>
            ) : isLastScreen ? (
              <div className="flex w-full justify-between gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size={"sm"}
                  disabled={isSubmittingDeploy}
                  onClick={() =>
                    setCurrentScreenIndex((previousIndex) => previousIndex - 1)
                  }
                  className="bg-accent/35"

                >
                  Back
                </Button>
                <Button
                  size={"sm"}
                  type="button"
                  onClick={() => void submitDeployment()}
                  disabled={isSubmittingDeploy}
                >
                  {isSubmittingDeploy ? "Deploying..." : "Confirm Deployment"}
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-between gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size={"sm"}
                  disabled={isSubmittingDeploy}
                  onClick={() =>
                    setCurrentScreenIndex((previousIndex) => previousIndex - 1)
                  }
                  className="bg-accent/35"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  onClick={handleNextScreen}
                  disabled={isSubmittingDeploy}
                >
                  Move Forward
                </Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
      </Dialog>
    </>
  )
}
