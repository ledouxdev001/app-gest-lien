import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api }     from '../api';
import Sidebar     from '../components/admin/Sidebar';
import Login       from '../components/admin/Login';
import Dashboard   from './admin/Dashboard';
import Profile     from './admin/Profile';
import Links       from './admin/Links';
import Categories  from './admin/Categories';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [links,      setLinks]      = useState([]);
  const [categories, setCategories] = useState([]);

  const loadAll = useCallback(async () => {
    const [cats, lnks] = await Promise.all([
      api('GET', '/api/admin/categories'),
      api('GET', '/api/admin/links'),
    ]);
    setCategories(cats);
    setLinks(lnks);
  }, []);

  useEffect(() => { if (user) loadAll(); }, [user, loadAll]);

  if (loading) return null;
  if (!user)   return <Login />;

  const shared = { links, categories, onRefresh: loadAll };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Routes>
          <Route index                  element={<Dashboard  {...shared} />} />
          <Route path="profile"         element={<Profile />} />
          <Route path="links"           element={<Links      {...shared} />} />
          <Route path="categories"      element={<Categories {...shared} />} />
          <Route path="*"               element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
