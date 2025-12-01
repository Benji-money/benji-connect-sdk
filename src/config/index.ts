import * as productionConfig from './production';
import * as sandboxConfig from './sandbox';
import * as developmentConfig from './development';

import { BenjiConnectEnvironment } from '../types/config';

const env = (typeof process !== 'undefined' ? process.env : {});
let data = developmentConfig;

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
}

export const Endpoints = Object.fromEntries(
  Object.entries(data.endpoints).map(([key, value]) => [
    key,
    env?.[key] || value,
  ])
);

export const Environment: BenjiConnectEnvironment = data["project_environment"] as BenjiConnectEnvironment;
export const Namespace = __NAMESPACE__;
export const Version = __VERSION__;

