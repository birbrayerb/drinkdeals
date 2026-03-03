import { Link } from 'react-router-dom'
import { formatTime, daysLabel, isDealActiveNow } from '../utils'

export default function DealCard({ bar, deal, distance, citySlug, stateSlug }) {
  const active = isDealActiveNow(deal);
  return (
    <div className={`bg-[var(--bg3)] border rounded-xl p-4 transition hover:border-[var(--accent)]/50 ${
      active ? 'border-[var(--green)]/50 ring-1 ring-[var(--green)]/20' : 'border-[var(--border)]'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{bar.image}</span>
            <Link
              to={`/${stateSlug}/${citySlug}/${bar.slug}`}
              className="font-semibold text-white no-underline hover:text-[var(--accent)] truncate"
            >
              {bar.name}
            </Link>
          </div>
          <div className="text-xs text-[var(--text2)] mb-2">
            {bar.neighborhood} · {bar.address.split(',').slice(-2).join(',').trim()}
            {distance != null && <span className="ml-1 text-[var(--accent)]">· {distance.toFixed(1)} mi</span>}
          </div>
        </div>
        {active && (
          <span className="shrink-0 bg-[var(--green)]/20 text-[var(--green)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
            🟢 Live Now
          </span>
        )}
      </div>

      <div className="bg-[var(--bg2)] rounded-lg p-3 mt-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--accent)]">{deal.description}</span>
          <span className="text-xs text-[var(--text2)]">{formatTime(deal.startTime)} – {formatTime(deal.endTime)}</span>
        </div>
        <div className="text-xs text-[var(--text2)] mb-2">{daysLabel(deal.days)}</div>
        <ul className="space-y-1">
          {deal.items.map((item, i) => (
            <li key={i} className="text-sm flex items-start gap-1.5">
              <span className="text-[var(--accent)] mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
