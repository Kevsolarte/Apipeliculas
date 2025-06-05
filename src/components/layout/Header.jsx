import { useState, useEffect } from "react";
import { searchMovies } from "/Users/Usuario/Desktop/Practica/ApiPeliculas/Apipeliculas/src/Api/moviesApi";
import { Link, useNavigate } from "react-router-dom";





export default function Header() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
     const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                searchMovies(query)
                    .then((res) => {
                        setResults(res.results);
                        console.log(res.results);
                    })
                    .catch((err) => console.error(err));
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/20 dark:bg-black/20 backdrop-blur-md border-b border-white/10 dark:border-black/10">



            <nav className="px-4 lg:px-6 py-3">
                <div className="flex justify-between items-center max-w-screen-xl mx-auto">

                    <a href="#" className="flex items-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="1.5" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        <span className="ml-2 text-white text-lg font-semibold">ApiPeliculas</span>
                    </a>
                    <form className="hidden lg:flex flex-grow max-w-md">
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Peliculas, Series, TV Shows..."
                        />
                    </form>
                    {query && results.length > 0 && (
                        <div className="absolute top-[100%] mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 w-[400px] z-50">
                            <ul className="max-h-64 overflow-y-auto">
                                {results.slice(0, 5).map((movie) => (
                                    <li key={movie.id} className="text-black dark:text-white py-1 border-b border-gray-200 dark:border-gray-600">
                                        {movie.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <ul className="hidden lg:flex space-x-6">
                        <Link to="/" className="text-white hover:text-gray-200">Home</Link>

                        <li className="relative group">
                            <Link to="/movies" className="text-white hover:text-gray-200">Peliculas</Link>

                          
                        </li>

                        <li className="relative group">
                             <Link to="/series" className="text-white hover:text-gray-200">Series</Link>
                          
                        </li>
                        <Link to="/tv" className="text-white hover:text-gray-200">TV</Link>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
