import { useNavigate } from 'react-router-dom';
import { StubMarket, formatVolume } from '@/lib/stub-data';

type Props = {
  market: StubMarket;
};

const ICON_COLOR_CLASSES: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
};

const AVATAR_COLORS = ['bg-primary/30', 'bg-secondary/30', 'bg-tertiary/30'];

export function MarketCard({ market }: Props) {
  const navigate = useNavigate();
  const yesPct = market.outcomes[0]?.probability ?? 0;
  const iconColorClass = ICON_COLOR_CLASSES[market.iconColor] ?? 'text-primary';

  return (
    <div
      onClick={() => navigate(`/markets/${market.id}`)}
      className="glass-panel bg-surface-container-low ghost-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 hover:bg-surface-container/60 transition-all duration-300 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5 sm:mb-6">
        <div className="flex gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface-container-highest flex items-center justify-center ghost-border flex-shrink-0">
            <span className={`material-symbols-outlined ${iconColorClass} text-2xl sm:text-3xl`}>
              {market.icon}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {market.title}
            </h3>
            <p className="text-on-surface-variant text-xs mt-0.5">{market.subcategory}</p>
          </div>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-on-surface-variant hover:text-on-surface transition-colors flex-shrink-0 ml-2"
        >
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Probability bar */}
      <div className="flex flex-col items-center mb-5 sm:mb-6">
        <div className="w-full flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1 mb-2">
          <span>Yes Chance</span>
          <span>No Chance</span>
        </div>
        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden flex">
          <div className="h-full bg-primary" style={{ width: `${yesPct}%` }} />
          <div className="h-full bg-on-surface-variant/20" style={{ width: `${100 - yesPct}%` }} />
        </div>
        <div className="flex justify-between w-full mt-2 font-black text-lg sm:text-xl">
          <span className="text-primary">{yesPct}%</span>
          <span className="text-on-surface-variant">{100 - yesPct}%</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 sm:gap-3 mb-4">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/markets/${market.id}`); }}
          className="flex-1 bg-primary-container text-on-primary-container text-sm font-black py-2.5 sm:py-3 rounded-xl hover:brightness-110 transition-all active:scale-95"
        >
          BUY YES
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/markets/${market.id}`); }}
          className="flex-1 bg-tertiary-container text-on-tertiary-container text-sm font-black py-2.5 sm:py-3 rounded-xl hover:brightness-110 transition-all active:scale-95"
        >
          BUY NO
        </button>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-on-surface-variant text-[10px] font-bold uppercase tracking-wide">
          <span className="material-symbols-outlined text-sm">analytics</span>
          {formatVolume(market.volume)} Vol
        </div>
        <div className="flex -space-x-2">
          {AVATAR_COLORS.slice(0, 2).map((bg, i) => (
            <div
              key={i}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-surface ${bg}`}
            />
          ))}
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[7px] sm:text-[8px] font-bold border-2 border-surface text-on-surface-variant">
            +{Math.floor(market.traderCount / 100)}
          </div>
        </div>
      </div>
    </div>
  );
}
