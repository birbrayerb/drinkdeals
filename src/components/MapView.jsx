import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { isDealActiveNow, formatTime } from '../utils'

// Custom marker icons
const activeIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px #22c55e88;"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const defaultIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#f59e0b;width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px #f59e0b88;"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

export default function MapView({ bars, center, zoom = 12, stateSlug, citySlug }) {
  return (
    <MapContainer center={center} zoom={zoom} className="w-full rounded-xl" style={{ height: '400px' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {bars.map(bar => {
        const hasActive = bar.deals?.some(d => isDealActiveNow(d));
        return (
          <Marker key={bar.id} position={[bar.lat, bar.lng]} icon={hasActive ? activeIcon : defaultIcon}>
            <Popup>
              <div>
                <strong>{bar.image} {bar.name}</strong><br />
                <span style={{ fontSize: 12, color: '#9898b0' }}>{bar.neighborhood}</span><br />
                {bar.deals?.map((d, i) => (
                  <div key={i} style={{ marginTop: 4, fontSize: 12 }}>
                    {isDealActiveNow(d) && <span style={{ color: '#22c55e' }}>🟢 </span>}
                    <strong style={{ color: '#f59e0b' }}>{d.description}</strong><br />
                    {formatTime(d.startTime)}–{formatTime(d.endTime)}
                  </div>
                ))}
                <Link to={`/${stateSlug}/${citySlug}/${bar.slug}`} style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
                  View all deals →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  )
}
