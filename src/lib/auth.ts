
import { AuthContextState } from '../types/auth';
import type { 
  BenjiConnectConfig, 
  BenjiConnectOptions 
} from '../types/config';
import { buildAuthRequestBody } from '../utils/auth';

let auth: AuthContextState | null = null;

/**
 * Initialize the global auth context.
 * Call this once when the SDK is configured.
 */
export function configureAuth(
  config: BenjiConnectConfig,
  options: BenjiConnectOptions
): void {   

  const authPayload = buildAuthRequestBody(options);
  const bearerToken = config.bearerToken;
  
  auth = {
    bearerToken,
    authPayload,
  };
}

/**
 * Read the current auth context.
 * Throws if you forgot to call configureAuthContext first.
 */
export function getAuth(): AuthContextState {
  if (!auth) {
    throw new Error(
      '[BenjiConnect SDK] Auth context not initialized. ' +
        'Call configureAuth(bearerToken, options) before using auth APIs.'
    );
  }
  return auth;
}

export function resetAuth(): void {
  auth = null;
}
