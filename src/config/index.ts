import * as productionConfig from './production';
import * as sandboxConfig from './sandbox';
import * as developmentConfig from './development';
import { BenjiConnectEnvironment } from '../types/types';

let data = developmentConfig;

export function configure(mode: BenjiConnectEnvironment) {
  if (mode == 'production') {
    data = productionConfig;
  } else if (mode == 'sandbox') {
    data = sandboxConfig;
  } else if (mode == 'development') {
    data = developmentConfig;
  }
}

export const Endpoints = Object.fromEntries(
  Object.entries(data.endpoints).map(([key, value]) => {
    return [
      key,
      process.env[`NEXT_PUBLIC_${key}`] || process.env[`VITE_${key}`] || process.env[key] || value
    ];
  })
);

export const ENVIRONMENT: string = data["project_environment"];

// Endpoints
export const BENJI_CONNECT_AUTH_URL: string = data["benji_connect_auth_url"];
export const BENJI_CONNECT_AUTH_SERVICE_URL: string = data["benji_connect_auth_service_url"];
export const MIXPANEL_ACCESS_URL: string = data["mixpanel_access_url"];

// Credentials
export const MIXPANEL_PROJECT_TOKEN: string = data["mixpanel_project_token"];
