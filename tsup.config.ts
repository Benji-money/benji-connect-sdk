import { defineConfig } from 'tsup';
import pkg from './package.json' assert { type: 'json' };

// get namespace from custom field with a fallback
const namespace = (pkg as any).benji?.namespace ?? 'benji-connect-sdk';

export default defineConfig([
  // ESM + CJS library build (for imports: ESM & require: CJS)
  {
    entry: { index: 'src/index.ts' },     // or .js if you’re JS-only
    format: ['esm', 'cjs'],
    dts: true,                                 // emits dist/index.d.ts, set false if JS-only
    sourcemap: true,
    clean: true,
    target: 'es2019',
    define: {
      __VERSION__: JSON.stringify(pkg.version),
      __NAMESPACE__: JSON.stringify(namespace)
    }
  },
  // UMD/IIFE build (for <script> usage: window.ConnectSDK)
  {
    entry: { 'connect-sdk.umd': 'src/global.ts' },
    format: ['iife'],
    globalName: 'ConnectSDK',
    sourcemap: true,
    clean: false,
    target: 'es2019',
    define: {
      __VERSION__: JSON.stringify(pkg.version),
      __NAMESPACE__: JSON.stringify(namespace)
    }
  }
]);
