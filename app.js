const DEALS = [
  { id: 1, title: "Half-price Negronis", bar: "Amaro & Oak", city: "New York", neighborhood: "West Village", type: "cocktail", price: 8, was: 16, rating: 4.9, hot: true, time: "4–7pm", icon: "cocktail", hue: "linear-gradient(135deg, #ff5c8a, #7c5cff)" },
  { id: 2, title: "$5 draft IPAs", bar: "The Hoppy Accident", city: "Austin", neighborhood: "East Side", type: "beer", price: 5, was: 9, rating: 4.7, hot: true, time: "All night Mon", icon: "beer", hue: "linear-gradient(135deg, #ffb86b, #ef476f)" },
  { id: 3, title: "Wine Wednesday", bar: "Cellar Door", city: "Chicago", neighborhood: "Logan Square", type: "wine", price: 7, was: 14, rating: 4.8, hot: false, time: "Weds", icon: "wine", hue: "linear-gradient(135deg, #7c5cff, #ef476f)" },
  { id: 4, title: "$8 Margarita Flights", bar: "Salt & Agave", city: "Los Angeles", neighborhood: "Silver Lake", type: "cocktail", price: 8, was: 18, rating: 4.9, hot: true, time: "5–8pm", icon: "cocktail", hue: "linear-gradient(135deg, #06d6a0, #118ab2)" },
  { id: 5, title: "Late-night oysters + bubbly", bar: "Low Tide", city: "Seattle", neighborhood: "Capitol Hill", type: "late", price: 12, was: 22, rating: 4.8, hot: false, time: "10pm–1am", icon: "moon", hue: "linear-gradient(135deg, #48cae4, #023e8a)" },
  { id: 6, title: "Two-for-one Aperol Spritz", bar: "Golden Hour", city: "Miami", neighborhood: "Wynwood", type: "happy", price: 9, was: 18, rating: 4.6, hot: true, time: "4–6pm", icon: "spritz", hue: "linear-gradient(135deg, #ffd166, #ff5c8a)" },
  { id: 7, title: "$3 PBR + shot combo", bar: "The Rusted Can", city: "Chicago", neighborhood: "Pilsen", type: "beer", price: 3, was: 7, rating: 4.5, hot: false, time: "All day", icon: "beer", hue: "linear-gradient(135deg, #ef476f, #073b4c)" },
  { id: 8, title: "$6 Old-Fashioneds", bar: "Smoke & Rye", city: "New York", neighborhood: "Lower East Side", type: "cocktail", price: 6, was: 15, rating: 4.8, hot: true, time: "5–7pm", icon: "cocktail", hue: "linear-gradient(135deg, #ffb86b, #7c5cff)" },
  { id: 9, title: "Happy hour sake", bar: "Koi Garden", city: "Seattle", neighborhood: "International District", type: "happy", price: 6, was: 12, rating: 4.7, hot: false, time: "4–6pm", icon: "sake", hue: "linear-gradient(135deg, #06d6a0, #ffd166)" },
  { id: 10, title: "Rooftop Rosé", bar: "Skyline & Oak", city: "Los Angeles", neighborhood: "Downtown", type: "wine", price: 9, was: 16, rating: 4.9, hot: true, time: "5–8pm", icon: "wine", hue: "linear-gradient(135deg, #ff5c8a, #ffd166)" },
  { id: 11, title: "$4 frozen margs", bar: "Fiesta Hall", city: "Austin", neighborhood: "South Congress", type: "happy", price: 4, was: 10, rating: 4.6, hot: false, time: "3–6pm", icon: "spritz", hue: "linear-gradient(135deg, #06d6a0, #ff8c42)" },
  { id: 12, title: "Midnight mezcal", bar: "Luna Negra", city: "Miami", neighborhood: "Little Havana", type: "late", price: 10, was: 18, rating: 4.8, hot: true, time: "11pm–2am", icon: "moon", hue: "linear-gradient(135deg, #7c5cff, #ef476f)" },
];

const ICONS = {
  cocktail: `<svg viewBox="0 0 64 64" fill="currentColor"><path d="M10 10h44L36 34v16h8v4H20v-4h8V34L10 10Zm8.8 6 4.4 6h17.6l4.4-6H18.8Z"/><circle cx="44" cy="14" r="2.5" opacity=".7"/></svg>`,
  beer: `<svg viewBox="0 0 64 64" fill="currentColor"><path d="M16 14h26v6h4a6 6 0 0 1 0 12h-4v18a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V14Zm26 10v6h4a3 3 0 0 0 0-6h-4Z"/><path d="M20 18h6v10h-6zM30 18h6v10h-6z" opacity=".3"/></svg>`,
  wine: `<svg viewBox="0 0 64 64" fill="currentColor"><path d="M20 8h24l-2 14a10 10 0 0 1-8 9.8V48h8v4H22v-4h8V31.8A10 10 0 0 1 22 22L20 8Zm4.4 4 1.1 8h13l1.1-8H24.4Z"/></svg>`,
  spritz: `<svg viewBox="0 0 64 64" fill="currentColor"><path d="M14 14h36L36 36v14h8v4H20v-4h8V36L14 14Zm22 4 6-0 2-0Z"/><circle cx="28" cy="24" r="2.5" opacity=".7"/><circle cx="36" cy="30" r="2" opacity=".7"/></svg>`,
  sake: `<svg viewBox="0 0 64 64" fill="currentColor"><path d="M12 18h40l-4 10H16l-4-10Zm4 14h32v18H16V32Zm6 4v10h4V36h-4Zm12 0v10h4V36h-4Z"/></svg>`,
  moon: `<svg viewBox="0 0 64 64" fill="currentColor"><path d="M44 8a24 24 0 1 0 12 32A18 18 0 0 1 44 8Z"/></svg>`,
};

