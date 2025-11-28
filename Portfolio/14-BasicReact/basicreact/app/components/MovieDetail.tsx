'use client';
import { useState, useEffect } from 'react';
// Assuming you are using Bootstrap classes (like row, col-md, btn, etc.) 
// which is implied by the original code.

export default function MovieDetail({ movie }: { movie: any }) {
  const [comments, setComments] = useState<{name: string, comment: string}[]>([]);
  const [form, setForm] = useState({ name: '', comment: '' });

  useEffect(() => {
    const storedComments = sessionStorage.getItem(`comments_${movie.episode}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      setComments([]);
    }
  }, [movie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name || !form.comment) return;
    const newComments = [...comments, form];
    setComments(newComments);
    sessionStorage.setItem(`comments_${movie.episode}`, JSON.stringify(newComments));
    setForm({ name: '', comment: '' });
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
      
      <form onSubmit={handleSubmit} className="mb-5 p-3 border rounded bg-white">
        <div className="row g-3">
            <div className="col-md-6">
                <label htmlFor="nameInput" className="form-label visually-hidden">Name</label>
                <input 
                    id="nameInput"
                    className="form-control" 
                    placeholder="Your Name" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required
                />
            </div>
            <div className="col-md-6">
            </div>

            <div className="col-12">
                <label htmlFor="commentTextarea" className="form-label visually-hidden">Comment</label>
                <textarea 
                    id="commentTextarea"
                    className="form-control" 
                    placeholder="Your Comment" 
                    rows={3}
                    value={form.comment} 
                    onChange={e => setForm({...form, comment: e.target.value})} 
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

      <h4 className="text-secondary mb-3">All Comments ({comments.length})</h4>
      <ul className="list-group">
        {comments.length === 0 ? (
             <li className="list-group-item text-muted">No comments yet</li>
        ) : (
            comments.map((c, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                        <strong className="text-info">{c.name}:</strong> {c.comment}
                    </div>
                    <small className="text-muted ms-3">just now</small>
                </li>
            ))
        )}
      </ul>
    </div>
  );
}