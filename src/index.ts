// Import the default export from connect-sdk.ts
import ConnectSDK from './connect-sdk';
import { BenjiConnectEventType } from './types/event';

// Re-export both default and a named export so consumers can do either:
//   import ConnectSDK from '...'
//   import { ConnectSDK } from '...'
// Also provide a default export (optional but helpful for JS users)
export default ConnectSDK;
export { ConnectSDK };

// Expose Public types
export * from './types/config';
export { 
  BenjiConnectErrorID,
  BenjiConnectErrorName,
  BenjiConnectEventType,
  BenjiConnectExitTrigger,
} from './types/event';