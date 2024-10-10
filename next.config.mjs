/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    /**
     * Linting and building will be done in separate steps in the build
     * pipeline, so it's preferable to know whether each step passes independent
     * of the other.
     */
    ignoreDuringBuilds: true,
  },
  typescript: {
    /**
     * Typechecking and building will be done in separate steps in the build
     * pipeline, so it's preferable to know whether each step passes independent
     * of the other.
     */
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
};

export default nextConfig;
