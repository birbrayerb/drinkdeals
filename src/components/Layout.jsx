import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-[var(--bg2)] border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🍻</span>
            <span className="text-xl font-bold text-[var(--accent)]">DrinkDeals</span>
            <span className="text-sm text-[var(--text2)]">.com</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/florida" className="text-[var(--text2)] hover:text-white no-underline">Florida</Link>
            <a href="#" className="text-[var(--text2)] hover:text-white no-underline opacity-50 cursor-not-allowed">New York</a>
            <a href="#" className="text-[var(--text2)] hover:text-white no-underline opacity-50 cursor-not-allowed">Texas</a>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="bg-[var(--bg2)] border-t border-[var(--border)] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[var(--text2)]">
          <p>© {new Date().getFullYear()} DrinkDeals.com — Find the best happy hour and drink specials near you</p>
          <p className="mt-2">
            <Link to="/florida/miami">Miami Drink Deals</Link>
            {' · '}
            <span className="opacity-50">Tampa (coming soon)</span>
            {' · '}
            <span className="opacity-50">Orlando (coming soon)</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
