import * as productionConfig from './production';
import * as sandboxConfig from './sandbox';
import * as developmentConfig from './development';

import { 
  BenjiConnectEnvironment, 
  BenjiConnectMode 
} from '../types/config';

const env =
  typeof import.meta !== 'undefined' && 'env' in import.meta
    ? import.meta.env
    : (typeof process !== 'undefined' ? process.env : {});
let data = developmentConfig;

export function configureConfig(
  environment: BenjiConnectEnvironment, 
  mode: BenjiConnectMode
) {
  console.log('SDK Configuring config default data', data);
  console.log('SDK Configuring config...', mode);
  if (environment == 'production') {
    data = productionConfig;
  } else if (environment == 'sandbox') {
    data = sandboxConfig;
  } else if (environment == 'development') {
    data = developmentConfig;
  }
  Mode = mode;
  console.log('SDK Configured config data', data);
}

export const Endpoints = Object.fromEntries(
  Object.entries(data.endpoints).map(([key, value]) => [
    key,
    env?.[`VITE_${key}`] || env?.[`NEXT_PUBLIC_${key}`] || env?.[key] || value,
  ])
);

export const Credentials = Object.fromEntries(
  Object.entries(data.credentials).map(([key, value]) => [
    key,
    env?.[`VITE_${key}`] || env?.[`NEXT_PUBLIC_${key}`] || env?.[key] || value,
  ])
);

export const Environment: BenjiConnectEnvironment = data["project_environment"] as BenjiConnectEnvironment;
export let Mode: BenjiConnectMode = 1;
export const Namespace = __NAMESPACE__;
export const Version = __VERSION__;

