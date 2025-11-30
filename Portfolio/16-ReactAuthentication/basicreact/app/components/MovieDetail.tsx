'use client';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../lib/hooks';

export default function MovieDetail({ movie }: { movie: any }) {
  const [comments, setComments] = useState<{text: string, author?: string, date: string}[]>([]);
  const [commentText, setCommentText] = useState('');
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetch(`http://localhost:5002/api/movies/${movie._id}`)
        .then(res => res.json())
        .then(data => {
            setComments(data.comments || []);
        })
        .catch(err => console.error(err));
  }, [movie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!commentText) return;
    
    try {
        const res = await fetch(`http://localhost:5002/api/movies/${movie._id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: commentText }),
            credentials: 'include'
        });
        const data = await res.json();
        setComments(data.comments);
        setCommentText('');
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="container my-5 p-4 border rounded shadow-lg bg-light">
      <div className="row mb-4 align-items-center">
        <div className="col-md-4 text-center">
            <img 
                src={`/images/${movie.best_character.image}`} 
                alt={movie.best_character.name} 
                className="img-fluid rounded-3 shadow-sm" 
            />
        </div>
        <div className="col-md-8">
            <h2 className="display-5 fw-bold text-primary">{movie.best_character.name}</h2>
            <p className="lead">{movie.best_character.bio}</p>

            <div className="mt-3">
                <button 
                    className="btn btn-outline-info me-2" 
                    onClick={() => alert(`Showing details for ${movie.best_character.name}`)}
                >
                    Character Info
                </button>
                <button 
                    className="btn btn-outline-dark"
                    onClick={() => alert('Opening related external link')}
                >
                    View Official Page
                </button>
            </div>
        </div>
      </div>

      <hr className="my-4" />

      <h4 className="text-secondary mb-3">Leave a Comment</h4>
      
      {user ? (
      <form onSubmit={handleSubmit} className="mb-5 p-3 border rounded bg-white">
        <div className="row g-3">
            <div className="col-12">
                <label htmlFor="commentTextarea" className="form-label visually-hidden">Comment</label>
                <textarea 
                    id="commentTextarea"
                    className="form-control" 
                    placeholder="Your Comment" 
                    rows={3}
                    value={commentText} 
                    onChange={e => setCommentText(e.target.value)} 
                    required
                />
            </div>

            <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary btn-lg">
                    Post Comment
                </button>
            </div>
        </div>
      </form>
      ) : (
        <div className="alert alert-warning">
            Please <a href="/login">login</a> to leave a comment.
        </div>
      )}

      <h4 className="text-secondary mb-3">All Comments ({comments.length})</h4>
      <ul className="list-group">
        {comments.length === 0 ? (
             <li className="list-group-item text-muted">No comments yet</li>
        ) : (
            comments.map((c, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                        {c.author && <strong>{c.author}: </strong>}
                        {c.text}
                    </div>
                    <small className="text-muted ms-3">{new Date(c.date).toLocaleDateString()}</small>
                </li>
            ))
        )}
      </ul>
    </div>
  );
}