'use client';
import { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';
import Navbar from './components/Navbar';
import { useAppDispatch } from './lib/hooks';
import { checkAuth } from './lib/features/auth/authSlice';

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    //check authentication status on load
    dispatch(checkAuth());

    //fetch movies 
    fetch('http://localhost:5002/api/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="text-center my-4">Star Wars Movies</h1>
        <div 
            className="d-flex flex-nowrap overflow-auto pb-4"
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
      </div>
    </>
  );
}