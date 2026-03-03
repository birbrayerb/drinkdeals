import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { states, cities } from '../data/deals'

export default function StatePage() {
  const { stateSlug } = useParams();
  const state = states.find(s => s.slug === stateSlug);
  if (!state) return <div className="max-w-6xl mx-auto px-4 py-12"><h1>State not found</h1></div>;

  return (
    <>
      <Helmet>
        <title>Drink Deals in {state.name} — Happy Hour Specials | DrinkDeals</title>
        <meta name="description" content={`Find happy hour deals and drink specials in ${state.name}. Browse by city.`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="text-xs text-[var(--text3)] mb-6 flex items-center gap-1.5">
          <Link to="/" className="text-[var(--text2)] hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-[var(--text)]">{state.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
          Drink deals in <span className="grad-text">{state.name}</span>
        </h1>
        <p className="text-[var(--text2)] mb-8 text-sm">Choose a city to explore happy hour specials.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.cities.map(citySlug => {
            const city = cities[citySlug];
            return city ? (
              <Link key={citySlug} to={`/${stateSlug}/${citySlug}`}
                className="glass card-hover rounded-2xl overflow-hidden no-underline">
                <div className="h-0.5" style={{ background: 'var(--grad1)' }} />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>{city.name}</h2>
                  <p className="text-sm text-[var(--text2)]">View deals →</p>
                </div>
              </Link>
            ) : (
              <div key={citySlug} className="glass rounded-2xl p-6 opacity-40">
                <h2 className="text-xl font-bold text-white mb-1 capitalize" style={{ fontFamily: 'Space Grotesk' }}>{citySlug.replace('-', ' ')}</h2>
                <p className="text-sm text-[var(--text3)]">Coming soon</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
}
