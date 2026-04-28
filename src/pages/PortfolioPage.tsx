import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  STUB_POSITIONS,
  STUB_TRADE_HISTORY,
  formatVolume,
  formatTimeLeft,
} from '@/lib/stub-data';

function positionValue(p: typeof STUB_POSITIONS[0]) {
  return p.shares * p.currentPrice;
}
function positionCost(p: typeof STUB_POSITIONS[0]) {
  return p.shares * p.avgPrice;
}
function positionPnl(p: typeof STUB_POSITIONS[0]) {
  return positionValue(p) - positionCost(p);
}
function positionPnlPct(p: typeof STUB_POSITIONS[0]) {
  const cost = positionCost(p);
  return cost > 0 ? (positionPnl(p) / cost) * 100 : 0;
}

const totalValue = STUB_POSITIONS.reduce((s, p) => s + positionValue(p), 0);
const totalCost = STUB_POSITIONS.reduce((s, p) => s + positionCost(p), 0);
const totalPnl = totalValue - totalCost;
const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
const totalTraded = STUB_TRADE_HISTORY.reduce((s, t) => s + t.shares * t.price, 0);

// Mock 30-day equity curve
const CHART_POINTS = [
  1200, 1180, 1240, 1310, 1290, 1360, 1420, 1390, 1450, 1480,
  1510, 1530, 1490, 1560, 1600, 1580, 1640, 1700, 1680, 1750,
  1720, 1790, 1810, 1840, 1820, 1870, 1900, 1880, 1842, 1843,
];

function buildChartPath(points: number[], w: number, h: number) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - ((v - min) / range) * (h * 0.85) - h * 0.05);
  return xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
}

const CHART_PERIODS = ['1W', '1M', '3M', 'All'];

