'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MovieDetail from '../../components/MovieDetail';
import Navbar from '../../components/Navbar';

export default function MoviePage() {
    const params = useParams();
    const id = params.id;
    const [movie, setMovie] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5002/api/movies/${id}`)
                .then(res => res.json())
                .then(data => setMovie(data))
                .catch(err => console.error(err));
        }
    }, [id]);

    if (!movie) return <div className="container mt-5 text-center"><h2>Loading...</h2></div>;

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <Link href="/" className="btn btn-outline-secondary mb-4">
                    &larr; Back to Movies
                </Link>
                <MovieDetail movie={movie} />
            </div>
        </>
    );
}
