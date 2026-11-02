export const defaultBudget = { hotel: 23000, food: 11000, transport: 150000, activities: 65000, rate: 150 };
export const defaultState = () => ({ saved: [], completed: [], notes: '', currency: 'JPY', budget: { ...defaultBudget } });
export function normalizeState(value) {
  const defaults = defaultState();
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Saved planner data is not a valid object.');
  return {
    saved: Array.isArray(value.saved) ? [...new Set(value.saved.filter(id => typeof id === 'string'))] : [],
    completed: Array.isArray(value.completed) ? [...new Set(value.completed.filter(id => typeof id === 'string'))] : [],
    notes: typeof value.notes === 'string' ? value.notes : '',
    currency: value.currency === 'USD' ? 'USD' : 'JPY',
    budget: Object.fromEntries(Object.entries(defaults.budget).map(([key, fallback]) => [key, typeof value.budget?.[key] === 'number' && Number.isFinite(value.budget[key]) && value.budget[key] >= (key === 'rate' ? 1 : 0) ? value.budget[key] : fallback])),
  };
}
export function formatMoney(amount, currency, rate) {
  if (!Number.isFinite(amount)) throw new RangeError('The amount must be a finite number.');
  if (!['JPY', 'USD'].includes(currency)) throw new RangeError('Unsupported display currency.');
  if (!Number.isFinite(rate) || rate <= 0) throw new RangeError('The exchange rate must be a positive number.');
  const value = currency === 'USD' ? amount / rate : amount;
  return `${currency === 'USD' ? 'US$' : '¥'}${value.toLocaleString('en-US', { maximumFractionDigits: currency === 'USD' ? 2 : 0 })}`;
}
export function formatPriceText(text, currency, rate) {
  formatMoney(0, currency, rate);
  if (currency === 'JPY') return text;
  const number = '(\\d[\\d,]*(?:\\.\\d+)?[kK]?)';
  const yen = new RegExp(`¥${number}(?:[–—-]¥?${number})?`, 'g');
  const amount = value => Number(value.replace(/,/g, '').replace(/[kK]$/, '')) * (/[kK]$/.test(value) ? 1000 : 1);
  return text.replace(yen, (_, start, end) => `≈ ${formatMoney(amount(start), 'USD', rate)}${end ? `–${formatMoney(amount(end), 'USD', rate).replace('US$', '')}` : ''}`);
}
export function calculateBudget(budget) {
  const rows = [
    { label: 'Hotels · 13 nights, one room for two', amount: budget.hotel * 13 },
    { label: 'Food & drink · 14 days, two adults', amount: budget.food * 14 },
    { label: 'Transport · both travelers', amount: budget.transport },
    { label: 'Experiences & both baseball games · two people', amount: budget.activities },
  ];
  const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
  return { rows, subtotal, buffer: Math.round(subtotal * 0.15), total: Math.round(subtotal * 1.15) };
}
export function filterPlaces(places, { city = 'All cities', category, query = '', saved } = {}) {
  const needle = query.trim().toLowerCase();
  return places.filter(place => (city === 'All cities' || place.city === city)
    && (!category || place.category === category)
    && (!saved || saved.includes(place.id))
    && (!needle || `${place.title} ${place.city} ${place.category} ${place.description} ${place.source || ''}`.toLowerCase().includes(needle)));
}
