import { TMDB_BASE_URL, TMDB_API_KEY, DEFAULT_LANGUAGE } from './tmdbConfig';

export const tmdbFetch = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY, 
    language: DEFAULT_LANGUAGE,
    ...params
  });
  
  url.search = searchParams.toString();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`TMDB Error: ${errorData.status_message}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
};