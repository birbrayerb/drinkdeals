import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { bars, cities } from '../data/deals'
import { formatTime, daysLabel, isDealActiveNow, dayName } from '../utils'

const pinIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#f59e0b;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 8px #f59e0b88;"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function BarPage() {
  const { stateSlug, citySlug, barSlug } = useParams();
  const bar = bars.find(b => b.slug === barSlug && b.city === citySlug);
  const city = cities[citySlug];

  if (!bar || !city) return <div className="max-w-7xl mx-auto px-4 py-12"><h1>Bar not found</h1></div>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "name": bar.name,
    "address": { "@type": "PostalAddress", "streetAddress": bar.address },
    "geo": { "@type": "GeoCoordinates", "latitude": bar.lat, "longitude": bar.lng },
    "telephone": bar.phone,
    "url": bar.website,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Happy Hour Specials",
      "itemListElement": bar.deals.map(d => ({
        "@type": "Offer",
        "name": d.description,
        "description": d.items.join(', '),
        "availabilityStarts": d.startTime,
        "availabilityEnds": d.endTime,
      }))
    }
  };

  return (
    <>
      <Helmet>
        <title>{bar.name} Happy Hour — Drink Deals in {city.name} | DrinkDeals.com</title>
        <meta name="description" content={`${bar.name} drink deals and happy hour specials in ${bar.neighborhood}, ${city.name}. ${bar.deals[0]?.items.slice(0, 3).join(', ')}.`} />
        <link rel="canonical" href={`https://drinkdeals.com/${stateSlug}/${citySlug}/${barSlug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="text-sm text-[var(--text2)] mb-6">
          <Link to="/">Home</Link> / <Link to={`/${stateSlug}`}>{city.stateName}</Link> / <Link to={`/${stateSlug}/${citySlug}`}>{city.name}</Link> / <span className="text-white">{bar.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{bar.image}</span>
          <div>
            <h1 className="text-3xl font-bold">{bar.name}</h1>
            <p className="text-[var(--text2)] mt-1">{bar.neighborhood} · {bar.address}</p>
            <div className="flex gap-3 mt-2">
              {bar.phone && (
                <a href={`tel:${bar.phone}`} className="text-sm bg-[var(--bg3)] px-3 py-1 rounded-lg no-underline">
                  📞 {bar.phone}
                </a>
              )}
              {bar.website && (
                <a href={bar.website} target="_blank" rel="noopener noreferrer" className="text-sm bg-[var(--bg3)] px-3 py-1 rounded-lg no-underline">
                  🌐 Website
                </a>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${bar.lat},${bar.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="text-sm bg-[var(--accent)] text-black px-3 py-1 rounded-lg no-underline font-medium"
              >
                📍 Directions
              </a>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mb-8 rounded-xl overflow-hidden" style={{ height: 250 }}>
          <MapContainer center={[bar.lat, bar.lng]} zoom={15} className="w-full h-full" scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OSM &copy; CARTO'
            />
            <Marker position={[bar.lat, bar.lng]} icon={pinIcon}>
              <Popup>{bar.name}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Deals */}
        <h2 className="text-xl font-bold mb-4">Drink Deals & Happy Hour Specials</h2>
        <div className="space-y-4">
          {bar.deals.map((deal, i) => {
            const active = isDealActiveNow(deal);
            return (
              <div key={i} className={`bg-[var(--bg3)] border rounded-xl p-5 ${
                active ? 'border-[var(--green)]/50 ring-1 ring-[var(--green)]/20' : 'border-[var(--border)]'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--accent)]">{deal.description}</h3>
                    <p className="text-sm text-[var(--text2)]">
                      {formatTime(deal.startTime)} – {formatTime(deal.endTime)} · {daysLabel(deal.days)}
                    </p>
                  </div>
                  {active && (
                    <span className="bg-[var(--green)]/20 text-[var(--green)] text-xs font-bold px-3 py-1 rounded-full">
                      🟢 HAPPENING NOW
                    </span>
                  )}
                </div>

                {/* Day pills */}
                <div className="flex gap-1 mb-3">
                  {[0,1,2,3,4,5,6].map(d => (
                    <span key={d} className={`text-[10px] px-2 py-0.5 rounded ${
                      deal.days.includes(d) ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--bg2)] text-[var(--text2)]/50'
                    }`}>
                      {dayName(d).slice(0, 3)}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2">
                  {deal.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-[var(--accent)]">🍺</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* SEO */}
        <section className="mt-12 prose prose-invert max-w-none">
          <h2 className="text-lg font-bold text-white">{bar.name} Happy Hour in {city.name}</h2>
          <p className="text-[var(--text2)] leading-relaxed">
            {bar.name} is located in {bar.neighborhood}, {city.name} and offers {bar.deals.length} happy hour
            {bar.deals.length > 1 ? ' specials' : ' special'}. Visit during happy hour to enjoy discounted drinks
            and food at one of {city.name}'s favorite spots. {bar.deals[0]?.items.slice(0, 2).join(' and ')} are
            just some of the deals available.
          </p>
        </section>
      </div>
    </>
  )
}
