import './style.css';
import { cities, places, itinerary, transport, bookingTasks, researchDate, sources } from './data.js';
import { defaultState, normalizeState, calculateBudget, filterPlaces, formatMoney, formatPriceText } from './model.js';

const icons = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 4h3m2 3h3"/>',
  bed: '<path d="M3 18V7m18 11V9M3 14h18M3 9h6a3 3 0 0 1 3 3v2m0-5h6a3 3 0 0 1 3 3M3 18v3m18-3v3"/>',
  food: '<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18m13 0V3c-4 2-5 7 0 9"/>',
  train: '<rect x="5" y="3" width="14" height="15" rx="4"/><path d="M5 10h14m-9-7v7m4-7v7M8 18l-3 4m11-4 3 4"/><path d="M8 14h1m6 0h1"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8V5l14-3v3m4 7h-6v5h6m-3-2.5h.01"/>',
  ticket: '<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Z"/><path d="M15 6v3m0 2v2m0 2v3"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  external: '<path d="M14 3h7v7m0-7L10 14m0-11H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  leaf: '<path d="M20 3C10 2 2 7 5 15s17 8 15-12ZM4 21l11-12"/>',
  plane: '<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13l6-6"/>',
  book: '<path d="M12 6C9 3 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-7-1-10 2Zm0 0v15"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.pin}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const link = (url, text, cls = 'text-link') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${text}${icon('external')}</a>`;
const image = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const storageKey = 'our-japan-2027-v1';
let storageError = '';
let state = defaultState();
try {
  const raw = localStorage.getItem(storageKey);
  if (raw) state = normalizeState(JSON.parse(raw));
} catch (error) {
  storageError = `Your saved planner could not be loaded (${error.message}). Changes may not persist. Export a backup before leaving.`;
}
let page = 'Overview';
let cityFilter = 'All cities';
let searchQuery = '';
let menuOpen = false;
let toastTimer;
const nav = [
  ['Overview', 'grid'], ['Destinations', 'pin'], ['Itinerary', 'calendar'],
  ['Stays', 'bed'], ['Food & drink', 'food'], ['Day trips', 'leaf'], ['Getting around', 'train'],
  ['Budget', 'wallet'], ['Book ahead', 'ticket'], ['Saved places', 'heart'],
];
const priceText = text => formatPriceText(text, state.currency, state.budget.rate);
const money = (amount, currency = state.currency) => formatMoney(amount, currency, state.budget.rate);

