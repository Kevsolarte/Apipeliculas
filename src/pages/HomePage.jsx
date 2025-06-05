import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MoviePopular from '../components/FrontApi/Movie/Moviepopular';
import TvPopular from '../components/FrontApi/TV/TvPopular';
import RatedMovie from '../components/FrontApi/Movie/RatedMovie';

function App() {
  return (
    <>
      <Header />

      <section className="relative w-full h-screen">
        <video
          className="w-full h-full object-cover"
          src="/videopresentacion.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">CineMovie!</h1>
            <p className="text-xl md:text-2xl mb-8 animate-fade-in delay-100">Descubre lo mejor del cine y la televisión</p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 animate-fade-in delay-200">
              Explorar ahora
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              <span className="border-b-4  pb-2">Películas Populares</span>
            </h2>
            <a href="#" className="text-gray-400 hover:text-white text-sm md:text-base transition-colors">
              Ver todas →
            </a>
          </div>
          <MoviePopular />
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              <span className="border-b-4 pb-2">TV Series Populares</span>
            </h2>
            <a href="#" className="text-gray-400 hover:text-white text-sm md:text-base transition-colors">
              Ver todas →
            </a>
          </div>
          <TvPopular />
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              <span className="border-b-4  pb-2">Top Rated Movies</span>
            </h2>
            <a href="#" className="text-gray-400 hover:text-white text-sm md:text-base transition-colors">
              Ver todas →
            </a>
          </div>
          <RatedMovie />
        </section>

        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 mb-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">¿Buscas algo específico?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Descubre miles de títulos, crea listas personalizadas y recibe recomendaciones exclusivas.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105">
            Registrarse gratis
          </button>
        </section>
      </main>
     

      <Footer />
    </>
  );
}

export default App;