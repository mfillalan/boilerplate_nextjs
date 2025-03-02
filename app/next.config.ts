/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config: {
      watchOptions: {
        poll: number; // Check for changes every 300ms
        aggregateTimeout: number; // Wait 300ms after a change to bundle
      };
    }, { isServer }: any) => {
    // Only apply to client-side Webpack config
    if (!isServer) {
      config.watchOptions = {
        poll: 300,           // Check for changes every 300ms
        aggregateTimeout: 300 // Wait 300ms after a change to bundle
      };
    }
    return config;
  },
};