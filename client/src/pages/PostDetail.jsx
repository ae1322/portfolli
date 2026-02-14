import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL, getAuthHeaders } from '../lib/supabase';
import { HiOutlineUser, HiOutlineTrash, HiOutlineArrowLeft, HiOutlineTag, HiOutlineClock } from 'react-icons/hi';

export default function PostDetail() {
    const { id } = useParams();
    const { user, session } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchPost(); }, [id]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`${API_URL}/posts/${id}`);
            const data = await res.json();
            setPost(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: getAuthHeaders(session),
                body: JSON.stringify({ post_id: id, content: comment }),
            });
            if (res.ok) {
                const data = await res.json();
                setPost({ ...post, comments: [...(post.comments || []), data] });
                setComment('');
            }
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    const handleDeletePost = async () => {
        if (!confirm('Delete this post?')) return;
        await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE', headers: getAuthHeaders(session),
        });
        navigate('/forum');
    };

    const handleDeleteComment = async (commentId) => {
        await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'DELETE', headers: getAuthHeaders(session),
        });
        setPost({ ...post, comments: post.comments.filter(c => c.id !== commentId) });
    };

    const timeAgo = (date) => {
        const s = Math.floor((Date.now() - new Date(date)) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    if (loading) return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
    );

    if (!post) return (
        <div className="page-container" style={{ textAlign: 'center', paddingTop: 100 }}>
            <p style={{ color: 'var(--text-secondary)' }}>Post not found</p>
        </div>
    );

    return (
        <div className="page-container animate-fade-in" style={{ maxWidth: 800 }}>
            <Link to="/forum" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 24,
                fontSize: '0.9rem',
            }}>
                <HiOutlineArrowLeft size={16} /> Back to Forum
            </Link>

            {/* Post */}
            <article className="glass-card" style={{ padding: 32, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, color: 'white', fontSize: '1.1rem',
                        }}>
                            {post.profiles?.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{post.profiles?.full_name || 'Anonymous'}</p>
                            <div style={{ display: 'flex', gap: 10, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <HiOutlineClock size={12} /> {timeAgo(post.created_at)}
                                </span>
                                {post.categories?.name && (
                                    <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                                        {post.categories.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {user?.id === post.user_id && (
                        <button onClick={handleDeletePost} className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <HiOutlineTrash size={14} /> Delete
                        </button>
                    )}
                </div>

                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>{post.title}</h1>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </div>
            </article>

            {/* Comments */}
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>
                Comments ({post.comments?.length || 0})
            </h2>

            {user && (
                <form onSubmit={handleComment} className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
                    <textarea className="form-input" rows={3} value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Write a comment..." style={{ marginBottom: 12 }} />
                    <button type="submit" className="btn-primary" disabled={submitting || !comment.trim()}>
                        {submitting ? <span className="spinner" /> : 'Post Comment'}
                    </button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {post.comments?.map(c => (
                    <div key={c.id} className="glass-card" style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'var(--bg-card-hover)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 600, fontSize: '0.8rem', color: 'var(--primary-light)',
                                }}>
                                    {c.profiles?.full_name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.profiles?.full_name || 'Anonymous'}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                    {timeAgo(c.created_at)}
                                </span>
                            </div>
                            {user?.id === c.user_id && (
                                <button onClick={() => handleDeleteComment(c.id)} style={{
                                    background: 'none', border: 'none', color: 'var(--danger)',
                                    cursor: 'pointer', padding: 4,
                                }}>
                                    <HiOutlineTrash size={14} />
                                </button>
                            )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{c.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
