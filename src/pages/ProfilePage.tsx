import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STUB_POSITIONS, STUB_TRADE_HISTORY, formatVolume } from '@/lib/stub-data';

const WALLET_ADDRESS = '0x3fA8b653114Cc79a64b7e2B7e6D0A4E1234abCD';

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const totalTraded = STUB_TRADE_HISTORY.reduce((s, t) => s + t.shares * t.price, 0);
const winRate = 64; // stub — % of resolved markets where user held the winning side

const BADGES = [
  { icon: 'currency_bitcoin', label: 'Crypto Degen', color: 'text-primary', earned: true },
  { icon: 'sports_soccer', label: 'Sports Fan', color: 'text-secondary', earned: true },
  { icon: 'how_to_vote', label: 'Politico', color: 'text-tertiary', earned: true },
  { icon: 'bolt', label: 'Fast Mover', color: 'text-primary', earned: true },
  { icon: 'trending_up', label: 'Bull Mode', color: 'text-secondary', earned: true },
  { icon: 'diamond', label: 'Diamond Hands', color: 'text-on-surface-variant', earned: false },
  { icon: 'workspace_premium', label: 'Top 1%', color: 'text-on-surface-variant', earned: false },
  { icon: 'groups', label: 'Influencer', color: 'text-on-surface-variant', earned: false },
  { icon: 'psychology', label: 'Oracle', color: 'text-on-surface-variant', earned: false },
];

const WATCHLIST = [
  { id: 'g7-cbdc', title: 'G7 CBDC by 2027?', pct: 29, category: 'Politics' },
  { id: 'uk-eu', title: 'UK rejoins EU Single Market?', pct: 18, category: 'Politics' },
  { id: 'eth-price', title: 'ETH price at EOY 2025', pct: 51, category: 'Crypto' },
  { id: 'starship', title: 'Starship Flight 5 Success?', pct: 82, category: 'Tech' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-[1600px] mx-auto pt-[124px] pb-28 md:pb-10 px-4 sm:px-8">

      {/* ── Profile hero ───────────────────────────────── */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary/40 to-secondary/30 border border-primary/30 text-3xl font-black text-primary select-none">
            0x
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono font-bold text-on-surface text-base sm:text-lg">
                {truncateAddress(WALLET_ADDRESS)}
              </span>
              <button
                onClick={copyAddress}
                className="p-1.5 rounded-lg hover:bg-white/10 text-on-surface-variant hover:text-primary transition-all"
                aria-label="Copy address"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                Joined March 2026
              </span>
              <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                Rank #142 · Top 5%
              </span>
              <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                {STUB_POSITIONS.length} open positions
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button className="px-4 py-2 ghost-border rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">share</span>
              Share
            </button>
            <button
              onClick={() => navigate('/profile/edit')}
              className="px-4 py-2 bg-primary-container text-on-primary-container rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">

          {/* ── Public stats ─────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Leaderboard Rank', value: '#142', sub: 'overall', icon: 'military_tech', color: 'text-primary' },
              { label: 'Win Rate', value: `${winRate}%`, sub: 'resolved markets', icon: 'emoji_events', color: 'text-secondary' },
              { label: 'Volume Traded', value: formatVolume(totalTraded), sub: 'all time', icon: 'swap_horiz', color: 'text-primary' },
              { label: 'Markets Traded', value: `${STUB_TRADE_HISTORY.length}`, sub: 'total trades', icon: 'bar_chart', color: 'text-tertiary' },
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
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Leaderboard breakdown ────────────────────── */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-sm font-black text-on-surface uppercase tracking-widest mb-5">
              Leaderboard Rankings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'By Volume', rank: '#89', pct: 'Top 3%', bar: 97, color: 'bg-primary' },
                { label: 'By P&L', rank: '#142', pct: 'Top 5%', bar: 95, color: 'bg-secondary' },
                { label: 'By Win Rate', rank: '#204', pct: 'Top 8%', bar: 92, color: 'bg-tertiary' },
              ].map(({ label, rank, pct, bar, color }) => (
                <div key={label} className="bg-white/5 rounded-xl p-4">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">{label}</p>
                  <p className="text-2xl font-black text-on-surface mb-1">{rank}</p>
                  <p className="text-xs text-secondary mb-3">{pct} of traders</p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Badges ───────────────────────────────────── */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black text-on-surface uppercase tracking-widest">Badges</h2>
              <span className="text-[10px] text-on-surface-variant">
                {BADGES.filter((b) => b.earned).length} / {BADGES.length} earned
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {BADGES.map(({ icon, label, color, earned }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ghost-border transition-all ${
                    earned ? 'bg-white/5 hover:bg-white/10' : 'opacity-30'
                  }`}
                  title={earned ? label : `${label} (locked)`}
                >
                  <span className={`material-symbols-outlined text-2xl ${color}`}
                    style={earned ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  <span className="text-[9px] text-center text-on-surface-variant font-bold leading-tight">
                    {label}
                  </span>
                  {!earned && (
                    <span className="material-symbols-outlined text-[10px] text-on-surface-variant/50">lock</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="xl:w-72 flex-shrink-0 space-y-5">

          {/* Quick link to portfolio */}
          <Link
            to="/portfolio"
            className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:bg-white/5 transition-all group block"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                View Portfolio
              </p>
              <p className="text-xs text-on-surface-variant">Positions, P&L, trade history</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              arrow_forward
            </span>
          </Link>

          {/* Watchlist */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                Watchlist
              </h3>
              <Link to="/markets" className="text-[10px] text-primary hover:underline font-bold">
                Browse
              </Link>
            </div>
            <div className="space-y-3">
              {WATCHLIST.map(({ id, title, pct, category }) => (
                <Link
                  key={id}
                  to={`/markets/${id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-primary leading-none">{pct}%</span>
                    <span className="text-[8px] text-on-surface-variant/60 leading-none mt-0.5">Yes</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-on-surface/70 group-hover:text-on-surface transition-colors line-clamp-2 leading-snug">
                      {title}
                    </p>
                    <p className="text-[9px] text-on-surface-variant/60 mt-0.5">{category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity summary */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {STUB_TRADE_HISTORY.slice(0, 4).map((trade) => (
                <Link
                  key={trade.id}
                  to={`/markets/${trade.marketId}`}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    trade.side === 'buy' ? 'bg-secondary' : 'bg-tertiary'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-on-surface/70 group-hover:text-on-surface transition-colors line-clamp-1">
                      {trade.side === 'buy' ? 'Bought' : 'Sold'} {trade.outcome}
                    </p>
                    <p className="text-[9px] text-on-surface-variant/60 line-clamp-1">{trade.marketTitle}</p>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant flex-shrink-0">
                    ${(trade.shares * trade.price).toFixed(0)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
