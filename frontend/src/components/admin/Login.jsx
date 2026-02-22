import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login }  = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) return;
    setError(''); setLoading(true);
    try { await login(username, password); }
    catch { setError('Identifiants incorrects'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>⚙ Admin</h1>
        <p>Connectez-vous pour gérer votre LinksHub</p>
        <div className="field">
          <label>Identifiant</label>
          <input type="text" placeholder="admin" value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