const CATEGORY_COLORS: Record<string, string> = {
  Crypto: 'text-primary bg-primary/10 border-primary/20',
  Sports: 'text-secondary bg-secondary/10 border-secondary/20',
  Politics: 'text-tertiary bg-tertiary/10 border-tertiary/20',
  Tech: 'text-primary-fixed-dim bg-primary-fixed-dim/10 border-primary-fixed-dim/20',
  Entertainment: 'text-tertiary bg-tertiary/10 border-tertiary/20',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const TABS = ['Positions', 'Trade History'];

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Positions');
  const [activeChartPeriod, setActiveChartPeriod] = useState('1M');

  const chartPath = buildChartPath(CHART_POINTS, 600, 120);
  const areaPath = `${chartPath} L600,120 L0,120 Z`;
  const monthGain = totalValue - CHART_POINTS[0];
  const monthGainPct = ((monthGain / CHART_POINTS[0]) * 100).toFixed(1);

  return (
    <div className="max-w-[1600px] mx-auto pt-[124px] pb-28 md:pb-10 px-4 sm:px-8">

      {/* ── Page title ─────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">Portfolio</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Your positions and trading activity</p>
        </div>
        <Link
          to="/profile"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">person</span>
          View Profile
        </Link>
      </div>

      {/* ── Stats row ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Portfolio Value',
            value: `$${totalValue.toFixed(2)}`,
            sub: `${STUB_POSITIONS.length} open positions`,
            icon: 'account_balance_wallet',
            color: 'text-primary',
          },
          {
            label: 'Unrealized P&L',
            value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`,
            sub: `${totalPnlPct >= 0 ? '+' : ''}${totalPnlPct.toFixed(1)}%`,
            icon: 'trending_up',
            color: totalPnl >= 0 ? 'text-secondary' : 'text-error',
          },
          {
            label: 'Volume Traded',
            value: formatVolume(totalTraded),
            sub: `${STUB_TRADE_HISTORY.length} total trades`,
            icon: 'swap_horiz',
            color: 'text-primary',
          },
          {
            label: 'Available Balance',
            value: '$500.00',
            sub: 'ready to trade',
            icon: 'payments',
            color: 'text-secondary',
          },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} className="glass-panel rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                {label}
              </span>
              <span className={`material-symbols-outlined text-base ${color}`}>{icon}</span>
            </div>
            <div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              {sub && <p className="text-[11px] text-on-surface-variant mt-0.5">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + tabs ───────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">

          {/* Equity chart */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-sm font-black text-on-surface uppercase tracking-widest">
                  Portfolio Value
                </h2>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-black text-on-surface">${totalValue.toFixed(2)}</p>
                  <p className={`text-sm font-bold ${monthGain >= 0 ? 'text-secondary' : 'text-error'}`}>
                    {monthGain >= 0 ? '+' : ''}${monthGain.toFixed(2)} ({monthGainPct}%)
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {CHART_PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActiveChartPeriod(p)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeChartPeriod === p
                        ? 'bg-primary-container text-on-primary-container'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 600 120" className="w-full h-32" preserveAspectRatio="none">
              <defs>
                <linearGradient id="port-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d7fff3" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d7fff3" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#port-area-grad)" />
              <path d={chartPath} fill="none" stroke="#d7fff3" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Positions / Trade History tabs */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex border-b border-white/10">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary -mb-px'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab}
                  {tab === 'Positions' && (
                    <span className="ml-2 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                      {STUB_POSITIONS.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Positions */}
            {activeTab === 'Positions' && (
              <div className="divide-y divide-white/5">
                {STUB_POSITIONS.map((pos) => {
                  const value = positionValue(pos);
                  const pnl = positionPnl(pos);
                  const pnlPct = positionPnlPct(pos);
                  const catColor = CATEGORY_COLORS[pos.category] ?? 'text-primary bg-primary/10 border-primary/20';
                  return (
                    <div
                      key={`${pos.marketId}-${pos.outcome}`}
                      className="p-5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/markets/${pos.marketId}`)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${catColor}`}>
                              {pos.category}
                            </span>
                            <span className="text-[10px] text-on-surface-variant">
                              Closes {formatTimeLeft(pos.closeDate)}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-on-surface line-clamp-1 mb-0.5">
                            {pos.marketTitle}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {pos.shares.toLocaleString()} shares ·{' '}
                            <span className="text-primary font-bold">{pos.outcome}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Avg Price</p>
                            <p className="text-sm font-bold text-on-surface">${pos.avgPrice.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Value</p>
                            <p className="text-sm font-bold text-on-surface">${value.toFixed(2)}</p>
                          </div>
                          <div className="text-right min-w-[72px]">
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">P&L</p>
                            <p className={`text-sm font-black ${pnl >= 0 ? 'text-secondary' : 'text-error'}`}>
                              {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                            </p>
                            <p className={`text-[10px] ${pnl >= 0 ? 'text-secondary/70' : 'text-error/70'}`}>
                              {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trade History */}
            {activeTab === 'Trade History' && (
              <div className="divide-y divide-white/5">
                {STUB_TRADE_HISTORY.map((trade) => (
                  <div
                    key={trade.id}
                    className="p-5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/markets/${trade.marketId}`)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            trade.side === 'buy'
                              ? 'text-secondary bg-secondary/10 border-secondary/20'
                              : 'text-tertiary bg-tertiary/10 border-tertiary/20'
                          }`}>
                            {trade.side}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            {formatDate(trade.timestamp)} · {formatTime(trade.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-on-surface line-clamp-1 mb-0.5">
                          {trade.marketTitle}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          <span className="text-primary font-bold">{trade.outcome}</span>
                          {' · '}
                          {trade.shares} shares @ ${trade.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Total</p>
                          <p className="text-sm font-bold text-on-surface">
                            ${(trade.shares * trade.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right min-w-[56px]">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Fee</p>
                          <p className="text-sm text-on-surface-variant">${trade.fee.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="xl:w-64 flex-shrink-0 space-y-5">

          {/* Deposit / Withdraw */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">
              Funds
            </h3>
            <div className="mb-4">
              <p className="text-[10px] text-on-surface-variant mb-1">Available balance</p>
              <p className="text-2xl font-black text-on-surface">$500.00</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-primary-container text-on-primary-container text-xs font-bold rounded-xl hover:brightness-110 transition-all">
                Deposit
              </button>
              <button className="flex-1 py-2.5 ghost-border text-on-surface-variant text-xs font-bold rounded-xl hover:bg-white/5 transition-all">
                Withdraw
              </button>
            </div>
          </div>

          {/* Exposure by category */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">
              Exposure by Category
            </h3>
            <div className="space-y-3">
              {Object.entries(
                STUB_POSITIONS.reduce<Record<string, number>>((acc, p) => {
                  acc[p.category] = (acc[p.category] ?? 0) + positionValue(p);
                  return acc;
                }, {})
              ).map(([cat, val]) => {
                const pct = Math.round((val / totalValue) * 100);
                const barColor =
                  cat === 'Crypto' ? 'bg-primary' :
                  cat === 'Sports' ? 'bg-secondary' : 'bg-tertiary';
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-on-surface-variant">{cat}</span>
                      <span className="font-bold text-on-surface">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
