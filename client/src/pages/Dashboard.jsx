import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { HiOutlineDocumentText, HiOutlineCode, HiOutlineChatAlt2, HiOutlineUser, HiOutlineExternalLink } from 'react-icons/hi';

export default function Dashboard() {
    const { user } = useAuth();

    const quickLinks = [
        { title: 'Certificates', desc: 'Upload and manage your certificates', icon: <HiOutlineDocumentText size={28} />, to: '/certificates', color: '#6366f1' },
        { title: 'Projects', desc: 'Showcase your best work', icon: <HiOutlineCode size={28} />, to: '/projects', color: '#f59e0b' },
        { title: 'Forum', desc: 'Join the community discussion', icon: <HiOutlineChatAlt2 size={28} />, to: '/forum', color: '#10b981' },
        { title: 'Profile', desc: 'Edit your public profile', icon: <HiOutlineUser size={28} />, to: '/profile', color: '#ec4899' },
    ];

    return (
        <div className="page-container animate-fade-in">
            {/* Welcome hero */}
            <div className="glass-card" style={{
                padding: '40px 32px', marginBottom: 32,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(245, 158, 11, 0.08))',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 200, height: 200,
                    borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', filter: 'blur(40px)',
                }} />
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
                    Welcome back, <span className="gradient-text">{user?.user_metadata?.full_name || 'there'}</span>! 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600 }}>
                    Build your professional portfolio, upload certificates, and connect with peers in the forum.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                    <Link to={`/portfolio/${user?.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <HiOutlineExternalLink size={16} /> View Public Portfolio
                    </Link>
                    <Link to="/forum" className="btn-secondary">Browse Forum</Link>
                </div>
            </div>

            {/* Quick links grid */}
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
            <div className="stagger-children" style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20,
            }}>
                {quickLinks.map(link => (
                    <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ padding: 24, cursor: 'pointer' }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 12, marginBottom: 16,
                                background: `${link.color}20`, color: link.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {link.icon}
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                                {link.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{link.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
