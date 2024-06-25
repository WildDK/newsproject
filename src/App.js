import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from './redux/actions';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsList from './components/NewsList';
import NewsDetail from './components/NewsDetail';

const App = () => {
  const dispatch = useDispatch();
  const news = useSelector((state) => state.news);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <Router>
      <div>
        <h1>Hacker News</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <Routes>
          <Route path="/" element={<NewsList news={news} />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
