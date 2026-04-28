import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STUB_MARKETS, StubMarket, MarketStatus } from '@/lib/stub-data';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<MarketStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: 'Draft',     color: 'text-on-surface-variant', bg: 'bg-white/10',           border: 'border-white/20' },
  open:      { label: 'Open',      color: 'text-secondary',          bg: 'bg-secondary/10',        border: 'border-secondary/30' },
  closed:    { label: 'Closed',    color: 'text-primary',            bg: 'bg-primary/10',          border: 'border-primary/30' },
  resolved:  { label: 'Resolved',  color: 'text-tertiary',           bg: 'bg-tertiary/10',         border: 'border-tertiary/30' },
  finalized: { label: 'Finalized', color: 'text-secondary',          bg: 'bg-secondary/10',        border: 'border-secondary/30' },
  cancelled: { label: 'Cancelled', color: 'text-error',              bg: 'bg-error/10',            border: 'border-error/30' },
};

// Actions available per status
const STATUS_ACTIONS: Record<MarketStatus, { label: string; icon: string; next: MarketStatus; style: string }[]> = {
  draft:     [{ label: 'Publish', icon: 'publish', next: 'open', style: 'bg-secondary-container text-on-secondary-container hover:brightness-110' }],
  open:      [
    { label: 'Close', icon: 'lock', next: 'closed', style: 'bg-primary-container text-on-primary-container hover:brightness-110' },
    { label: 'Cancel', icon: 'cancel', next: 'cancelled', style: 'bg-error-container text-on-error-container hover:brightness-110' },
  ],
  closed:    [
    { label: 'Resolve', icon: 'check_circle', next: 'resolved', style: 'bg-tertiary-container text-on-tertiary-container hover:brightness-110' },
    { label: 'Cancel', icon: 'cancel', next: 'cancelled', style: 'bg-error-container text-on-error-container hover:brightness-110' },
  ],
  resolved:  [],
  finalized: [],
  cancelled: [],
};

const FILTER_TABS: { label: string; value: MarketStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Cancelled', value: 'cancelled' },
];

const CATEGORIES = ['Politics', 'Sports', 'Crypto', 'Tech', 'Entertainment', 'Economics'];
const SUBCATEGORY_MAP: Record<string, string[]> = {
  Politics: ['U.S. Elections', 'Global Affairs', 'Legislative', 'Polling'],
  Sports: ['Football', 'Basketball', 'Tennis', 'Baseball'],
  Crypto: ['Bitcoin', 'Ethereum', 'Altcoins', 'DeFi'],
  Tech: ['AI & ML', 'Space', 'Gaming', 'Startups'],
  Entertainment: ['Awards', 'Movies', 'Music', 'TV'],
  Economics: ['Monetary Policy', 'Fiscal Policy', 'Trade', 'Inflation'],
};

// ── Create Market form state ──────────────────────────────────────────────────

type CreateForm = {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: 'binary' | 'multiple_choice';
  closeDate: string;
  resolutionDate: string;
  resolutionSource: string;
  outcomes: string[]; // labels for multi; ignored for binary
};

const EMPTY_FORM: CreateForm = {
  title: '',
  description: '',
  category: 'Politics',
  subcategory: '',
  type: 'binary',
  closeDate: '',
  resolutionDate: '',
  resolutionSource: '',
  outcomes: ['', ''],
};

// ── Resolve modal state ───────────────────────────────────────────────────────

