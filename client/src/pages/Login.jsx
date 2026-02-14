import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: err } = await signIn(email, password);
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 50%), var(--bg-dark)',
        }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: 40 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 800, color: 'white',
                    }}>P</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to your Portfolli account</p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'var(--danger)', fontSize: '0.9rem',
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <HiOutlineMail size={18} style={{
                                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)',
                            }} />
                            <input type="email" className="form-input" placeholder="you@example.com"
                                style={{ paddingLeft: 40 }}
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <HiOutlineLockClosed size={18} style={{
                                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)',
                            }} />
                            <input type="password" className="form-input" placeholder="••••••••"
                                style={{ paddingLeft: 40 }}
                                value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }}>
                        {loading ? <span className="spinner" /> : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
