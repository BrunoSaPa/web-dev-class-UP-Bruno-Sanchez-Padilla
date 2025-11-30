'use client';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { logoutUser } from '../lib/features/auth/authSlice';

export default function Navbar() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" href="/">Star Wars Movies</Link>
                <div className="d-flex">
                    {user ? (
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-light">Welcome, {user.username}</span>
                            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Logout</button>
                        </div>
                    ) : (
                        <div className="d-flex gap-2">
                            <Link href="/login" className="btn btn-outline-light btn-sm">Login</Link>
                            <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
