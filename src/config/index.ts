import * as productionConfig from './production';
import * as sandboxConfig from './sandbox';
import * as developmentConfig from './development';

import { BenjiConnectEnvironment } from '../types/config';

// Defaults
const env = (typeof process !== 'undefined' ? process.env : {});
let data = developmentConfig;
export let Endpoints = {};
export let Environment = BenjiConnectEnvironment.DEVELOPMENT;

// Configure with environment at runtime 
export function configureConfig(environment: BenjiConnectEnvironment) {
  if (environment == 'production') {
    console.log('[Connect SDK] configuring with env production');
    data = productionConfig;
  } else if (environment == 'sandbox') {
    console.log('[Connect SDK] configuring with env sandbox');
    data = sandboxConfig;
  } else if (environment == 'development') {
    console.log('[Connect SDK] configuring with env development');
    data = developmentConfig;
  }
  Endpoints = getEndpoints();
  Environment = getEnvironment();
}

function getEndpoints() {
  return Object.fromEntries(
    Object.entries(data.endpoints).map(([key, value]) => [
      key,
      env?.[key] || value,
    ])
  );
}

function getEnvironment(): BenjiConnectEnvironment {
  return data['project_environment'] as BenjiConnectEnvironment;
}

export const Namespace = __NAMESPACE__;
export const Version = __VERSION__;

