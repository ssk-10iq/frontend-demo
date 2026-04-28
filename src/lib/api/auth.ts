import { apiClient, tokenStore } from './client';
import type { NonceResponse, VerifyRequest, AuthTokens, RefreshRequest } from './types';

/**
 * GET /auth/nonce
 * Fetch a sign challenge for the given wallet address.
 * Returns a pre-formatted EIP-191 message the wallet should sign.
 */
export async function getNonce(address: string): Promise<NonceResponse> {
  const { data } = await apiClient.get<NonceResponse>('/auth/nonce', {
    params: { address },
  });
  return data;
}

/**
 * POST /auth/verify
 * Submit the wallet signature to authenticate.
 * Automatically stores the returned tokens for subsequent requests.
 */
export async function verify(body: VerifyRequest): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/verify', body);
  tokenStore.set(data.access_token, data.refresh_token);
  return data;
}

/**
 * POST /auth/refresh
 * Exchange a refresh token for a new access token.
 * Automatically updates stored tokens.
 */
export async function refresh(body: RefreshRequest): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/refresh', body);
  tokenStore.set(data.access_token, data.refresh_token);
  return data;
}

/** Sign out by clearing stored tokens (no server-side revocation endpoint). */
export function signOut(): void {
  tokenStore.clear();
}
