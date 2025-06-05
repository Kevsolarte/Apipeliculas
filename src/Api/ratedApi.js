import { tmdbFetch } from './fetchUtils';

export const getRatedMovies = async (page = 1) => {
  return tmdbFetch('/movie/top_rated', { page });
};