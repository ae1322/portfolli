import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL, getAuthHeaders } from '../lib/supabase';
import { HiOutlineSave, HiOutlineGlobe, HiOutlineLink } from 'react-icons/hi';

export default function Profile() {
    const { session } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/profiles/me`, {
                headers: getAuthHeaders(session),
            });
            const data = await res.json();
            setProfile(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch(`${API_URL}/profiles/me`, {
                method: 'PUT',
                headers: getAuthHeaders(session),
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                setMessage('Profile updated successfully!');
            } else {
                const err = await res.json();
                setMessage(err.error || 'Failed to update');
            }
        } catch (err) {
            setMessage('Network error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
    );

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <h1>Edit <span className="gradient-text">Profile</span></h1>
                <p>Customize your public-facing profile information</p>
            </div>

            <form onSubmit={handleSave} style={{ maxWidth: 640 }}>
                <div className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {message && (
                        <div style={{
                            padding: '12px 16px', borderRadius: 10,
                            background: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${message.includes('success') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            color: message.includes('success') ? 'var(--success)' : 'var(--danger)',
                            fontSize: '0.9rem',
                        }}>{message}</div>
                    )}

                    <div>
                        <label className="form-label">Full Name</label>
                        <input className="form-input" value={profile?.full_name || ''}
                            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                            placeholder="Your full name" />
                    </div>

                    <div>
                        <label className="form-label">Bio</label>
                        <textarea className="form-input" rows={4} value={profile?.bio || ''}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="Tell the world about yourself..." />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="form-label"><HiOutlineLink style={{ verticalAlign: 'middle' }} /> LinkedIn</label>
                            <input className="form-input" value={profile?.linkedin || ''}
                                onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                                placeholder="linkedin.com/in/..." />
                        </div>
                        <div>
                            <label className="form-label"><HiOutlineLink style={{ verticalAlign: 'middle' }} /> GitHub</label>
                            <input className="form-input" value={profile?.github || ''}
                                onChange={e => setProfile({ ...profile, github: e.target.value })}
                                placeholder="github.com/..." />
                        </div>
                    </div>

                    <div>
                        <label className="form-label"><HiOutlineGlobe style={{ verticalAlign: 'middle' }} /> Website</label>
                        <input className="form-input" value={profile?.website || ''}
                            onChange={e => setProfile({ ...profile, website: e.target.value })}
                            placeholder="https://yoursite.com" />
                    </div>

                    <button type="submit" className="btn-primary" disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14 }}>
                        {saving ? <span className="spinner" /> : <><HiOutlineSave size={18} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
