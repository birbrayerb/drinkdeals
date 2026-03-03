import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { cities, bars as allBars } from '../data/deals'
import { getDistance, isDealActiveNow, isDealOnDay, dayShort } from '../utils'
import MapView from '../components/MapView'
import DealCard from '../components/DealCard'

const DAYS = [0, 1, 2, 3, 4, 5, 6];
const SORT_OPTIONS = [
  { value: 'active', label: 'Active First' },
  { value: 'proximity', label: 'Nearest' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'neighborhood', label: 'Area' },
];

export default function CityPage() {
  const { stateSlug, citySlug } = useParams();
  const city = cities[citySlug];
  const [userLoc, setUserLoc] = useState(null);
  const [dayFilter, setDayFilter] = useState(new Date().getDay());
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('active');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => city && setUserLoc({ lat: city.lat, lng: city.lng })
      );
    }
  }, [city]);

  if (!city) return <div className="max-w-6xl mx-auto px-4 py-12"><h1>City not found</h1></div>;

  const cityBars = allBars.filter(b => b.city === citySlug);

  const filtered = useMemo(() => {
    let result = [];
    for (const bar of cityBars) {
      const dayDeals = bar.deals.filter(d => isDealOnDay(d, dayFilter));
      if (dayDeals.length === 0) continue;
      if (showActiveOnly && !dayDeals.some(d => isDealActiveNow(d))) continue;
      if (neighborhoodFilter !== 'all' && bar.neighborhood !== neighborhoodFilter) continue;
      const dist = userLoc ? getDistance(userLoc.lat, userLoc.lng, bar.lat, bar.lng) : null;
      for (const deal of dayDeals) {
        result.push({ bar, deal, distance: dist });
      }
    }
    result.sort((a, b) => {
      if (sortBy === 'active') {
        const aa = isDealActiveNow(a.deal) ? 0 : 1;
        const bb = isDealActiveNow(b.deal) ? 0 : 1;
        if (aa !== bb) return aa - bb;
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
    "numberOfItems": cityBars.length,
    "itemListElement": cityBars.map((bar, i) => ({
      "@type": "ListItem", "position": i + 1,
      "item": { "@type": "BarOrPub", "name": bar.name, "address": bar.address,
        "geo": { "@type": "GeoCoordinates", "latitude": bar.lat, "longitude": bar.lng } }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Drink Deals in {city.name} — Happy Hour Specials | DrinkDeals</title>
        <meta name="description" content={`Find ${cityBars.length}+ bars with happy hour deals in ${city.name}. Filter by day, time, and neighborhood.`} />
        <link rel="canonical" href={`https://drinkdeals.com/${stateSlug}/${citySlug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--text3)] mb-5 flex items-center gap-1.5">
          <Link to="/" className="text-[var(--text2)] hover:text-white">Home</Link>
          <span>/</span>
          <Link to={`/${stateSlug}`} className="text-[var(--text2)] hover:text-white">{city.stateName}</Link>
          <span>/</span>
          <span className="text-[var(--text)]">{city.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Drink deals in <span className="grad-text">{city.name}</span>
          </h1>
          <p className="text-[var(--text2)] mt-2 flex items-center gap-3 text-sm">
            <span>{cityBars.length} bars</span>
            <span className="text-[var(--text3)]">·</span>
            <span>{filtered.length} deals today</span>
            {activeCount > 0 && (
              <>
                <span className="text-[var(--text3)]">·</span>
                <span className="text-[var(--green)] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full live-badge" />
                  {activeCount} live now
                </span>
              </>
            )}
          </p>
        </div>

        {/* Map toggle + Map */}
        <div className="mb-6">
          <button onClick={() => setShowMap(v => !v)} className="text-xs text-[var(--text2)] hover:text-white mb-2 flex items-center gap-1.5">
            <span>{showMap ? '🗺️ Hide map' : '🗺️ Show map'}</span>
          </button>
          {showMap && (
            <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
              <MapView bars={cityBars} center={[city.lat, city.lng]} zoom={12} stateSlug={stateSlug} citySlug={citySlug} />
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Days */}
            <div className="flex gap-1">
              {DAYS.map(d => (
                <button
                  key={d}
                  onClick={() => setDayFilter(d)}
                  className={`pill text-xs ${
                    dayFilter === d ? 'pill-active'
                    : d === today ? 'pill-inactive !border-[var(--amber)]/30 !text-[var(--amber)]'
                    : 'pill-inactive'
                  }`}
                >
                  {dayShort(d)}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-[var(--border)] mx-1" />

            {/* Neighborhood */}
            <select
              value={neighborhoodFilter}
              onChange={e => setNeighborhoodFilter(e.target.value)}
              className="glass rounded-xl text-xs px-3 py-1.5 text-[var(--text)] border-none outline-none cursor-pointer"
            >
              <option value="all">All Areas</option>
              {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="glass rounded-xl text-xs px-3 py-1.5 text-[var(--text)] border-none outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Active toggle */}
            <button
              onClick={() => setShowActiveOnly(v => !v)}
              className={`pill text-xs ${showActiveOnly ? 'pill-green active' : 'pill-green'}`}
            >
              🟢 Live only
            </button>
          </div>
        </div>

        {/* Deal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((f, i) => (
            <DealCard key={`${f.bar.id}-${i}`} bar={f.bar} deal={f.deal} distance={f.distance} citySlug={citySlug} stateSlug={stateSlug} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🍷</div>
            <p className="text-lg text-[var(--text2)]">No deals match your filters</p>
            <p className="text-sm text-[var(--text3)] mt-1">Try a different day or clear the area filter</p>
          </div>
        )}

        {/* SEO */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Happy Hour in {city.name}</h2>
          <p className="text-sm text-[var(--text2)] leading-relaxed mb-3">
            Looking for the best drink deals in {city.name}? We've curated {cityBars.length}+ bars with happy hour specials
            across {neighborhoods.slice(0, 5).join(', ')}, and more. From $1 oysters to 2-for-1 cocktails, find the best
            prices on drinks near you.
          </p>
          <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Neighborhoods</h3>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map(n => (
              <button key={n} onClick={() => setNeighborhoodFilter(n)}
                className="pill pill-inactive text-xs">
                {n} ({cityBars.filter(b => b.neighborhood === n).length})
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
