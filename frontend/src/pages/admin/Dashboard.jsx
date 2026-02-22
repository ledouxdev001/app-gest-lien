export default function Dashboard({ links, categories }) {
  const active = links.filter(l => l.active).length;
  const hidden = links.filter(l => !l.active).length;

  return (
    <div>
      <h1 className="page-title">Tableau de bord</h1>
      <p className="page-sub">Vue d'ensemble — Backend Python + MySQL</p>

      <div className="stats-grid">
        <div className="stat-card"><div className="val">{active}</div><div className="lbl">Liens actifs</div></div>
        <div className="stat-card"><div className="val">{categories.length}</div><div className="lbl">Catégories</div></div>
        <div className="stat-card"><div className="val">{hidden}</div><div className="lbl">Masqués</div></div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Liens récents</h3></div>
        <table className="table">
          <thead><tr><th>Emoji</th><th>Titre</th><th>Catégorie</th><th>Statut</th></tr></thead>
          <tbody>
            {links.length === 0
              ? <tr><td colSpan={4} className="empty-cell">Aucun lien</td></tr>
              : links.slice(0, 6).map(l => {
                  const cat = categories.find(c => c.id === l.category_id);
                  return (
                    <tr key={l.id}>
                      <td style={{ fontSize: '1.2rem' }}>{l.emoji}</td>
                      <td>{l.title}</td>
                      <td style={{ color: 'var(--muted)' }}>{cat?.label || '—'}</td>
                      <td><span className={`badge ${l.active ? 'badge-active' : 'badge-inactive'}`}>{l.active ? 'Actif' : 'Masqué'}</span></td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
