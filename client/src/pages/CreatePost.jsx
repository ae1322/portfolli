import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL, getAuthHeaders } from '../lib/supabase';

export default function CreatePost() {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ title: '', content: '', category_id: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/posts/categories`)
            .then(r => r.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: getAuthHeaders(session),
                body: JSON.stringify({
                    title: form.title,
                    content: form.content,
                    category_id: form.category_id || null,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                navigate(`/forum/${data.id}`);
            } else {
                const err = await res.json();
                setError(err.error || 'Failed to create post');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-container animate-fade-in" style={{ maxWidth: 700 }}>
            <div className="page-header">
                <h1>Create <span className="gradient-text">Post</span></h1>
                <p>Share your thoughts with the community</p>
            </div>

            {error && (
                <div style={{
                    padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--danger)', fontSize: '0.9rem',
                }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                    <label className="form-label">Title *</label>
                    <input className="form-input" required value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="What's on your mind?" />
                </div>

                <div>
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category_id}
                        onChange={e => setForm({ ...form, category_id: e.target.value })}>
                        <option value="">Select a category (optional)</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="form-label">Content *</label>
                    <textarea className="form-input" rows={8} required value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        placeholder="Write your post content here..." />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '14px 32px' }}>
                        {saving ? <span className="spinner" /> : 'Publish Post'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/forum')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
