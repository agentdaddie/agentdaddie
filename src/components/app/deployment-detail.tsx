"use client";

import { useMemo, useState, type ReactNode } from "react";
import useSWR from "swr";
import {
  Activity,
  BadgeCheck,
  CircleX,
  Copy,
  ExternalLink,
  Globe,
  Loader,
  Server,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchDeployItemById } from "@/lib/fetchers";

import type { DeployItem, DeployItemResponse } from "@/lib/type";

function getDomainFromUrl(url: string | null): string {
  if (!url) return "Pending tunnel URL";
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function formatCreatedAt(value: string | null): string {
  if (!value) return "Unknown";

  let date: Date;

  // 1. If it's ONLY time (e.g., "14:30:00"), we must tell JS it's UTC 
  // so it can calculate the offset to your local time.
  if (/^\d{2}:\d{2}/.test(value)) {
    const today = new Date().toISOString().split('T')[0]; // "2024-05-20"
    // We combine Today + Time + 'Z' to force UTC parsing
    date = new Date(`${today}T${value}${value.includes('Z') ? '' : 'Z'}`);
  } else {
    // 2. For full strings, ensure there is a 'Z' at the end if it's missing
    const utcValue = value.endsWith('Z') ? value : `${value}Z`;
    date = new Date(utcValue);
  }

  if (isNaN(date.getTime())) return "Unknown";

  // 3. This tells the browser: "Take that UTC time and show it in the user's system timezone"
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    // hourCycle: 'h12' // Uncomment if you specifically want AM/PM
  }).format(date);
}

const statusText: Record<DeployItem["status"], string> = {
  started: "Deploying",
  success: "Live",
  failed: "Failed",
};

const statusIcon: Record<DeployItem["status"], ReactNode> = {
  started: <Loader className="size-4 animate-spin text-amber-300" />,
  success: <BadgeCheck className="size-4 text-sky-300" />,
  failed: <CircleX className="size-4 text-destructive" />,
};

const providerLabel: Record<DeployItem["llmProvider"], string> = {
  openai: "Open AI",
  anthropic: "Anthropic",
  openrouter: "Open Router",
};

type DeploymentDetailProps = {
  deployment: DeployItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeploymentDetail({
  deployment,
  open,
  onOpenChange,
}: DeploymentDetailProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const detailKey =
    deployment && deployment.status === "started"
      ? `/api/deploy/${deployment.id}`
      : null;

  const { data, error, isLoading } = useSWR<DeployItemResponse>(
    detailKey,
    () => fetchDeployItemById(deployment?.id ?? ""),
    {
      refreshInterval: (latestData) =>
        latestData?.item.status === "started" ? 5000 : 0,
      fallbackData: deployment
        ? {
            ok: true,
            item: deployment,
          }
        : undefined,
      revalidateOnFocus: true,
    },
  );

  const currentDeployment = data?.item ?? deployment;
  const previewDomain = useMemo(
    () => getDomainFromUrl(currentDeployment?.deployedUrl ?? null),
    [currentDeployment?.deployedUrl],
  );
  const createdAtText = useMemo(
    () => formatCreatedAt(currentDeployment?.deployAt ?? null),
    [currentDeployment?.deployAt],
  );
  const canOpenLink =
    currentDeployment?.status === "success" &&
    Boolean(currentDeployment.deployedUrl);

  const handleCopyLink = async () => {
    if (!canOpenLink || !currentDeployment?.deployedUrl) return;
    try {
      await navigator.clipboard.writeText(currentDeployment.deployedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader className="border-b pb-3">
          <SheetTitle className="text-xl">
            {currentDeployment?.name ?? "Deployment"}
          </SheetTitle>
          <SheetDescription>
            Full deployment details and tunnel preview.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="space-y-3 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              Failed to load deployment detail.
            </div>
          ) : null}

          {!isLoading && !error && currentDeployment ? (
            <>
              <section className="rounded-lg border p-3">
                <div className="mb-3 flex items-center gap-2 text-sm">
                  {statusIcon[currentDeployment.status]}
                  <span>{statusText[currentDeployment.status]}</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Server className="size-4" />
                    <span>Region: {currentDeployment.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="size-4" />
                    <span>
                      Provider: {providerLabel[currentDeployment.llmProvider]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="size-4" />
                    <span className="truncate">Domain: {previewDomain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Created: {createdAtText}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border p-3">
                <p className="mb-2 text-sm font-medium">URL Preview</p>
                <div className="rounded-md border bg-muted/40 p-2 text-sm text-muted-foreground">
                  {currentDeployment.deployedUrl ?? "URL is not available yet"}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCopyLink}
                    disabled={!canOpenLink}
                  >
                    <Copy className="size-4" />
                    {copied ? "Copied" : "Copy Link"}
                  </Button>
                  <Button
                    asChild
                    type="button"
                    size="sm"
                    disabled={!canOpenLink}
                  >
                    <a
                      href={currentDeployment.deployedUrl ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="size-4" />
                      Open
                    </a>
                  </Button>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
