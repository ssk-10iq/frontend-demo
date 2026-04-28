import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const QUICK_AMOUNTS = [50, 100, 250, 500];

export function DepositModal({ isOpen, onClose }: Props) {
  const [amountStr, setAmountStr] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const amount = parseFloat(amountStr) || 0;
  const fee = amount * 0.001; // 0.1% network fee stub
  const total = amount - fee;

  function handleConfirm() {
    if (amount <= 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAmountStr('');
      onClose();
    }, 1800);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-secondary tracking-[0.2em] mb-1 block uppercase">
              Add Funds
            </span>
            <h2 className="text-base font-bold text-on-surface">Deposit USDC</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-all"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Amount input */}
          <div>
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">
              Amount (USDC)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full bg-white/5 ghost-border rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-on-surface placeholder-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                autoFocus
              />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mt-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmountStr(String(q))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    amount === q
                      ? 'bg-secondary-container text-on-secondary-container border-secondary/40'
                      : 'bg-white/5 text-on-surface-variant border-white/10 hover:bg-white/10'
                  }`}
                >
                  ${q}
                </button>
              ))}
            </div>
          </div>

          {/* Fee breakdown */}
          {amount > 0 && (
            <div className="bg-white/5 ghost-border rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Deposit amount</span>
                <span className="text-on-surface font-bold">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Network fee (0.1%)</span>
                <span className="text-on-surface-variant">−${fee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">You receive</span>
                <span className="font-black text-secondary">${total.toFixed(2)} USDC</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleConfirm}
            disabled={amount <= 0 || submitted}
            className="w-full py-4 bg-secondary-container text-on-secondary-container font-bold text-base rounded-2xl shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitted ? (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Deposit Confirmed
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">add_card</span>
                {amount > 0 ? `Deposit $${amount.toFixed(2)}` : 'Enter an amount'}
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-on-surface-variant/60 leading-relaxed">
            Funds are deposited as USDC on Arbitrum. Your wallet will prompt you to sign the transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
