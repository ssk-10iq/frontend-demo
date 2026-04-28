export type MarketType = 'binary' | 'multiple_choice';
export type MarketStatus = 'draft' | 'open' | 'closed' | 'resolved' | 'cancelled';

export interface Outcome {
  id: string;
  label: string;
  current_price: number | null;
  total_shares: number;
}

export interface Market {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  market_type: MarketType;
  status: MarketStatus;
  category: string;
  tags: string[];
  outcomes: Outcome[];
  close_date: string;
  resolution_date?: string;
  resolved_at?: string;
  resolved_outcome_id?: string;
  volume: number;
  liquidity: number;
  trader_count: number;
  created_at: string;
}

export interface CreateMarketInput {
  title: string;
  description: string;
  resolution_source: string;
  market_type: MarketType;
  category: string;
  tags: string[];
  outcomes: string[];
  close_date: string;
  resolution_date?: string;
}
