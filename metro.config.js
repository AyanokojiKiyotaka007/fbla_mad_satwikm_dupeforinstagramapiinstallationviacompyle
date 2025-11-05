const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Keep package exports disabled for other packages
config.resolver.unstable_enablePackageExports = false;

// Add mjs and cjs to source extensions
config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'mjs',
  'cjs',
];

// Store the original resolver
const originalResolveRequest = config.resolver.resolveRequest;

// Custom resolver to handle @vercel/oidc
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @vercel/oidc resolution - use browser version for React Native
  if (moduleName === '@vercel/oidc') {
    const oidcPath = path.resolve(__dirname, 'node_modules/@vercel/oidc/dist/index-browser.js');
    return {
      filePath: oidcPath,
      type: 'sourceFile',
    };
  }

  // Use the original resolver for all other modules
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  // Fallback to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

// Add explicit node module paths
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

module.exports = wrapWithReanimatedMetroConfig(config);