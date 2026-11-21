import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static site in out/: no server, so it can be hosted anywhere and run offline.
  output: 'export',
};

export default nextConfig;
