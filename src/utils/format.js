/**
 * Format a numeric price to Indonesian Rupiah string.
 * e.g. 49000.00 → "49.000"  |  349000 → "349.000"
 *
 * @param {number|string} price
 * @returns {string}
 */
export function formatPrice(price) {
  return Number(price).toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

/**
 * Format a price with Rp prefix.
 * e.g. 49000 → "Rp 49.000"
 *
 * @param {number|string} price
 * @returns {string}
 */
export function formatRupiah(price) {
  return `Rp ${formatPrice(price)}`;
}

/**
 * Format an ISO date string to a readable Indonesian date.
 * e.g. "2027-01-01T00:00:00Z" → "1 Januari 2027"
 *
 * @param {string} dateStr – ISO date string or date-only string
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format an ISO date string to short format.
 * e.g. "2027-01-01" → "01 Jan 2027"
 *
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
