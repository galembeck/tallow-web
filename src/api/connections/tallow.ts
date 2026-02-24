export const API = {
  baseURL: "http://localhost:5005",

  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.success === false) {
      const errMsg = json.error?.message || `HTTP error: ${res.status}`;
      throw new Error(errMsg);
    }

    return json.data !== undefined ? json.data : json;
  },
};
