import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL, getAuthHeaders } from '../lib/supabase';
import { HiOutlineUpload, HiOutlineTrash, HiOutlineDocumentText, HiOutlineExternalLink } from 'react-icons/hi';

export default function Certificates() {
    const { session } = useAuth();
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ title: '', issuer: '', issue_date: '' });
    const fileRef = useRef();

    useEffect(() => { fetchCerts(); }, []);

    const fetchCerts = async () => {
        try {
            const res = await fetch(`${API_URL}/certificates`, { headers: getAuthHeaders(session) });
            const data = await res.json();
            setCerts(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('issuer', form.issuer);
        formData.append('issue_date', form.issue_date);
        if (fileRef.current?.files[0]) formData.append('file', fileRef.current.files[0]);

        try {
            const res = await fetch(`${API_URL}/certificates`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${session?.access_token}` },
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                setCerts([data, ...certs]);
                setForm({ title: '', issuer: '', issue_date: '' });
                setShowForm(false);
            }
        } catch (err) { console.error(err); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this certificate?')) return;
        try {
            await fetch(`${API_URL}/certificates/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(session),
            });
            setCerts(certs.filter(c => c.id !== id));
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
                    <h1>My <span className="gradient-text">Certificates</span></h1>
                    <p>Upload and manage your achievements</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlineUpload size={18} /> {showForm ? 'Cancel' : 'Add Certificate'}
                </button>
            </div>

            {/* Upload form */}
            {showForm && (
                <form onSubmit={handleUpload} className="glass-card animate-fade-in"
                    style={{ padding: 28, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <div>
                            <label className="form-label">Title *</label>
                            <input className="form-input" required value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. AWS Solutions Architect" />
                        </div>
                        <div>
                            <label className="form-label">Issuer</label>
                            <input className="form-input" value={form.issuer}
                                onChange={e => setForm({ ...form, issuer: e.target.value })} placeholder="e.g. Amazon" />
                        </div>
                        <div>
                            <label className="form-label">Issue Date</label>
                            <input className="form-input" type="date" value={form.issue_date}
                                onChange={e => setForm({ ...form, issue_date: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Certificate File (PDF/Image)</label>
                        <input type="file" ref={fileRef} accept=".pdf,.png,.jpg,.jpeg"
                            style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={uploading}
                        style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
                        {uploading ? <span className="spinner" /> : 'Upload Certificate'}
                    </button>
                </form>
            )}

            {/* Certificates list */}
            {certs.length === 0 ? (
                <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
                    <HiOutlineDocumentText size={48} style={{ color: 'var(--text-secondary)', marginBottom: 16 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No certificates yet. Add your first one!</p>
                </div>
            ) : (
                <div className="stagger-children" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
                }}>
                    {certs.map(cert => (
                        <div key={cert.id} className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 10,
                                    background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <HiOutlineDocumentText size={22} />
                                </div>
                                <button onClick={() => handleDelete(cert.id)} className="btn-danger"
                                    style={{ padding: '6px 10px' }}>
                                    <HiOutlineTrash size={16} />
                                </button>
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{cert.title}</h3>
                            {cert.issuer && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>{cert.issuer}</p>}
                            {cert.issue_date && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                    {new Date(cert.issue_date).toLocaleDateString()}
                                </p>
                            )}
                            {cert.file_url && (
                                <a href={cert.file_url} target="_blank" rel="noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12,
                                        color: 'var(--primary-light)', fontSize: '0.85rem', textDecoration: 'none',
                                    }}>
                                    <HiOutlineExternalLink size={14} /> View Certificate
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
