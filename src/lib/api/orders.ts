import { apiClient } from './client';
import type { Order, PlaceOrderRequest, OrderBookSnapshot, PaginatedResponse } from './types';

/**
 * GET /orders/me 🔒
 * List all orders placed by the authenticated user.
 */
export async function getMyOrders(params: {
  limit?: number;
  offset?: number;
} = {}): Promise<PaginatedResponse<Order>> {
  const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders/me', { params });
  return data;
}

/**
 * POST /orders 🔒
 * Place a new limit order. The request must include an on-chain signature
 * (EIP-712) so the backend can submit it to the Exchange contract.
 *
 * Note: order cancellation is on-chain only — call `cancelOrder()` on the
 * Exchange contract and the indexer will update the order status.
 */
export async function placeOrder(body: PlaceOrderRequest): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders', body);
  return data;
}

/**
 * GET /orders/:id
 * Get a single order by its UUID.
 */
export async function getOrder(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${id}`);
  return data;
}

/**
 * GET /orders/book/:market_id/:outcome_id
 * Snapshot of the current order book for a specific outcome.
 * Bids are sorted highest-price first; asks lowest-price first.
 *
 * @param marketId   bytes32 on-chain market ID
 * @param outcomeId  bytes32 on-chain outcome ID
 */
export async function getOrderBook(
  marketId: string,
  outcomeId: string,
): Promise<OrderBookSnapshot> {
  const { data } = await apiClient.get<OrderBookSnapshot>(
    `/orders/book/${marketId}/${outcomeId}`,
  );
  return data;
}
