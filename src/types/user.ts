export interface User {
  id: string;
  wallet_address: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  balance: number;
  created_at: string;
}

export interface Position {
  id: string;
  market: {
    id: string;
    title: string;
  };
  outcome: {
    id: string;
    label: string;
  };
  shares: number;
  avg_cost_basis: number;
  current_price: number;
  current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
}
