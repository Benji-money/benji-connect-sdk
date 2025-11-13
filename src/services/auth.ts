
import { BenjiConnectAuth } from '../types/auth';
import { BenjiConnectTokenData } from '../types/connect';
import { getConnectTokenData } from '../api/auth/connect';
import { mapTokenDataToAuth } from '../utils/auth';

let auth: BenjiConnectAuth | null = null;

/**
 * Configure the auth for connect
 */
export async function configureAuthentication(token: string): Promise<BenjiConnectTokenData> {

  // Fetch the one time token's connect data from api 
  const tokenData: BenjiConnectTokenData = await getConnectTokenData(token);

  // Configure auth based on token data
  auth = mapTokenDataToAuth(tokenData);

  return tokenData; 
}

/**
 * Read the current auth.
 * Throws error if not yet configured.
 */
export function getAuthentication(): BenjiConnectAuth {
  if (!auth) {
    throw new Error(
      '[BenjiConnect SDK] Auth not initialized. ' +
        'Call configureAuthentication(token) before using authentication.'
    );
  }
  return auth;
}

export function resetAuthentication(): void {
  auth = null;
}
