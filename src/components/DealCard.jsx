import { Link } from 'react-router-dom'
import { formatTime, daysLabel, isDealActiveNow } from '../utils'

export default function DealCard({ bar, deal, distance, citySlug, stateSlug }) {
  const active = isDealActiveNow(deal);

  return (
    <div className={`glass card-hover rounded-2xl overflow-hidden ${active ? 'glow-green' : ''}`}>
      {/* Top accent bar */}
      <div className="h-0.5" style={{ background: active ? 'var(--green)' : 'var(--grad1)' }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: 'rgba(245, 166, 35, 0.08)', border: '1px solid rgba(245, 166, 35, 0.12)' }}>
              {bar.image}
            </div>
            <div className="min-w-0">
              <Link
                to={`/${stateSlug}/${citySlug}/${bar.slug}`}
                className="font-semibold text-white no-underline hover:opacity-80 block truncate"
                style={{ fontFamily: 'Space Grotesk', fontSize: '15px' }}
              >
                {bar.name}
              </Link>
              <div className="text-xs text-[var(--text2)] flex items-center gap-1.5 mt-0.5">
                <span>{bar.neighborhood}</span>
                {distance != null && (
                  <>
                    <span className="text-[var(--text3)]">·</span>
                    <span className="text-[var(--amber)]">{distance.toFixed(1)} mi</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {active && (
            <div className="live-badge shrink-0 bg-[var(--green)]/15 text-[var(--green)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full" />
              Live
            </div>
          )}
        </div>

        {/* Deal content */}
        <div className="rounded-xl p-3.5" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold grad-text">{deal.description}</span>
            <span className="text-[11px] text-[var(--text2)] font-mono">
              {formatTime(deal.startTime)}–{formatTime(deal.endTime)}
            </span>
          </div>
          <div className="text-[11px] text-[var(--text3)] font-medium mb-2.5">{daysLabel(deal.days)}</div>
          <div className="flex flex-wrap gap-1.5">
            {deal.items.slice(0, 5).map((item, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(245, 166, 35, 0.06)', border: '1px solid rgba(245, 166, 35, 0.1)', color: 'var(--text)' }}>
                {item}
              </span>
            ))}
            {deal.items.length > 5 && (
              <span className="text-xs px-2.5 py-1 rounded-lg text-[var(--text3)]">
                +{deal.items.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
