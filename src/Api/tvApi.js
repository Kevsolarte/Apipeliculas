import { tmdbFetch } from './fetchUtils';

export const gettvpopular = async (page = 1) => {
  return tmdbFetch('/tv/popular', { page });
};


export const getTvDetails = async (tvId) => {
  // Puedes añadir append_to_response para traer videos, credits, etc
  return tmdbFetch(`/tv/${ tvId }`, { append_to_response: 'videos,credits' });
};
export const getTvReviews = async (tvId, page = 1) => {
  return tmdbFetch(`/tv/${ tvId }/reviews?language=en-US&`, { page });
};


