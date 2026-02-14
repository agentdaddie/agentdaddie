"use client";

import { useMemo, useState, type ReactNode } from "react";
import useSWR from "swr";
import { BadgeCheck, CircleDot, CircleX, CloudUpload, Loader, Server } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Skeleton } from "@/components/ui/skeleton";
import { DeploymentDetail } from "@/components/app/deployment-detail";
import { fetchDeployItems } from "@/lib/fetchers";

import type { DeployItem, DeployItemsResponse } from "@/lib/type";
import { useDigitalOcean } from "@/context/digital-ocean-provider";

function EmptyState() {
  const {isConnected} = useDigitalOcean()

  const emptyContent = !isConnected?(
    "Connect your Digital Ocean account for quick, easy and secure deployment of Open Claw on your own personal server in just a few clicks."
  ):(
    "You’re all set! Deploy Open Claw on your server in just a few clicks."
  )
  return (
    <Empty>
      <EmptyHeader className="py-32 md:py-24">
        <EmptyMedia variant="icon">
          {!isConnected?<Server/>:<CloudUpload/>}
        </EmptyMedia>
        <EmptyTitle className="font-semibold tracking-tight text-base-50">No Claw Is Deployed Yet</EmptyTitle>
        <EmptyDescription className="font-semibold text-muted-foreground tracking-wide">
          {emptyContent}
        </EmptyDescription>
        {isConnected&&(
          <EmptyContent className="text-xs text-secondary font-[550] tracking-wide'">
            We never store or access your API keys or tokens. All data stays securely on your own server, fully under your control.
          </EmptyContent>
        )}
      </EmptyHeader>
    </Empty>
  );
}
const statusIcons: Record<DeployItem["status"], ReactNode> = {
  started: <Loader className="size-4 animate-spin text-amber-300" />,
  success: <BadgeCheck className="size-4 text-sky-300" />,
  failed: <CircleX className="size-4 text-destructive" />,
};

const providerLabel: Record<DeployItem["llmProvider"], string> = {
  openrouter: "Open Router",
  openai: "Open AI",
  anthropic: "Anthropic",
};

function getRelativeTime(value: Date | null): string {
  if (!value) return "just now";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) return "just now";

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) return "just now"; // Future date

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs >= day) return `${Math.floor(diffMs / day)}d ago`;
  if (diffMs >= hour) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs >= minute) return `${Math.floor(diffMs / minute)}m ago`;
  return "just now";
}

type DeploymentCardProps = {
  item: DeployItem;
  onOpenDetail: (item: DeployItem) => void;
};

function DeploymentCard({ item, onOpenDetail }: DeploymentCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail(item);
        }
      }}
      className="group w-full overflow-hidden rounded-xl border border-border bg-accent/15 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-colors hover:border-base-600"
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-2xl font-medium tracking-tight text-base-100">
            {item.name}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 md:gap-12">
          {statusIcons[item.status]}
          <span className="text-xs text-base-400">
            {getRelativeTime(item.deployAt)}
          </span>
        </div>
      </div>

      <div className="border-t border-base-800/80 px-5 py-3">
        <div className="grid grid-cols-2 gap-3 text-base-300 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <Server className="size-4 text-base-400" />
            <span className="truncate text-sm">{item.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDot className="size-4 text-base-400" />
            <span className="truncate text-sm">
              {providerLabel[item.llmProvider]}
            </span>
          </div>
          <div />
          <div className="flex items-center justify-end">
            <span className="hidden rounded-md bg-accent/50 px-2 py-1 text-xs font-[550] tracking-wider sm:block">
              View more
            </span>
          </div>
        </div>
        <div className="right-0 flex w-full items-center gap-2 mt-0.5">
          <span className="w-full rounded-md border bg-accent/50 px-3 py-1.5 text-center text-sm sm:hidden">
            View more
          </span>
        </div>
      </div>
    </article>
  );
}

function LoadingCards() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`deploy-skeleton-${index}`}
          className="overflow-hidden rounded-2xl border border-base-800 bg-base-950/60"
        >
          <div className="space-y-3 px-5 py-4">
            <Skeleton className="h-7 w-40 bg-base-800" />
            <Skeleton className="h-5 w-72 bg-base-800" />
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-base-800 px-5 py-3 md:grid-cols-4">
            <Skeleton className="h-4 w-24 bg-base-800" />
            <Skeleton className="h-4 w-20 bg-base-800" />
            <Skeleton className="h-4 w-28 bg-base-800" />
            <Skeleton className="h-4 w-16 bg-base-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Deploy() {
  const [selectedDeployment, setSelectedDeployment] =
    useState<DeployItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const { data, error, isLoading } = useSWR<DeployItemsResponse>(
    "/api/deploy",
    fetchDeployItems,
    {
      refreshInterval: (latestData) =>
        latestData?.items.some((item) => item.status === "started") ? 5000 : 0,
    },
  );

  const totalClaws = useMemo(
    () => (data?.items.length ?? 0).toString(),
    [data?.items.length],
  );

  const handleOpenDetail = (item: DeployItem) => {
    setSelectedDeployment(item);
    setIsSheetOpen(true);
  };

  if(!isLoading && !error && data && data.items.length === 0){
    return (
      <EmptyState/>
    )
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl px-3 pb-10 sm:px-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-base-100">
          Deployments
        </h1>
        <p className="text-sm font-semibold text-base-400">
          {totalClaws} Claws
        </p>
      </div>

      {isLoading ? <LoadingCards /> : null}

      {!isLoading && error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          Failed to load deployments. Please refresh.
        </div>
      ) : null}


      {!isLoading && !error && data && data.items.length > 0 ? (
        <div className="space-y-4">
          {data.items.map((item) => (
            <DeploymentCard
              key={item.id}
              item={item}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </div>
      ) : null}

      <DeploymentDetail
        deployment={selectedDeployment}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