type ResolveTarget = { market: StubMarket } | null;

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [markets, setMarkets] = useState<StubMarket[]>(STUB_MARKETS);
  const [activeFilter, setActiveFilter] = useState<MarketStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [resolveTarget, setResolveTarget] = useState<ResolveTarget>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState('');

  // Filtered markets
  const visible = markets.filter((m) => {
    if (activeFilter !== 'all' && m.status !== activeFilter) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Status counts for tab badges
  const counts = markets.reduce<Record<string, number>>((acc, m) => {
    acc[m.status] = (acc[m.status] ?? 0) + 1;
    acc.all = (acc.all ?? 0) + 1;
    return acc;
  }, {});

  function applyAction(marketId: string, next: MarketStatus) {
    if (next === 'resolved') {
      const market = markets.find((m) => m.id === marketId);
      if (market) {
        setResolveTarget({ market });
        setSelectedOutcomeId(market.outcomes[0]?.id ?? '');
        return;
      }
    }
    setMarkets((prev) =>
      prev.map((m) => (m.id === marketId ? { ...m, status: next } : m))
    );
  }

  function confirmResolve() {
    if (!resolveTarget) return;
    setMarkets((prev) =>
      prev.map((m) =>
        m.id === resolveTarget.market.id ? { ...m, status: 'resolved' } : m
      )
    );
    setResolveTarget(null);
  }

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newMarket: StubMarket = {
      id: `custom-${Date.now()}`,
      title: form.title,
      description: form.description,
      category: form.category,
      subcategory: form.subcategory,
      status: 'draft',
      type: form.type,
      closeDate: form.closeDate,
      resolutionDate: form.resolutionDate,
      resolutionSource: form.resolutionSource,
      volume: 0,
      traders: 0,
      traderCount: 0,
      icon: 'help_outline',
      iconColor: 'primary',
      outcomes:
        form.type === 'binary'
          ? [
              { id: 'yes', label: 'Yes', probability: 50, change: null, midPrice: 0.5, asks: [], bids: [] },
              { id: 'no', label: 'No', probability: 50, change: null, midPrice: 0.5, asks: [], bids: [] },
            ]
          : form.outcomes
              .filter((o) => o.trim())
              .map((label, i) => ({
                id: `outcome-${i}`,
                label: label.trim(),
                probability: Math.floor(100 / form.outcomes.filter((o) => o.trim()).length),
                change: null,
                midPrice: 1 / form.outcomes.filter((o) => o.trim()).length,
                asks: [],
                bids: [],
              })),
    };
    setMarkets((prev) => [newMarket, ...prev]);
    setForm(EMPTY_FORM);
    setShowCreate(false);
  }

  const inputCls = 'w-full bg-white/5 ghost-border rounded-xl px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all';
  const labelCls = 'block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2';

  return (
    <div className="max-w-[1600px] mx-auto pt-[124px] pb-28 md:pb-10 px-4 sm:px-8">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-error uppercase tracking-widest bg-error/10 border border-error/30 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">Market Management</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Create, publish, and manage prediction markets</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Market
        </button>
      </div>

      {/* ── Summary stats ────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {(['draft', 'open', 'closed', 'resolved', 'finalized', 'cancelled'] as MarketStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`glass-panel rounded-xl p-4 text-left transition-all hover:bg-white/5 ${activeFilter === s ? 'ring-2 ring-primary/50' : ''}`}
            >
              <p className={`text-2xl font-black ${cfg.color}`}>{counts[s] ?? 0}</p>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1">
                {cfg.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Filter + search bar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Status filter tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeFilter === value
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              }`}
            >
              {label}
              <span className="ml-1.5 opacity-60">{counts[value] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs ml-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
          <input
            type="text"
            placeholder="Search markets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 ghost-border rounded-xl pl-9 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* ── Market table ─────────────────────────────────── */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {visible.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-3">search_off</span>
            <p className="text-on-surface-variant">No markets match this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
              <div className="col-span-5">Market</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1 text-right">Volume</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {visible.map((market) => {
              const cfg = STATUS_CONFIG[market.status];
              const actions = STATUS_ACTIONS[market.status] ?? [];
              return (
                <div
                  key={market.id}
                  className="px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center">
                    {/* Title */}
                    <div className="col-span-5 min-w-0">
                      <Link
                        to={`/markets/${market.id}`}
                        className="text-sm font-bold text-on-surface hover:text-primary transition-colors line-clamp-2 leading-snug"
                      >
                        {market.title}
                      </Link>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        Closes {market.closeDate} · {market.outcomes.length} outcomes
                      </p>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <p className="text-xs text-on-surface-variant">{market.category}</p>
                      <p className="text-[10px] text-on-surface-variant/60">{market.subcategory}</p>
                    </div>

                    {/* Type */}
                    <div className="col-span-1">
                      <span className="text-[10px] font-bold text-on-surface-variant capitalize">
                        {market.type === 'binary' ? 'Binary' : 'Multi'}
                      </span>
                    </div>

                    {/* Volume */}
                    <div className="col-span-1 text-right">
                      <span className="text-xs font-bold text-on-surface">
                        {market.volume > 0 ? `$${(market.volume / 1000).toFixed(0)}K` : '—'}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="col-span-1 flex sm:justify-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex gap-1.5 sm:justify-end flex-wrap">
                      {actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => applyAction(market.id, action.next)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${action.style}`}
                        >
                          <span className="material-symbols-outlined text-sm">{action.icon}</span>
                          {action.label}
                        </button>
                      ))}
                      {actions.length === 0 && (
                        <span className="text-[10px] text-on-surface-variant/40 italic">No actions</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create Market drawer ─────────────────────────── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="w-full max-w-lg h-full overflow-y-auto glass-panel border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-primary tracking-widest uppercase">Admin</span>
                <h2 className="text-lg font-black text-on-surface">New Market</h2>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className={labelCls}>Market Title</label>
                <input
                  required
                  type="text"
                  placeholder="Will X happen before Y date?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description & Resolution Criteria</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the market and exactly how it will be resolved..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Category + Subcategory */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: '' })}
                    className={inputCls}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Subcategory</label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select…</option>
                    {(SUBCATEGORY_MAP[form.category] ?? []).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Market type */}
              <div>
                <label className={labelCls}>Market Type</label>
                <div className="flex gap-2">
                  {(['binary', 'multiple_choice'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        form.type === t
                          ? 'bg-primary-container text-on-primary-container border-primary/40'
                          : 'bg-white/5 text-on-surface-variant border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {t === 'binary' ? 'Binary (Yes / No)' : 'Multiple Choice'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-choice outcomes */}
              {form.type === 'multiple_choice' && (
                <div>
                  <label className={labelCls}>Outcomes</label>
                  <div className="space-y-2">
                    {form.outcomes.map((o, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Outcome ${i + 1}`}
                          value={o}
                          onChange={(e) => {
                            const next = [...form.outcomes];
                            next[i] = e.target.value;
                            setForm({ ...form, outcomes: next });
                          }}
                          className={`${inputCls} flex-1`}
                        />
                        {form.outcomes.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, outcomes: form.outcomes.filter((_, j) => j !== i) })}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                    {form.outcomes.length < 8 && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, outcomes: [...form.outcomes, ''] })}
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add outcome
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Close Date</label>
                  <input
                    required
                    type="date"
                    value={form.closeDate}
                    onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Resolution Date</label>
                  <input
                    required
                    type="date"
                    value={form.resolutionDate}
                    onChange={(e) => setForm({ ...form, resolutionDate: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Resolution source */}
              <div>
                <label className={labelCls}>Resolution Source</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Reuters official reporting"
                  value={form.resolutionSource}
                  onChange={(e) => setForm({ ...form, resolutionSource: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 ghost-border rounded-xl text-sm font-bold text-on-surface-variant hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-container text-on-primary-container rounded-xl text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Resolve modal ─────────────────────────────────── */}
      {resolveTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setResolveTarget(null)}
        >
          <div
            className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10">
              <span className="text-[10px] font-black text-tertiary tracking-widest uppercase block mb-1">
                Resolve Market
              </span>
              <h2 className="text-base font-bold text-on-surface leading-snug line-clamp-2">
                {resolveTarget.market.title}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface-variant">
                Select the winning outcome. This action is irreversible.
              </p>

              <div className="space-y-2">
                {resolveTarget.market.outcomes.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOutcomeId(o.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedOutcomeId === o.id
                        ? 'bg-tertiary-container/20 border-tertiary/40 text-on-surface'
                        : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedOutcomeId === o.id ? 'border-tertiary' : 'border-on-surface-variant/40'
                    }`}>
                      {selectedOutcomeId === o.id && (
                        <div className="w-2 h-2 rounded-full bg-tertiary" />
                      )}
                    </div>
                    <span className="font-bold text-sm">{o.label}</span>
                    <span className="text-xs text-on-surface-variant ml-auto">{o.probability}%</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setResolveTarget(null)}
                  className="flex-1 py-3 ghost-border rounded-xl text-sm font-bold text-on-surface-variant hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResolve}
                  disabled={!selectedOutcomeId}
                  className="flex-1 py-3 bg-tertiary-container text-on-tertiary-container rounded-xl text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
