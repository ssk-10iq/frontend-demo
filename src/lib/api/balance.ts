import { apiClient } from './client';
import type { Balance } from './types';

/**
 * GET /balance/me 🔒
 * Get the authenticated user's USDC balance (available and locked).
 *
 * Deposits and withdrawals are handled on-chain and reflected by the indexer.
 */
export async function getMyBalance(): Promise<Balance> {
  const { data } = await apiClient.get<Balance>('/balance/me');
  return data;
}
