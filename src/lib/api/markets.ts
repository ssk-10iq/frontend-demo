import { apiClient } from './client';
import type { Market, ListMarketsParams, UpdateMarketRequest, PaginatedResponse } from './types';

/**
 * GET /markets
 * List markets with optional filtering and pagination.
 * All params are optional — omitting them returns all markets.
 */
export async function listMarkets(
  params: ListMarketsParams = {},
): Promise<PaginatedResponse<Market>> {
  const { data } = await apiClient.get<PaginatedResponse<Market>>('/markets', { params });
  return data;
}

/**
 * GET /markets/:id
 * Full market details including outcomes.
 * @param id  bytes32 on-chain market ID
 */
export async function getMarket(id: string): Promise<Market> {
  const { data } = await apiClient.get<Market>(`/markets/${id}`);
  return data;
}

/**
 * PATCH /markets/:id 🔒
 * Update mutable market metadata. Only callable by the market creator.
 * @param id  bytes32 on-chain market ID
 */
export async function updateMarket(
  id: string,
  body: UpdateMarketRequest,
): Promise<Market> {
  const { data } = await apiClient.patch<Market>(`/markets/${id}`, body);
  return data;
}
