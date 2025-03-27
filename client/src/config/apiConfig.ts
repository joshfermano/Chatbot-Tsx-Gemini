export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Makes a fetch request with authentication credentials
export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_URL}${endpoint}`;
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  return fetch(url, fetchOptions);
};
