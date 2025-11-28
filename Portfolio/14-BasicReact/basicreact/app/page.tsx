'use client';
import { useState } from 'react';
import sw from '../public/data/data.js';
import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  if (!selectedMovie && sw.length > 0) {
    setSelectedMovie(sw[0]);
  }

  return (
    <>

      <div 
        className="container-fluid mt-5 mb-5 p-4 bg-light rounded shadow-lg py-10 d-flex flex-nowrap overflow-auto"
        style={{ scrollSnapType: 'x mandatory' }}
      >
          {sw.map((movie, index) => (
            <div 
                className="me-4"
                key={index} 
                style={{ 
                    flex: '0 0 auto', 
                    scrollSnapAlign: 'start' 
                }}
            >
              <MovieCard 
                movie={movie} 
                onSelect={setSelectedMovie} 
                isSelected={selectedMovie && selectedMovie.title === movie.title}
              />
            </div>
          ))}
      </div>

      <hr className="my-5" />

      <div className="container mb-5">
        <div className="p-4 rounded shadow-lg bg-white border">
          {selectedMovie ? (
            <MovieDetail movie={selectedMovie} />
          ) : (
            <div className="text-center p-5">
              <h3 className="text-muted">Select a Movie Above to View Character Details</h3>            </div>
          )}
        </div>
      </div>
    </>
  );
}