import type { NextConfig } from "next";

const tunnelOrigin = process.env.NEXT_ALLOWED_DEV_ORIGIN;

const nextConfig: NextConfig = {
  allowedDevOrigins: tunnelOrigin
    ? [tunnelOrigin]
    : ["https://45dc-103-70-80-93.ngrok-free.app"],
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
