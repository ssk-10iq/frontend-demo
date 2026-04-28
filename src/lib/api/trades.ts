import { apiClient } from './client';
import type { Trade, PaginatedResponse } from './types';

/**
 * GET /trades/me 🔒
 * List all trades (as maker or taker) for the authenticated user.
 */
export async function getMyTrades(params: {
  limit?: number;
  offset?: number;
} = {}): Promise<PaginatedResponse<Trade>> {
  const { data } = await apiClient.get<PaginatedResponse<Trade>>('/trades/me', { params });
  return data;
}

/**
 * GET /trades/:market_id
 * Public trade history for a market, newest first.
 *
 * @param marketId  bytes32 on-chain market ID
 */
export async function getMarketTrades(
  marketId: string,
  params: { limit?: number; offset?: number } = {},
): Promise<PaginatedResponse<Trade>> {
  const { data } = await apiClient.get<PaginatedResponse<Trade>>(
    `/trades/${marketId}`,
    { params },
  );
  return data;
}
