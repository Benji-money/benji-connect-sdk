// These are compile-time constants replaced by tsup's `define` option.
// Declaring them globally prevents TypeScript errors.
export {};

declare global {
  const __VERSION__: string;
  const __NAMESPACE__: string;

  // Global browser exposure for UMD builds 
  interface Window {
    // SDK main class (UMD builds attach this)
    ConnectSDK?: any;
  }
}