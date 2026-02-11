export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    // Some of our older APIs return non-JSON errors, just as text
    let errorMessage = 'API request failed';
    try {
      const errorData = await res.json();
      errorMessage = errorData.reason || errorData.message || errorMessage;
    } catch {
      // Not JSON so try text
      try {
        errorMessage = await res.text();
      } catch {
        /* ignore */
      }
    }
    const err = new Error(errorMessage) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return await res.json();
};
