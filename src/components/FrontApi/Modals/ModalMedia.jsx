import { useEffect, useState } from "react";
import { getMovieDetails, imagenMovie } from "../../../Api/moviesApi";
import { getTvDetails } from "../../../Api/tvApi";
import { normalizeMedia } from "../../../hooks/useNormalizedMedia";
import { useNavigate } from "react-router-dom";

export default function ModalMedia({ media: initialMedia, mediaType, closeModal }) {
  const [media, setMedia] = useState(null);
  const [backdrop, setBackdrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cast, setCast] = useState([]);
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    closeModal();
    navigate(`/media/${mediaType}/${media.id}`);

  };

  useEffect(() => {
    if (!initialMedia?.id) return;

    const fetchMediaData = async () => {
      setLoading(true);
      try {
        let details;
        if (mediaType === "movie") {
          details = await getMovieDetails(initialMedia.id);
        } else {
          details = await getTvDetails(initialMedia.id);
        }
        
        const normalized = normalizeMedia(details, mediaType);
        setMedia(normalized);

        if (mediaType === "movie") {
          const imagesData = await imagenMovie(initialMedia.id);
          if (imagesData?.backdrops?.length > 0) {
            setBackdrop(imagesData.backdrops[0].file_path);
          }
        } else if (normalized.backdrop_path) {
          setBackdrop(normalized.backdrop_path);
        }

        // Limitar el reparto a 4 actores
        if (details.credits?.cast) {
          setCast(details.credits.cast.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching media data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [initialMedia?.id, mediaType]);

  // Funciones de formato
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "No disponible";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "No disponible";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  if (!media) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      {/* Contenedor principal */}
      <div className="relative bg-gray-800 rounded-xl w-full max-w-6xl h-[vh] flex flex-col shadow-2xl">

        {/* Fondo con imagen */}
        {backdrop && (
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${backdrop}`}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
          </div>
        )}

        {/* Contenido con scroll interno */}
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="p-6 bg-gradient-to-b from-black/60 to-transparent flex-shrink-0">
            <div className="flex justify-between items-start">
              <div className="max-w-[80%]">
                <h2 className="text-2xl md:text-3xl font-bold text-white truncate">{media.title}</h2>
                <p className="text-gray-300 italic text-sm truncate">{media.tagline}</p>
              </div>
              <button onClick={closeModal} className="text-gray-300 hover:text-white text-3xl">
                &times;
              </button>
            </div>

            {/* Detalles rápidos */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs md:text-sm">
              <span className="bg-blue-500 px-2 py-1 rounded-full whitespace-nowrap">
                {media.release_date?.split('-')[0]}
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                ⭐ {media.vote_average?.toFixed(1)} ({media.vote_count} votos)
              </span>
              <span className="whitespace-nowrap">{formatRuntime(media.runtime)}</span>
              {mediaType === "movie" && (
                <span className="whitespace-nowrap">{media.adult ? '+18' : 'Todo público'}</span>
              )}
            </div>
          </div>

          {/* Cuerpo principal */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-4">

            {/* Columna izquierda - Solo poster y botón */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={`Poster de ${media.title}`}
                className="w-full rounded-lg shadow-lg"
              />
              
              <div>
                <button 
                  onClick={handleViewDetails} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                >
                  Ver detalles completos
                </button>
              </div>
            </div>

            {/* Columna derecha - Contenido principal */}
            <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-3">

              {/* Sinopsis */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Sinopsis</h3>
                <p className="text-gray-300">
                  {media.overview || "Descripción no disponible."}
                </p>
              </div>

              {/* Géneros */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Géneros</h3>
                <div className="flex flex-wrap gap-1">
                  {media.genres.map(genre => (
                    <span key={genre.id} className="bg-gray-700 px-2 py-0.5 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reparto principal (limitado a 4 actores) */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Reparto Principal</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {cast.map(person => (
                    <div key={person.id} className="flex flex-col items-center">
                      <img
                        src={person.profile_path
                          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                          : 'https://via.placeholder.com/185x278?text=No+Image'}
                        alt={person.name}
                        className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-gray-600"
                      />
                      <div className="text-center">
                        <p className="text-white text-sm font-medium truncate w-full">
                          {person.name}
                        </p>
                        <p className="text-gray-400 text-xs truncate w-full">
                          {person.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}