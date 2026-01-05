import * as productionConfig from './production';
import * as sandboxConfig from './sandbox';
import * as developmentConfig from './development';
import { BenjiConnectEnvironment } from '../types/config';

// Defaults to dev
const env = (typeof process !== 'undefined' ? process.env : {});
let data = developmentConfig;
// Derive endpoint type from dev config
type EndpointConfig = typeof developmentConfig.endpoints;
export let Endpoints: EndpointConfig = getEndpoints();
export let Environment = BenjiConnectEnvironment.DEVELOPMENT;

// Configure with environment at runtime 
export function configureConfig(environment: BenjiConnectEnvironment) {
  if (environment == 'production') {
    console.log('[Connect SDK] configuring with environment production');
    data = productionConfig;
  } else if (environment == 'sandbox') {
    console.log('[Connect SDK] configuring with environment sandbox');
    data = sandboxConfig;
  } else if (environment == 'development') {
    console.log('[Connect SDK] configuring with environment development');
    data = developmentConfig;
  }
  Endpoints = getEndpoints();
  Environment = getEnvironment();
}

function getEndpoints(): EndpointConfig {
  const entries = Object.entries(data.endpoints).map(([key, value]) => {
    const override = env?.[key] || value;
    return [key, override] as const;
  });
  return Object.fromEntries(entries) as EndpointConfig;
}

function getEnvironment(): BenjiConnectEnvironment {
  return data['project_environment'] as BenjiConnectEnvironment;
}

export const Namespace = __NAMESPACE__;
export const Version = __VERSION__;

