import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', tagline: '', emoji: '' });

  useEffect(() => {
    api('GET', '/api/admin/profile').then(p =>
      setForm({ name: p.name || '', tagline: p.tagline || '', emoji: p.emoji || '' })
    );
  }, []);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    try { await api('PUT', '/api/admin/profile', form); toast('Profil enregistré ✓', 'success'); }
    catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div>
      <h1 className="page-title">Profil</h1>
      <p className="page-sub">Informations affichées sur le site public</p>
      <div className="card">
        <div className="profile-preview">
          <div className="profile-avatar">{form.emoji || '✦'}</div>
          <div className="profile-info">
            <div className="name">{form.name || '—'}</div>
            <div className="tag">{form.tagline || '—'}</div>
          </div>
        </div>
        <div className="field"><label>Nom affiché</label><input type="text" value={form.name} onChange={set('name')} /></div>
        <div className="field"><label>Tagline</label><input type="text" value={form.tagline} onChange={set('tagline')} /></div>
        <div className="field"><label>Emoji avatar</label><input type="text" value={form.emoji} onChange={set('emoji')} maxLength={4} style={{ maxWidth: 80 }} /></div>
        <div style={{ marginTop: 20 }}><button className="btn btn-primary" onClick={save}>💾 Enregistrer</button></div>
      </div>
    </div>
  );
}
