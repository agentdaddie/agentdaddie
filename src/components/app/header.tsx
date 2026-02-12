"use client";

import Link from "next/link";

// import Image from "next/image";
import { UserProfile } from "./user-profile";
import { Bubbles } from "lucide-react";
import { ConnectDigitalOcean } from "./connect-digital-ocean";
import { DeployDialog } from "./deploy-dialog";

export function Header() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) rounded-t-2xl border-b border-border z-50 backdrop-blur-2xl">
      <div className="flex flex-col w-full px-4 py-2 md:py-0 md:pt-1">
        <div className="flex flex-row items-center justify-between gap-1 pb-1">
          <div className="flex flex-row items-center justify-between  gap-2 rounded-full">
            <Link href="/">
              {/* <Image
                src="/favicon.png"
                alt="Scint Logo"
                width={30}
                height={30}
                className="size-7 rounded-full"
              /> */}
              <Bubbles/>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <DeployDialog />
            <ConnectDigitalOcean />
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
