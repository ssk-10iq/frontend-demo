import { useState } from 'react';
import {
  StubMarket,
  getResolutionForMarket,
  getDisputesForMarket,
  formatDateTime,
} from '@/lib/stub-data';
import { DisputeForm, DisputeFormValues } from './DisputeForm';
import { DisputeList } from '../market/DisputeList';

type Props = {
  market: StubMarket;
};

export function ResolutionPanel({ market }: Props) {
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const resolution = getResolutionForMarket(market.id);
  const disputes = getDisputesForMarket(market.id);
  const winningOutcome = resolution
    ? market.outcomes.find((o) => o.id === resolution.winningOutcomeId)
    : null;

  function handleDisputeSubmit(_values: DisputeFormValues) {
    // TODO: call placeOrder equivalent — disputeResolution(marketId, reason, evidenceIpfs)
    setDisputeSubmitted(true);
  }

  // ── Awaiting resolution ───────────────────────────────────────────────────
  if (market.status === 'closed') {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 text-center">
        <span className="material-symbols-outlined text-4xl text-primary block">hourglass_top</span>
        <h3 className="font-bold text-white uppercase tracking-widest text-sm">
          Awaiting Resolution
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Trading has closed. Moderators will resolve this market after the outcome is confirmed.
        </p>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Resolution expected by{' '}
          <span className="text-primary">{formatDateTime(market.resolutionDate + 'T00:00:00Z')}</span>
        </p>
      </div>
    );
  }

  // ── Cancelled — refund available ─────────────────────────────────────────
  if (market.status === 'cancelled') {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-error/20 space-y-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error text-2xl">cancel</span>
          <div>
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">
              Market Cancelled
            </h3>
            <p className="text-[10px] text-on-surface-variant mt-0.5">All positions are refundable</p>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          This market was cancelled. Your purchase cost will be refunded in full.
        </p>
        <button className="w-full py-4 bg-error-container text-on-error-container rounded-2xl font-bold uppercase tracking-widest text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">payments</span>
          Claim Refund
        </button>
      </div>
    );
  }

  // ── Resolved or finalized ─────────────────────────────────────────────────
  if (market.status !== 'resolved' && market.status !== 'finalized') return null;

  const isFinalized = market.status === 'finalized';
  const disputeWindowOpen = !isFinalized;
  const hasPendingDispute = disputes.some((d) => d.status === 'pending');

  return (
    <div className="space-y-5">
      {/* Resolution summary */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-xl ${isFinalized ? 'text-secondary' : 'text-tertiary'}`}>
            {isFinalized ? 'verified' : 'gavel'}
          </span>
          <h3 className="font-bold text-white uppercase tracking-widest text-sm">
            {isFinalized ? 'Resolution Final' : 'Market Resolved'}
          </h3>
        </div>

        {/* Winning outcome */}
        {winningOutcome ? (
          <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/25 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
                Winning Outcome
              </p>
              <p className="font-black text-lg text-white">{winningOutcome.label}</p>
            </div>
            <span className="material-symbols-outlined text-secondary text-3xl">emoji_events</span>
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant">Resolution data unavailable.</p>
        )}

        {/* Resolution metadata */}
        {resolution && (
          <div className="space-y-2 text-xs text-on-surface-variant">
            <div className="flex justify-between">
              <span>Resolved by</span>
              <span className="text-on-surface font-bold">{resolution.resolverName}</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved at</span>
              <span className="text-on-surface font-bold">{formatDateTime(resolution.resolvedAt)}</span>
            </div>
            {resolution.evidenceUrl && (
              <a
                href={resolution.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-bold text-secondary hover:underline w-full justify-end"
              >
                View Evidence
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            )}
            {resolution.notes && (
              <p className="text-on-surface-variant leading-relaxed pt-1 border-t border-white/5">
                {resolution.notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Claim payout (finalized) */}
      {isFinalized && (
        <button className="w-full py-4 bg-secondary-container text-on-secondary-container rounded-2xl font-black text-base uppercase tracking-tight hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-secondary/10 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">payments</span>
          Claim Payout
        </button>
      )}

      {/* Dispute section (resolved, window open) */}
      {disputeWindowOpen && (
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Dispute Window</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary border border-primary/30 bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Open
            </span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            You have 24 hours from resolution to challenge the outcome. Payouts are paused until the window closes.
          </p>

          {disputeSubmitted ? (
            <div className="flex items-center gap-3 p-4 bg-tertiary/10 border border-tertiary/30 rounded-2xl">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              <p className="text-sm font-bold text-tertiary">
                Dispute submitted. Moderators will review within 24 hours.
              </p>
            </div>
          ) : hasPendingDispute ? (
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-xs text-on-surface-variant">
                A dispute is already pending review. Only one dispute can be active at a time.
              </p>
            </div>
          ) : (
            <DisputeForm outcomes={market.outcomes} onSubmit={handleDisputeSubmit} />
          )}
        </div>
      )}

      {/* Dispute history */}
      {disputes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
            Dispute History
          </h3>
          <DisputeList disputes={disputes} outcomes={market.outcomes} />
        </div>
      )}
    </div>
  );
}
