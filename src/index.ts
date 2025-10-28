// Import the default export from connect-sdk.ts
import ConnectSDK from './connect-sdk';

// Re-export both default and a named export so consumers can do either:
//   import ConnectSDK from '...'
//   import { ConnectSDK } from '...'
// Also provide a default export (optional but helpful for JS users)
export default ConnectSDK;
export { ConnectSDK };

// (Optional) bubble up public types
export * from './types';