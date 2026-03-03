import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { states, bars } from '../data/deals'
import { isDealActiveNow } from '../utils'

export default function Home() {
  const activeCount = bars.reduce((n, b) => n + b.deals.filter(isDealActiveNow).length, 0);

  return (
    <>
      <Helmet>
        <title>DrinkDeals — Happy Hour & Drink Specials Near You</title>
        <meta name="description" content="Find the best happy hour deals, drink specials, and bar promotions in cities across the USA. Search by city, day, and time." />
        <link rel="canonical" href="https://drinkdeals.com" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* BG gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.3), transparent 70%)' }} />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(255,64,129,0.3), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
          {activeCount > 0 && (
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[var(--green)] rounded-full live-badge" />
              <span className="text-sm text-[var(--text2)]">
                <span className="text-[var(--green)] font-semibold">{activeCount} deals</span> happening right now
              </span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5" style={{ fontFamily: 'Space Grotesk' }}>
            Find the best<br />
            <span className="grad-text">drink deals</span> near you
          </h1>

          <p className="text-lg md:text-xl text-[var(--text2)] max-w-xl mx-auto mb-10 leading-relaxed">
            Happy hours, specials, and promotions at bars and restaurants — filtered by time, day, and distance.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/florida/miami"
              className="inline-flex items-center gap-2 text-black font-semibold px-8 py-3.5 rounded-full text-base no-underline transition hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'var(--grad1)' }}
            >
              🌴 Explore Miami
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-14">
            {[
              { n: '20+', l: 'Bars' },
              { n: '40+', l: 'Deals' },
              { n: '1', l: 'City (more soon)' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold grad-text" style={{ fontFamily: 'Space Grotesk' }}>{s.n}</div>
                <div className="text-xs text-[var(--text3)] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured city */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Featured Cities</h2>
            <p className="text-sm text-[var(--text2)] mt-1">We're expanding fast. Here's where you can find deals today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Miami card */}
          <Link to="/florida/miami" className="group glass card-hover rounded-2xl overflow-hidden no-underline">
            <div className="h-1" style={{ background: 'var(--grad1)' }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🌴</span>
                <span className="pill pill-active text-xs">Live</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>Miami</h3>
              <p className="text-sm text-[var(--text2)]">20+ bars · South Beach, Brickell, Wynwood & more</p>
              <div className="mt-4 text-sm font-medium grad-text">Explore deals →</div>
            </div>
          </Link>

          {/* Coming soon cards */}
          {['Tampa', 'Orlando'].map(city => (
            <div key={city} className="glass rounded-2xl overflow-hidden opacity-40">
              <div className="h-1 bg-[var(--border)]" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{city === 'Tampa' ? '⚓' : '🎢'}</span>
                  <span className="pill pill-inactive text-xs">Coming Soon</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>{city}</h3>
                <p className="text-sm text-[var(--text2)]">Launching soon</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-10" style={{ fontFamily: 'Space Grotesk' }}>How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📍', title: 'Pick your city', desc: 'Browse bars in Miami, with more cities launching soon.' },
            { icon: '📅', title: 'Filter by day & time', desc: 'See what deals are happening right now, or plan ahead.' },
            { icon: '🗺️', title: 'Find deals nearby', desc: 'View on a map sorted by distance. Never miss a deal.' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-white mb-1.5" style={{ fontFamily: 'Space Grotesk' }}>{s.title}</h3>
              <p className="text-sm text-[var(--text2)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO content */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>About DrinkDeals</h2>
        <p className="text-sm text-[var(--text2)] leading-relaxed">
          DrinkDeals.com is the ultimate guide to finding happy hour specials, drink deals, and bar promotions
          across the United States. Whether you're looking for cheap drinks in Miami, happy hour deals in New York,
          or bar specials near you, we help you find the best prices on cocktails, beer, wine, and food.
          Filter by city, day, and time to find deals happening right now.
        </p>
      </section>
    </>
  )
}
