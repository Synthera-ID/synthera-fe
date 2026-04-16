const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * Ambil XSRF-TOKEN dari cookie browser & decode
 */
function getXsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (!match) return "";
  return decodeURIComponent(match[1]);
}

/**
 * Fetch wrapper untuk request ke Laravel API.
 * Otomatis include credentials + X-XSRF-TOKEN header.
 */
export async function apiFetch(endpoint, options = {}) {
  const { method = "GET", body, headers = {} } = options;

  const fetchHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };

  // POST/PUT/PATCH/DELETE butuh XSRF token
  if (method !== "GET") {
    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      fetchHeaders["X-XSRF-TOKEN"] = xsrfToken;
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    credentials: "include",
    headers: fetchHeaders,
    ...(body && { body: JSON.stringify(body) }),
  });

  return res;
}
