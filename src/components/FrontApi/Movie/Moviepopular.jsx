import { useEffect, useState } from "react";
import { getPopularMovies } from "../../../Api/moviesApi";
import ModalMedia from "./ModalMedia";

export default function MoviePopular() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null); // Estado para la película seleccionada
    const [isModalOpen, setIsModalOpen] = useState(false);



    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await getPopularMovies(page);
                setMovies((prevMovies) => [...prevMovies, ...data.results]); 
                console.log(data);

            } catch (error) {
                console.error("Error fetching popular movies:", error);
            }
            setLoading(false);
        };

        fetchMovies();
    }, [page]);
    const handleScroll = (event) => {
        const { scrollLeft, clientWidth, scrollWidth } = event.target;
        if (scrollLeft + clientWidth >= scrollWidth - 5 && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };



    const openModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };



    return (
        <div className="overflow-x-auto scrollbar-hide" onScroll={handleScroll}>
            <div className="flex flex-row space-x-6 p-6">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="min-w-[150px] w-80 flex flex-col rounded-lg bg-gray-900 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        onClick={() => openModal(movie)} // Abre el modal al hacer clic
                    >
                        <div className="aspect-[2/3] relative">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${ movie.poster_path }`}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="text-white font-bold text-lg truncate">
                                {movie.title}
                            </h3>
                            <span className="text-gray-400 text-sm">
                                {new Date(movie.release_date).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="text-center py-4 text-gray-400">Cargando más películas...</div>
            )}

            {isModalOpen &&
                <ModalMedia
                    media={selectedMovie}
                    mediaType="movie"
                    closeModal={closeModal} />}
        </div>
    );


}