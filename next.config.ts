import type { NextConfig } from "next";

const tunnelOrigin = process.env.DEPLOYMENT_CHECK!;
const isDevEnv = process.env.ENV === "DEV";

const nextConfig: NextConfig = isDevEnv
  ? {
      allowedDevOrigins: [tunnelOrigin],
    }
  : {};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (isDevEnv) {
  initOpenNextCloudflareForDev();
}
