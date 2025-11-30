'use client';
import { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <>

      <div 
        className="container-fluid mt-5 mb-5 p-4 bg-light rounded shadow-lg py-10 d-flex flex-nowrap overflow-auto"
        style={{ scrollSnapType: 'x mandatory' }}
      >
          {movies.map((movie, index) => (
            <div 
                className="me-4"
                key={movie._id || index} 
                style={{ 
                    flex: '0 0 auto', 
                    scrollSnapAlign: 'start' 
                }}
            >
              <MovieCard 
                movie={movie} 
              />
            </div>
          ))}
      </div>
    </>
  );
}