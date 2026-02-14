import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <footer style={{
                textAlign: 'center', padding: '24px',
                borderTop: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: '0.85rem',
            }}>
                © 2026 Portfolli — Career Portfolio & Forum Platform
            </footer>
        </div>
    );
}
