import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Markets', icon: 'explore', path: '/' },
  { label: 'Trade', icon: 'swap_horiz', path: '/markets' },
  { label: 'Portfolio', icon: 'pie_chart', path: '/portfolio' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-slate-950/80 backdrop-blur-lg rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] text-[9px] uppercase tracking-widest">
      {NAV_ITEMS.map(({ label, icon, path }) => {
        const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
        return (
          <Link
            key={label}
            to={path}
            className={`flex flex-col items-center justify-center transition-all ${
              active ? 'text-primary scale-105' : 'text-slate-500'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg mb-0.5"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
