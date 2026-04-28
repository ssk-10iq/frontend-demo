import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NAV_CATEGORIES, STUB_POSITIONS } from '@/lib/stub-data';
import { DepositModal } from './DepositModal';

// Stub balances — replace with API/on-chain data at integration time
const CASH_BALANCE = 500;
const PORTFOLIO_VALUE = STUB_POSITIONS.reduce(
  (sum, p) => sum + p.shares * p.currentPrice,
  0
);

function fmt(n: number) {
  return n >= 1000
    ? `$${(n / 1000).toFixed(1)}K`
    : `$${n.toFixed(0)}`;
}

export function Header() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [depositOpen, setDepositOpen] = useState(false);

  const currentCategory = new URLSearchParams(search).get('category') ?? '';
  const isHome = pathname === '/';

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/markets?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function isNavActive(path: string) {
    if (path === '/') return isHome;
    const catParam = new URLSearchParams(path.split('?')[1] ?? '').get('category') ?? '';
    return pathname.startsWith('/markets') && currentCategory === catParam;
  }

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        {/* Main top bar */}
        <header className="w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between gap-4 sm:gap-6">

            {/* Logo */}
            <Link
              to="/"
              className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary-container bg-clip-text text-transparent whitespace-nowrap flex-shrink-0"
            >
              Ten IQ Markets
            </Link>

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 ghost-border rounded-full py-2.5 pl-12 pr-4 text-sm text-on-surface placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">

              {/* Mobile search toggle */}
              <button
                className="md:hidden p-2 hover:bg-white/5 rounded-full transition-all"
                onClick={() => setMobileSearchOpen((v) => !v)}
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-on-surface">search</span>
              </button>

              {/* Notifications */}
              <button
                className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-95"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              </button>

              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const connected = mounted && account && chain;

                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary-container px-3 sm:px-5 py-2 rounded-full font-bold text-on-primary active:scale-95 transition-all shadow-lg shadow-primary/20 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <span
                          className="material-symbols-outlined text-lg sm:text-xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          account_balance_wallet
                        </span>
                        <span>Connect</span>
                      </button>
                    );
                  }

                  return (
                    <>
                      {/* Balance chips — desktop only */}
                      <div className="hidden md:flex items-center gap-1.5">
                        {/* Portfolio value */}
                        <button
                          onClick={() => navigate('/portfolio')}
                          className="flex items-center gap-1.5 ghost-border bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition-all group"
                          title="Portfolio value"
                        >
                          <span className="material-symbols-outlined text-primary text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            pie_chart
                          </span>
                          <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                            {fmt(PORTFOLIO_VALUE)}
                          </span>
                        </button>

                        {/* Cash balance */}
                        <button
                          onClick={() => navigate('/portfolio')}
                          className="flex items-center gap-1.5 ghost-border bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition-all group"
                          title="Available cash"
                        >
                          <span className="material-symbols-outlined text-secondary text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            payments
                          </span>
                          <span className="text-xs font-bold text-on-surface group-hover:text-secondary transition-colors">
                            {fmt(CASH_BALANCE)}
                          </span>
                        </button>
                      </div>

                      {/* Deposit button */}
                      <button
                        onClick={() => setDepositOpen(true)}
                        className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-secondary/10 whitespace-nowrap"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        <span className="hidden sm:inline">Deposit</span>
                      </button>

                      {/* Profile button */}
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary-container px-3 sm:px-4 py-2 rounded-full font-bold text-on-primary active:scale-95 transition-all shadow-lg shadow-primary/20 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <span
                          className="material-symbols-outlined text-base sm:text-lg"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          person
                        </span>
                        <span className="hidden sm:inline">{account.displayName}</span>
                      </button>
                    </>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>

          {/* Mobile search bar (expands below header) */}
          {mobileSearchOpen && (
            <div className="md:hidden px-4 pb-3">
              <form onSubmit={handleSearch} className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  search
                </span>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 ghost-border rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </form>
            </div>
          )}
        </header>

        {/* Category subnav */}
        <nav className="w-full bg-slate-950/40 backdrop-blur-md border-t border-white/5 overflow-x-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-11 flex items-center gap-6 sm:gap-8 text-[11px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">
            {NAV_CATEGORIES.map(({ label, path }) => {
              const active = isNavActive(path);
              return (
                <Link
                  key={label}
                  to={path}
                  className={`h-11 flex items-center transition-colors ${
                    active
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
    </>
  );
}
