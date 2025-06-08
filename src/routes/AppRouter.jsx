// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MoviesPage from '../pages/MoviesPage';
import SeriesPage from '../pages/SeriesPage';
import TVPage from '../pages/TVPage';
import MediaDetailPage from '../pages/MediaDetailPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/series" element={<SeriesPage />} />
      <Route path="/tv" element={<TVPage />} />
      <Route path="/media/:type/:id" element={<MediaDetailPage />} />

    </Routes>
  );
};

export default AppRouter;