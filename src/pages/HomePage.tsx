import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketCard } from '@/components/market/MarketCard';
import { MarketCardMulti } from '@/components/market/MarketCardMulti';
import {
  STUB_MARKETS,
  TRENDING_ITEMS,
  CLOSING_SOON_ITEMS,
  formatVolume,
  formatTraders,
} from '@/lib/stub-data';

const FILTER_CATEGORIES = ['All Markets', 'Crypto', 'Politics', 'Sports', 'Entertainment', 'Technology'];

const FEATURED_MARKET = STUB_MARKETS.find((m) => m.id === 'btc-ath')!;
const FEATURED_YES_PCT = FEATURED_MARKET.outcomes[0]?.probability ?? 68;

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Markets');

  const gridMarkets = STUB_MARKETS.filter((m) => m.id !== 'btc-ath').filter((m) => {
    if (activeFilter === 'All Markets') return true;
    if (activeFilter === 'Technology') return m.category === 'Tech';
    return m.category === activeFilter;
  }).slice(0, 6);

  return (
    <main className="pt-[124px] pb-28 md:pb-10 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto grid grid-cols-12 gap-6 lg:gap-8">
      {/* Left content column */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-8 sm:space-y-10">

        {/* Featured hero */}
        <section
          onClick={() => navigate(`/markets/${FEATURED_MARKET.id}`)}
          className="relative group h-[280px] sm:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden glass-panel bg-surface-container-low ghost-border cursor-pointer"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/10" />
          {/* Animated mesh overlay */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700 bg-gradient-to-tr from-primary/30 via-transparent to-secondary-container/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="bg-secondary/20 text-secondary text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-secondary/30">
                Live Now
              </span>
              <span className="text-on-surface-variant text-xs sm:text-sm font-medium">
                Vol: {formatVolume(FEATURED_MARKET.volume)}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-on-surface mb-4 sm:mb-6 leading-tight tracking-tighter max-w-2xl">
              {FEATURED_MARKET.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
              {/* Mini chart */}
              <div className="flex-1 h-12 sm:h-16 hidden sm:block">
                <svg className="w-full h-full" viewBox="0 0 400 64" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#95a9ff" />
                      <stop offset="100%" stopColor="#26fedc" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,52 Q50,45 100,55 T200,26 T300,38 T400,12"
                    fill="none"
                    stroke="url(#chart-grad)"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">
                    Probability
                  </p>
                  <p className="text-2xl sm:text-4xl font-black text-secondary">{FEATURED_YES_PCT}%</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/markets/${FEATURED_MARKET.id}`); }}
                    className="bg-primary-container hover:brightness-110 transition-all text-on-primary-container text-sm sm:text-base font-bold px-5 sm:px-7 py-3 rounded-xl active:scale-95 shadow-lg shadow-primary/20"
                  >
                    Yes ${(FEATURED_YES_PCT / 100).toFixed(2)}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/markets/${FEATURED_MARKET.id}`); }}
                    className="bg-tertiary-container hover:brightness-110 transition-all text-on-tertiary-container text-sm sm:text-base font-bold px-5 sm:px-7 py-3 rounded-xl active:scale-95"
                  >
                    No ${((100 - FEATURED_YES_PCT) / 100).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category filter chips */}
        <section className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary/20'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Market grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {gridMarkets.length === 0 ? (
            <p className="col-span-2 text-on-surface-variant text-center py-12">
              No markets in this category yet.
            </p>
          ) : (
            gridMarkets.map((market) =>
              market.type === 'binary' ? (
                <MarketCard key={market.id} market={market} />
              ) : (
                <MarketCardMulti key={market.id} market={market} />
              )
            )
          )}
        </section>
      </div>

      {/* Right sidebar */}
      <aside className="hidden md:block md:col-span-4 lg:col-span-3">
        <div className="space-y-6 md:sticky md:top-[124px]">
          {/* Trending panel */}
          <div className="glass-panel bg-surface-container-low ghost-border rounded-2xl sm:rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-black text-on-surface tracking-tight uppercase">
                Trending
              </h2>
              <span className="material-symbols-outlined text-secondary">trending_up</span>
            </div>
            <div className="space-y-5">
              {TRENDING_ITEMS.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/markets/${item.id}`)}
                  className="flex gap-4 group cursor-pointer"
                >
                  <span className="text-xl font-black text-outline-variant group-hover:text-secondary transition-colors w-6 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm leading-snug group-hover:text-on-surface transition-colors line-clamp-2 text-on-surface/80">
                      {item.title}
                    </h4>
                    <p className="text-secondary text-[10px] font-black mt-1 uppercase tracking-widest">
                      {item.probability}% Yes{' '}
                      <span className="text-on-surface-variant/60 font-medium">
                        · {formatVolume(item.volume)} Vol
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing soon panel */}
          <div className="glass-panel bg-surface-container-low ghost-border rounded-2xl sm:rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-black text-on-surface tracking-tight uppercase">
                Closing Soon
              </h2>
              <span className="material-symbols-outlined text-error">timer</span>
            </div>
            <div className="space-y-5">
              {CLOSING_SOON_ITEMS.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/markets/${item.id}`)}
                  className="flex gap-4 group cursor-pointer"
                >
                  <span className="text-xl font-black text-outline-variant group-hover:text-secondary transition-colors w-6 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm leading-snug group-hover:text-on-surface transition-colors line-clamp-2 text-on-surface/80">
                      {item.title}
                    </h4>
                    <p className="text-secondary text-[10px] font-black mt-1 uppercase tracking-widest">
                      {item.probability}% Yes{' '}
                      <span className="text-error font-medium">· {item.timeLeft}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="glass-panel bg-surface-container-low ghost-border rounded-2xl p-5">
            <h2 className="text-xs font-black text-on-surface uppercase tracking-widest mb-4">
              Platform Stats
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Total Volume', value: '$48.2M' },
                { label: 'Open Markets', value: `${STUB_MARKETS.length}` },
                { label: 'Active Traders', value: formatTraders(STUB_MARKETS.reduce((a, m) => a + m.traders, 0)) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">{label}</span>
                  <span className="text-xs font-black text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
