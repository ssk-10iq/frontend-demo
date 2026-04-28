import { apiClient } from './client';
import type { Position, PaginatedResponse } from './types';

/**
 * GET /positions/me 🔒
 * Get the authenticated user's portfolio (all open positions across markets).
 */
export async function getMyPositions(params: {
  limit?: number;
  offset?: number;
} = {}): Promise<PaginatedResponse<Position>> {
  const { data } = await apiClient.get<PaginatedResponse<Position>>('/positions/me', { params });
  return data;
}

/**
 * GET /positions/:market_id
 * Get all holders' positions for a specific market.
 *
 * @param marketId  bytes32 on-chain market ID
 */
export async function getMarketPositions(
  marketId: string,
  params: { limit?: number; offset?: number } = {},
): Promise<PaginatedResponse<Position>> {
  const { data } = await apiClient.get<PaginatedResponse<Position>>(
    `/positions/${marketId}`,
    { params },
  );
  return data;
}
