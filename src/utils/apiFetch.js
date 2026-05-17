import { getCookie, removeCookie } from "@/utils/cookie";

const API_BASE = process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:8000/api";

const apiFetch = {
  async request(endpoint, options = {}) {
    const token = getCookie("userAccessToken");

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),

        ...options.headers,
      },

      body: options.body,
    });

    // unauthorized
    if (res.status === 401) {
      removeCookie("userAccessToken");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return null;
    }

    // handle non-json response
    const contentType = res.headers.get("content-type");

    const data = contentType?.includes("application/json") ? await res.json() : await res.text();

    // throw error jika gagal
    if (!res.ok) {
      throw {
        status: res.status,
        data,
      };
    }

    return data;
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
    });
  },

  /**
   * Upload FormData (multipart/form-data).
   * Does NOT set Content-Type so the browser can set the boundary automatically.
   */
  async upload(endpoint, formData, method = "POST") {
    const token = getCookie("userAccessToken");

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (res.status === 401) {
      removeCookie("userAccessToken");
      if (typeof window !== "undefined") window.location.href = "/login";
      return null;
    }

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await res.json() : await res.text();

    if (!res.ok) {
      throw { status: res.status, data };
    }

    return data;
  },
};

export default apiFetch;
