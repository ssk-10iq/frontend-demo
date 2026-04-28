export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type OrderStatus = 'open' | 'partially_filled' | 'filled' | 'cancelled';

export interface Order {
  id: string;
  market_id: string;
  outcome_id: string;
  user_id: string;
  side: OrderSide;
  order_type: OrderType;
  price?: number;
  quantity: number;
  filled: number;
  status: OrderStatus;
  created_at: string;
}

export interface SubmitOrderInput {
  market_id: string;
  outcome_id: string;
  side: OrderSide;
  order_type: OrderType;
  price?: number;
  quantity: number;
  signature: string;
}

export interface Trade {
  id: string;
  market_id: string;
  outcome_id: string;
  buy_order_id: string;
  sell_order_id: string;
  buyer_id: string;
  seller_id: string;
  price: number;
  quantity: number;
  timestamp: number;
}

export interface OrderBookLevel {
  price: number;
  quantity: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number | null;
  mid_price: number | null;
}
