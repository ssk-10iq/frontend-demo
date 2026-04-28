import { StubDispute, StubOutcome, formatAddress, formatDateTime } from '@/lib/stub-data';

type Props = {
  disputes: StubDispute[];
  outcomes: StubOutcome[];
};

const STATUS_CONFIG: Record<StubDispute['status'], { label: string; classes: string; icon: string }> = {
  pending:  { label: 'Pending Review', classes: 'bg-primary/15 text-primary border-primary/30',    icon: 'pending' },
  upheld:   { label: 'Upheld',         classes: 'bg-tertiary/15 text-tertiary border-tertiary/30', icon: 'check_circle' },
  rejected: { label: 'Rejected',       classes: 'bg-error/15 text-error border-error/30',          icon: 'cancel' },
};

export function DisputeList({ disputes, outcomes }: Props) {
  if (disputes.length === 0) {
    return (
      <div className="text-center py-8 text-on-surface-variant">
        <span className="material-symbols-outlined text-3xl mb-2 block opacity-40">
          shield_question
        </span>
        <p className="text-sm">No disputes filed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {disputes.map((dispute) => {
        const cfg = STATUS_CONFIG[dispute.status];
        const suggested = outcomes.find((o) => o.id === dispute.suggestedOutcomeId);

        return (
          <div
            key={dispute.id}
            className="p-4 rounded-2xl bg-surface-container-low border border-white/5 space-y-3"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface font-mono">
                  {formatAddress(dispute.disputer)}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {formatDateTime(dispute.disputedAt)}
                </p>
              </div>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 uppercase tracking-widest ${cfg.classes}`}
              >
                <span className="material-symbols-outlined text-xs">{cfg.icon}</span>
                {cfg.label}
              </span>
            </div>

            {/* Reason */}
            <p className="text-xs text-on-surface-variant leading-relaxed">{dispute.reason}</p>

            {/* Suggested outcome */}
            {suggested && (
              <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                Suggested outcome:
                <span className="text-primary">{suggested.label}</span>
              </div>
            )}

            {/* Evidence link */}
            {dispute.evidenceUrl && (
              <a
                href={dispute.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-secondary hover:underline"
              >
                <span className="material-symbols-outlined text-xs">open_in_new</span>
                View Evidence
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
