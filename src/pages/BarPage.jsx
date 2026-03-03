import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { bars, cities } from '../data/deals'
import { formatTime, daysLabel, isDealActiveNow, dayName } from '../utils'

const pinIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px rgba(245,166,35,0.5);background:linear-gradient(135deg,#f5a623,#ff6b35);"></div>',
  iconSize: [16, 16], iconAnchor: [8, 8],
});

export default function BarPage() {
  const { stateSlug, citySlug, barSlug } = useParams();
  const bar = bars.find(b => b.slug === barSlug && b.city === citySlug);
  const city = cities[citySlug];
  if (!bar || !city) return <div className="max-w-6xl mx-auto px-4 py-12"><h1>Bar not found</h1></div>;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "BarOrPub", "name": bar.name,
    "address": { "@type": "PostalAddress", "streetAddress": bar.address },
    "geo": { "@type": "GeoCoordinates", "latitude": bar.lat, "longitude": bar.lng },
    "telephone": bar.phone, "url": bar.website,
  };

  return (
    <>
      <Helmet>
        <title>{bar.name} Happy Hour — Drink Deals {city.name} | DrinkDeals</title>
        <meta name="description" content={`${bar.name} drink deals and happy hour specials in ${bar.neighborhood}, ${city.name}. ${bar.deals[0]?.items.slice(0,3).join(', ')}.`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--text3)] mb-6 flex items-center gap-1.5">
          <Link to="/" className="text-[var(--text2)] hover:text-white">Home</Link><span>/</span>
          <Link to={`/${stateSlug}`} className="text-[var(--text2)] hover:text-white">{city.stateName}</Link><span>/</span>
          <Link to={`/${stateSlug}/${citySlug}`} className="text-[var(--text2)] hover:text-white">{city.name}</Link><span>/</span>
          <span className="text-[var(--text)]">{bar.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: 'rgba(245, 166, 35, 0.08)', border: '1px solid rgba(245, 166, 35, 0.12)' }}>
            {bar.image}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{bar.name}</h1>
            <p className="text-sm text-[var(--text2)] mt-1">{bar.neighborhood} · {bar.address}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {bar.phone && (
                <a href={`tel:${bar.phone}`} className="pill pill-inactive text-xs no-underline">📞 {bar.phone}</a>
              )}
              {bar.website && (
                <a href={bar.website} target="_blank" rel="noopener noreferrer" className="pill pill-inactive text-xs no-underline">🌐 Website</a>
              )}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${bar.lat},${bar.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="pill text-xs no-underline font-semibold text-black" style={{ background: 'var(--grad1)' }}>
                📍 Directions
              </a>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-[var(--border)] mb-8" style={{ height: 220 }}>
          <MapContainer center={[bar.lat, bar.lng]} zoom={15} className="w-full h-full" scrollWheelZoom={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OSM &copy; CARTO' />
            <Marker position={[bar.lat, bar.lng]} icon={pinIcon}><Popup>{bar.name}</Popup></Marker>
          </MapContainer>
        </div>

        {/* Deals */}
        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Happy Hour Specials</h2>
        <div className="space-y-4">
          {bar.deals.map((deal, i) => {
            const active = isDealActiveNow(deal);
            return (
              <div key={i} className={`glass rounded-2xl overflow-hidden ${active ? 'glow-green' : ''}`}>
                <div className="h-0.5" style={{ background: active ? 'var(--green)' : 'var(--grad1)' }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold grad-text">{deal.description}</h3>
                      <p className="text-xs text-[var(--text2)] mt-0.5 font-mono">
                        {formatTime(deal.startTime)} – {formatTime(deal.endTime)} · {daysLabel(deal.days)}
                      </p>
                    </div>
                    {active && (
                      <div className="live-badge bg-[var(--green)]/15 text-[var(--green)] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full" />
                        HAPPENING NOW
                      </div>
                    )}
                  </div>

                  {/* Day dots */}
                  <div className="flex gap-1.5 mb-4">
                    {[0,1,2,3,4,5,6].map(d => (
                      <span key={d} className={`text-[10px] w-8 text-center py-0.5 rounded-md font-medium ${
                        deal.days.includes(d)
                          ? 'text-[var(--amber)]'
                          : 'text-[var(--text3)]/40'
                      }`} style={deal.days.includes(d) ? { background: 'rgba(245,166,35,0.08)' } : {}}>
                        {dayName(d).slice(0, 2)}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {deal.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <span className="text-[var(--amber)]">🍺</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SEO */}
        <section className="mt-12">
          <h2 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>{bar.name} Happy Hour</h2>
          <p className="text-xs text-[var(--text2)] leading-relaxed">
            {bar.name} is located in {bar.neighborhood}, {city.name} and offers {bar.deals.length} happy hour
            {bar.deals.length > 1 ? ' specials' : ' special'}. {bar.deals[0]?.items.slice(0,2).join(' and ')} are
            just some of the deals available during happy hour.
          </p>
        </section>
      </div>
    </>
  )
}
