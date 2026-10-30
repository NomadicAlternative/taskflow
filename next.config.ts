import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this project so it does not walk up to $HOME
  // looking for a lockfile (there is a stray ~/pnpm-lock.yaml outside the repo).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
