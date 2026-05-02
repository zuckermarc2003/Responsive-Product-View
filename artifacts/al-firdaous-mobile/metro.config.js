const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
// pnpm monorepo workspace root (two levels up from artifacts/al-firdaous-mobile)
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch the whole workspace so Metro can see packages in the pnpm store
config.watchFolders = [workspaceRoot];

// Tell the resolver where to find node_modules in both the app dir and the workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// pnpm stores packages as symlinks — Metro must follow them
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
