import test from 'node:test';
import assert from 'node:assert/strict';
import { places, cities, itinerary, bookingTasks, transport } from '../src/data.js';
import { defaultBudget, defaultState, normalizeState, calculateBudget, filterPlaces, formatMoney, formatPriceText } from '../src/model.js';
import { placePhotos } from '../src/photos.js';

test('budget correctly counts 13 room nights, 14 couple-food days, and contingency', () => {
  const result = calculateBudget(defaultBudget);
  assert.equal(result.subtotal, 668000);
  assert.equal(result.buffer, 100200);
  assert.equal(result.total, 768200);
  assert.equal(calculateBudget({ hotel: 0, food: 0, transport: 0, activities: 0 }).total, 0);
});
test('new planner state is independent and validates persisted numeric values', () => {
  const first = defaultState();
  first.saved.push('nara');
  assert.deepEqual(defaultState().saved, []);
  const result = normalizeState({ saved: ['nara', 'nara', null], completed: [2, 'schedule'], notes: '<script>not executable</script>', budget: { hotel: -1, food: NaN, rate: 0, transport: 2000 } });
  assert.deepEqual(result.saved, ['nara']);
  assert.deepEqual(result.completed, ['schedule']);
  assert.equal(result.budget.hotel, defaultBudget.hotel);
  assert.equal(result.budget.food, defaultBudget.food);
  assert.equal(result.budget.rate, 150);
  assert.equal(result.budget.transport, 2000);
  assert.throws(() => normalizeState(null));
});
test('city, category, query, and shortlist filters work together', () => {
  assert.equal(filterPlaces(places, { category: 'Stay' }).length, 6);
  assert.equal(filterPlaces(places, { category: 'Stay', city: 'Sapporo' }).length, 2);
  assert.deepEqual(filterPlaces(places, { query: ' NARA ', saved: ['nara', 'otaru'] }).map(p => p.id), ['nara']);
  assert.equal(filterPlaces(places, { saved: [] }).length, 0);
  assert.equal(filterPlaces(places, { query: 'no-such-place' }).length, 0);
  assert.equal(filterPlaces(places, { category: 'Experience', query: 'baseball' }).length, 2);
});
test('currency preference persists without changing legacy saved data or yen budgets', () => {
  assert.equal(defaultState().currency, 'JPY');
  assert.equal(normalizeState({ notes: 'Keep my trip notes' }).currency, 'JPY');
  assert.equal(normalizeState({ currency: 'EUR' }).currency, 'JPY');
  const budget = { ...defaultBudget, hotel: 27000 };
  const result = normalizeState({ currency: 'USD', saved: ['nara'], completed: ['schedule'], notes: 'Keep my trip notes', budget });
  assert.equal(result.currency, 'USD');
  assert.deepEqual(result.budget, budget);
  assert.deepEqual(result.saved, ['nara']);
  assert.deepEqual(result.completed, ['schedule']);
  assert.equal(result.notes, 'Keep my trip notes');
  assert.deepEqual(normalizeState(JSON.parse(JSON.stringify(result))), result);
});
test('currency formatting converts amounts, ranges, shorthand, and mixed price descriptions', () => {
  assert.equal(formatMoney(768200, 'JPY', 150), '¥768,200');
  assert.equal(formatMoney(768200, 'USD', 150), 'US$5,121.33');
  assert.equal(formatMoney(500, 'USD', 150), 'US$3.33');
  assert.equal(formatMoney(0, 'USD', 150), 'US$0');
  assert.equal(formatPriceText('¥18,000–30,000 / room / night', 'USD', 150), '≈ US$120–200 / room / night');
  assert.equal(formatPriceText('Allow ¥500–¥1,000 / person', 'USD', 100), 'Allow ≈ US$5–10 / person');
  assert.equal(formatPriceText('¥30k + ¥70k + ¥28K + ¥22k', 'USD', 100), '≈ US$300 + ≈ US$700 + ≈ US$280 + ≈ US$220');
  assert.equal(formatPriceText('¥500-1,000 / person', 'USD', 125), '≈ US$4–8 / person');
  assert.equal(formatPriceText('Free; food extra', 'USD', 150), 'Free; food extra');
  assert.equal(formatPriceText('Source document: US$60–80', 'JPY', 150), 'Source document: US$60–80');
  for (const entry of [...places, ...transport]) {
    assert.equal(formatPriceText(entry.price, 'JPY', 150), entry.price);
    const converted = formatPriceText(entry.price, 'USD', 150);
    assert.ok(!converted.includes('¥'), entry.id || entry.title);
    if (entry.price.includes('¥')) assert.match(converted, /≈ US\$/, entry.id || entry.title);
  }
  assert.throws(() => formatMoney(100, 'USD', 0), RangeError);
  assert.throws(() => formatMoney(Infinity, 'USD', 150), RangeError);
  assert.throws(() => formatMoney(100, 'EUR', 150), RangeError);
});
test('all research entries have unique IDs, HTTPS leads, and complete context', () => {
  assert.equal(new Set(places.map(p => p.id)).size, places.length);
  for (const place of places) {
    assert.ok(cities.some(city => city.id === place.city), place.id);
    assert.ok(place.title && place.description && place.price, place.id);
    assert.equal(new URL(place.url).protocol, 'https:');
  }
  assert.equal(new Set(bookingTasks.map(task => task.id)).size, bookingTasks.length);
  for (const leg of transport) assert.equal(new URL(leg.url).protocol, 'https:');
});
test('itinerary has 14 days and 13 correctly allocated overnight stays', () => {
  assert.equal(itinerary.length, 14);
  assert.deepEqual(itinerary.slice(0, -1).reduce((nights, [city]) => ({ ...nights, [city]: (nights[city] || 0) + 1 }), {}), { Tokyo: 6, Kyoto: 4, Sapporo: 3 });
  assert.ok(itinerary[12][2].includes('overnight buffer'));
});
test('every place has a credited photo and illustrative images are labeled', () => {
  assert.deepEqual(Object.keys(placePhotos).sort(), places.map(place => place.id).sort());
  for (const place of places) {
    const photo = place.photo;
    assert.ok(photo.alt && photo.credit, place.id);
    assert.equal(new URL(photo.src).protocol, 'https:', place.id);
    assert.equal(new URL(photo.sourceUrl || place.url).protocol, 'https:', place.id);
    assert.ok(['venue', 'area', 'illustrative'].includes(photo.kind), place.id);
    if (place.category === 'Stay') assert.equal(photo.kind, 'venue', place.id);
    if (photo.sourceUrl?.includes('commons.wikimedia.org')) {
      assert.match(photo.license, /^(CC BY|Public domain)/);
      assert.equal(new URL(photo.licenseUrl).protocol, 'https:');
    }
  }
});
