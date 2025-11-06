// Polyfills for AI SDK on React Native
// This file must be imported early in index.ts

// Only setup polyfills on native platforms
if (typeof window !== 'undefined' && !window.TextEncoderStream) {
  // Defer polyfill setup to avoid Babel runtime issues
  setTimeout(() => {
    try {
      const { Platform } = require('react-native');
      
      if (Platform.OS !== 'web') {
        const structuredClone = require('@ungap/structured-clone');
        const { polyfillGlobal } = require('react-native/Libraries/Utilities/PolyfillFunctions');
        const { TextEncoderStream, TextDecoderStream } = require('@stardazed/streams-text-encoding');

        if (!global.structuredClone) {
          polyfillGlobal('structuredClone', () => structuredClone);
        }

        polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
        polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
      }
    } catch (error) {
      console.warn('Polyfill setup skipped:', error.message);
    }
  }, 0);
}

export {};