'use client';
import { useState } from 'react';

export default function MovieCard({ movie, onSelect }) {
  const [hover, setHover] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // Determine if affiliation is good (blue) or evil (red)
  const isGoodAffiliation = movie.best_character.affiliation === 'Jedi' || movie.best_character.affiliation === 'Rebellion';
  const affiliationColor = isGoodAffiliation ? '#2E67F8' : '#E63946';
  const affiliationColorLight = isGoodAffiliation ? 'rgba(46, 103, 248, 0.1)' : 'rgba(230, 57, 70, 0.1)';
  const affiliationColorMedium = isGoodAffiliation ? 'rgba(46, 103, 248, 0.2)' : 'rgba(230, 57, 70, 0.2)';
  
  return (
    <div 
        className="card h-100 shadow-lg border-0 rounded-3" 
        style={{ 
          maxWidth: '280px', 
          width: '100%',
          minHeight: '450px',
          transition: 'all 0.3s ease-in-out', 
          transform: hover ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: hover ? `0 10px 25px ${affiliationColorMedium}, 0 0 0 2px ${affiliationColor}` : '0 5px 15px rgba(0,0,0,0.08)',
          border: hover ? `2px solid ${affiliationColor}` : '2px solid transparent'
        }}
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)}
    >
      <div 
        className="position-relative overflow-hidden"
        style={{ 
          height: '250px', 
          borderTopLeftRadius: '0.75rem', 
          borderTopRightRadius: '0.75rem',
          background: hover ? `linear-gradient(135deg, ${affiliationColorLight}, ${affiliationColorMedium})` : 'transparent'
        }} 
      >
        <img 
            src={hover ? `/images/${movie.best_character.affiliation}.png` : `/images/${movie.poster}`} 
            className="card-img-top w-100 h-100" 
            alt={movie.title} 
            style={{ 
                objectFit: 'cover',
                borderBottom: hover ? `4px solid ${affiliationColor}` : 'none',
                transition: 'all 0.3s ease-in-out'
            }}
        />
        {hover && (
            <div className="position-absolute top-0 end-0 p-2">
                <span className="badge rounded-pill" style={{ backgroundColor: affiliationColor }}>
                    {movie.best_character.affiliation}
                </span>
            </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column p-3" style={{ minHeight: '200px' }}>
        <div className="mb-2 grow">
            <h5 className="card-title fw-bold text-truncate mb-2" title={movie.title} style={{ fontSize: '1.1rem' }}>{movie.title}</h5>
            <p className="card-text text-muted small mb-0">{movie.year}</p>
        </div>
        
        <div className="d-grid gap-2 mb-3">
            <button 
                onClick={() => onSelect(movie)} 
                className="btn btn-sm fw-semibold rounded-pill border-0"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: affiliationColor,
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = isGoodAffiliation ? '#1e4db8' : '#c73545'}
                onMouseLeave={(e) => e.target.style.backgroundColor = affiliationColor}
            >
                More...
            </button>
        </div>
        
        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
            <button 
                onClick={(e) => { e.stopPropagation(); setLikes(likes + 1); }} 
                className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 rounded-pill flex-fill me-2"
                style={{ 
                  maxWidth: '48%',
                  fontSize: '0.8rem',
                  padding: '0.25rem 0.75rem'
                }}
            >
                <span>👍</span> <span className="fw-bold">{likes}</span>
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); setDislikes(dislikes + 1); }} 
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-pill flex-fill"
                style={{ 
                  maxWidth: '48%',
                  fontSize: '0.8rem',
                  padding: '0.25rem 0.75rem'
                }}
            >
                <span>👎</span> <span className="fw-bold">{dislikes}</span>
            </button>
        </div>
      </div>
    </div>
  );
}