import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { cities, bars as allBars } from '../data/deals'
import { getDistance, isDealActiveNow, isDealOnDay, dayShort } from '../utils'
import MapView from '../components/MapView'
import DealCard from '../components/DealCard'

const DAYS = [0, 1, 2, 3, 4, 5, 6];
const SORT_OPTIONS = [
  { value: 'proximity', label: 'Nearest' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'neighborhood', label: 'Neighborhood' },
  { value: 'active', label: 'Active Now First' },
];

export default function CityPage() {
  const { stateSlug, citySlug } = useParams();
  const city = cities[citySlug];
  const [userLoc, setUserLoc] = useState(null);
  const [dayFilter, setDayFilter] = useState(new Date().getDay());
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('active');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLoc(city ? { lat: city.lat, lng: city.lng } : null)
      );
    }
  }, [city]);

  if (!city) return <div className="max-w-7xl mx-auto px-4 py-12"><h1>City not found</h1></div>;

  const cityBars = allBars.filter(b => b.city === citySlug);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = [];
    for (const bar of cityBars) {
      // Get deals for selected day
      const dayDeals = bar.deals.filter(d => isDealOnDay(d, dayFilter));
      if (dayDeals.length === 0 && dayFilter !== -1) continue;
      const dealsToShow = dayFilter === -1 ? bar.deals : dayDeals;

      if (showActiveOnly && !dealsToShow.some(d => isDealActiveNow(d))) continue;
      if (neighborhoodFilter !== 'all' && bar.neighborhood !== neighborhoodFilter) continue;

      const dist = userLoc ? getDistance(userLoc.lat, userLoc.lng, bar.lat, bar.lng) : null;
      for (const deal of dealsToShow) {
        result.push({ bar, deal, distance: dist });
      }
    }

    result.sort((a, b) => {
      if (sortBy === 'active') {
        const aActive = isDealActiveNow(a.deal) ? 0 : 1;
        const bActive = isDealActiveNow(b.deal) ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return (a.distance ?? 999) - (b.distance ?? 999);
      }
      if (sortBy === 'proximity') return (a.distance ?? 999) - (b.distance ?? 999);
      if (sortBy === 'name') return a.bar.name.localeCompare(b.bar.name);
      if (sortBy === 'neighborhood') return a.bar.neighborhood.localeCompare(b.bar.neighborhood);
      return 0;
    });

    return result;
  }, [cityBars, dayFilter, neighborhoodFilter, sortBy, showActiveOnly, userLoc]);

  const neighborhoods = [...new Set(cityBars.map(b => b.neighborhood))].sort();
  const activeCount = filtered.filter(f => isDealActiveNow(f.deal)).length;
  const today = new Date().getDay();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Happy Hour Deals in ${city.name}, ${city.stateName}`,
    "description": `Find ${cityBars.length}+ bars with drink deals and happy hour specials in ${city.name}`,
    "numberOfItems": cityBars.length,
    "itemListElement": cityBars.map((bar, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "BarOrPub",
        "name": bar.name,
        "address": bar.address,
        "geo": { "@type": "GeoCoordinates", "latitude": bar.lat, "longitude": bar.lng },
        "url": `https://drinkdeals.com/${stateSlug}/${citySlug}/${bar.slug}`,
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Drink Deals in {city.name} — Happy Hour Specials & Bar Deals | DrinkDeals.com</title>
        <meta name="description" content={`Find ${cityBars.length}+ bars with happy hour deals in ${city.name}, ${city.stateName}. Filter by day, time, and neighborhood. See what's happening right now on the map.`} />
        <link rel="canonical" href={`https://drinkdeals.com/${stateSlug}/${citySlug}`} />
        <meta property="og:title" content={`Drink Deals in ${city.name} | DrinkDeals.com`} />
        <meta property="og:description" content={`${cityBars.length}+ bars with happy hour deals in ${city.name}. Find cheap drinks near you.`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--text2)] mb-4">
          <Link to="/">Home</Link> / <Link to={`/${stateSlug}`}>{city.stateName}</Link> / <span className="text-white">{city.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Drink Deals in {city.name}</h1>
            <p className="text-[var(--text2)] mt-1">
              {cityBars.length} bars · {filtered.length} deals
              {activeCount > 0 && <span className="text-[var(--green)]"> · {activeCount} active now</span>}
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="mb-6">
          <MapView
            bars={cityBars}
            center={[city.lat, city.lng]}
            zoom={12}
            stateSlug={stateSlug}
            citySlug={citySlug}
          />
        </div>

        {/* Filters */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Day filter */}
            <div className="flex gap-1">
              {DAYS.map(d => (
                <button
                  key={d}
                  onClick={() => setDayFilter(d)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    dayFilter === d
                      ? 'bg-[var(--accent)] text-black'
                      : d === today
                        ? 'bg-[var(--bg3)] text-[var(--accent)] border border-[var(--accent)]/30'
                        : 'bg-[var(--bg3)] text-[var(--text2)] hover:text-white'
                  }`}
                >
                  {dayShort(d)}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-[var(--border)]" />

            {/* Neighborhood */}
            <select
              value={neighborhoodFilter}
              onChange={e => setNeighborhoodFilter(e.target.value)}
              className="bg-[var(--bg3)] border border-[var(--border)] text-sm rounded-lg px-3 py-1.5 text-[var(--text)]"
            >
              <option value="all">All Neighborhoods</option>
              {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[var(--bg3)] border border-[var(--border)] text-sm rounded-lg px-3 py-1.5 text-[var(--text)]"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Active only toggle */}
            <button
              onClick={() => setShowActiveOnly(v => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                showActiveOnly ? 'bg-[var(--green)] text-black' : 'bg-[var(--bg3)] text-[var(--text2)]'
              }`}
            >
              🟢 Active Now Only
            </button>
          </div>
        </div>

        {/* Deal list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((f, i) => (
            <DealCard
              key={`${f.bar.id}-${i}`}
              bar={f.bar}
              deal={f.deal}
              distance={f.distance}
              citySlug={citySlug}
              stateSlug={stateSlug}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--text2)]">
            <p className="text-xl mb-2">No deals match your filters</p>
            <p>Try a different day or clear the neighborhood filter</p>
          </div>
        )}

        {/* SEO content */}
        <section className="mt-16 prose prose-invert max-w-3xl">
          <h2 className="text-xl font-bold text-white">Happy Hour Deals in {city.name}, {city.stateName}</h2>
          <p className="text-[var(--text2)] leading-relaxed">
            Looking for the best drink deals in {city.name}? DrinkDeals.com has you covered with {cityBars.length}+ bars
            offering happy hour specials across neighborhoods like {neighborhoods.slice(0, 5).join(', ')}, and more.
            From $1 oysters and $5 margaritas to 2-for-1 cocktails and bottomless brunch deals, find the cheapest drinks
            near you right now.
          </p>
          <h3 className="text-lg font-bold text-white">Popular Neighborhoods for Drink Deals</h3>
          <ul className="text-[var(--text2)]">
            {neighborhoods.map(n => (
              <li key={n}><strong>{n}</strong> — {cityBars.filter(b => b.neighborhood === n).length} bars with deals</li>
            ))}
          </ul>
          <h3 className="text-lg font-bold text-white">How to Use DrinkDeals</h3>
          <p className="text-[var(--text2)] leading-relaxed">
            Select a day of the week to see which bars have specials running. Filter by neighborhood to find deals close to you.
            Deals marked "Active Now" are happening at this very moment — grab your friends and go! We update our deal listings
            regularly to ensure accuracy.
          </p>
        </section>
      </div>
    </>
  )
}
