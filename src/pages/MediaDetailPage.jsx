import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMediaDetails, getMediaReviews } from '../Api/mediaApi';
import { formatCurrency, formatRuntime } from '../utils/formatUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import MediaTrailers from '../components/FrontApi/Modals/MediaTrailers';


const MediaDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);


  useEffect(() => {
    const loadMedia = async () => {
      try {
        const data = await getMediaDetails(type, id);
        setMedia(data);

        if (data.credits?.cast) {
          setCast(data.credits.cast.slice(0, 8));
        }

        if (data.credits?.crew) {
          const keyPositions = ['Director', 'Screenplay', 'Story', 'Producer'];
          const filteredCrew = data.credits.crew.filter(person =>
            keyPositions.includes(person.job)
          );
          setCrew(filteredCrew);
        }

        if (data.videos?.results) {
          const videoFilter = type === 'movie'
            ? video => video.type === 'Trailer' && video.site === 'YouTube'
            : video => (video.type === 'Trailer' || video.type === 'Teaser' || video.type === 'Clip') && video.site === 'YouTube';

          setVideos(data.videos.results.filter(videoFilter));
        } else {
          setVideos([]); // Asegurarse de limpiar si no hay videos
        }
        const reviewsData = await getMediaReviews(type, id);
        setReviews(reviewsData.results || []);
        console.log(reviewsData, 'reviewsData');
      } catch (err) {
        setError('Error al cargar el contenido');
        console.error(err);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    loadMedia();
  }, [type, id]);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!media) return <div className="text-center py-20">Contenido no encontrado</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Banner superior */}
      <div className="relative h-40 md:h-250">
        {media.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${ media.backdrop_path }`}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            {media.title || media.name}
          </h1>
          {media.tagline && (
            <h2 className="text-lg md:text-xl text-gray-300 mt-2">{media.tagline}</h2>
          )}
        </div>
      </div>

      {/* Contenedor de 3 columnas */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Poster */}
          <div className="bg-gray-800 p-6 rounded-lg">
            {media.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${ media.poster_path }`}
                alt="Poster"
                className="w-full rounded-lg shadow-lg mb-4"
              />
            )}

            {/* Información adicional */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-amber-400 mb-1">Ficha Técnica</h3>
                <ul className="text-sm text-gray-300">
                  <li className="flex justify-between py-1 border-b border-gray-700">
                    <span className="font-medium">Estado</span>
                    <span>{media.status}</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-gray-700">
                    <span className="font-medium">Idioma Original</span>
                    <span>{media.original_language.toUpperCase()}</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-gray-700">
                    <span className="font-medium">Presupuesto</span>
                    <span>{media.budget > 0 ? formatCurrency(media.budget) : 'No disponible'}</span>
                  </li>
                  <li className="flex justify-between py-1 border-b border-gray-700">
                    <span className="font-medium">Ingresos</span>
                    <span>{media.revenue > 0 ? formatCurrency(media.revenue) : 'No disponible'}</span>
                  </li>
                </ul>
              </div>
            </div>
          <div className="space-y-8">
            {/* Equipo técnico */}
            {crew.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Equipo Técnico</h3>
                <ul className="space-y-3">
                  {crew.map(person => (
                    <li key={person.credit_id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{person.name}</p>
                        <p className="text-sm text-gray-400">{person.job}</p>
                      </div>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {person.department}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compañías de producción */}
            {media.production_companies?.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Producción</h3>
                <div className="space-y-4">
                  {media.production_companies.map(company => (
                    <div key={company.id} className="flex items-center gap-3">
                      {company.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${ company.logo_path }`}
                          alt={company.name}
                          className="h-12 w-auto object-contain"
                        />
                      ) : (
                        <div className="bg-gray-700 border border-gray-600 rounded h-12 w-12 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      <span className="font-medium">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Países */}
            {media.production_countries?.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Países de Producción</h3>
                <div className="flex flex-wrap gap-2">
                  {media.production_countries.map(country => (
                    <span
                      key={country.iso_3166_1}
                      className="bg-amber-900 px-3 py-1 rounded-full text-sm"
                    >
                      {country.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>

          {/* Columna 2: Información principal */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-amber-400 mb-3">Descripción</h3>
              <p className="text-gray-300">{media.overview || "Descripción no disponible."}</p>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-amber-400 mb-3">Información clave</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="font-medium w-32">Fecha de lanzamiento:</span>
                        <span>{media.release_date || media.first_air_date}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-32">Calificación:</span>
                        <span>
                          ⭐ {media.vote_average?.toFixed(1)}/10 ({media.vote_count} votos)
                        </span>
                      </li>
                      {media.runtime && (
                        <li className="flex items-start">
                          <span className="font-medium w-32">Duración:</span>
                          <span>{formatRuntime(media.runtime)}</span>
                        </li>
                      )}
                      {type === 'tv' && (
                        <li className="flex items-start">
                          <span className="font-medium w-32">Temporadas:</span>
                          <span>{media.number_of_seasons}</span>
                        </li>
                      )}
                      {type === 'tv' && (
                        <li className="flex items-start">
                          <span className="font-medium w-32">Episodios:</span>
                          <span>{media.number_of_episodes}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Géneros</h4>
                    <div className="flex flex-wrap gap-2">
                      {media.genres.map(genre => (
                        <span
                          key={genre.id}
                          className="bg-amber-600 px-3 py-1 rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>

                    {media.homepage && (
                      <div className="mt-4">
                        <h4 className="font-bold text-lg mb-2">Sitio oficial</h4>
                        <a
                          href={media.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline inline-flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                          Enlace oficial
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reparto principal */}
            {cast.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Reparto Principal</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cast.map(person => (
                    <div key={person.id} className="flex flex-col">
                      <img
                        src={person.profile_path
                          ? `https://image.tmdb.org/t/p/w185${ person.profile_path }`
                          : 'https://via.placeholder.com/185x278?text=No+Image'}
                        alt={person.name}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <div>
                        <p className="font-semibold text-white truncate">{person.name}</p>
                        <p className="text-gray-400 text-sm truncate">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailers */}
            <div className='bg-gray-800 mt-4 p-6 rounded-lg'>
              <h3 className="text-2xl font-bold text-amber-400 mb-4">Trailers</h3>
              <MediaTrailers
                videos={videos}
                mediaType={type}
              />
            </div>

            {/* Sección de Reseñas movida aquí */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-amber-400">Reseñas</h3>
                <span className="text-gray-400 text-sm">{reviews.length} reseñas</span>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-4">Cargando reseñas...</div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-400 italic">No hay reseñas disponibles</p>
              ) : (
                <div className="space-y-6">
                  {reviews.slice(0, 2).map(review => (
                    <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0">
                      <div className="flex items-start mb-3">
                        <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-xl">{review.author.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{review.author}</h4>
                          {review.author_details.rating && (
                            <div className="flex items-center mt-1">
                              <div className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded mr-2">
                                {review.author_details.rating}/10
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${ i < Math.floor(review.author_details.rating / 2) ? 'text-amber-400' : 'text-gray-600' }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-3 line-clamp-3">
                        {review.content}
                      </p>

                      <div className="flex justify-between items-center">
                        <a
                          href={review.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 text-sm hover:underline inline-flex items-center"
                        >
                          {/* Leer reseña completa
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg> */}
                        </a>
                        <span className="text-gray-500 text-xs">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {reviews.length > 2 && (
                    <div className="text-center mt-4">
                      <button
                        className="text-amber-400 hover:underline"
                        onClick={() => {/* Lógica para mostrar más reseñas */ }}
                      >
                        Ver todas las reseñas ({reviews.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Columna 3: Detalles adicionales */}
        </div>
      </div>
    </div>
  );
};

export default MediaDetailPage;