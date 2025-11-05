import * as productionConfig from './production';
import * as sandboxConfig from './sandbox';
import * as developmentConfig from './development';
import { BenjiConnectEnvironment } from '../types/types';

const env =
  typeof import.meta !== 'undefined' && 'env' in import.meta
    ? import.meta.env
    : (typeof process !== 'undefined' ? process.env : {});
let data = developmentConfig;

export function configure(mode: BenjiConnectEnvironment) {
  console.log('SDK Configuring config default data', data);
  console.log('SDK Configuring config...', mode);
  if (mode == 'production') {
    data = productionConfig;
  } else if (mode == 'sandbox') {
    data = sandboxConfig;
  } else if (mode == 'development') {
    data = developmentConfig;
  }
  console.log('SDK Configured config data', data);
  console.log('SDK Configured config BENJI_CONNECT_AUTH_URL', Endpoints.benji_connect_auth_url);
  console.log('SDK Configured config BENJI_CONNECT_AUTH_SERVICE_URL', Endpoints.benji_connect_auth_service_url);
  console.log('SDK Configured config MIXPANEL_ACCESS_URL', Endpoints.mixpanel_access_url);
  console.log('SDK Configured config mixpanel_project_token', Credentials.mixpanel_project_token);
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

export const environment: BenjiConnectEnvironment = data["project_environment"] as BenjiConnectEnvironment;

