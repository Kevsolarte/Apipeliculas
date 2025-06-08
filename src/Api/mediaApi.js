// src/api/mediaApi.js
import { getMovieDetails, getMovieReviews } from './moviesApi';
import { getTvDetails, getTvReviews } from './tvApi';

export const getMediaDetails = async (type, id) => {
  if (type === 'movie') {
    return getMovieDetails(id);
  } else if (type === 'tv') {
    return getTvDetails(id);
  } else {
    throw new Error(`Tipo de media no soportado: ${type}`);
  }
};
export const getMediaReviews = async (type, id, page = 1) => {
  if (type === 'movie') {
    return getMovieReviews(id, page);
  } else if (type === 'tv') {
    return getTvReviews(id, page);
  } else {
    throw new Error(`Tipo de media no soportado: ${type}`);
  }
};