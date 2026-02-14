import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL, getAuthHeaders } from '../lib/supabase';
import { HiOutlineUsers, HiOutlineTrash, HiOutlineShieldCheck } from 'react-icons/hi';

export default function AdminDashboard() {
    const { session } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, { headers: getAuthHeaders(session) });
            if (res.status === 403) { setError('Admin access required'); return; }
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { setError('Failed to load'); }
        finally { setLoading(false); }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await fetch(`${API_URL}/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: getAuthHeaders(session),
                body: JSON.stringify({ role: newRole }),
            });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
    );

    if (error) return (
        <div className="page-container" style={{ textAlign: 'center', paddingTop: 100 }}>
            <HiOutlineShieldCheck size={48} style={{ color: 'var(--danger)', marginBottom: 16 }} />
            <p style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>{error}</p>
        </div>
    );

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <h1>Admin <span className="gradient-text">Dashboard</span></h1>
                <p>Manage users and platform content</p>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <HiOutlineUsers size={20} style={{ color: 'var(--primary-light)' }} />
                    <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>All Users ({users.length})</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['Name', 'Role', 'Joined', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        padding: '12px 20px', textAlign: 'left',
                                        fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)',
                                        textTransform: 'uppercase', letterSpacing: '0.05em',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, color: 'white', fontSize: '0.85rem', flexShrink: 0,
                                            }}>
                                                {u.full_name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.full_name || 'Unnamed'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span className={u.role === 'admin' ? 'badge badge-accent' : 'badge'}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <button onClick={() => toggleRole(u.id, u.role)}
                                            className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
