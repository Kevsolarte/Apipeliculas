// src/api/moviesApi.js
import { tmdbFetch } from './fetchUtils';

export const getPopularMovies = async (page = 1) => {
  return tmdbFetch('/movie/popular', { page });
};
// Ejemplo de otras funciones que puedes añadir:
export const getMovieDetails = async (movieId) => {
  return tmdbFetch(`/movie/${ movieId }`, {
    append_to_response: 'videos,credits'
  });
};

export const imagenMovie = async (movieId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${ movieId }/images`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZWQ4Y2Q3ZTRjYWFkMzU1ZWYwZTAwY2FkMjE5YWZiOCIsIm5iZiI6MTc0Nzk2MTU1OC4yOTMsInN1YiI6IjY4MmZjNmQ2ZGQwNzY0NWNjMDAzNjI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JzbrG7rR4JGTj2p2gBhqfr0fzwTtboma9jyA2Q75FrQ`,
        'accept': 'application/json'
      }
    }
  );
  return await response.json();
};
export const searchMovies = async (query) => {
  return tmdbFetch('/search/movie', { query });
};
export const getMovieReviews = async (movieId, page = 1) => {
  return tmdbFetch(`/movie/${movieId}/reviews`, { page });
};