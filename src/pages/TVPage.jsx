import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ModalMedia from "../components/FrontApi/Modals/ModalMedia";
import { gettvpopular } from "../Api/tvApi";
import { useEffect, useState, useRef } from "react";
import {
  FaStar,
  FaCalendarAlt,
  FaFilter,
  FaTimes,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUpAlt,
  FaTv,
  FaPlayCircle
} from "react-icons/fa";

export default function TVShowsPage() {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null); // Estado para la película seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Filtros y ordenamiento
  const [searchTitle, setSearchTitle] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");

  const mainRef = useRef(null);
  const genres = [
    { id: 10759, name: "Acción y Aventura" },
    { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" },
    { id: 99, name: "Documental" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Familia" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Misterio" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
    { id: 37, name: "Western" }
  ];

  useEffect(() => {
    const fetchTVShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await gettvpopular(page);
        setShows(prevShows => [...prevShows, ...data.results]);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Error fetching popular TV shows:", err);
        setError("No se pudieron cargar las series. Inténtalo de nuevo más tarde.");
      }
      setLoading(false);
    };

    fetchTVShows();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current || loading) return;

      const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (page < totalPages) {
          setPage(prevPage => prevPage + 1);
        }
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, page, totalPages]);

  // Filtrar y ordenar series
  const filteredShows = shows
    .filter(show => {
      const matchesTitle = show.name
        .toLowerCase()
        .includes(searchTitle.toLowerCase());

      const matchesYear = filterYear
        ? new Date(show.first_air_date).getFullYear().toString() === filterYear
        : true;

      const matchesGenre = filterGenre
        ? show.genre_ids.includes(parseInt(filterGenre))
        : true;

      return matchesTitle && matchesYear && matchesGenre;
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;

      switch (sortBy) {
        case "name":
          return order * a.name.localeCompare(b.name);
        case "rating":
          return order * (a.vote_average - b.vote_average);
        case "date":
          return order * (new Date(a.first_air_date) - new Date(b.first_air_date));
        default: 
          return order * (a.popularity - b.popularity);
      }
    });

  // Obtener años únicos para el filtro
  const uniqueYears = [...new Set(
    shows.map(show => new Date(show.first_air_date).getFullYear())
  )].filter(year => !isNaN(year) && year > 1900)
    .sort((a, b) => b - a);

  const clearFilters = () => {
    setSearchTitle("");
    setFilterYear("");
    setFilterGenre("");
    setSortBy("popularity");
    setSortOrder("desc");
  };

 
  const openModal = (show) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  // Cierra el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShow(null);
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="pt-24 px-4 max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Series de TV Populares
            </h1>
            <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
              Descubre las series más populares, filtradas por género, año de lanzamiento y más.
            </p>
          </div>

          <section className="flex flex-col lg:flex-row w-full gap-6">
            {/* Filtros */}
            <aside className="bg-gray-800/60 backdrop-blur-lg w-full lg:w-80 h-fit rounded-2xl p-6 flex flex-col gap-6 border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <FaFilter className="text-blue-400" /> Filtros de Series
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center gap-1 transition"
                  aria-label="Limpiar filtros"
                >
                  <FaTimes /> Limpiar
                </button>
              </div>

              {/* Buscador */}
              <div className="flex flex-col gap-2">
                <label htmlFor="searchTitle" className="text-gray-300 font-medium flex items-center gap-2">
                  <FaSearch className="text-blue-400" /> Buscar por título:
                </label>
                <div className="relative">
                  <input
                    id="searchTitle"
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="Breaking Bad, Stranger Things..."
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900/80 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pl-10"
                    autoComplete="off"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Filtro por año */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="filterYear" className="text-gray-300 font-medium flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-400" /> Año:
                  </label>
                  <select
                    id="filterYear"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="p-2.5 rounded-lg border border-gray-600 bg-gray-900/80 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  >
                    <option value="">Todos</option>
                    {uniqueYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por género */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="filterGenre" className="text-gray-300 font-medium">
                    Género:
                  </label>
                  <select
                    id="filterGenre"
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="p-2.5 rounded-lg border border-gray-600 bg-gray-900/80 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  >
                    <option value="">Todos</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ordenamiento */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-300 font-medium">
                  Ordenar por:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="col-span-2 p-2.5 rounded-lg border border-gray-600 bg-gray-900/80 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  >
                    <option value="popularity">Popularidad</option>
                    <option value="rating">Calificación</option>
                    <option value="name">Título</option>
                    <option value="date">Fecha de estreno</option>
                  </select>

                  <button
                    onClick={() => setSortOrder("asc")}
                    className={`p-2 rounded-lg flex items-center justify-center gap-2 ${ sortOrder === "asc"
                      ? "bg-blue-600 border-blue-500"
                      : "bg-gray-800 border-gray-700"
                      } border transition`}
                  >
                    <FaSortAmountDown /> Asc
                  </button>

                  <button
                    onClick={() => setSortOrder("desc")}
                    className={`p-2 rounded-lg flex items-center justify-center gap-2 ${ sortOrder === "desc"
                      ? "bg-blue-600 border-blue-500"
                      : "bg-gray-800 border-gray-700"
                      } border transition`}
                  >
                    <FaSortAmountUpAlt /> Desc
                  </button>
                </div>
              </div>

              <div className="mt-2 bg-gray-700 h-px"></div>

              {/* Contador de resultados */}
              <div className="text-center text-sm text-gray-400">
                {filteredShows.length} {filteredShows.length === 1 ? 'serie encontrada' : 'series encontradas'}
              </div>
            </aside>

            {/* Lista de series */}
            <main
              ref={mainRef}
              className="flex-1 bg-gray-800/30 backdrop-blur-lg p-4 rounded-2xl overflow-auto max-h-[calc(100vh-8rem)] border border-gray-700 shadow-xl"
            >
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {filteredShows.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="text-5xl mb-4">📺</div>
                  <h3 className="text-xl font-medium">No se encontraron series</h3>
                  <p className="mt-2 text-center">
                    Intenta ajustar tus filtros o busca algo diferente
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredShows.map((show) => {

                    return (
                      <div
                        key={show.id}
                        className="group bg-gray-900/80 backdrop-blur rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="relative">
                          {show.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${ show.poster_path }`}
                              alt={show.name}
                              className="w-full h-80 object-cover group-hover:opacity-80 transition-opacity"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentNode.innerHTML = '<div class="bg-gray-800 w-full h-80 flex items-center justify-center text-gray-500"><div>Imagen no disponible</div></div>';
                              }}
                              onClick={() => openModal(show)}
                            />
                          ) : (
                            <div className="bg-gray-800 w-full h-80 flex items-center justify-center text-gray-500">
                              <FaTv className="text-4xl" />
                            </div>
                          )}

                          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-blue-600 px-2 py-1 rounded text-sm font-bold">
                            <FaStar className="text-yellow-300" />
                            <span>{show.vote_average.toFixed(1)}</span>
                          </div>

                          {show.in_production && (
                            <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              EN EMISIÓN
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3
                              className="text-white font-bold text-lg truncate group-hover:text-blue-400 transition-colors flex-1"
                              title={show.name}
                            >
                              {show.name}
                            </h3>

                            {show.first_air_date && (
                              <span className="text-gray-400 text-sm flex-shrink-0 ml-2">
                                {new Date(show.first_air_date).getFullYear()}
                              </span>
                            )}
                          </div>

                          

                        

                         
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {!loading && page < totalPages && filteredShows.length > 0 && (
                <div className="text-center py-6 text-gray-400">
                  Desplázate hacia abajo para cargar más series...
                </div>
              )}
            </main>
          </section>
        </div>
        {isModalOpen &&
          <ModalMedia
            media={selectedShow}
            mediaType="tv"
            closeModal={closeModal} />}
      </div>
      <Footer />
    </>
  );
}