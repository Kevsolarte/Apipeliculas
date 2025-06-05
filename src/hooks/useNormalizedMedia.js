// src/utils/normalizeUtils.js
export function normalizeMedia(data, mediaType) {
  const isMovie = mediaType === "movie";
  
  return {
    id: data.id,
    title: isMovie ? data.title : data.name,
    original_title: isMovie ? data.original_title : data.original_name,
    tagline: data.tagline || "",
    overview: data.overview,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    release_date: isMovie ? data.release_date : data.first_air_date,
    runtime: isMovie 
      ? data.runtime 
      : (data.episode_run_time?.[0] || data.runtime || null),
    budget: isMovie ? data.budget : null,
    revenue: isMovie ? data.revenue : null,
    status: data.status,
    original_language: data.original_language,
    imdb_id: isMovie ? data.imdb_id : null,
    adult: isMovie ? data.adult : null,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    genres: data.genres || [],
    production_companies: data.production_companies || [],
    production_countries: data.production_countries || [],
    spoken_languages: data.spoken_languages || [],
    credits: data.credits || {},
    media_type: mediaType,
  };
}