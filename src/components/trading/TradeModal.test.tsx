import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TradeModal } from './TradeModal';
import type { StubMarket, StubOutcome } from '@/lib/stub-data';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockOutcome: StubOutcome = {
  id: 'outcome-yes',
  label: 'Yes',
  probability: 65,
  change: null,
  midPrice: 0.65,
  asks: [],
  bids: [],
};

const mockMarket: StubMarket = {
  id: 'market-btc',
  title: 'Will BTC reach $100k?',
  description: '',
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
  outcomes: [mockOutcome],
};

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  market: mockMarket,
  outcome: mockOutcome,
  side: 'buy' as const,
  amount: 10,
  onConfirm: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('TradeModal', () => {
  describe('visibility', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(<TradeModal {...defaultProps} isOpen={false} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the modal when isOpen is true', () => {
      render(<TradeModal {...defaultProps} />);
      expect(screen.getByText('Trade Confirmation')).toBeInTheDocument();
    });

    it('renders the market title in the header', () => {
      render(<TradeModal {...defaultProps} />);
      expect(screen.getByText('Will BTC reach $100k?')).toBeInTheDocument();
    });
  });

  describe('financial calculations', () => {
    // amount=10, midPrice=0.65
    // shares = 10 / 0.65 ≈ 15.38
    // fee    = 10 * 0.005 = 0.05
    // total  = 10 + 0.05  = 10.05

    it('calculates and displays the share count (amount / midPrice)', () => {
      render(<TradeModal {...defaultProps} amount={10} />);
      expect(screen.getByText('15.38')).toBeInTheDocument();
    });

    it('calculates and displays the fee (0.5% of amount)', () => {
      render(<TradeModal {...defaultProps} amount={10} />);
      expect(screen.getByText('$0.05')).toBeInTheDocument();
    });

    it('calculates and displays the total cost (amount + fee)', () => {
      render(<TradeModal {...defaultProps} amount={10} />);
      expect(screen.getByText('$10.05')).toBeInTheDocument();
    });

    it('shows the average price formatted to 2 decimal places', () => {
      render(<TradeModal {...defaultProps} />);
      // midPrice=0.65 → "$0.65"
      expect(screen.getByText('$0.65')).toBeInTheDocument();
    });
  });

  describe('side label', () => {
    it('shows "Confirm Buy" on the buy side', () => {
      render(<TradeModal {...defaultProps} side="buy" />);
      expect(screen.getByRole('button', { name: /Confirm Buy/i })).toBeInTheDocument();
    });

    it('shows "Confirm Sell" on the sell side', () => {
      render(<TradeModal {...defaultProps} side="sell" />);
      expect(screen.getByRole('button', { name: /Confirm Sell/i })).toBeInTheDocument();
    });
  });

  describe('price impact warning', () => {
    // priceImpact = (shares / 50_000) * 100 — warning shows when > 0.5%
    // need shares > 250 → with midPrice=0.5, amount=200: shares=400 → impact=0.8%

    it('shows a price impact warning when impact exceeds 0.5%', () => {
      const highImpactOutcome = { ...mockOutcome, midPrice: 0.5 };
      render(<TradeModal {...defaultProps} outcome={highImpactOutcome} amount={200} />);
      expect(screen.getByText(/price impact/i)).toBeInTheDocument();
    });

    it('does not show a price impact warning for small amounts', () => {
      // amount=10, midPrice=0.65 → shares≈15.38, impact≈0.031%
      render(<TradeModal {...defaultProps} amount={10} />);
      expect(screen.queryByText(/price impact/i)).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onClose when the close button is clicked', () => {
      const onClose = vi.fn();
      render(<TradeModal {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onConfirm when the confirm button is clicked', () => {
      const onConfirm = vi.fn();
      render(<TradeModal {...defaultProps} onConfirm={onConfirm} />);
      fireEvent.click(screen.getByRole('button', { name: /Confirm Buy/i }));
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('calls onClose when the backdrop is clicked', () => {
      const onClose = vi.fn();
      const { container } = render(<TradeModal {...defaultProps} onClose={onClose} />);
      // The backdrop is the first child of the container
      fireEvent.click(container.firstChild!);
      expect(onClose).toHaveBeenCalledOnce();
    });
  });
});
