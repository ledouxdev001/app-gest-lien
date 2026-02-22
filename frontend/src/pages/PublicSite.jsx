import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackgroundCanvas from '../components/public/BackgroundCanvas';
import Avatar           from '../components/public/Avatar';
import LinksContainer   from '../components/public/LinksContainer';
import BarChart         from '../components/public/BarChart';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function PublicSite() {
  const [data,    setData]    = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/site`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setData(d); document.title = d.profile?.name || 'Mes Sites'; })
      .catch(() => setError('Erreur de chargement. Vérifiez que le serveur tourne.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="public-wrapper">
      <BackgroundCanvas />
      <div className="pub-container">
        {loading && (
          <div className="loader">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(123,94,167,0.3)" strokeWidth="2"/>
              <path d="M 16 4 A 12 12 0 0 1 28 16" fill="none" stroke="#e8ff47" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>Chargement...</p>
          </div>
        )}
        {error && <p className="error-msg">{error}</p>}
        {data && (
          <>
            <div className="pub-header">
              <Avatar emoji={data.profile.emoji} />
              <h1 className="site-name">{data.profile.name}</h1>
              <p className="tagline">{data.profile.tagline}</p>
            </div>
            <LinksContainer categories={data.categories} links={data.links} />
            <BarChart links={data.links} />
            <div className="pub-footer">
              Fait avec <span>✦</span> D3.js &amp; Python{' '}
              <Link to="/admin">⚙ Admin</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
