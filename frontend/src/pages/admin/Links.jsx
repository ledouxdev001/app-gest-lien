import { useState } from 'react';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

const EMPTY = { title: '', url: '', desc: '', emoji: '🔗', weight: 10, category_id: '', featured: false, active: true };

export default function Links({ links, categories, onRefresh }) {
  const toast = useToast();
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);

  const set = key => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [key]: val }));
  };

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY, category_id: categories[0]?.id || '' }); setOpen(true); };
  const openEdit   = l  => { setEditing(l.id); setForm({ title: l.title, url: l.url, desc: l.desc, emoji: l.emoji, weight: l.weight, category_id: l.category_id, featured: l.featured, active: l.active }); setOpen(true); };

  const save = async () => {
    if (!form.title || !form.url || !form.category_id) { toast('Titre, URL et catégorie requis', 'error'); return; }
    try {
      if (editing) await api('PUT',  `/api/admin/links/${editing}`, form);
      else         await api('POST', '/api/admin/links', form);
      setOpen(false); await onRefresh();
      toast(editing ? 'Lien modifié ✓' : 'Lien ajouté ✓', 'success');
    } catch (e) { toast(e.message, 'error'); }
  };

  const del    = async id => { if (!confirm('Supprimer ce lien ?')) return; try { await api('DELETE', `/api/admin/links/${id}`); await onRefresh(); toast('Lien supprimé', 'success'); } catch (e) { toast(e.message, 'error'); } };
  const toggle = async id => { try { await api('PATCH', `/api/admin/links/${id}/toggle`); await onRefresh(); toast('Statut modifié ✓', 'success'); } catch (e) { toast(e.message, 'error'); } };

  return (
    <div>
      <h1 className="page-title">Liens</h1>
      <p className="page-sub">Gérez tous vos liens</p>
      <div className="card">
        <div className="card-header"><h3>Tous les liens</h3><button className="btn btn-primary" onClick={openCreate}>+ Ajouter</button></div>
        <table className="table">
          <thead><tr><th>Emoji</th><th>Titre</th><th>Catégorie</th><th>Poids</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {links.length === 0
              ? <tr><td colSpan={6} className="empty-cell">Aucun lien</td></tr>
              : links.map(l => {
                  const cat = categories.find(c => c.id === l.category_id);
                  return (
                    <tr key={l.id}>
                      <td style={{ fontSize: '1.2rem' }}>{l.emoji}</td>
                      <td>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{l.title}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.68rem' }}>{l.desc}</div>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{cat?.label || '—'}</td>
                      <td style={{ color: 'var(--accent)' }}>{l.weight}</td>
                      <td>
                        <span className={`badge ${l.active ? 'badge-active' : 'badge-inactive'}`}>{l.active ? 'Actif' : 'Masqué'}</span>
                        {l.featured && <span className="badge badge-featured" style={{ marginLeft: 4 }}>✦</span>}
                      </td>
                      <td><div className="actions">
                        <button className="btn btn-ghost btn-icon"   onClick={() => openEdit(l)}>✏</button>
                        <button className="btn btn-success btn-icon" onClick={() => toggle(l.id)}>👁</button>
                        <button className="btn btn-danger btn-icon"  onClick={() => del(l.id)}>✕</button>
                      </div></td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Modifier le lien' : 'Ajouter un lien'}
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
        <div className="field"><label>Titre *</label><input type="text" value={form.title} onChange={set('title')} placeholder="Mon site" /></div>
        <div className="field"><label>URL *</label><input type="url" value={form.url} onChange={set('url')} placeholder="https://..." /></div>
        <div className="field"><label>Description</label><input type="text" value={form.desc} onChange={set('desc')} /></div>
        <div className="form-row" style={{ marginTop: 12 }}>
          <div className="field"><label>Emoji</label><input type="text" value={form.emoji} onChange={set('emoji')} maxLength={4} /></div>
          <div className="field"><label>Poids</label><input type="number" value={form.weight} onChange={set('weight')} min={1} max={100} /></div>
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>Catégorie *</label>
          <select value={form.category_id} onChange={set('category_id')}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <div className="checkbox-row"><input type="checkbox" id="lk-featured" checked={form.featured} onChange={set('featured')} /><label htmlFor="lk-featured">Mis en avant</label></div>
          <div className="checkbox-row"><input type="checkbox" id="lk-active"   checked={form.active}   onChange={set('active')}   /><label htmlFor="lk-active">Visible sur le site</label></div>
        </div>
      </Modal>
    </div>
  );
}
