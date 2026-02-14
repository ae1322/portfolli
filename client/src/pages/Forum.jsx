import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../lib/supabase';
import { HiOutlineChatAlt2, HiOutlineTag, HiOutlinePlus, HiOutlineUser, HiOutlineClock } from 'react-icons/hi';

export default function Forum() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, []);

    useEffect(() => {
        fetchPosts(activeCategory);
    }, [activeCategory]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/posts/categories`);
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const fetchPosts = async (categoryId = null) => {
        setLoading(true);
        try {
            const url = categoryId ? `${API_URL}/posts?category=${categoryId}` : `${API_URL}/posts`;
            const res = await fetch(url);
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const timeAgo = (date) => {
        const s = Math.floor((Date.now() - new Date(date)) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1>Community <span className="gradient-text">Forum</span></h1>
                    <p>Share experiences, ask questions, and connect with peers</p>
                </div>
                <Link to="/forum/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <HiOutlinePlus size={18} /> New Post
                </Link>
            </div>

            {/* Category filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                <button className={activeCategory === null ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveCategory(null)} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                    All
                </button>
                {categories.map(cat => (
                    <button key={cat.id}
                        className={activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Posts list */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
                    <div className="spinner" style={{ width: 40, height: 40 }} />
                </div>
            ) : posts.length === 0 ? (
                <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
                    <HiOutlineChatAlt2 size={48} style={{ color: 'var(--text-secondary)', marginBottom: 16 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No posts yet. Be the first to start a discussion!</p>
                </div>
            ) : (
                <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {posts.map(post => (
                        <Link key={post.id} to={`/forum/${post.id}`} style={{ textDecoration: 'none' }}>
                            <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                {/* Avatar */}
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, color: 'white', fontSize: '1rem',
                                }}>
                                    {post.profiles?.full_name?.charAt(0)?.toUpperCase() || <HiOutlineUser size={18} />}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4, color: 'var(--text-primary)' }}>
                                        {post.title}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <HiOutlineUser size={13} /> {post.profiles?.full_name || 'Anonymous'}
                                        </span>
                                        {post.categories?.name && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <HiOutlineTag size={13} /> {post.categories.name}
                                            </span>
                                        )}
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <HiOutlineClock size={13} /> {timeAgo(post.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
