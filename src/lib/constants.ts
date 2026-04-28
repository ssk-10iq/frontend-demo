export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export const MARKET_CATEGORIES = [
  'Politics',
  'Sports',
  'Cryptocurrency',
  'Technology',
  'Economics',
  'Entertainment',
  'Science',
  'Current Events',
  'Other',
] as const;

export const MARKET_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_SIDE = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

export const ORDER_TYPE = {
  MARKET: 'market',
  LIMIT: 'limit',
} as const;

export const FEE_RATES = {
  MAKER: 0.001, // 0.1%
  TAKER: 0.003, // 0.3%
} as const;
