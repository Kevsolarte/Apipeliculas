import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MoviesPage() {
  return (
    <>
      <Header />
      <section className="flex w-full h-screen pt-30 px-4 gap-4">
        <aside className="bg-gray-900 w-64 h-200 shadow-2xl rounded-4xl p-9">
          <p className="text-white">Soy un sidebar</p>
        </aside>

        <main className="flex-1 bg-gray-800 p-4 overflow-auto h-200 rounded-4xl">
        </main>
      </section>
      <Footer />
    </>
  );
}
