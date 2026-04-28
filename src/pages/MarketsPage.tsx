import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MarketCard } from '@/components/market/MarketCard';
import { MarketCardMulti } from '@/components/market/MarketCardMulti';
import {
  STUB_MARKETS,
  CATEGORY_SUBCATEGORIES,
  getMarketsByCategory,
} from '@/lib/stub-data';

const ALL_CATEGORIES = Array.from(new Set(STUB_MARKETS.map((m) => m.category))).sort();

const CATEGORY_META: Record<string, { icon: string; description: string }> = {
  Politics: {
    icon: 'gavel',
    description:
      'Analyze the shift in geopolitical power. From US elections to European legislative cycles, trade on the outcomes of history in the making.',
  },
  Sports: {
    icon: 'sports_soccer',
    description:
      'From World Cups to championship titles, trade on the biggest sporting events and outcomes across the globe.',
  },
  Crypto: {
    icon: 'currency_bitcoin',
    description:
      'Price predictions, protocol decisions, and market milestones — trade on the future of decentralized finance.',
  },
  Tech: {
    icon: 'computer',
    description:
      'From AI breakthroughs to space exploration — trade on the technology that is shaping tomorrow.',
  },
  Entertainment: {
    icon: 'movie',
    description:
      'Awards season, box office records, and cultural moments — who will win, who will rise, who will fall.',
  },
  Economics: {
    icon: 'trending_up',
    description:
      'Interest rates, GDP, inflation targets — trade on the macroeconomic forces driving global markets.',
  },
};

export default function MarketsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlCategory = searchParams.get('category') ?? '';
  const urlSearch = searchParams.get('search') ?? '';
  const activeCategory = urlCategory || ALL_CATEGORIES[0];

  const meta = CATEGORY_META[activeCategory] ?? {
    icon: 'explore',
    description: 'Browse all prediction markets and trade on the outcomes of future events.',
  };

  const subcategories = CATEGORY_SUBCATEGORIES[activeCategory] ?? [];
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);

  let markets = getMarketsByCategory(urlCategory);
  if (urlSearch) {
    markets = STUB_MARKETS.filter((m) =>
      m.title.toLowerCase().includes(urlSearch.toLowerCase())
    );
  }
  if (activeSubcat) {
    markets = markets.filter((m) => m.subcategory === activeSubcat);
  }

  return (
    <div className="max-w-[1600px] mx-auto pt-[124px] pb-28 md:pb-10 px-4 sm:px-8 flex gap-8">
      {/* Left sidebar */}
      <aside className="hidden md:block w-60 flex-shrink-0">
        <div className="glass-panel rounded-2xl overflow-hidden shadow-xl sticky top-[124px]">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-primary-container">{meta.icon}</span>
              <h2 className="text-white font-bold text-base">{activeCategory || 'All Markets'}</h2>
            </div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
              Market Forecasts
            </p>
          </div>
          <nav className="flex flex-col py-3">
            {/* All in category */}
            <button
              onClick={() => setActiveSubcat(null)}
              className={`flex items-center gap-3 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                activeSubcat === null
                  ? 'bg-primary-container/20 text-primary-container border-r-4 border-primary-container'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">apps</span>
              All
            </button>
            {subcategories.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActiveSubcat(label)}
                className={`flex items-center gap-3 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeSubcat === label
                    ? 'bg-primary-container/20 text-primary-container border-r-4 border-primary-container'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{icon}</span>
                {label}
              </button>
            ))}

            {/* Divider + other categories */}
            <div className="h-px bg-white/10 mx-5 my-3" />
            <p className="px-5 pb-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              Other Categories
            </p>
            {ALL_CATEGORIES.filter((c) => c !== activeCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/markets?category=${encodeURIComponent(cat)}`)}
                className="flex items-center gap-3 px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">
                  {CATEGORY_META[cat]?.icon ?? 'circle'}
                </span>
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-4">
        {/* Hero banner */}
        {!urlSearch && (
          <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden mb-8 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent" />
            <div className="relative h-full flex flex-col justify-center px-8 sm:px-12">
              <span className="bg-primary-container/20 text-primary-container text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-primary-container/30 w-fit mb-4">
                Live Market Forecasts
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tighter leading-tight">
                {activeCategory || 'All Markets'}
              </h1>
              <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
                {meta.description}
              </p>
            </div>
          </div>
        )}

        {/* Search result header */}
        {urlSearch && (
          <div className="mb-6">
            <h1 className="text-xl font-black text-on-surface">
              Search results for{' '}
              <span className="text-primary">"{urlSearch}"</span>
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              {markets.length} market{markets.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Mobile subcategory chips */}
        {subcategories.length > 0 && (
          <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
            <button
              onClick={() => setActiveSubcat(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubcat === null
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              All
            </button>
            {subcategories.map(({ label }) => (
              <button
                key={label}
                onClick={() => setActiveSubcat(label)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeSubcat === label
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Market grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {markets.length === 0 ? (
            <div className="col-span-2 text-center py-20">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">
                search_off
              </span>
              <p className="text-on-surface-variant">No markets found.</p>
            </div>
          ) : (
            markets.map((market) =>
              market.type === 'binary' ? (
                <MarketCard key={market.id} market={market} />
              ) : (
                <MarketCardMulti key={market.id} market={market} />
              )
            )
          )}
        </div>
      </main>
    </div>
  );
}
