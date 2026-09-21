// Every figure is read from the CRM. These helpers only put it into the words the wireframe uses.
const LONDON = 'Europe/London';

export const num = (n: number | null | undefined) => new Intl.NumberFormat('en-GB').format(Number(n) || 0);

export function pounds(n: number | string | null | undefined): string {
  const v = Number(n);
  if (!isFinite(v)) return '';
  const abs = Math.abs(v);
  const whole = Math.abs(abs - Math.round(abs)) < 0.005;
  return '£' + (whole ? num(Math.round(abs)) : abs.toFixed(2));
}

// +620, −520 (the wireframe uses a true minus sign), 0
export function signedPoints(n: number | null | undefined): string {
  const v = Number(n) || 0;
  if (v > 0) return '+' + num(v);
  if (v < 0) return '−' + num(-v);
  return '0';
}

// A date only value (YYYY-MM-DD) is a calendar day, so it is parsed as local noon and never shifts.
// A timestamp is an instant and is shown in salon time.
export function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

const isInstant = (s: string) => !/^\d{4}-\d{2}-\d{2}$/.test(s);

function fmt(s: string | null | undefined, opts: Intl.DateTimeFormatOptions): string {
  const d = parseDate(s);
  if (!d || !s) return '';
  return new Intl.DateTimeFormat('en-GB', { ...opts, ...(isInstant(s) ? { timeZone: LONDON } : {}) }).format(d);
}

const currentYear = () => new Date().getFullYear();

// 14 November
export const dayMonth = (s: string | null | undefined) => fmt(s, { day: 'numeric', month: 'long' });
// 14 November, or 12 September 2025 when it is not this year
export function dayMonthYear(s: string | null | undefined) {
  const d = parseDate(s);
  if (!d) return '';
  return d.getFullYear() === currentYear() ? dayMonth(s) : fmt(s, { day: 'numeric', month: 'long', year: 'numeric' });
}
// 31 December 2027
export const fullDate = (s: string | null | undefined) => fmt(s, { day: 'numeric', month: 'long', year: 'numeric' });
// 2027
export const yearOf = (s: string | null | undefined) => fmt(s, { year: 'numeric' });
// 14
export const dayNumber = (s: string | null | undefined) => fmt(s, { day: 'numeric' });
// Nov
export const monthShort = (s: string | null | undefined) => fmt(s, { month: 'short' });
// Friday
export const weekday = (s: string | null | undefined) => fmt(s, { weekday: 'long' });
// 11:00
export const time = (s: string | null | undefined) => fmt(s, { hour: '2-digit', minute: '2-digit', hour12: false });
// March 2023
export const monthYear = (s: string | null | undefined) => fmt(s, { month: 'long', year: 'numeric' });

export const capitalise = (s: string | null | undefined) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// 07700 900123, from +447700900123
export function displayMobile(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  const national = digits.startsWith('44') ? '0' + digits.slice(2) : digits;
  return national.length > 5 ? national.slice(0, 5) + ' ' + national.slice(5) : national;
}

// +447700900123, from whatever she typed after the fixed +44
export function toE164(typed: string): string | null {
  let digits = typed.replace(/\D/g, '');
  if (digits.startsWith('44')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length < 9 || digits.length > 10) return null;
  return '+44' + digits;
}

export function updatedAgo(at: number | null, now: number): string {
  if (!at) return '';
  const mins = Math.floor((now - at) / 60000);
  if (mins < 1) return 'Updated just now';
  if (mins === 1) return 'Updated 1 minute ago';
  if (mins < 60) return `Updated ${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  return hours === 1 ? 'Updated 1 hour ago' : `Updated ${hours} hours ago`;
}
