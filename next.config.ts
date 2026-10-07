import type { NextConfig } from "next";
import { execSync } from "node:child_process";

function git(cmd: string, fallback: string) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || fallback;
  } catch {
    return fallback;
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_REV: git("git rev-list --count HEAD", "1"),
    NEXT_PUBLIC_SHA: git("git rev-parse --short HEAD", "dev"),
    NEXT_PUBLIC_BUILT: new Date().toISOString(),
  },
};

export default nextConfig;
