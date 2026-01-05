import { BenjiConnectEnvironment } from "../types/config";

export const buildContext = () => ({
  namespace: typeof __NAMESPACE__ !== 'undefined' && __NAMESPACE__ ? __NAMESPACE__ : 'benji-connect-sdk',
  version: typeof __VERSION__ !== 'undefined' && __VERSION__ ? String(__VERSION__) : '0.0.0',
});

export function isBenjiConnectEnvironment(
  environment: unknown
): environment is BenjiConnectEnvironment {
  return (
    environment === BenjiConnectEnvironment.DEVELOPMENT ||
    environment === BenjiConnectEnvironment.SANDBOX ||
    environment === BenjiConnectEnvironment.PRODUCTION
  );
}

export function mapToConnectEnvironment(
  environment: BenjiConnectEnvironment | string
): BenjiConnectEnvironment {

  if (isBenjiConnectEnvironment(environment)) return environment;

  const environments: Record<string, BenjiConnectEnvironment> = {
    development: BenjiConnectEnvironment.DEVELOPMENT,
    sandbox: BenjiConnectEnvironment.SANDBOX,
    production: BenjiConnectEnvironment.PRODUCTION
  };
  const mapped = environments[environment];
  if (mapped) return mapped;

  const defaultEnvironment = BenjiConnectEnvironment.DEVELOPMENT;
  console.warn(`[Benji Connect SDK] ${environment} not valid environment defaulting to ${defaultEnvironment}`);

  return defaultEnvironment;
}