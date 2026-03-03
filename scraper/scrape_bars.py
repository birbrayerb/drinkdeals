#!/usr/bin/env python3
"""
DrinkDeals Bar Scraper — Miami
Scrapes happy hour data from aggregator sites and bar websites.
Uses Scrapling for anti-bot fetching.

Usage: python3 scraper/scrape_bars.py
"""

import json
import os
import re
import time
from pathlib import Path
from scrapling.fetchers import Fetcher, StealthyFetcher

OUTPUT = Path(__file__).parent.parent / "src" / "data" / "scraped_miami.json"

def fetch(url, stealthy=False):
    """Fetch a URL and return the response."""
    print(f"  GET {url}")
    try:
        if stealthy:
            return StealthyFetcher.fetch(url, headless=True, network_idle=True)
        return Fetcher.get(url)
    except Exception as e:
        print(f"    Error: {e}")
        return None

def get_text(el):
    """Safely get text from an element."""
    if el is None:
        return ''
    try:
        # Scrapling elements
        t = el.text
        if callable(t):
            t = t()
        return (t or '').strip()
    except:
        return ''

def get_all_text(resp):
    """Get all visible text from a page."""
    try:
        body = resp.css('body')
        if body:
            return get_text(body[0])
    except:
        pass
    return ''


# ── Source 1: Scrape Yelp happy hour search results ────────────────

def scrape_yelp(city="Miami", state="FL", pages=3):
    """Search Yelp for happy hour bars and extract details."""
    bars = []
    
    for page in range(pages):
        offset = page * 10
        url = f"https://www.yelp.com/search?find_desc=happy+hour&find_loc={city}%2C+{state}&start={offset}"
        resp = fetch(url, stealthy=True)
        if not resp:
            continue
        
        # Extract business links
        links = resp.css('a[href*="/biz/"]')
        seen = set()
        for link in links:
            href = link.attrib.get('href', '')
            name = get_text(link)
            if '/biz/' in href and name and len(name) > 3 and 'yelp' not in name.lower():
                slug = href.split('/biz/')[-1].split('?')[0]
                if slug not in seen and not slug.startswith('ad-'):
                    seen.add(slug)
                    bars.append({
                        'name': name,
                        'yelp_url': f"https://www.yelp.com/biz/{slug}",
                    })
        
        print(f"    Page {page+1}: {len(seen)} new bars")
        time.sleep(3)
    
    return bars


def scrape_yelp_detail(bar):
    """Get address, phone, website, coords from Yelp biz page."""
    resp = fetch(bar['yelp_url'], stealthy=True)
    if not resp:
        return
    
    full_text = get_all_text(resp)
    
    # Address — look for Florida pattern
    addr_match = re.search(r'(\d+\s+[^,]+,\s*(?:Miami|Miami Beach|Coral Gables|Aventura|Key Biscayne|Coconut Grove|Wynwood)[^,]*,\s*FL\s*\d{5})', full_text)
    if addr_match:
        bar['address'] = addr_match.group(1)
    
    # Phone
    phone_match = re.search(r'\((\d{3})\)\s*(\d{3})[.-](\d{4})', full_text)
    if phone_match:
        bar['phone'] = f"({phone_match.group(1)}) {phone_match.group(2)}-{phone_match.group(3)}"
    
    # Website from redirect links
    for link in resp.css('a'):
        href = link.attrib.get('href', '')
        if 'biz_redir' in href and 'url=' in href:
            from urllib.parse import unquote
            bar['website'] = unquote(href.split('url=')[1].split('&')[0])
            break
    
    # Coordinates from JSON-LD or scripts
    for script in resp.css('script'):
        st = get_text(script)
        lat = re.search(r'"latitude":\s*([\d.-]+)', st)
        lng = re.search(r'"longitude":\s*([\d.-]+)', st)
        if lat and lng:
            bar['lat'] = float(lat.group(1))
            bar['lng'] = float(lng.group(1))
            break
    
    # Neighborhood
    for tag in resp.css('a[href*="neighborhood"]'):
        n = get_text(tag)
        if n and len(n) > 2:
            bar['neighborhood'] = n
            break
    
    time.sleep(2)


# ── Source 2: Scrape bar's own website for deal info ───────────────

def scrape_website_deals(bar):
    """Visit bar website, find happy hour info."""
    url = bar.get('website')
    if not url:
        return
    
    resp = fetch(url)
    if not resp:
        return
    
    text = get_all_text(resp)
    
    # Also try /happy-hour, /menu, /specials pages
    for path in ['/happy-hour', '/specials', '/menu', '/drink-menu', '/happenings']:
        base = url.rstrip('/')
        sub_resp = fetch(base + path)
        if sub_resp:
            text += '\n' + get_all_text(sub_resp)
        time.sleep(0.5)
    
    bar['_website_text'] = text[:10000]
    time.sleep(1)


# ── Deal parser ────────────────────────────────────────────────────

