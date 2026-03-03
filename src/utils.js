const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function dayName(d) { return DAY_NAMES[d]; }
export function dayShort(d) { return DAY_SHORT[d]; }

export function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function isDealActiveNow(deal) {
  const now = new Date();
  const day = now.getDay();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return deal.days.includes(day) && time >= deal.startTime && time <= deal.endTime;
}

export function isDealOnDay(deal, dayIndex) {
  return deal.days.includes(dayIndex);
}

export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function daysLabel(days) {
  if (days.length === 7) return 'Daily';
  if (arrEq(days, [1,2,3,4,5])) return 'Mon–Fri';
  if (arrEq(days, [6,0])) return 'Sat & Sun';
  return days.map(d => DAY_SHORT[d]).join(', ');
}

function arrEq(a, b) { return a.length === b.length && a.every((v, i) => v === b[i]); }
