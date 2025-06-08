import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Modal from 'react-modal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

Modal.setAppElement('#root');

const MediaTrailers = ({ videos, mediaType }) => {
    console.log(videos, 'videos');
    console.log(mediaType, 'mediaType');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // 1. Corrección clave: Manejar diferentes tipos de videos
    const filteredVideos = videos.filter(video => {
        if (mediaType === 'movie') {
            return video.type === 'Trailer' && video.site === 'YouTube';
        } else {
            // Para TV shows aceptamos diferentes tipos de videos
            return (
                (video.type === 'Trailer' ||
                    video.type === 'Teaser' ||
                    video.type === 'Clip') &&
                video.site === 'YouTube'
            );
        }
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const openModal = (trailerKey) => {
        setSelectedTrailer(trailerKey);
        setModalIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedTrailer(null);
        setModalIsOpen(false);
        document.body.style.overflow = 'unset';
    };

    // Calcular tamaño óptimo del video
    const calculateVideoSize = () => {
        const maxWidth = Math.min(windowSize.width * 0.9, 1200);
        const maxHeight = windowSize.height * 0.8;

        // Mantener relación de aspecto 16:9
        const heightBasedOnWidth = maxWidth * (9 / 16);
        const widthBasedOnHeight = maxHeight * (16 / 9);

        if (heightBasedOnWidth <= maxHeight) {
            return {
                width: maxWidth,
                height: heightBasedOnWidth
            };
        } else {
            return {
                width: widthBasedOnHeight,
                height: maxHeight
            };
        }
    };

    const settings = {
        dots: true,
        infinite: filteredVideos.length > 3,
        speed: 500,
        slidesToShow: Math.min(3, filteredVideos.length),
        slidesToScroll: Math.min(2, filteredVideos.length),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(2, filteredVideos.length),
                    slidesToScroll: Math.min(2, filteredVideos.length)
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const videoSize = calculateVideoSize();

    // 2. Manejar caso cuando no hay videos
    if (filteredVideos.length === 0) {
        return (
            <div className="py-4 text-center">
                <h3 className="text-xl font-bold text-gray-300 mb-4">Trailers</h3>
                <p className="text-gray-500">No hay trailers disponibles</p>
            </div>
        );
    }

    return (
        <div className="py-4">
            <h3 className="text-xl font-bold text-gray-300 mb-4">Trailers</h3>

            <Slider {...settings}>
                {filteredVideos.map((video) => (
                    <div key={video.id} className="p-2">
                        <div
                            className="cursor-pointer relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
                            onClick={() => openModal(video.key)}
                        >
                            <img
                                src={`https://img.youtube.com/vi/${ video.key }/mqdefault.jpg`}
                                alt={video.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                                <span className="text-white font-semibold text-sm">
                                    {video.name.slice(0, 30)}
                                    {video.name.length > 30 ? '...' : ''}
                                </span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <div className="bg-red-600 rounded-full p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            {/* 3. Mostrar tipo de video para series */}
                            {mediaType === 'tv' && (
                                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    {video.type}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </Slider>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Trailer Modal"
                className="bg-transparent border-none outline-none"
                overlayClassName="fixed inset-0 bg-black/95 flex items-center justify-center z-[1000]"
            >
                <div className="relative" style={{
                    width: `${ videoSize.width }px`,
                    maxWidth: '95vw',
                    height: `${ videoSize.height }px`,
                    maxHeight: '80vh'
                }}>
                    <button
                        onClick={closeModal}
                        className="absolute -top-12 right-0 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        ✕
                    </button>

                    {selectedTrailer && (
                        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl">
                            <iframe
                                title="Trailer"
                                src={`https://www.youtube.com/embed/${ selectedTrailer }?autoplay=1&mute=0`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default MediaTrailers;