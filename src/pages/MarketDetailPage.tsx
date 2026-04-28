import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TradeModal } from '@/components/trading/TradeModal';
import { ResolutionPanel } from '@/components/trading/ResolutionPanel';
import { DisputeList } from '@/components/market/DisputeList';
import {
  getMarketById,
  getDisputesForMarket,
  formatVolume,
  formatTraders,
  formatTimeLeft,
  MarketStatus,
} from '@/lib/stub-data';

const CHART_PERIODS = ['1D', '1W', '1M', 'All'];
const BASE_INFO_TABS = ['About', 'Activity', 'Comments', 'Leaderboard'];

const STATUS_BADGE: Record<MarketStatus, { label: string; classes: string; dot: boolean }> = {
  open:      { label: 'Live',      classes: 'bg-secondary/20 text-secondary border-secondary/30',              dot: true  },
  closed:    { label: 'Closed',    classes: 'bg-primary/20 text-primary border-primary/30',                    dot: false },
  resolved:  { label: 'Resolved',  classes: 'bg-tertiary/20 text-tertiary border-tertiary/30',                 dot: false },
  finalized: { label: 'Final',     classes: 'bg-surface-container text-on-surface-variant border-outline/20',  dot: false },
  cancelled: { label: 'Cancelled', classes: 'bg-error/20 text-error border-error/30',                          dot: false },
  draft:     { label: 'Draft',     classes: 'bg-surface-container text-on-surface-variant border-outline/20',  dot: false },
};
const QUICK_AMOUNTS = [10, 50, 100];

// Outcome color scheme cycling
const OUTCOME_COLORS = [
  { accent: 'primary', bar: 'bg-primary', glow: 'shadow-[0_0_10px_rgba(183,196,255,0.5)]', border: 'border-primary/40', bg: 'bg-primary/5' },
  { accent: 'tertiary', bar: 'bg-tertiary', glow: 'shadow-[0_0_10px_rgba(255,175,237,0.5)]', border: 'border-tertiary/40', bg: 'bg-tertiary/5' },
  { accent: 'secondary', bar: 'bg-secondary', glow: 'shadow-[0_0_10px_rgba(0,245,211,0.5)]', border: 'border-secondary/40', bg: 'bg-secondary/5' },
  { accent: 'primary-fixed-dim', bar: 'bg-primary-fixed-dim', glow: '', border: 'border-white/20', bg: 'bg-white/5' },
];

const ACCENT_TEXT: Record<string, string> = {
  primary: 'text-primary',
  tertiary: 'text-tertiary',
  secondary: 'text-secondary',
  'primary-fixed-dim': 'text-primary-fixed-dim',
};

