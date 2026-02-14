import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLogout, HiOutlineUser, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
        }}>
            <div style={{
                maxWidth: 1200, margin: '0 auto', padding: '0 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1.1rem', color: 'white',
                    }}>P</div>
                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                        Portfolli
                    </span>
                </Link>

                {/* Desktop links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    className="desktop-nav">
                    {user ? (
                        <>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            <NavLink to="/certificates">Certificates</NavLink>
                            <NavLink to="/projects">Projects</NavLink>
                            <NavLink to="/forum">Forum</NavLink>
                            <NavLink to="/profile">
                                <HiOutlineUser size={16} style={{ marginRight: 4 }} /> Profile
                            </NavLink>
                            <button onClick={handleSignOut} className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', marginLeft: 8 }}>
                                <HiOutlineLogout size={16} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Log In</NavLink>
                            <Link to="/register" className="btn-primary" style={{ marginLeft: 8 }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                    className="mobile-toggle">
                    {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    background: 'var(--bg-dark)',
                }}
                    className="mobile-menu">
                    {user ? (
                        <>
                            <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                            <NavLink to="/certificates" onClick={() => setMobileOpen(false)}>Certificates</NavLink>
                            <NavLink to="/projects" onClick={() => setMobileOpen(false)}>Projects</NavLink>
                            <NavLink to="/forum" onClick={() => setMobileOpen(false)}>Forum</NavLink>
                            <NavLink to="/profile" onClick={() => setMobileOpen(false)}>Profile</NavLink>
                            <button onClick={handleSignOut} className="btn-danger" style={{ marginTop: 8, width: '100%' }}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={() => setMobileOpen(false)}>Log In</NavLink>
                            <NavLink to="/register" onClick={() => setMobileOpen(false)}>Sign Up</NavLink>
                        </>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </nav>
    );
}

function NavLink({ to, children, ...props }) {
    return (
        <Link to={to} style={{
            textDecoration: 'none', color: 'var(--text-secondary)',
            padding: '8px 14px', borderRadius: 8, fontWeight: 500, fontSize: '0.9rem',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center',
        }}
            onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-card)'; }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
            {...props}>
            {children}
        </Link>
    );
}
