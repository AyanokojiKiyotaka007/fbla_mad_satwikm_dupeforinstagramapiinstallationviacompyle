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

// Custom resolver to handle @vercel/oidc and other problematic modules
const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Resolve @vercel/oidc to the browser/react-native version
  if (moduleName === '@vercel/oidc') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/@vercel/oidc/dist/index-browser.js'),
      type: 'sourceFile',
    };
  }
  
  // Use default resolver for everything else
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = wrapWithReanimatedMetroConfig(config);