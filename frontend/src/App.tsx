import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Portfolio } from './pages/Portfolio';
import { Login } from './pages/Login';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/AdminLayout';

// Admin Sub-pages
import { Dashboard } from './pages/admin/Dashboard';
import { ManageProjects } from './pages/admin/ManageProjects';
import { ManageSkills } from './pages/admin/ManageSkills';
import { ManageCertificates } from './pages/admin/ManageCertificates';
import { ManageEducation } from './pages/admin/ManageEducation';
import { ManageProfile } from './pages/admin/ManageProfile';
import { ManageGallery } from './pages/admin/ManageGallery';
import { ManageMessages } from './pages/admin/ManageMessages';
import { ManageSettings } from './pages/admin/ManageSettings';

import { useLocation } from 'react-router-dom';

// Public Layout Wrapper (to show Header and Footer on landing page, but hide them in login/admin)
const PublicLayout: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeSection = searchParams.get('section');

  return (
    <>
      <Header />
      <Portfolio />
      {!activeSection && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<PublicLayout />} />
        
        {/* Admin Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="certificates" element={<ManageCertificates />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="profile" element={<ManageProfile />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
