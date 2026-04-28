import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MarketCardMulti } from './MarketCardMulti';
import type { StubMarket } from '@/lib/stub-data';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => mockNavigate,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseOutcome = {
  change: null,
  midPrice: 0.5,
  asks: [],
  bids: [],
};

const mockMarket: StubMarket = {
  id: 'market-wc',
  title: 'Who will win the 2026 World Cup?',
  description: 'FIFA World Cup 2026 winner prediction.',
  category: 'sports',
  subcategory: 'Football',
  status: 'open',
  type: 'multiple_choice',
  closeDate: '2026-07-19',
  resolutionDate: '2026-07-19',
  resolutionSource: 'FIFA',
  volume: 120_000,
  traders: 250,
  traderCount: 250,
  icon: 'sports_soccer',
  iconColor: 'secondary',
  outcomes: [
    { ...baseOutcome, id: 'outcome-brazil', label: 'Brazil', probability: 22 },
    { ...baseOutcome, id: 'outcome-france', label: 'France', probability: 18 },
    { ...baseOutcome, id: 'outcome-england', label: 'England', probability: 14 },
  ],
};

function renderCard(market: StubMarket = mockMarket) {
  return render(
    <MemoryRouter>
      <MarketCardMulti market={market} />
    </MemoryRouter>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe('MarketCardMulti', () => {
  it('renders the market title', () => {
    renderCard();
    expect(screen.getByText('Who will win the 2026 World Cup?')).toBeInTheDocument();
  });

  it('shows the subcategory label', () => {
    renderCard();
    expect(screen.getByText('Football')).toBeInTheDocument();
  });

  it('renders only the top two outcomes', () => {
    renderCard();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.queryByText('England')).not.toBeInTheDocument();
  });

  it('shows the probability for each displayed outcome', () => {
    renderCard();
    expect(screen.getByText('22%')).toBeInTheDocument();
    expect(screen.getByText('18%')).toBeInTheDocument();
  });

  it('renders a "View All Outcomes" button', () => {
    renderCard();
    expect(screen.getByText('View All Outcomes')).toBeInTheDocument();
  });

  it('navigates to the market detail page when the card is clicked', async () => {
    renderCard();
    await userEvent.click(screen.getByText('Who will win the 2026 World Cup?'));
    expect(mockNavigate).toHaveBeenCalledWith('/markets/market-wc');
  });

  it('navigates to the market detail page when "View All Outcomes" is clicked', async () => {
    renderCard();
    await userEvent.click(screen.getByText('View All Outcomes'));
    expect(mockNavigate).toHaveBeenCalledWith('/markets/market-wc');
  });

  it('applies the fallback icon colour class for an unrecognised iconColor', () => {
    const { container } = renderCard({
      ...mockMarket,
      iconColor: 'unknown' as StubMarket['iconColor'],
    });
    // Unknown iconColor must fall back to text-primary (not throw or render nothing)
    expect(container.querySelector('.text-primary')).toBeInTheDocument();
  });
});
