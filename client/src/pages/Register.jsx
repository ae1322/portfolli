import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const { error: err } = await signUp(email, password, fullName);
        if (err) {
            setError(err.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            background: 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.1), transparent 50%), var(--bg-dark)',
        }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: 40 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, var(--accent), var(--primary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 800, color: 'white',
                    }}>P</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Join Portfolli and showcase your journey</p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'var(--danger)', fontSize: '0.9rem',
                    }}>{error}</div>
                )}

                {success && (
                    <div style={{
                        padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: 'var(--success)', fontSize: '0.9rem',
                    }}>Account created! Redirecting to dashboard...</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <HiOutlineUser size={18} style={{
                                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)',
                            }} />
                            <input type="text" className="form-input" placeholder="John Doe"
                                style={{ paddingLeft: 40 }}
                                value={fullName} onChange={e => setFullName(e.target.value)} required />
                        </div>
                    </div>
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
                            <input type="password" className="form-input" placeholder="Min. 6 characters"
                                style={{ paddingLeft: 40 }}
                                value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading || success}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }}>
                        {loading ? <span className="spinner" /> : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
