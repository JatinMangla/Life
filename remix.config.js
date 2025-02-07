/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
    appDirectory: "app",
    assetsBuildDirectory: "public/build",
    serverBuildDirectory: "build",
    publicPath: "/build/",
    serverBuildTarget: "vercel", // <-- This tells Remix to build for Vercel
  };
  