export default function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const market = getMarketById(id ?? '');

  const [openOutcomeId, setOpenOutcomeId] = useState<string | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amountStr, setAmountStr] = useState('100');
  const [amountMode, setAmountMode] = useState<'usd' | 'shares'>('usd');
  const [showModal, setShowModal] = useState(false);
  const [activeChartPeriod, setActiveChartPeriod] = useState('1D');
  const [activeInfoTab, setActiveInfoTab] = useState('About');
  const [tradeConfirmed, setTradeConfirmed] = useState(false);

  const amount = parseFloat(amountStr) || 0;
  const isTrading = market?.status === 'open';
  const disputes = useMemo(() => getDisputesForMarket(market?.id ?? ''), [market]);
  const infoTabs = useMemo(
    () =>
      market?.status === 'resolved' || market?.status === 'finalized'
        ? [...BASE_INFO_TABS, 'Disputes']
        : BASE_INFO_TABS,
    [market],
  );

  const selectedOutcome = useMemo(
    () => market?.outcomes.find((o) => o.id === selectedOutcomeId) ?? market?.outcomes[0],
    [market, selectedOutcomeId]
  );

  if (!market) {
    return (
      <div className="pt-[124px] px-8 max-w-[1600px] mx-auto text-center py-20">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">
          search_off
        </span>
        <h1 className="text-xl font-bold text-on-surface mb-2">Market not found</h1>
        <p className="text-on-surface-variant mb-6">The market you're looking for doesn't exist.</p>
        <Link to="/" className="text-primary hover:underline">
          ← Back to Markets
        </Link>
      </div>
    );
  }

  const isBinary = market.type === 'binary';
  const price = selectedOutcome ? selectedOutcome.midPrice : 0;
  const shares = price > 0 ? amount / price : 0;
  const fee = amount * 0.005;
  const estimatedPayout = shares;

  function handleConfirmTrade() {
    setShowModal(false);
    setTradeConfirmed(true);
    setTimeout(() => setTradeConfirmed(false), 3000);
  }

  return (
    <>
      <main className="pt-[124px] pb-32 md:pb-10 px-4 lg:px-8 max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Left column */}
        <section className="xl:col-span-8 space-y-8">

          {/* Hero */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              {(() => {
                const badge = STATUS_BADGE[market.status];
                return (
                  <span className={`${badge.classes} border px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5`}>
                    {badge.dot && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                    {badge.label}
                  </span>
                );
              })()}
              <span className="bg-surface-container text-on-surface-variant border border-outline/20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                #{market.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter">
              {market.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                    Closes In
                  </p>
                  <p className="text-xl font-extrabold text-white leading-none">
                    {formatTimeLeft(market.closeDate)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                  Volume
                </p>
                <p className="text-xl font-extrabold text-white leading-none">
                  {formatVolume(market.volume)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                  Traders
                </p>
                <p className="text-xl font-extrabold text-white leading-none">
                  {formatTraders(market.traders)}
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                Probability Trends
              </h2>
              <div className="flex gap-1">
                {CHART_PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActiveChartPeriod(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      activeChartPeriod === p
                        ? 'bg-surface-container-highest text-white'
                        : 'text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Mock chart */}
            <div className="relative w-full h-[200px] sm:h-[240px]">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-white w-full" />
                ))}
              </div>
              {/* Bars */}
              <div className="flex items-end justify-around h-full z-10 relative gap-1 pb-2">
                {[60, 45, 55, 80, 65, 35, 50, 70, 58, 42, 68, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm hover:opacity-100 transition-all"
                    style={{
                      height: `${h}%`,
                      background: i % 3 === 0
                        ? 'rgba(187,198,255,0.4)'
                        : i % 3 === 1
                        ? 'rgba(215,255,243,0.4)'
                        : 'rgba(255,175,237,0.3)',
                    }}
                  />
                ))}
              </div>
              {/* SVG overlay lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 80 Q 20 60, 40 75 T 80 40 T 100 20"
                  fill="none"
                  stroke="#bbc6ff"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 90 Q 30 70, 50 85 T 90 50 T 100 45"
                  fill="none"
                  stroke="#ffafed"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 overflow-x-auto no-scrollbar">
              {market.outcomes.slice(0, 3).map((o, i) => {
                const colors = OUTCOME_COLORS[i % OUTCOME_COLORS.length];
                return (
                  <div key={o.id} className="flex items-center gap-2 flex-shrink-0">
                    <span className={`w-3 h-3 rounded-full ${colors.bar}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      {o.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outcomes list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                Market Outcomes
              </h2>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {market.outcomes.length} Outcome{market.outcomes.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {market.outcomes.map((outcome, i) => {
                const colors = OUTCOME_COLORS[i % OUTCOME_COLORS.length];
                const accentText = ACCENT_TEXT[colors.accent];
                const isOpen = openOutcomeId === outcome.id;
                const changeColor =
                  outcome.change === null
                    ? 'text-slate-500'
                    : outcome.change > 0
                    ? 'text-secondary'
                    : 'text-error';
                const changeLabel =
                  outcome.change === null
                    ? 'Unchanged'
                    : outcome.change > 0
                    ? `+${outcome.change}%`
                    : `${outcome.change}%`;

                return (
                  <div
                    key={outcome.id}
                    className={`glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all ${
                      isOpen ? `${colors.border} ${colors.bg}` : 'hover:border-white/20'
                    }`}
                  >
                    {/* Summary row */}
                    <button
                      className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
                      onClick={() => {
                        setOpenOutcomeId(isOpen ? null : outcome.id);
                        setSelectedOutcomeId(outcome.id);
                      }}
                    >
                      {/* Icon placeholder */}
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                          colors.bg
                        } ${colors.border}`}
                      >
                        <span className={`material-symbols-outlined ${accentText}`}>flag</span>
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-sm sm:text-base text-white">{outcome.label}</h3>
                          <p className={`text-lg sm:text-2xl font-black ${accentText}`}>
                            {outcome.probability}%
                          </p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="h-1.5 flex-grow bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.bar} rounded-full ${colors.glow}`}
                              style={{ width: `${outcome.probability}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${changeColor}`}>
                            {changeLabel}
                          </span>
                        </div>
                      </div>

                      <span
                        className="material-symbols-outlined text-slate-500 flex-shrink-0 transition-transform"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* Order book (expanded) */}
                    {isOpen && outcome.asks.length > 0 && (
                      <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-white/5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              Order Book
                            </span>
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                              Spread: ${(outcome.asks[0]?.price - outcome.bids[0]?.price).toFixed(2)} (
                              {(((outcome.asks[0]?.price - outcome.bids[0]?.price) / outcome.midPrice) * 100).toFixed(1)}%)
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 px-2 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] border-b border-white/5">
                            <span>Price</span>
                            <span className="text-right">Size</span>
                            <span className="text-right">Total</span>
                          </div>

                          {/* Asks (sell) */}
                          {outcome.asks.map((entry, j) => (
                            <div
                              key={j}
                              className="grid grid-cols-3 gap-4 px-2 py-1 hover:bg-white/5 rounded text-xs font-semibold text-tertiary relative overflow-hidden"
                            >
                              <div
                                className="absolute right-0 top-0 bottom-0 bg-tertiary/10"
                                style={{ width: `${(entry.size / (outcome.asks[outcome.asks.length - 1]?.cumulative || 1)) * 60}%` }}
                              />
                              <span className="z-10">${entry.price.toFixed(2)}</span>
                              <span className="text-right z-10 text-slate-300">{entry.size.toLocaleString()}</span>
                              <span className="text-right z-10 text-slate-500">{entry.cumulative.toLocaleString()}</span>
                            </div>
                          ))}

                          {/* Mid price */}
                          <div className="flex items-center justify-between py-2.5 px-4 my-1 rounded-xl bg-slate-900/50 border border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Mid Price
                              </span>
                            </div>
                            <span className="text-lg font-black text-white">${outcome.midPrice.toFixed(3)}</span>
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Live</span>
                          </div>

                          {/* Bids (buy) */}
                          {outcome.bids.map((entry, j) => (
                            <div
                              key={j}
                              className="grid grid-cols-3 gap-4 px-2 py-1 hover:bg-white/5 rounded text-xs font-semibold text-secondary relative overflow-hidden"
                            >
                              <div
                                className="absolute right-0 top-0 bottom-0 bg-secondary/10"
                                style={{ width: `${(entry.size / (outcome.bids[outcome.bids.length - 1]?.cumulative || 1)) * 60}%` }}
                              />
                              <span className="z-10">${entry.price.toFixed(2)}</span>
                              <span className="text-right z-10 text-slate-300">{entry.size.toLocaleString()}</span>
                              <span className="text-right z-10 text-slate-500">{entry.cumulative.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info tabs */}
          <div className="space-y-5 pt-4">
            <div className="flex gap-6 sm:gap-8 border-b border-white/10 overflow-x-auto no-scrollbar">
              {infoTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveInfoTab(tab)}
                  className={`pb-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeInfoTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {tab}
                  {tab === 'Comments' && (
                    <span className="ml-2 bg-surface-container-highest px-1.5 py-0.5 rounded text-[9px]">
                      42
                    </span>
                  )}
                  {tab === 'Disputes' && disputes.length > 0 && (
                    <span className="ml-2 bg-tertiary/20 text-tertiary px-1.5 py-0.5 rounded text-[9px] font-bold">
                      {disputes.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeInfoTab === 'About' && (
              <div className="space-y-4">
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  {market.description}
                </p>
                <div className="p-5 rounded-2xl bg-surface-container-low border border-outline/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary">verified</span>
                    <h4 className="font-bold text-sm text-white uppercase tracking-widest">
                      Resolution Source
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{market.resolutionSource}</p>
                </div>
              </div>
            )}

            {activeInfoTab === 'Activity' && (
              <div className="text-center py-10 text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl mb-2 block">history</span>
                <p className="text-sm">Trade activity will appear here.</p>
              </div>
            )}

            {activeInfoTab === 'Comments' && (
              <div className="text-center py-10 text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl mb-2 block">chat</span>
                <p className="text-sm">Comments will appear here.</p>
              </div>
            )}

            {activeInfoTab === 'Leaderboard' && (
              <div className="text-center py-10 text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl mb-2 block">leaderboard</span>
                <p className="text-sm">Top traders will appear here.</p>
              </div>
            )}

            {activeInfoTab === 'Disputes' && (
              <DisputeList disputes={disputes} outcomes={market.outcomes} />
            )}
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="xl:col-span-4">
          <div className="xl:sticky xl:top-[130px] xl:max-h-[calc(100vh-148px)] xl:overflow-y-auto no-scrollbar space-y-5">

            {!isTrading && <ResolutionPanel market={market} />}

            {/* Trade success banner */}
            {isTrading && tradeConfirmed && (
              <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/30 rounded-2xl">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
                <span className="text-sm font-bold text-secondary">Order submitted!</span>
              </div>
            )}

            {/* Trading card + position card */}
            {isTrading && <><div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl">
              {/* Selected outcome label */}
              <div className="mb-4">
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
                  {selectedOutcome?.label ?? market.outcomes[0]?.label}
                </span>
              </div>

              {/* Buy / Sell tabs */}
              <div className="flex border-b border-white/5 mb-5">
                {(['buy', 'sell'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSide(s)}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                      side === s
                        ? 'text-white border-b-2 border-primary-container'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                {/* Pick outcome */}
                {!isBinary && (
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">
                      Pick Outcome
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {market.outcomes.slice(0, 4).map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setSelectedOutcomeId(o.id)}
                          className={`py-3 px-2 rounded-xl border-2 transition-all text-sm font-bold text-center leading-tight ${
                            selectedOutcomeId === o.id || (!selectedOutcomeId && o.id === market.outcomes[0].id)
                              ? 'border-primary-container bg-primary-container/10 text-white'
                              : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400'
                          }`}
                        >
                          {o.label}
                          <span className="block text-[10px] text-primary-container font-black">
                            ${o.midPrice.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Binary: Yes / No */}
                {isBinary && (
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">
                      Pick Outcome
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {market.outcomes.map((o) => {
                        const isYes = o.id === 'yes';
                        const active = selectedOutcomeId === o.id || (!selectedOutcomeId && isYes);
                        return (
                          <button
                            key={o.id}
                            onClick={() => setSelectedOutcomeId(o.id)}
                            className={`flex flex-col items-center py-4 px-2 rounded-xl border-2 transition-all ${
                              active
                                ? isYes
                                  ? 'border-primary-container bg-primary-container/10'
                                  : 'border-tertiary-container bg-tertiary-container/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <span className={`font-bold text-lg ${active ? 'text-white' : 'text-slate-400'}`}>
                              {o.label}{' '}
                              <span className={isYes ? 'text-primary-container' : 'text-tertiary-container'}>
                                ${o.midPrice.toFixed(2)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Amount
                    </label>
                    <div className="flex bg-surface-container-lowest rounded-lg p-1 gap-0.5">
                      {(['usd', 'shares'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setAmountMode(mode)}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                            amountMode === mode
                              ? 'bg-surface-container-high text-white shadow-sm'
                              : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          {mode === 'usd' ? 'USD' : 'Shares'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-5 py-4 text-2xl font-bold text-white focus:outline-none focus:border-primary-container/50 transition-all"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined">
                      attach_money
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {QUICK_AMOUNTS.map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmountStr(String(v))}
                        className="py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-slate-400 hover:bg-white/10 transition-all"
                      >
                        ${v}
                      </button>
                    ))}
                    <button
                      onClick={() => setAmountStr('500')}
                      className="py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-slate-400 hover:bg-white/10 transition-all"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Summary data */}
                <div className="bg-slate-900/40 rounded-2xl p-4 space-y-3 border border-white/5">
                  {[
                    {
                      label: 'Estimated Payout',
                      value: `$${estimatedPayout.toFixed(2)}`,
                      suffix: amount > 0 ? ` (+${((estimatedPayout / amount - 1) * 100).toFixed(0)}%)` : '',
                      color: 'text-secondary',
                    },
                    {
                      label: 'Shares Received',
                      value: shares.toFixed(2),
                      suffix: '',
                      color: 'text-slate-300',
                    },
                    {
                      label: 'Price Impact',
                      value: shares > 1000 ? `${((shares / 50000) * 100).toFixed(2)}%` : '< 0.01%',
                      suffix: '',
                      color: 'text-slate-300',
                    },
                    {
                      label: 'Trading Fee (0.5%)',
                      value: `$${fee.toFixed(2)}`,
                      suffix: '',
                      color: 'text-slate-300',
                    },
                  ].map(({ label, value, suffix, color }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className={`text-xs font-bold ${color}`}>
                        {value}
                        {suffix && <span className="text-secondary">{suffix}</span>}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Review trade button */}
                <button
                  onClick={() => amount > 0 && setShowModal(true)}
                  disabled={amount <= 0}
                  className="w-full py-4 sm:py-5 bg-primary-container text-on-primary-container rounded-2xl font-black text-base sm:text-lg uppercase tracking-tight hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Review Trade
                </button>
              </div>
            </div>

            {/* Your position card */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5 bg-slate-900/40">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                  Your Position
                </h3>
                <span className="material-symbols-outlined text-slate-500">account_balance_wallet</span>
              </div>
              <div className="space-y-4">
                {/* Stub position for first outcome */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">flag</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{market.outcomes[0]?.label}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      500 Shares
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-black text-sm">$125.00</p>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      +$15.00 P&L
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Avg Price
                    </p>
                    <p className="text-white font-bold text-sm">
                      ${market.outcomes[0]?.midPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Returns
                    </p>
                    <p className="text-secondary font-bold text-sm">+12%</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-error-container text-on-error-container rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-error transition-all active:scale-95">
                  Sell All Position
                </button>
              </div>
            </div>
          </>}
          </div>
        </aside>
      </main>

      {/* Trade modal */}
      {selectedOutcome && (
        <TradeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          market={market}
          outcome={selectedOutcome}
          side={side}
          amount={amount}
          onConfirm={handleConfirmTrade}
        />
      )}
    </>
  );
}
