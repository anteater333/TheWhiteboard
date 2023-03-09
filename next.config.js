const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  sassOptions: {
    includesPaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;
