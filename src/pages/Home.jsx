import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { states } from '../data/deals'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>DrinkDeals.com — Find Happy Hour & Drink Specials Near You</title>
        <meta name="description" content="Find the best happy hour deals, drink specials, and bar promotions in cities across the USA. Search by city, day, and time to discover deals happening right now." />
        <link rel="canonical" href="https://drinkdeals.com" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00] via-[var(--bg)] to-[var(--bg)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-[var(--accent)]">Drink Deals</span> Near You
          </h1>
          <p className="text-xl text-[var(--text2)] max-w-2xl mx-auto mb-8">
            Find the best happy hour specials, drink discounts, and bar promotions happening right now in your city.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/florida/miami"
              className="bg-[var(--accent)] text-black font-bold px-8 py-3 rounded-xl text-lg no-underline hover:bg-amber-400 transition"
            >
              🌴 Miami Deals
            </Link>
            <span className="bg-[var(--bg3)] text-[var(--text2)] px-8 py-3 rounded-xl text-lg opacity-50 cursor-not-allowed">
              More cities coming soon
            </span>
          </div>
        </div>
      </section>

      {/* States */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Browse by State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {states.map(s => (
            <Link
              key={s.slug}
              to={`/${s.slug}`}
              className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-6 no-underline hover:border-[var(--accent)]/50 transition"
            >
              <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
              <p className="text-sm text-[var(--text2)]">{s.cities.length} cities · {s.slug === 'florida' ? '20+ bars' : 'Coming soon'}</p>
            </Link>
          ))}
        </div>

        {/* SEO content */}
        <div className="mt-16 prose prose-invert max-w-3xl">
          <h2 className="text-xl font-bold text-white">About DrinkDeals.com</h2>
          <p className="text-[var(--text2)] leading-relaxed">
            DrinkDeals.com is the ultimate guide to finding happy hour specials, drink deals, and bar promotions across the United States.
            Whether you're looking for cheap drinks in Miami, happy hour deals in New York, or bar specials in your neighborhood,
            we help you find the best prices on cocktails, beer, wine, and food at bars and restaurants near you.
          </p>
          <p className="text-[var(--text2)] leading-relaxed">
            Filter by city, day of the week, and time of day to find deals happening right now. See all deals on a map sorted by proximity
            to your location, or browse by neighborhood. Never miss a happy hour again.
          </p>
        </div>
      </section>
    </>
  )
}
