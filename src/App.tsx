import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import BrandMarketing from './pages/BrandMarketing';
import AITechnology from './pages/AITechnology';
import BusinessFunding from './pages/BusinessFunding';
import RealEstateTitleServices from './pages/RealEstateTitleServices';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import ContentEditor from './pages/admin/ContentEditor';
import SettingsEditor from './pages/admin/SettingsEditor';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main id="main-content">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brand-marketing" element={<BrandMarketing />} />
          <Route path="/ai-technology" element={<AITechnology />} />
          <Route path="/business-funding" element={<BusinessFunding />} />
          <Route path="/real-estate-title-services" element={<RealEstateTitleServices />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="settings" element={<SettingsEditor />} />
          </Route>
        </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;