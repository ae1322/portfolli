import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../lib/supabase';
import { HiOutlineUser, HiOutlineGlobe, HiOutlineDocumentText, HiOutlineCode, HiOutlineExternalLink } from 'react-icons/hi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

export default function PublicPortfolio() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [certs, setCerts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/profiles/${userId}`).then(r => r.json()),
            fetch(`${API_URL}/certificates/user/${userId}`).then(r => r.json()),
            fetch(`${API_URL}/projects/user/${userId}`).then(r => r.json()),
        ]).then(([p, c, proj]) => {
            setProfile(p);
            setCerts(Array.isArray(c) ? c : []);
            setProjects(Array.isArray(proj) ? proj : []);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
    );

    if (!profile || profile.error) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Portfolio not found</p>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.12), transparent 60%), var(--bg-dark)',
        }}>
            <div className="page-container animate-fade-in" style={{ maxWidth: 900 }}>
                {/* Profile header */}
                <div className="glass-card" style={{
                    padding: '48px 40px', textAlign: 'center', marginBottom: 40,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(245, 158, 11, 0.05))',
                }}>
                    <div style={{
                        width: 96, height: 96, borderRadius: '50%', margin: '0 auto 20px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', fontWeight: 800, color: 'white',
                        boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
                    }}>
                        {profile.full_name?.charAt(0)?.toUpperCase() || <HiOutlineUser size={40} />}
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
                        <span className="gradient-text">{profile.full_name || 'User'}</span>
                    </h1>
                    {profile.bio && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 20px', lineHeight: 1.6 }}>
                            {profile.bio}
                        </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                        {profile.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary-light)', textDecoration: 'none' }}>
                                <FaLinkedin size={18} /> LinkedIn
                            </a>
                        )}
                        {profile.github && (
                            <a href={profile.github} target="_blank" rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                <FaGithub size={18} /> GitHub
                            </a>
                        )}
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', textDecoration: 'none' }}>
                                <HiOutlineGlobe size={18} /> Website
                            </a>
                        )}
                    </div>
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HiOutlineCode size={24} style={{ color: 'var(--accent)' }} /> Projects
                        </h2>
                        <div className="stagger-children" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
                        }}>
                            {projects.map(proj => (
                                <div key={proj.id} className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{proj.title}</h3>
                                    {proj.description && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12, lineHeight: 1.5 }}>
                                            {proj.description}
                                        </p>
                                    )}
                                    {proj.tech_stack?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                                            {proj.tech_stack.map(t => <span key={t} className="badge">{t}</span>)}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {proj.live_url && (
                                            <a href={proj.live_url} target="_blank" rel="noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary-light)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                                <HiOutlineExternalLink size={14} /> Live
                                            </a>
                                        )}
                                        {proj.repo_url && (
                                            <a href={proj.repo_url} target="_blank" rel="noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                                <HiOutlineCode size={14} /> Source
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certificates */}
                {certs.length > 0 && (
                    <section>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HiOutlineDocumentText size={24} style={{ color: 'var(--primary-light)' }} /> Certificates
                        </h2>
                        <div className="stagger-children" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20,
                        }}>
                            {certs.map(cert => (
                                <div key={cert.id} className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{cert.title}</h3>
                                    {cert.issuer && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{cert.issuer}</p>}
                                    {cert.issue_date && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>
                                            {new Date(cert.issue_date).toLocaleDateString()}
                                        </p>
                                    )}
                                    {cert.file_url && (
                                        <a href={cert.file_url} target="_blank" rel="noreferrer"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, color: 'var(--primary-light)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                            <HiOutlineExternalLink size={14} /> View
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {certs.length === 0 && projects.length === 0 && (
                    <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>This portfolio is still being built. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
