// API types — mirroring the backend models (backend/README.md)
// All monetary values (price, size, volume, balance) are decimal strings to
// preserve precision across languages. Parse with parseFloat() or a bigint
// library when doing arithmetic.

// ── Shared ────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  code: string;
  message: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface NonceResponse {
  /** Wallet address the nonce was issued for */
  address: string;
  /** Pre-formatted EIP-191 message the client should sign */
  message: string;
  /** Raw nonce string embedded in the message */
  nonce: string;
}

export interface VerifyRequest {
  /** Wallet address (checksummed) */
  address: string;
  /** Hex-encoded signature over the nonce message */
  signature: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  /** Seconds until the access token expires */
  expires_in: number;
}

export interface RefreshRequest {
  refresh_token: string;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface User {
  /** Wallet address — also the primary key */
  id: string;
  address: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

export interface UpdateUserRequest {
  username?: string;
  avatar?: string;
  bio?: string;
}

// ── Markets ───────────────────────────────────────────────────────────────────

export type MarketStatus = 'draft' | 'open' | 'closed' | 'resolved' | 'finalized' | 'cancelled';
export type MarketType = 'binary' | 'multiple_choice';

export interface Outcome {
  /** bytes32 on-chain ID */
  id: string;
  market_id: string;
  label: string;
  /** null until resolved */
  is_winner: boolean | null;
}

export interface Market {
  /** bytes32 on-chain ID */
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  status: MarketStatus;
  type: MarketType;
  /** Creator's wallet address */
  creator: string;
  close_date: string;
  resolution_date: string;
  resolution_source: string;
  /** Cumulative USDC volume as a decimal string */
  volume: string;
  created_at: string;
  outcomes: Outcome[];
}

export interface ListMarketsParams {
  status?: MarketStatus;
  type?: MarketType;
  /** Filter by creator wallet address */
  creator?: string;
  /** Full-text search on title */
  search?: string;
  limit?: number;
  offset?: number;
}

export interface UpdateMarketRequest {
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'partial' | 'filled' | 'cancelled';

export interface Order {
  /** UUID */
  id: string;
  /** bytes32 on-chain order hash */
  hash: string;
  market_id: string;
  outcome_id: string;
  /** Trader's wallet address */
  trader: string;
  side: OrderSide;
  /** Limit price as a decimal string, e.g. "0.65" */
  price: string;
  /** Total order size in shares */
  size: string;
  /** Shares filled so far */
  filled: string;
  status: OrderStatus;
  created_at: string;
}

export interface PlaceOrderRequest {
  market_id: string;
  outcome_id: string;
  side: OrderSide;
  /** Limit price as a decimal string in [0, 1] */
  price: string;
  /** Number of shares to buy or sell */
  size: string;
  /** EIP-712 / on-chain signature authorising this order */
  signature: string;
  /** On-chain nonce to prevent replay */
  nonce: number;
  /** Unix timestamp after which the order is invalid */
  expiry: number;
}

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface OrderBookSnapshot {
  market_id: string;
  outcome_id: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: string;
}

// ── Trades ────────────────────────────────────────────────────────────────────

export interface Trade {
  /** UUID */
  id: string;
  market_id: string;
  outcome_id: string;
  /** Maker's wallet address */
  maker: string;
  /** Taker's wallet address */
  taker: string;
  /** Side from the taker's perspective */
  side: OrderSide;
  price: string;
  size: string;
  taker_fee: string;
  created_at: string;
}

// ── Positions ─────────────────────────────────────────────────────────────────

export interface Position {
  /** UUID */
  id: string;
  market_id: string;
  outcome_id: string;
  /** Holder's wallet address */
  user: string;
  shares: string;
  avg_price: string;
  realized_pnl: string;
  created_at: string;
  updated_at: string;
}

// ── Balance ───────────────────────────────────────────────────────────────────

export interface Balance {
  /** Wallet address */
  address: string;
  /** USDC available for new orders */
  available: string;
  /** USDC locked in open orders */
  locked: string;
  /** available + locked */
  total: string;
}

// ── WebSocket ─────────────────────────────────────────────────────────────────

export type WsChannel = 'order_book' | 'trades' | 'market' | 'user';

export type WsClientMessage =
  | { type: 'ping' }
  | { type: 'subscribe';   channel: 'order_book'; market_id: string; outcome_id: string }
  | { type: 'subscribe';   channel: 'trades';     market_id: string }
  | { type: 'subscribe';   channel: 'market';     market_id: string }
  | { type: 'subscribe';   channel: 'user';       token: string }
  | { type: 'unsubscribe'; channel: 'order_book'; market_id: string; outcome_id: string }
  | { type: 'unsubscribe'; channel: 'trades';     market_id: string }
  | { type: 'unsubscribe'; channel: 'market';     market_id: string }
  | { type: 'unsubscribe'; channel: 'user' };

export type WsServerMessage =
  | { type: 'connected' }
  | { type: 'pong' }
  | { type: 'subscribed'; channel: WsChannel }
  | { type: 'error'; code: string; message: string }
  | {
      type: 'order_book_update';
      market_id: string;
      outcome_id: string;
      bids: OrderBookEntry[];
      asks: OrderBookEntry[];
      timestamp: string;
    }
  | {
      type: 'trade';
      market_id: string;
      outcome_id: string;
      price: string;
      size: string;
      side: OrderSide;
      timestamp: string;
    }
  | {
      type: 'market_update';
      market_id: string;
      status: MarketStatus;
      volume: string;
    }
  | { type: 'position_update'; position: Position }
  | { type: 'balance_update'; balance: Balance };