const grid = document.getElementById("dealGrid");
const empty = document.getElementById("emptyState");
const chips = document.getElementById("chips");
const seg = document.querySelector(".seg");
const searchForm = document.getElementById("searchForm");
const qInput = document.getElementById("q");
const citySel = document.getElementById("city");

const state = {
  filter: "all",
  sort: "hot",
  q: "",
  city: "",
};

function matches(d) {
  if (state.filter !== "all" && d.type !== state.filter) return false;
  if (state.city && d.city !== state.city) return false;
  if (state.q) {
    const h = `${d.title} ${d.bar} ${d.type} ${d.city} ${d.neighborhood}`.toLowerCase();
    if (!h.includes(state.q.toLowerCase())) return false;
  }
  return true;
}

function sortDeals(list) {
  const sorted = list.slice();
  if (state.sort === "hot") sorted.sort((a, b) => (b.hot - a.hot) || (b.rating - a.rating));
  if (state.sort === "price") sorted.sort((a, b) => a.price - b.price);
  if (state.sort === "close") sorted.sort((a, b) => a.bar.localeCompare(b.bar));
  return sorted;
}

function render() {
  const list = sortDeals(DEALS.filter(matches));
  grid.innerHTML = "";
  if (!list.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const frag = document.createDocumentFragment();
  list.forEach((d, i) => {
    const card = document.createElement("article");
    card.className = "card reveal";
    card.style.transitionDelay = `${Math.min(i * 40, 320)}ms`;
    card.innerHTML = `
      <div class="card-media">
        <div class="card-art" style="--hue: ${d.hue}">
          ${ICONS[d.icon] || ICONS.cocktail}
        </div>
        ${d.hot ? `<span class="badge badge-hot">Hot tonight</span>` : `<span class="badge">${d.time}</span>`}
      </div>
      <div class="card-body">
        <h3 class="card-title">${d.title}</h3>
        <div class="card-bar">
          <span>${d.bar}</span>
          <span class="dotd"></span>
          <span>${d.neighborhood}, ${d.city}</span>
        </div>
        <div class="card-meta">
          <span class="price"><s>$${d.was}</s>$${d.price}</span>
          <span class="rating"><span class="star">★</span>${d.rating.toFixed(1)}</span>
        </div>
      </div>
    `;
    frag.appendChild(card);
  });
  grid.appendChild(frag);

  requestAnimationFrame(() => {
    grid.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  });
}

chips.addEventListener("click", (e) => {
  const t = e.target.closest(".chip");
  if (!t) return;
  chips.querySelectorAll(".chip").forEach(c => {
    c.classList.remove("is-active");
    c.setAttribute("aria-selected", "false");
  });
  t.classList.add("is-active");
  t.setAttribute("aria-selected", "true");
  state.filter = t.dataset.filter;
  render();
});

seg.addEventListener("click", (e) => {
  const t = e.target.closest(".seg-btn");
  if (!t) return;
  seg.querySelectorAll(".seg-btn").forEach(c => c.classList.remove("is-active"));
  t.classList.add("is-active");
  state.sort = t.dataset.sort;
  render();
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  state.q = qInput.value.trim();
  state.city = citySel.value;
  document.getElementById("deals").scrollIntoView({ behavior: "smooth", block: "start" });
  render();
});

qInput.addEventListener("input", () => {
  state.q = qInput.value.trim();
  render();
});
citySel.addEventListener("change", () => {
  state.city = citySel.value;
  render();
});

// Subscribe form
const subForm = document.getElementById("subscribeForm");
const subNote = document.getElementById("subscribeNote");
subForm.addEventListener("submit", (e) => {
  e.preventDefault();
  subNote.textContent = "Cheers — check your inbox for a confirmation.";
  subForm.querySelector("input").value = "";
});

// Theme toggle
const themeBtn = document.getElementById("themeToggle");
const saved = localStorage.getItem("dd-theme");
if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
themeBtn.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("dd-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("dd-theme", "light");
  }
});

// Reveal on scroll for static sections
const revealEls = document.querySelectorAll(".stat, .city, .tl-row, .section-head, .cta");
revealEls.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${Math.min(i * 30, 300)}ms`;
});
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

render();
