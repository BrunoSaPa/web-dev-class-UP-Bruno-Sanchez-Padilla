'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { registerUser } from '../lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(registerUser({ username, password }));
        if (registerUser.fulfilled.match(result)) {
            router.push('/');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5" style={{ maxWidth: '400px' }}>
                <h2 className="mb-4 text-center">Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit} className="card p-4 shadow">
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Already have an account? <Link href="/login">Login</Link>
                </p>
            </div>
        </>
    );
}
