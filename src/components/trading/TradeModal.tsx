import { StubMarket, StubOutcome } from '@/lib/stub-data';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  market: StubMarket;
  outcome: StubOutcome;
  side: 'buy' | 'sell';
  amount: number;
  onConfirm: () => void;
};

export function TradeModal({ isOpen, onClose, market, outcome, side, amount, onConfirm }: Props) {
  if (!isOpen) return null;

  const price = outcome.midPrice;
  const shares = price > 0 ? amount / price : 0;
  const fee = amount * 0.005;
  const total = amount + fee;
  const estimatedPayout = shares; // $1 per share if correct
  const priceImpact = shares > 0 ? (shares / 50_000) * 100 : 0; // stub calculation

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="glass-panel w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] font-black text-primary tracking-[0.2em] mb-2 block uppercase">
              Trade Confirmation
            </span>
            <h2 className="text-base font-bold text-on-surface leading-tight line-clamp-2">
              {market.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-all active:scale-95 flex-shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary table */}
          <div className="space-y-3">
            <Row label="Outcome">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(187,198,255,0.5)]" />
                <span className="text-sm font-bold text-on-surface">
                  {outcome.label} ({side === 'buy' ? 'Yes' : 'No'})
                </span>
              </div>
            </Row>

            <Row label="Action">
              <span className="text-[10px] font-bold bg-secondary/20 text-secondary px-2.5 py-1 rounded-full border border-secondary/30 uppercase tracking-widest">
                {side.toUpperCase()}
              </span>
            </Row>

            <Row label="Shares">
              <span className="text-sm font-bold text-on-surface">{shares.toFixed(2)}</span>
            </Row>

            <Row label="Average Price">
              <span className="text-sm font-bold text-on-surface">${price.toFixed(2)}</span>
            </Row>

            <div className="h-px bg-white/10" />

            <Row label="Subtotal">
              <span className="text-sm text-on-surface">${amount.toFixed(2)}</span>
            </Row>

            <Row label="Fees (0.5%)">
              <span className="text-sm text-on-surface">${fee.toFixed(2)}</span>
            </Row>

            <Row label="Total Cost">
              <span className="text-base font-black text-primary">${total.toFixed(2)}</span>
            </Row>
          </div>

          {/* Price movement */}
          <div className="bg-white/5 ghost-border rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">Price Movement</span>
              <div className="flex items-center gap-2 font-bold">
                <span className="text-on-surface-variant">{Math.round(price * 100)}¢</span>
                <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                <span className="text-primary">
                  {Math.round((price + priceImpact / 100) * 100)}¢
                </span>
              </div>
            </div>
            {priceImpact > 0.5 && (
              <div className="flex items-center gap-2 bg-error-container/20 border border-error-container/40 p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-error text-sm">warning</span>
                <span className="text-sm text-error font-semibold">
                  {priceImpact.toFixed(1)}% price impact
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs text-on-surface-variant">
              <span>Estimated Payout (if correct)</span>
              <span className="font-bold text-secondary">
                ${estimatedPayout.toFixed(2)} (+{((estimatedPayout / amount - 1) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-secondary-container text-on-secondary-container font-bold text-lg rounded-2xl shadow-lg shadow-secondary-container/30 hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-3"
            >
              Confirm {side === 'buy' ? 'Buy' : 'Sell'}
              <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
            </button>
            <p className="text-center text-[11px] text-on-surface-variant leading-relaxed opacity-70">
              By confirming, you authorize your wallet to sign this transaction. Predicted outcomes
              are not guaranteed. Market risk applies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-on-surface-variant">{label}</span>
      {children}
    </div>
  );
}
