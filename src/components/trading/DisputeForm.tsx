import { useState } from 'react';
import { StubOutcome } from '@/lib/stub-data';

const MAX_REASON = 500;

export type DisputeFormValues = {
  reason: string;
  evidenceUrl: string;
  suggestedOutcomeId: string;
};

type Props = {
  outcomes: StubOutcome[];
  onSubmit: (values: DisputeFormValues) => void;
};

export function DisputeForm({ outcomes, onSubmit }: Props) {
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [suggestedOutcomeId, setSuggestedOutcomeId] = useState(outcomes[0]?.id ?? '');

  const reasonTrimmed = reason.trim();
  const isValid = reasonTrimmed.length >= 1 && reasonTrimmed.length <= MAX_REASON;
  const charsLeft = MAX_REASON - reason.length;

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({ reason: reasonTrimmed, evidenceUrl: evidenceUrl.trim(), suggestedOutcomeId });
  }

  return (
    <div className="space-y-4">
      {/* Suggested outcome */}
      <div>
        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">
          Correct Outcome
        </label>
        <div className="grid grid-cols-2 gap-2">
          {outcomes.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSuggestedOutcomeId(o.id)}
              className={`py-2.5 px-3 rounded-xl border-2 text-sm font-bold transition-all text-left leading-tight ${
                suggestedOutcomeId === o.id
                  ? 'border-tertiary bg-tertiary/10 text-white'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-on-surface-variant'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
            Reason <span className="text-error">*</span>
          </label>
          <span
            className={`text-[10px] font-bold ${
              charsLeft < 0 ? 'text-error' : charsLeft < 50 ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            {charsLeft < 0 ? `${Math.abs(charsLeft)} over limit` : `${charsLeft} left`}
          </span>
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Explain why this resolution is incorrect and what the correct outcome should be…"
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all resize-none"
        />
      </div>

      {/* Evidence URL */}
      <div>
        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">
          Evidence URL <span className="opacity-50">(optional)</span>
        </label>
        <input
          type="url"
          value={evidenceUrl}
          onChange={(e) => setEvidenceUrl(e.target.value)}
          placeholder="https://…"
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-all"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full py-3.5 bg-tertiary-container text-on-tertiary-container rounded-2xl font-bold uppercase tracking-widest text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">gavel</span>
        File Dispute
      </button>

      <p className="text-center text-[10px] text-on-surface-variant opacity-60 leading-relaxed">
        Disputes are reviewed by moderators within 24 hours. Payouts are paused while a dispute is pending.
      </p>
    </div>
  );
}
