import { useEffect, useState } from "react";
import { gettvpopular } from "../../../Api/tvApi";
import ModalMedia from "../../../components/FrontApi/Movie/ModalMedia";
export default function TvPopular() {
    const [tvshows, setTvshows] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedTvshow, setSelectedTvshow] = useState(null); // Estado para la película seleccionada
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchTvshows = async () => {
            setLoading(true);
            try {
                const data = await gettvpopular(page);
                setTvshows((prevTvshows) => [...prevTvshows, ...data.results]); // Concatenar nuevas películas
                console.log(data);

            } catch (error) {
                console.error("Error fetching popular tvshows:", error);
            }
            setLoading(false);
        };

        fetchTvshows();
    }, [page]);
    const handleScroll = (event) => {
        const { scrollLeft, clientWidth, scrollWidth } = event.target;
        if (scrollLeft + clientWidth >= scrollWidth - 5 && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const openModal = (tvshow) => {
        setSelectedTvshow(tvshow);
        setIsModalOpen(true);
    };

    // Cierra el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTvshow(null);
    };

    return (
        <div>
            <div className="overflow-x-auto scrollbar-hide" onScroll={handleScroll}>
                <div className="flex flex-row space-x-6 p-6">
                    {tvshows.map((tvshow) => (
                        <div
                            key={tvshow.id}
                            className="min-w-[150px] w-80 flex flex-col rounded-lg bg-gray-900 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            onClick={() => openModal(tvshow)} // Abre el modal al hacer clic
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${ tvshow.poster_path }`}
                                alt={tvshow.name}
                                className="w-full h-96 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white">{tvshow.name}</h3>
                                <p className="text-sm text-gray-400">{tvshow.first_air_date.slice(0, 100)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && selectedTvshow && (
                <ModalMedia
                    media={selectedTvshow}
                    mediaType="tv"
                    closeModal={closeModal} />
            )}
        </div>
    )
}