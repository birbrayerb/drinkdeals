import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const loc = useLocation();
  const isHome = loc.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="glass-strong sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'var(--grad1)' }}>
              🍻
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              <span className="text-white">drink</span><span className="grad-text">deals</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/florida/miami" className={`pill ${loc.pathname.includes('miami') ? 'pill-active' : 'pill-inactive'}`}>
              Miami
            </Link>
            <span className="pill pill-inactive opacity-40 cursor-default">Tampa</span>
            <span className="pill pill-inactive opacity-40 cursor-default">NYC</span>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-20">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--grad1)' }}>🍻</div>
                <span className="font-bold" style={{ fontFamily: 'Space Grotesk' }}>drinkdeals</span>
              </div>
              <p className="text-sm text-[var(--text2)] leading-relaxed">
                Find the best happy hour specials and drink deals near you. Updated regularly.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text3)] mb-3">Cities</h4>
              <div className="flex flex-col gap-1.5">
                <Link to="/florida/miami" className="text-sm text-[var(--text2)] hover:text-white">Miami, FL</Link>
                <span className="text-sm text-[var(--text3)]">Tampa, FL — soon</span>
                <span className="text-sm text-[var(--text3)]">Orlando, FL — soon</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text3)] mb-3">Popular Searches</h4>
              <div className="flex flex-col gap-1.5 text-sm text-[var(--text2)]">
                <Link to="/florida/miami" className="hover:text-white">Happy Hour Miami</Link>
                <Link to="/florida/miami" className="hover:text-white">Drink Deals South Beach</Link>
                <Link to="/florida/miami" className="hover:text-white">Brickell Happy Hour</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[var(--border)] mt-8 pt-6 text-center">
            <p className="text-xs text-[var(--text3)]">© {new Date().getFullYear()} DrinkDeals.com · All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