function currencyToggle() {
  return `<div class="currency-toggle" role="group" aria-label="Display currency">${['JPY', 'USD'].map(currency => `<button data-currency="${currency}" aria-pressed="${state.currency === currency}" title="View estimates in ${currency}">${currency === 'JPY' ? '¥ JPY' : '$ USD'}</button>`).join('')}</div>`;
}
function currencyNotice() {
  return `<span>${state.currency === 'USD' ? 'USD prices are approximate conversions.' : 'Prices are displayed in Japanese yen.'} Reference rate: ¥${state.budget.rate.toLocaleString('en-US')} = US$1 · not live.</span><button class="text-link" data-action="edit-rate">Edit exchange rate ${icon('arrow')}</button>`;
}
function budgetInputValue(key) {
  return key === 'rate' || state.currency === 'JPY' ? state.budget[key] : Number((state.budget[key] / state.budget.rate).toFixed(2));
}
function budgetBreakdown() {
  return priceText('Transport default for two: roughly ¥30k shinkansen + ¥70k domestic flights/airport transfers + ¥28k local transport + ¥22k day-trip travel. Increase it for higher flight fares or taxis. Attraction admissions belong in experiences. No live exchange-rate feed.');
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch (error) {
    storageError = `This browser could not save your changes (${error.message}). Export a backup before leaving.`;
    const notice = document.querySelector('#storage-warning');
    if (notice) {
      notice.hidden = false;
      notice.textContent = storageError;
    }
    return false;
  }
}
function toast(text) {
  const element = document.querySelector('#toast');
  element.textContent = text;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 2600);
}
function navigate(nextPage, nextCity = 'All cities') {
  page = nextPage;
  cityFilter = nextCity;
  searchQuery = '';
  menuOpen = false;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelector('#main').focus({ preventScroll: true });
}
function heading(kicker, title, description, extra = '') {
  return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="page-description">${description}</p></div>${extra}</div>`;
}
function bookmark(place) {
  const selected = state.saved.includes(place.id);
  return `<button class="bookmark ${selected ? 'is-saved' : ''}" data-save="${place.id}" aria-label="${selected ? 'Unsave' : 'Save'} ${esc(place.title)}" aria-pressed="${selected}">${icon('heart')}</button>`;
}
function placePhoto(place, detail = false) {
  const photo = place.photo;
  const label = photo.kind === 'area' ? 'Area photo' : photo.kind === 'illustrative' ? 'Illustrative photo' : place.category === 'Stay' ? 'Hotel photo' : 'Venue / destination photo';
  const content = `<img src="${esc(photo.src)}" alt="${esc(photo.alt)}" width="1000" height="650" loading="${detail ? 'eager' : 'lazy'}" decoding="async" referrerpolicy="no-referrer" /><span class="photo-unavailable" hidden>${icon('info')}Photo unavailable. Use the source link to view photos.</span>`;
  const credit = link(photo.sourceUrl || place.url, `Photo: ${esc(photo.credit)}`, 'photo-credit');
  return `<figure class="place-photo ${detail ? 'detail-photo' : 'card-photo'}" data-photo="${place.id}">${detail ? `<div class="photo-frame">${content}</div>` : `<button class="photo-frame" data-detail="${place.id}" aria-label="View photo and details for ${esc(place.title)}">${content}<span class="photo-expand">${icon('search')}</span></button>`}<figcaption><span>${label}</span>${credit}${photo.license ? link(photo.licenseUrl, `${esc(photo.license)}${detail ? '' : ' · cropped preview'}`, 'photo-license') : ''}</figcaption></figure>`;
}
function placeCard(place) {
  const city = cities.find(city => city.id === place.city);
  return `<article class="place-card ${place.category === 'Stay' ? 'stay-card' : ''}">
    ${placePhoto(place)}
    <div class="place-card-content">
    <div class="place-card-top"><span class="city-label ${city.color}">${esc(place.city)}</span>${bookmark(place)}</div>
    <p class="small-caps">${esc(place.tier || place.category)}${place.area ? ` · ${esc(place.area)}` : ''}</p>
    <h3><button data-detail="${place.id}" class="title-button">${esc(place.title)}</button></h3>
    <p class="card-description">${esc(priceText(place.description))}</p>
    ${place.book ? `<span class="advance-label">${icon('ticket')}${esc(place.tag || 'Plan ahead')}</span>` : ''}
    <div class="place-meta">${icon(place.category === 'Stay' ? 'bed' : 'wallet')}<span>${esc(priceText(place.price))}</span></div>
    ${place.duration ? `<p class="duration">${esc(place.duration)}</p>` : ''}
    <div class="card-bottom"><button class="text-link" data-detail="${place.id}">Details & tips ${icon('arrow')}</button>${link(place.url, place.category === 'Stay' ? 'Hotel site' : 'Website')}</div>
    </div>
  </article>`;
}
function cityCard(city) {
  return `<button class="destination-card" data-city="${city.id}" aria-label="Explore ${city.id}">
    <div class="destination-image" style="background-image:url('${image(city.image)}');background-position:${city.position}"><span class="night-chip">${city.nights}</span><span class="city-jp" lang="ja">${city.jp}</span></div>
    <div class="destination-body"><div class="destination-title"><h3>${city.id}</h3><span>${icon('arrow')}</span></div><p>${city.subtitle}</p><div class="destination-footer"><span>${city.days}</span><span class="explore-city">Explore city ${icon('arrow')}</span></div></div>
  </button>`;
}
function sectionHeader(kicker, title, action = '', target = '') {
  return `<div class="section-heading"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div>${action ? `<button class="text-link" data-nav="${target}">${action}${icon('arrow')}</button>` : ''}</div>`;
}
function overview() {
  return `<section class="hero">
    <img class="hero-image" src="${image('photo-1493976040374-85c8e12f0c0e', 1800)}" alt="Traditional Kyoto street with a pagoda and Japanese architecture" fetchpriority="high" />
    <div class="hero-shade"></div><div class="hero-content"><span class="hero-label"><span></span> SEPTEMBER 2027 · 14 DAYS</span><h1>Japan trip<br> planner.</h1><p>Tokyo, Kyoto, and Sapporo.<br> Hotels, activities, transport, and baseball.</p><button class="button cream" data-nav="Itinerary">View itinerary ${icon('arrow')}</button></div><span class="hero-caption">${icon('pin')} Kyoto, Japan <span lang="ja">京都、日本</span></span>
  </section>
  <div class="trip-stats"><div>${icon('calendar')}<span><small>TRAVEL MONTH</small><strong>September 2027</strong></span></div><div>${icon('sun')}<span><small>DURATION & TRAVELERS</small><strong>14 days · 2 adults</strong></span></div><div>${icon('pin')}<span><small>DESTINATIONS</small><strong>Tokyo · Kyoto · Sapporo</strong></span></div><span class="draft-pill"><span></span> Draft itinerary</span></div>
  <div class="intro-line"><div><p class="eyebrow">TRIP RESEARCH & PLANNING</p><h2>Trip overview</h2><p>Compare destinations, accommodation, activities, and estimated costs.</p></div><div class="stamp" aria-hidden="true"><span>日本旅行</span><small>JAPAN · 2027</small></div></div>
  ${sectionHeader('TOKYO · KYOTO · SAPPORO', 'Destinations', 'All destinations', 'Destinations')}
  <div class="destination-grid">${cities.map(cityCard).join('')}</div>
  <div class="overview-two"><section class="baseball-feature"><div class="feature-icon">${icon('ticket')}</div><p class="eyebrow">TOKYO DOME & ES CON FIELD</p><h2>Baseball games</h2><p>Plan for a Giants game in Tokyo<br> and a Fighters game in Kitahiroshima.</p><div class="game-pair"><span>TOKYO <strong>Giants</strong></span>${icon('arrow')}<span>KITAHIROSHIMA <strong>Fighters</strong></span></div><button class="text-link" data-action="baseball">View baseball details ${icon('arrow')}</button><span class="pending-note">2027 game dates & ticket sales to be confirmed</span></section>
  <section class="ahead-preview"><div class="section-heading"><div><p class="eyebrow">BOOKING WINDOWS & DEADLINES</p><h2>Advance bookings</h2></div>${icon('calendar')}</div><p class="muted">Reservations and ticket releases to monitor before departure.</p>${bookingTasks.slice(0, 3).map((task, index) => `<button class="ahead-row" data-task="${task.id}"><span class="ahead-number">0${index + 1}</span><span><strong>${esc(task.title)}</strong><small>${esc(task.when)}</small></span>${icon('arrow')}</button>`).join('')}<button class="text-link" data-nav="Book ahead">View booking checklist ${icon('arrow')}</button></section></div>
  ${sectionHeader('FROM TOKYO, KYOTO & SAPPORO', 'Day trips', 'All day trips', 'Day trips')}
  <div class="mini-grid">${['nara', 'otaru', 'kawaguchiko'].map(id => { const p = places.find(p => p.id === id); return `<button class="mini-card" data-detail="${id}"><span class="mini-icon">${icon(id === 'nara' ? 'leaf' : id === 'otaru' ? 'train' : 'sun')}</span><span><small>FROM ${p.city.toUpperCase()}</small><strong>${p.title}</strong><span>${p.duration}</span></span>${icon('arrow')}</button>`; }).join('')}</div>
  <div class="research-note">${icon('book')}<p><strong>Research status.</strong> Based on the Japan 2027 document, with additional Sapporo research. Prices are planning estimates, not live quotes. Dates remain provisional until both home games are confirmed. <button data-nav="Research notes" class="inline-link">View research notes</button></p></div>`;
}

function controls() {
  return `<div class="filter-bar"><div class="city-tabs" aria-label="Filter by city">${['All cities', ...cities.map(city => city.id)].map(city => `<button data-filter="${city}" class="${cityFilter === city ? 'active' : ''}" aria-pressed="${cityFilter === city}">${city === 'All cities' ? 'All cities' : city}${city === 'All cities' ? '' : `<span class="dot ${cities.find(c => c.id === city).color}"></span>`}</button>`).join('')}</div><label class="search-box">${icon('search')}<input id="place-search" type="search" placeholder="Search places…" value="${esc(searchQuery)}" aria-label="Search places" /></label></div>`;
}
function results(category, savedOnly = false) {
  const matches = filterPlaces(places, { city: cityFilter, category, query: searchQuery, saved: savedOnly ? state.saved : undefined });
  return `<p class="result-count" aria-live="polite">${matches.length} ${matches.length === 1 ? 'result' : 'results'} <span>${state.currency === 'USD' ? 'Approximate USD estimates.' : 'All prices are estimates in JPY.'}</span></p><div class="place-grid">${matches.map(placeCard).join('')}</div>${!matches.length ? `<div class="empty-state">${icon(savedOnly ? 'heart' : 'search')}<h2>${savedOnly && !state.saved.length ? 'No saved places' : 'No matching places'}</h2><p>${savedOnly && !state.saved.length ? 'Select the heart icon on an activity, hotel, restaurant, or day trip to save it here.' : 'Try a different city or a broader search.'}</p><button class="button dark" ${savedOnly && !state.saved.length ? 'data-nav="Destinations"' : 'data-action="clear-filters"'}>${savedOnly && !state.saved.length ? 'View destinations' : 'Clear filters'} ${icon('arrow')}</button></div>` : ''}`;
}
function collection(title, kicker, description, category, savedOnly = false) {
  return `${heading(kicker, title, description)}${category === 'Stay' ? '<div class="callout">' + icon('info') + '<p><strong>One room, two people, per night.</strong> These are editorial planning ranges, not checked September 2027 availability. Budget for taxes, breakfast, room size, and holiday/weekend changes. Prefer refundable holds until the baseball dates align.</p></div>' : ''}${controls()}<div id="results">${results(category, savedOnly)}</div>`;
}
function destinations() {
  const city = cities.find(city => city.id === cityFilter);
  return `${heading('CITY GUIDES', city ? city.id : 'Destinations', city ? city.description : 'Research activities, hotels, restaurants, and day trips in Tokyo, Kyoto, and Sapporo.')}${!city ? `<div class="destination-grid top-destinations">${cities.map(cityCard).join('')}</div>` : `<div class="city-banner"><img src="${image(city.image, 1200)}" alt="${city.id}, Japan" /><div><span class="eyebrow">${city.days} · ${city.nights}</span><h2 lang="ja">${city.jp}</h2><p>Suggested base: ${city.area}</p></div></div>`}${controls()}<div class="category-pills">${['Experience', 'Stay', 'Food & drink', 'Day trip'].map(category => `<button data-category="${category}">${icon(category === 'Stay' ? 'bed' : category === 'Food & drink' ? 'food' : 'pin')}${category === 'Experience' ? 'Things to do' : category === 'Stay' ? 'Places to stay' : category === 'Day trip' ? 'Day trips' : category}</button>`).join('')}</div><div id="results">${results('Experience')}</div>`;
}
function itineraryPage() {
  return `${heading('14 DAYS · 13 NIGHTS', 'Suggested itinerary', 'A provisional route through Tokyo, Kyoto, and Sapporo. Day numbers are relative; exact September dates are not fixed.') }
    <div class="route-strip"><span>Tokyo <small>5 nights</small></span>${icon('train')}<span>Kyoto <small>4 nights</small></span>${icon('plane')}<span>Sapporo <small>3 nights</small></span>${icon('plane')}<span>Tokyo <small>1 buffer night</small></span></div>
    <div class="callout">${icon('ticket')}<p><strong>Baseball schedule dependency.</strong> This order is provisional and does not guarantee two home games. Once schedules are released, adjust game days within each stay or reverse the route. Adding another overnight destination requires reducing time elsewhere; day trips avoid an additional hotel change.</p></div>
    <div class="timeline">${itinerary.map(([city, title, description, tag], index) => `<article class="day-row"><div class="day-marker"><small>DAY</small><strong>${String(index + 1).padStart(2, '0')}</strong></div><div class="day-content"><span class="city-label ${cities.find(c => c.id === city).color}">${city}</span><span class="day-tag">${tag}</span><h3>${title}</h3><p>${description}</p></div></article>`).join('')}</div>
    <div class="callout">${icon('info')}<p><strong>Day-trip alternatives.</strong> Nara, Osaka, and Nintendo/Uji compete for the same Kyoto day. Choose one unless another Kyoto day is reassigned. Tokyo’s Nikko and Odawara options are alternatives too. Departure origin and flight schedules still need to be chosen.</p></div>`;
}
function transportPage() {
  return `${heading('TRAINS, FLIGHTS & LOCAL TRANSPORT', 'Transportation options', 'Compare shinkansen, domestic flights, airport transfers, and local transport. Times are approximate; prices are one-way planning estimates, not quotes.')}<div class="transport-grid">${transport.map((leg, index) => `<article class="transport-card"><div class="transport-top"><span class="transport-icon">${icon(index === 0 || index > 2 ? 'train' : 'plane')}</span><span class="small-caps">${leg.mode}</span></div><h2>${leg.title}</h2><p class="transport-time">${leg.time}</p><p>${esc(priceText(leg.description))}</p><strong class="transport-price">${esc(priceText(leg.price))}</strong><div class="card-bottom">${link(leg.url, leg.label)}${leg.other ? link(leg.other, 'Other airline') : ''}</div></article>`).join('')}</div><div class="callout">${icon('info')}<p><strong>Baggage and connection times.</strong> Check each airline’s baggage allowance. Luggage forwarding may simplify Tokyo–Kyoto, but confirm delivery time before using it for Hokkaido. Book oversized shinkansen baggage space when required. Allow additional time for rail and flight disruption during typhoon season.</p></div>`;
}
function budgetPage() {
  return `${heading('ESTIMATED COSTS FOR TWO ADULTS', 'Trip budget', `An editable estimate for 14 days and 13 nights, displayed in ${state.currency}. USD conversions use the illustrative exchange rate below.`)}<div class="budget-layout"><section class="panel budget-inputs"><p class="eyebrow">EDIT ESTIMATES</p><h2>Budget assumptions</h2><p>Change an amount to update the estimate. Saved in this browser. Switching currency does not change the underlying yen budget.</p>${[
    ['hotel', 'Hotel per night · one room for two', `${state.currency} / night`],
    ['food', 'Daily food & drink · both travelers', `${state.currency} / day`],
    ['transport', 'Total transport · both travelers', state.currency],
    ['activities', 'Total experiences · both travelers', state.currency],
    ['rate', 'Illustrative exchange rate', 'JPY per 1 USD'],
  ].map(([key, label, unit]) => `<label class="budget-field" for="budget-${key}"><span>${label}</span><div><input id="budget-${key}" data-budget="${key}" type="number" min="${key === 'rate' ? '1' : '0'}" max="10000000" step="${key === 'rate' ? 'any' : state.currency === 'USD' ? '0.01' : '1'}" value="${budgetInputValue(key)}" required /><span>${unit}</span></div></label>`).join('')}<p class="field-help" id="budget-breakdown">${esc(budgetBreakdown())}</p></section><section class="budget-summary panel" id="budget-summary">${budgetSummary()}</section></div><div class="callout">${icon('info')}<p><strong>Not included:</strong> international flights (origin undecided), shopping, travel insurance, eSIM, passport/visa costs, and additional premium activities. The 15% contingency is not a forecast of 2027 price inflation. Bookable quotes may be higher, especially around public holidays. Do not double-count airport transfers already included in the flight-leg allowances.</p></div>`;
}
function budgetSummary() {
  const { rows, subtotal, buffer, total } = calculateBudget(state.budget);
  return `<p class="eyebrow">ESTIMATED COST IN JAPAN · ${state.currency}</p><h2>${state.currency === 'USD' ? '≈ ' : ''}${money(total)}</h2><p class="usd">${state.currency === 'JPY' ? '≈ ' : ''}${money(total, state.currency === 'JPY' ? 'USD' : 'JPY')} <span>for two adults</span></p><div class="budget-lines">${rows.map(row => `<div><span>${row.label}</span><strong>${money(row.amount)}</strong></div>`).join('')}<div><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div><span>Contingency · 15%</span><strong>${money(buffer)}</strong></div></div><div class="budget-total"><span>Per person, excluding international flights</span><strong>${money(Math.round(total / 2))}</strong></div><p class="field-help">Estimates, not researched hotel quotes or guaranteed 2027 ticket prices. USD values are approximate conversions.</p>`;
}
function bookingsPage() {
  const completed = bookingTasks.filter(task => state.completed.includes(task.id)).length;
  return `${heading('RESERVATIONS & TICKET RELEASES', 'Booking checklist', 'Track advance reservations and booking deadlines. Marking an item complete does not make a reservation.')}<div class="booking-progress"><div><strong>${completed} of ${bookingTasks.length} complete</strong><span>Checklist progress is saved in this browser.</span></div><progress max="${bookingTasks.length}" value="${completed}" aria-label="Booking checklist progress"></progress></div><div class="booking-list">${bookingTasks.map((task, index) => `<article class="booking-card ${state.completed.includes(task.id) ? 'complete' : ''}" id="task-${task.id}"><label class="task-checkbox"><input type="checkbox" data-complete="${task.id}" ${state.completed.includes(task.id) ? 'checked' : ''} /><span>${icon('check')}</span><span class="sr-only">Mark ${esc(task.title)} complete</span></label><div><span class="small-caps">${String(index + 1).padStart(2, '0')} / ${task.when}</span><h2>${task.title}</h2><p>${task.text}</p><div class="booking-links">${link(task.url, 'Official guide / booking')}${task.other ? link(task.other, 'Fighters / F Village') : ''}${task.id === 'experiences' ? '<button class="text-link" data-nav="Destinations">Find experience links ' + icon('arrow') + '</button>' : ''}</div></div></article>`).join('')}</div>`;
}
function savedPage() {
  return `${collection('Saved places', 'SHORTLIST', 'Select a heart icon to save a place. Saved in this browser only; not synced between devices or travelers.', undefined, true)}<section class="panel notes-panel"><div class="section-heading"><div><p class="eyebrow">PLANNING NOTES</p><h2>Trip notes</h2></div>${icon('book')}</div><label for="trip-notes" class="muted">Record decisions, restaurant recommendations, and planning questions. Do not include sensitive booking or passport details.</label><textarea id="trip-notes" rows="6" placeholder="Add planning notes…">${esc(state.notes)}</textarea><div class="notes-footer"><span id="notes-status" aria-live="polite">Notes save automatically on this device.</span><button class="text-link" data-action="export">${icon('download')} Export planner backup</button></div></section>`;
}
function researchPage() {
  return `${heading('SOURCES & LIMITATIONS', 'Research notes', `Research snapshot: ${researchDate}. This is a personal planning tool, not a travel agent or live booking feed.`)}<div class="panel research-panel"><h2>Research scope and price estimates</h2><p>The attached Japan 2027 document provided the initial Tokyo and Kyoto recommendations. Sapporo, its hotels, food, and day trips are additional research. The original source’s US-dollar prices are not reused as guaranteed rates. All yen ranges are broad planning estimates for comparing options; none is a verified September 2027 quote.</p><p>Direct links are provided wherever possible; the two GetYourGuide workshops and Viator kart experience are third-party listings from the source document. Listings, restaurant menus, opening hours, and booking policies may change before 2027. Some official pages are Japanese-only or block automated access. A link does not mean availability has been checked.</p><p>Baseball schedules, ticket-sale windows, exact travel dates, international flight origin, and hotel budget remain undecided. Check home fixtures for both teams before nonrefundable travel. An indoor or roofed venue does not prevent transport disruption.</p><p>September in Tokyo and Kyoto can be hot, humid, and affected by typhoons. Allow for indoor alternatives and an overnight in Tokyo before the return flight. Early Hokkaido mountain foliage is possible; Kyoto city’s autumn colors generally arrive much later. Respect temple photography rules, private lanes in Gion, and wildlife in Nara.</p></div><div class="source-grid">${sources.map(([title, description, url]) => `<article class="panel source-card"><span class="source-icon">${icon('book')}</span><h3>${title}</h3><p>${description}</p>${url ? link(url, 'Open source') : '<span class="small-caps">Provided attachment · not published</span>'}</article>`).join('')}</div><div class="callout">${icon('heart')}<p><strong>Source-document recommendations.</strong> Street karting and Art Aquarium are optional activities with licensing and animal-welfare considerations. Nintendo Museum, Nara, and Osaka compete for the same available day. The source document and personal attachment are not hosted by this website.</p></div>`;
}
function renderContent() {
  switch (page) {
    case 'Overview': return overview();
    case 'Destinations': return destinations();
    case 'Itinerary': return itineraryPage();
    case 'Stays': return collection('Places to stay', 'HOTELS & ACCOMMODATION', 'Compare six accommodation options by location and estimated nightly cost. The itinerary uses one hotel per city stay.', 'Stay');
    case 'Food & drink': return collection('Places to eat and drink', 'RESTAURANTS, MARKETS & SAKE', 'Restaurant and market options in each city, with estimated costs and links. Prices are per person, not per couple.', 'Food & drink');
    case 'Day trips': return collection('Day trips', 'OPTIONS FROM EACH CITY', 'Choose one destination per day. Travel times are approximate one way; costs are broad per-person daily estimates.', 'Day trip');
    case 'Getting around': return transportPage();
    case 'Budget': return budgetPage();
    case 'Book ahead': return bookingsPage();
    case 'Saved places': return savedPage();
    case 'Research notes': return researchPage();
    default: return overview();
  }
}
function render() {
  document.title = `${page} · Japan trip planner`;
  document.querySelector('#app').innerHTML = `<a class="skip-link" href="#main">Skip to content</a>
    <aside class="sidebar ${menuOpen ? 'open' : ''}" aria-label="Trip navigation"><a href="#overview" class="brand" data-nav="Overview"><span class="brand-symbol">旅</span><span>japan<span class="brand-sub">TRIP PLANNER</span></span></a><div class="trip-label">SEPTEMBER <span>2027</span></div><nav>${nav.map(([title, glyph]) => `<button class="nav-item ${page === title ? 'active' : ''}" data-nav="${title}" ${page === title ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${title}</span>${title === 'Book ahead' ? '<span class="nav-dot"></span>' : title === 'Saved places' ? `<span class="saved-count">${state.saved.length}</span>` : ''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="sidebar-note"><span class="little-sun">${icon('sun')}</span><p>Tokyo · Kyoto · Sapporo<br>14 days · 2 adults</p><span>SEPTEMBER 2027</span></div><button class="nav-item research-nav ${page === 'Research notes' ? 'active' : ''}" data-nav="Research notes">${icon('book')} Research notes ${icon('external')}</button><span class="sidebar-foot">RESEARCH & PLANNING ${icon('book')}</span></div></aside>
    <div class="main-shell"><header class="topbar"><button class="mobile-menu icon-button" data-action="menu" aria-label="Toggle trip navigation" aria-expanded="${menuOpen}">${icon(menuOpen ? 'close' : 'menu')}</button><div class="breadcrumb"><span class="breadcrumb-brand">Japan trip planner</span><span class="breadcrumb-separator">/</span><strong>${page}</strong></div><div class="topbar-right">${currencyToggle()}<span class="top-date">${icon('calendar')} September 2027</span><button class="couple-avatar" data-nav="Saved places" aria-label="Open saved places">JP<span>2</span></button></div></header>
    <main id="main" tabindex="-1"><div id="storage-warning" class="storage-warning" role="alert" ${storageError ? '' : 'hidden'}>${esc(storageError)}</div><div class="currency-notice" id="currency-notice">${currencyNotice()}</div>${renderContent()}<footer><span>Prices and dates are provisional.</span><button data-nav="Research notes">Estimates & sources ${icon('arrow')}</button><span>JAPAN · SEPTEMBER 2027</span></footer></main></div>
    <dialog id="detail-dialog" aria-labelledby="dialog-title"></dialog><div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}
function showDetail(id) {
  const place = places.find(place => place.id === id);
  if (!place) return;
  const dialog = document.querySelector('#detail-dialog');
  dialog.innerHTML = `<div class="dialog-top"><span class="small-caps">${place.city} / ${place.category}</span><button class="icon-button" data-action="close-dialog" aria-label="Close details">${icon('close')}</button></div><h2 id="dialog-title">${esc(place.title)}</h2>${placePhoto(place, true)}<p class="photo-disclaimer">${place.category === 'Stay' ? 'Property photo; the room type and view shown are not guaranteed for any rate.' : 'Photos may show a different season or setup. Check current details with the venue.'}</p><p>${esc(priceText(place.description))}</p><div class="detail-price">${icon('wallet')}<strong>${esc(priceText(place.price))}</strong></div><p class="field-help">Planning estimate only, not a live quote or confirmed 2027 price. ${state.currency === 'USD' ? `USD converted at ¥${state.budget.rate.toLocaleString('en-US')} = US$1 (illustrative, not live).` : ''}</p>${place.duration ? `<p>${icon('calendar')} ${esc(place.duration)}</p>` : ''}${place.book ? `<div class="detail-callout"><span class="small-caps">BOOKING NOTE</span><p>${esc(priceText(place.book))}</p></div>` : ''}${place.tip ? `<div class="detail-tip"><strong>Planning considerations</strong><p>${esc(priceText(place.tip))}</p></div>` : ''}${place.source ? `<p class="source-credit">${place.source}</p>` : ''}<div class="dialog-actions">${link(place.url, place.category === 'Stay' ? 'Hotel website' : 'Website / booking info', 'button dark')}<button class="button outline" data-save="${place.id}" aria-pressed="${state.saved.includes(place.id)}">${icon('heart')}${state.saved.includes(place.id) ? 'Saved to shortlist' : 'Save to shortlist'}</button></div><p class="field-help">Opens an external site. Check current availability, terms, and cancellation rules before paying.</p>`;
  dialog.showModal();
}
function exportPlanner() {
  const blob = new Blob([JSON.stringify({ trip: 'Japan · September 2027', exported: new Date().toISOString(), ...state, budgetCurrency: 'JPY', savedPlaces: places.filter(place => state.saved.includes(place.id)) }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'our-japan-2027-planner.json';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Planner backup exported.');
}
document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const figure = image.closest('.place-photo');
  if (!figure) return;
  image.hidden = true;
  figure.classList.add('photo-failed');
  figure.querySelector('.photo-unavailable').hidden = false;
  console.warn(`Photo could not be loaded for ${figure.dataset.photo}: ${image.src}`);
}, true);
document.addEventListener('click', event => {
  const target = event.target.closest('button, a[data-nav]');
  if (!target) return;
  if (target.dataset.nav) {
    event.preventDefault();
    navigate(target.dataset.nav);
  } else if (target.dataset.currency) {
    if (state.currency === target.dataset.currency) return;
    const scrollY = window.scrollY;
    state.currency = target.dataset.currency;
    const stored = persist();
    render();
    window.scrollTo({ top: scrollY, behavior: 'instant' });
    document.querySelector(`[data-currency="${state.currency}"]`).focus({ preventScroll: true });
    toast(stored ? `Prices displayed in ${state.currency}.` : 'Currency changed, but not saved. Export a backup.');
  } else if (target.dataset.city) {
    navigate('Destinations', target.dataset.city);
  } else if (target.dataset.filter) {
    cityFilter = target.dataset.filter;
    render();
    document.querySelector(`[data-filter="${cityFilter}"]`).focus({ preventScroll: true });
  } else if (target.dataset.save) {
    const id = target.dataset.save;
    state.saved = state.saved.includes(id) ? state.saved.filter(saved => saved !== id) : [...state.saved, id];
    const stored = persist();
    const isSaved = state.saved.includes(id);
    document.querySelectorAll(`[data-save="${id}"]`).forEach(button => {
      button.setAttribute('aria-pressed', String(isSaved));
      if (button.classList.contains('bookmark')) {
        button.classList.toggle('is-saved', isSaved);
        button.setAttribute('aria-label', `${isSaved ? 'Unsave' : 'Save'} ${places.find(p => p.id === id).title}`);
      } else {
        button.innerHTML = `${icon('heart')}${isSaved ? 'Saved to shortlist' : 'Save to shortlist'}`;
      }
    });
    document.querySelector('.saved-count').textContent = state.saved.length;
    if (page === 'Saved places') document.querySelector('#results').innerHTML = results(undefined, true);
    toast(stored ? isSaved ? 'Place saved to shortlist.' : 'Place removed from shortlist.' : 'Change not saved. Export a backup.');
  } else if (target.dataset.detail) {
    showDetail(target.dataset.detail);
  } else if (target.dataset.category) {
    const category = target.dataset.category;
    if (category === 'Stay') navigate('Stays', cityFilter);
    else if (category === 'Food & drink') navigate('Food & drink', cityFilter);
    else if (category === 'Day trip') navigate('Day trips', cityFilter);
    else document.querySelector('#results').innerHTML = results('Experience');
  } else if (target.dataset.task) {
    navigate('Book ahead');
    document.querySelector(`#task-${target.dataset.task}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    switch (target.dataset.action) {
      case 'menu': menuOpen = !menuOpen; render(); break;
      case 'close-dialog': document.querySelector('#detail-dialog').close(); break;
      case 'clear-filters': cityFilter = 'All cities'; searchQuery = ''; render(); break;
      case 'export': exportPlanner(); break;
      case 'edit-rate': navigate('Budget'); document.querySelector('#budget-rate').focus(); break;
      case 'baseball': navigate('Destinations'); searchQuery = 'baseball'; document.querySelector('#place-search').value = searchQuery; document.querySelector('#results').innerHTML = results('Experience'); document.querySelector('#place-search').scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
    }
  }
});
document.addEventListener('input', event => {
  const target = event.target;
  if (target.id === 'place-search') {
    searchQuery = target.value;
    const category = page === 'Stays' ? 'Stay' : page === 'Food & drink' ? 'Food & drink' : page === 'Day trips' ? 'Day trip' : page === 'Saved places' ? undefined : 'Experience';
    document.querySelector('#results').innerHTML = results(category, page === 'Saved places');
  } else if (target.id === 'trip-notes') {
    state.notes = target.value;
    const stored = persist();
    document.querySelector('#notes-status').textContent = stored ? 'Saved on this device.' : 'Not saved. Please export a backup.';
  } else if (target.dataset.budget) {
    if (!target.checkValidity()) return;
    const value = Number(target.value);
    if (!Number.isFinite(value)) return;
    const key = target.dataset.budget;
    state.budget[key] = key === 'rate' || state.currency === 'JPY' ? value : Math.round(value * state.budget.rate);
    persist();
    document.querySelector('#budget-summary').innerHTML = budgetSummary();
    if (key === 'rate') {
      document.querySelector('#currency-notice').innerHTML = currencyNotice();
      document.querySelector('#budget-breakdown').textContent = budgetBreakdown();
      document.querySelectorAll('[data-budget]').forEach(input => {
        if (input.dataset.budget !== 'rate') input.value = budgetInputValue(input.dataset.budget);
      });
    }
  }
});
document.addEventListener('change', event => {
  const target = event.target;
  if (target.dataset.complete) {
    const id = target.dataset.complete;
    state.completed = target.checked ? [...new Set([...state.completed, id])] : state.completed.filter(completed => completed !== id);
    const stored = persist();
    render();
    document.querySelector(`[data-complete="${id}"]`).focus();
    if (!stored) toast('Checklist changed, but not saved. Export a backup.');
  }
});
document.addEventListener('click', event => {
  const dialog = document.querySelector('#detail-dialog');
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
render();
