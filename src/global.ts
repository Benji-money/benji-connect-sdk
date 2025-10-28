/// <reference path="./global.d.ts" />

import ConnectSDK from './connect-sdk';
(globalThis as any).ConnectSDK = ConnectSDK;

// (Optional) expose build info for debugging
(globalThis as any).BenjiConnect = {
  VERSION: __VERSION__,
  NAMESPACE: __NAMESPACE__,
};