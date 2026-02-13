"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LockKeyholeOpen } from "lucide-react";
import { useDigitalOcean } from "../../context/digital-ocean-provider";

export function ConnectDigitalOcean() {
  const { isConnected, isLoading, startConnection } = useDigitalOcean();
  const [open, setOpen] = useState(false);

  if (isLoading || isConnected) {
    return null;
  }

  return (
    <>
      <Button
        size="xs"
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="bg-blue-600/35 hover:bg-primary-900 tracking-wide ring-2 ring-primary-600 text-secondary text-xs font-medium"
      >
        <LockKeyholeOpen /> Digital Ocean
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle className="text-blue-50">
            Connect Your Digital Ocean Account
          </DialogTitle>
          <DialogDescription className="font-semibold text-muted-foreground">
            We have chosen DigitalOcean to host your application because it is
            reliable, fast, and affordable. You dont need to do anything
            technical. we will take care of all the setup work. Just connect
            your DigitalOcean account, and we will handle everything else
            automatically.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-full" onClick={startConnection}>
            Connect Digital ocean
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    </>
  );
}
