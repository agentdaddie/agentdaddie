"use client";

// import Image from "next/image";
import { UserProfile } from "./user-profile";
import { ConnectDigitalOcean } from "./connect-digital-ocean";
import { DeployDialog } from "./deploy-dialog";
import { useDigitalOcean } from "@/context/digital-ocean-provider";

export function Header() {
  const { isConnected } = useDigitalOcean();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) rounded-t-2xl border-b border-border z-50 backdrop-blur-2xl">
      <div className="flex flex-col w-full px-4 py-2 md:py-0 md:pt-1">
        <div className="flex flex-row items-center justify-between gap-1 pb-1">
          <div className="flex flex-row items-center justify-between  gap-2 rounded-full">
            <h1 className="text-sm briFont">agent daddie</h1>
          </div>
          <div className="flex items-center gap-4">
            {isConnected&&(
              <DeployDialog />
            )}
            <ConnectDigitalOcean />
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
