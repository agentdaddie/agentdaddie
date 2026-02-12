"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type DigitalOceanContextValue = {
  isConnected: boolean;
  isLoading: boolean;
  startConnection: () => void;
  refreshConnection: () => Promise<void>;
};

const DigitalOceanContext = createContext<DigitalOceanContextValue | null>(null);

export function DigitalOceanProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshConnection = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/integrations/digitalocean/status", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setIsConnected(false);
        return;
      }

      const data = (await response.json()) as { connected?: boolean };
      setIsConnected(Boolean(data.connected));
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshConnection();
  }, [refreshConnection]);

  const startConnection = useCallback(() => {
    window.location.assign("/api/integrations/digitalocean/connect");
  }, []);

  const value = useMemo(
    () => ({
      isConnected,
      isLoading,
      startConnection,
      refreshConnection,
    }),
    [isConnected, isLoading, startConnection, refreshConnection],
  );

  return <DigitalOceanContext.Provider value={value}>{children}</DigitalOceanContext.Provider>;
}

export function useDigitalOcean() {
  const context = useContext(DigitalOceanContext);
  if (!context) {
    throw new Error("useDigitalOcean must be used within a DigitalOceanProvider");
  }

  return context;
}
