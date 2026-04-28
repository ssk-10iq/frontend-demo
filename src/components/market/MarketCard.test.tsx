import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MarketCard } from './MarketCard';
import type { StubMarket } from '@/lib/stub-data';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockMarket: StubMarket = {
  id: 'market-btc',
  title: 'Will BTC reach $100k by end of 2026?',
  description: 'Bitcoin ATH prediction market.',
  category: 'crypto',
  subcategory: 'Bitcoin',
  status: 'open',
  type: 'binary',
  closeDate: '2026-12-31',
  resolutionDate: '2026-12-31',
  resolutionSource: 'CoinGecko',
  volume: 50_000,
  traders: 100,
  traderCount: 500,
  icon: 'currency_bitcoin',
  iconColor: 'primary',
  outcomes: [
    {
      id: 'outcome-yes',
      label: 'Yes',
      probability: 65,
      change: null,
      midPrice: 0.65,
      asks: [],
      bids: [],
    },
    {
      id: 'outcome-no',
      label: 'No',
      probability: 35,
      change: null,
      midPrice: 0.35,
      asks: [],
      bids: [],
    },
  ],
};

function renderCard(market: StubMarket = mockMarket) {
  return render(
    <MemoryRouter>
      <MarketCard market={market} />
    </MemoryRouter>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MarketCard', () => {
  it('renders the market title', () => {
    renderCard();
    expect(screen.getByText('Will BTC reach $100k by end of 2026?')).toBeInTheDocument();
  });

  it('shows the subcategory label', () => {
    renderCard();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('displays the Yes probability from outcomes[0]', () => {
    renderCard();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('displays the No probability as 100 minus Yes probability', () => {
    renderCard();
    expect(screen.getByText('35%')).toBeInTheDocument();
  });

  it('renders BUY YES and BUY NO action buttons', () => {
    renderCard();
    expect(screen.getByText('BUY YES')).toBeInTheDocument();
    expect(screen.getByText('BUY NO')).toBeInTheDocument();
  });

  it('displays the trader count chip (traderCount / 100)', () => {
    renderCard();
    // traderCount=500 → Math.floor(500/100) = 5 → displays "+5"
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('defaults Yes probability to 0% when outcomes array is empty', () => {
    renderCard({ ...mockMarket, outcomes: [] });
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
