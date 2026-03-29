export const API = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005",

  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: isFormData
        ? (options.headers ?? {})
        : {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
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
