import { getCookie, removeCookie } from "@/utils/cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const apiFetch = {
  async request(endpoint, options = {}) {
    const token = getCookie("auth_token");

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (res.status === 401) {
      removeCookie("auth_token");
      window.location.href = "/login";
    }

    return res.json();
  },

  get(endpoint) {
    return this.request(endpoint);
  },
  post(endpoint, data) {
    return this.request(endpoint, { method: "POST", body: JSON.stringify(data) });
  },
  put(endpoint, data) {
    return this.request(endpoint, { method: "PUT", body: JSON.stringify(data) });
  },
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },
};

export default apiFetch;
