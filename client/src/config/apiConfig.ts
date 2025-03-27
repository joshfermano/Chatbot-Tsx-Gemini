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

  try {
    return await fetch(url, fetchOptions);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);

    // Create a custom response for network/CORS errors
    if (
      error instanceof TypeError &&
      error.message.includes('Failed to fetch')
    ) {
      console.warn(
        'CORS or network error detected, returning fallback error response'
      );
      return new Response(
        JSON.stringify({
          error: 'Network error',
          message: 'Unable to connect to server. Please try again later.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    throw error;
  }
};
