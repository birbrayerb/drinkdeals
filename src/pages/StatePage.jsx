import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { states, cities } from '../data/deals'

export default function StatePage() {
  const { stateSlug } = useParams();
  const state = states.find(s => s.slug === stateSlug);
  if (!state) return <div className="max-w-7xl mx-auto px-4 py-12"><h1>State not found</h1></div>;

  return (
    <>
      <Helmet>
        <title>Drink Deals in {state.name} — Happy Hour Specials | DrinkDeals.com</title>
        <meta name="description" content={`Find the best happy hour deals and drink specials in ${state.name}. Browse bars by city — Miami, Tampa, Orlando, and more.`} />
        <link rel="canonical" href={`https://drinkdeals.com/${stateSlug}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--text2)] mb-6">
          <Link to="/">Home</Link> / <span className="text-white">{state.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">Drink Deals in {state.name}</h1>
        <p className="text-[var(--text2)] mb-8">Choose a city to find happy hour specials and drink deals near you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.cities.map(citySlug => {
            const city = cities[citySlug];
            const available = !!city;
            return (
              <div key={citySlug}>
                {available ? (
                  <Link
                    to={`/${stateSlug}/${citySlug}`}
                    className="block bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-6 no-underline hover:border-[var(--accent)]/50 transition"
                  >
                    <h2 className="text-xl font-bold text-white mb-1">{city.name}</h2>
                    <p className="text-sm text-[var(--text2)]">View all deals →</p>
                  </Link>
                ) : (
                  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-6 opacity-50">
                    <h2 className="text-xl font-bold text-white mb-1 capitalize">{citySlug.replace('-', ' ')}</h2>
                    <p className="text-sm text-[var(--text2)]">Coming soon</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 prose prose-invert max-w-3xl">
          <h2 className="text-xl font-bold text-white">Happy Hour in {state.name}</h2>
          <p className="text-[var(--text2)] leading-relaxed">
            {state.name} is known for its vibrant bar scene and incredible drink specials. From beachside cocktails in Miami
            to downtown happy hours in Tampa, find the best drink deals across {state.name}'s top cities. We update our deals
            regularly so you always know where to find the cheapest drinks near you.
          </p>
        </div>
      </div>
    </>
  )
}
