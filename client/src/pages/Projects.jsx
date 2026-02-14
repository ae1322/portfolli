import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL, getAuthHeaders } from '../lib/supabase';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCode, HiOutlineExternalLink } from 'react-icons/hi';

export default function Projects() {
    const { session } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', tech_stack: '', live_url: '', repo_url: '',
    });

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/projects`, { headers: getAuthHeaders(session) });
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: getAuthHeaders(session),
                body: JSON.stringify({
                    ...form,
                    tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setProjects([data, ...projects]);
                setForm({ title: '', description: '', tech_stack: '', live_url: '', repo_url: '' });
                setShowForm(false);
            }
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        try {
            await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE', headers: getAuthHeaders(session),
            });
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
    );

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1>My <span className="gradient-text">Projects</span></h1>
                    <p>Showcase your best work to the world</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlinePlus size={18} /> {showForm ? 'Cancel' : 'Add Project'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="glass-card animate-fade-in"
                    style={{ padding: 28, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                        <label className="form-label">Title *</label>
                        <input className="form-input" required value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project Name" />
                    </div>
                    <div>
                        <label className="form-label">Description</label>
                        <textarea className="form-input" rows={3} value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this project do?" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="form-label">Tech Stack (comma-separated)</label>
                            <input className="form-input" value={form.tech_stack}
                                onChange={e => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
                        </div>
                        <div>
                            <label className="form-label">Live URL</label>
                            <input className="form-input" value={form.live_url}
                                onChange={e => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Repository URL</label>
                        <input className="form-input" value={form.repo_url}
                            onChange={e => setForm({ ...form, repo_url: e.target.value })} placeholder="https://github.com/..." />
                    </div>
                    <button type="submit" className="btn-primary" disabled={saving}
                        style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
                        {saving ? <span className="spinner" /> : 'Save Project'}
                    </button>
                </form>
            )}

            {projects.length === 0 ? (
                <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
                    <HiOutlineCode size={48} style={{ color: 'var(--text-secondary)', marginBottom: 16 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No projects yet. Add your first one!</p>
                </div>
            ) : (
                <div className="stagger-children" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20,
                }}>
                    {projects.map(proj => (
                        <div key={proj.id} className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 10,
                                    background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <HiOutlineCode size={22} />
                                </div>
                                <button onClick={() => handleDelete(proj.id)} className="btn-danger" style={{ padding: '6px 10px' }}>
                                    <HiOutlineTrash size={16} />
                                </button>
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{proj.title}</h3>
                            {proj.description && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12, lineHeight: 1.5 }}>
                                    {proj.description}
                                </p>
                            )}
                            {proj.tech_stack?.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                                    {proj.tech_stack.map(tech => (
                                        <span key={tech} className="badge">{tech}</span>
                                    ))}
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
            )}
        </div>
    );
}
