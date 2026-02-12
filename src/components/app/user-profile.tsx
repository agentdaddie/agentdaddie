import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserRoundPen } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDigitalOcean } from "../../context/digital-ocean-provider";

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();
  const { isConnected } = useDigitalOcean();

  if (isPending)
    return <div className="size-8 rounded-full bg-base-200 animate-pulse" />;

  if (!session) return null;

  const user = {
    name: session?.user.name,
    email: session?.user.email,
    avatar: session?.user.image ?? "", // Fallback to empty string if no image
    id: session?.user.id,
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.replace("/");
      console.log("logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-row items-center gap-3 md:gap-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="shadow-none ring-0 border-0 outline-0"
        >
          <button className="p-2 rounded-full bg-accent shadow-none">
            <UserRoundPen className="size-4 md:size-3" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-56 rounded-lg mt-2 border"
        >
          <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-[14px]">
              <AvatarImage src={user.avatar} alt={user.name || "User"} />
              <AvatarFallback className="rounded-[13px]">
                {user.name?.slice(0, 2).toUpperCase() || "SI"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
              {isConnected ? (
                <span className="text-emerald-400 text-xs">
                  Digital Ocean (connected)
                </span>
              ) : null}
            </div>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-xs tracking-wider font-medium border  focus:bg-accent cursor-pointer"
          >
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
