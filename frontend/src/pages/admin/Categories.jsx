import { useState } from 'react';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

export default function Categories({ categories, links, onRefresh }) {
  const toast = useToast();
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({ label: '', order_pos: 0 });

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const openCreate = () => { setEditing(null); setForm({ label: '', order_pos: categories.length }); setOpen(true); };
  const openEdit   = c  => { setEditing(c.id); setForm({ label: c.label, order_pos: c.order_pos }); setOpen(true); };

  const save = async () => {
    if (!form.label) { toast('Nom requis', 'error'); return; }
    try {
      const payload = { label: form.label, order_pos: parseInt(form.order_pos) || 0 };
      if (editing) await api('PUT',  `/api/admin/categories/${editing}`, payload);
      else         await api('POST', '/api/admin/categories', payload);
      setOpen(false); await onRefresh();
      toast(editing ? 'Catégorie modifiée ✓' : 'Catégorie ajoutée ✓', 'success');
    } catch (e) { toast(e.message, 'error'); }
  };

  const del = async id => {
    const nb = links.filter(l => l.category_id === id).length;
    if (!confirm(nb > 0 ? `Supprimer cette catégorie et ses ${nb} lien(s) ?` : 'Supprimer cette catégorie ?')) return;
    try { await api('DELETE', `/api/admin/categories/${id}`); await onRefresh(); toast('Catégorie supprimée', 'success'); }
    catch (e) { toast(e.message, 'error'); }
  };

  const sorted = [...categories].sort((a, b) => a.order_pos - b.order_pos);

  return (
    <div>
      <h1 className="page-title">Catégories</h1>
      <p className="page-sub">Organisez vos liens</p>
      <div className="card">
        <div className="card-header"><h3>Catégories</h3><button className="btn btn-primary" onClick={openCreate}>+ Ajouter</button></div>
        <table className="table">
          <thead><tr><th>Nom</th><th>Ordre</th><th>Liens</th><th>Actions</th></tr></thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={4} className="empty-cell">Aucune catégorie</td></tr>
              : sorted.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{c.label}</td>
                    <td style={{ color: 'var(--muted)' }}>{c.order_pos}</td>
                    <td style={{ color: 'var(--accent)' }}>{links.filter(l => l.category_id === c.id).length}</td>
                    <td><div className="actions">
                      <button className="btn btn-ghost btn-icon"  onClick={() => openEdit(c)}>✏</button>
                      <button className="btn btn-danger btn-icon" onClick={() => del(c.id)}>✕</button>
                    </div></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
        <div className="field"><label>Nom *</label><input type="text" value={form.label} onChange={set('label')} placeholder="Mes projets" /></div>
        <div className="field" style={{ marginTop: 12 }}><label>Ordre</label><input type="number" value={form.order_pos} onChange={set('order_pos')} min={0} /></div>
      </Modal>
    </div>
  );
}