def parse_deals(bar):
    """Parse happy hour deals from scraped text."""
    text = bar.get('_website_text', '')
    if not text:
        return []
    
    deals = []
    
    # Find time ranges like "4-7pm", "4:00 PM - 7:00 PM"
    time_matches = re.findall(
        r'(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?)\s*[-–to]+\s*(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?))',
        text, re.IGNORECASE
    )
    
    # Find price items like "$5 beers", "$7 cocktails"
    price_lines = []
    for line in text.split('\n'):
        line = line.strip()
        if re.search(r'\$\d+', line) and 5 < len(line) < 100:
            # Clean up
            line = re.sub(r'\s+', ' ', line)
            price_lines.append(line)
    
    # Dedupe price lines
    seen = set()
    unique_prices = []
    for p in price_lines:
        key = p.lower().strip()
        if key not in seen:
            seen.add(key)
            unique_prices.append(p)
    
    # Detect days
    text_lower = text.lower()
    days = detect_days(text_lower)
    
    if time_matches and unique_prices:
        start, end = time_matches[0]
        deals.append({
            'days': days,
            'startTime': norm_time(start),
            'endTime': norm_time(end),
            'description': 'Happy Hour',
            'items': unique_prices[:10],
        })
    elif unique_prices:
        # No time found, assume standard 4-7pm
        deals.append({
            'days': days,
            'startTime': '16:00',
            'endTime': '19:00',
            'description': 'Happy Hour',
            'items': unique_prices[:10],
        })
    
    return deals


def detect_days(text):
    """Detect which days deals are available from text."""
    if any(w in text for w in ['daily', 'every day', 'everyday', '7 days']):
        return [0, 1, 2, 3, 4, 5, 6]
    
    days = []
    day_map = {'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 0}
    for name, num in day_map.items():
        if name in text:
            days.append(num)
    
    if 'weekday' in text:
        days.extend([1, 2, 3, 4, 5])
    if 'weekend' in text:
        days.extend([0, 6])
    
    # Check for ranges like "monday through friday", "mon-fri"
    if re.search(r'mon\w*\s*[-–through]+\s*fri', text):
        days.extend([1, 2, 3, 4, 5])
    if re.search(r'tue\w*\s*[-–through]+\s*sat', text):
        days.extend([2, 3, 4, 5, 6])
    
    days = sorted(set(days))
    return days if days else [0, 1, 2, 3, 4, 5, 6]  # Default daily


def norm_time(t):
    """Normalize time string to HH:MM."""
    t = t.strip().upper().replace('.', '')
    m = re.match(r'(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?', t)
    if not m:
        return '17:00'
    h, mn, ap = m.groups()
    h = int(h)
    mn = int(mn or 0)
    if ap == 'PM' and h < 12:
        h += 12
    elif ap == 'AM' and h == 12:
        h = 0
    elif not ap and h < 12 and h > 0:
        # Ambiguous - assume PM for happy hours
        h += 12
    return f"{h:02d}:{mn:02d}"


# ── Main ───────────────────────────────────────────────────────────

def main():
    print("🍻 DrinkDeals Scraper — Miami")
    print("=" * 50)
    
    # Step 1: Find bars on Yelp
    print("\n📍 Step 1: Searching Yelp for happy hour bars...")
    bars = scrape_yelp("Miami", "FL", pages=3)
    print(f"  Found {len(bars)} bars")
    
    # Step 2: Get details from each Yelp page
    print(f"\n📍 Step 2: Getting details for {len(bars)} bars...")
    for i, bar in enumerate(bars):
        print(f"  [{i+1}/{len(bars)}] {bar['name']}")
        scrape_yelp_detail(bar)
    
    # Step 3: Scrape bar websites for deals
    bars_with_sites = [b for b in bars if b.get('website')]
    print(f"\n📍 Step 3: Scraping {len(bars_with_sites)} bar websites...")
    for i, bar in enumerate(bars_with_sites):
        print(f"  [{i+1}/{len(bars_with_sites)}] {bar['name']}: {bar['website']}")
        scrape_website_deals(bar)
    
    # Step 4: Parse deals
    print(f"\n📍 Step 4: Parsing deals...")
    for bar in bars:
        bar['deals'] = parse_deals(bar)
        if bar['deals']:
            print(f"  ✅ {bar['name']}: {len(bar['deals'])} deals, {len(bar['deals'][0]['items'])} items")
        else:
            print(f"  ❌ {bar['name']}: no deals found")
    
    # Step 5: Output
    emojis = ['🍸', '🍺', '🍹', '🥃', '🍻', '🥂', '🍷', '🌮', '🍜', '🦪', '🔥', '🌴', '🎨', '🐟', '🦩', '🏀']
    output = []
    for i, bar in enumerate(bars):
        if not bar.get('lat') or not bar.get('deals'):
            continue
        slug = re.sub(r'[^a-z0-9]+', '-', bar['name'].lower()).strip('-')
        output.append({
            'id': 1000 + i,
            'name': bar['name'],
            'slug': slug,
            'address': bar.get('address', ''),
            'neighborhood': bar.get('neighborhood', 'Miami'),
            'city': 'miami',
            'lat': bar['lat'],
            'lng': bar['lng'],
            'phone': bar.get('phone', ''),
            'website': bar.get('website', ''),
            'image': emojis[i % len(emojis)],
            'deals': bar['deals'],
        })
    
    os.makedirs(OUTPUT.parent, exist_ok=True)
    with open(OUTPUT, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✅ {len(output)} bars with deals saved to {OUTPUT}")
    
    # Save raw for debugging
    raw = [{k: v for k, v in b.items() if k != '_website_text'} for b in bars]
    with open(str(OUTPUT).replace('.json', '_raw.json'), 'w') as f:
        json.dump(raw, f, indent=2)
    
    print(f"   {len(bars) - len(output)} bars skipped (no coords or no deals)")


if __name__ == '__main__':
    main()
