import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Markets', to: '/markets' },
  { label: 'Portfolio', to: '/portfolio' },
];

const LEGAL_LINKS = [
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Risk Disclosure', to: '/risk' },
];

const SOCIAL_LINKS = [
  { label: 'X / Twitter', icon: 'alternate_email', href: '#' },
  { label: 'Discord', icon: 'forum', href: '#' },
  { label: 'GitHub', icon: 'code', href: '#' },
];

const CATEGORIES = ['Politics', 'Sports', 'Crypto', 'Tech', 'Entertainment', 'Economics'];

export function Footer() {
  return (
    // Hidden on mobile — BottomNav handles mobile navigation
    <footer className="hidden md:block border-t border-white/10 mt-auto">
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ten IQ Markets
              </span>
            </Link>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
              A decentralized prediction market where you trade on the outcomes of real-world events.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl ghost-border flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all"
                >
                  <span className="material-symbols-outlined text-base">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Markets */}
          <div className="col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/markets?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-on-surface/70 hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-on-surface/70 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-on-surface/70 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-on-surface-variant/60">
            © {new Date().getFullYear()} Ten IQ Studios. All rights reserved.
          </p>
          <p className="text-xs text-on-surface-variant/40 max-w-lg text-right leading-relaxed">
            Trading on prediction markets involves financial risk. Past performance is not indicative
            of future results. Not available in all jurisdictions.
          </p>
        </div>
      </div>
    </footer>
  );
}
