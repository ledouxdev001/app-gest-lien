import { Routes, Route } from 'react-router-dom';
import PublicSite   from './pages/PublicSite';
import AdminLayout  from './pages/AdminLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<PublicSite />} />
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  );
}
