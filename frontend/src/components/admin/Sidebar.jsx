import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/admin',            label: 'Tableau de bord', icon: '📊' },
  { path: '/admin/profile',    label: 'Profil',           icon: '👤' },
  { path: '/admin/links',      label: 'Liens',            icon: '🔗' },
  { path: '/admin/categories', label: 'Catégories',       icon: '📂' },
];

export default function Sidebar() {
  const { logout }   = useAuth();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Links<span>Hub</span></div>

      {NAV.map(n => (
        <Link
          key={n.path}
          to={n.path}
          className={`nav-item ${pathname === n.path ? 'active' : ''}`}
        >
          <span>{n.icon}</span>
          {n.label}
        </Link>
      ))}

      <div className="sidebar-footer">
        <Link to="/" className="btn btn-ghost btn-full">↗ Voir le site</Link>
        <a href="/docs" target="_blank" className="btn btn-ghost btn-full">📚 API Docs</a>
        <button className="btn btn-ghost btn-full" onClick={logout}>Déconnexion</button>
      </div>
    </aside>
  );
}
