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

export function MarketCardMulti({ market }: Props) {
  const navigate = useNavigate();
  const topOutcomes = market.outcomes.slice(0, 2);
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
            <h3 className="font-bold text-sm sm:text-base text-on-surface group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
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

      {/* Top outcomes */}
      <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
        {topOutcomes.map((outcome) => (
          <div
            key={outcome.id}
            className="flex items-center justify-between p-2.5 sm:p-3 bg-surface-container-highest/50 rounded-xl ghost-border hover:bg-surface-variant/50 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-on-surface font-bold text-sm sm:text-base">{outcome.label}</span>
              <span className="text-secondary font-black text-sm sm:text-base">{outcome.probability}%</span>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/markets/${market.id}`); }}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-lg bg-primary-container text-on-primary-container hover:brightness-110 transition-all"
              >
                Yes
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/markets/${market.id}`); }}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-lg bg-tertiary-container text-on-tertiary-container hover:brightness-110 transition-all"
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-on-surface-variant text-[10px] font-bold uppercase tracking-wide">
          <span className="material-symbols-outlined text-sm">analytics</span>
          {formatVolume(market.volume)} Vol
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/markets/${market.id}`); }}
          className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:underline"
        >
          View All Outcomes
        </button>
      </div>
    </div>
  );
}
