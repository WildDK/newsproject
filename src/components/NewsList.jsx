import React from 'react';
import { Link } from 'react-router-dom';

const NewsList = ({ news }) => {
  return (
    <div className="container">
      <button onClick={() => window.location.reload()}>Refresh News</button>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <Link to={`/news/${item.id}`}>
              <div className="news-title">{item.title}</div>
              <div className="news-meta">By: {item.by} | Date: {new Date(item.time * 1000).toLocaleString()}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
