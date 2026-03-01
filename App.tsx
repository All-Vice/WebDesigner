
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { SiteRenderer } from './components/SiteRenderer';
import { Site } from './types';
import { getSiteStore, findSiteBySlug } from './services/siteService';
import { DEFAULT_SITE } from './constants';

const MainView: React.FC = () => {
  const navigate = useNavigate();
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const handleCreate = () => {
    const newSite: Site = {
      ...DEFAULT_SITE as Site,
      id: Math.random().toString(36).substr(2, 9),
      name: 'My New Website',
      slug: `site-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setEditingSite(newSite);
  };

  const handleEdit = (id: string) => {
    const store = getSiteStore();
    const site = store.sites[id];
    if (site) setEditingSite(site);
  };

  if (editingSite) {
    return <Editor initialSite={editingSite} onExit={() => setEditingSite(null)} />;
  }

  return <Dashboard onEdit={handleEdit} onCreate={handleCreate} />;
};

const HostedView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<Site | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const found = findSiteBySlug(slug);
      setSite(found);
    }
    setLoading(false);
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Locating virtual host...</div>;
  if (!site) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-12 text-center">
      <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800">Host Not Found</h2>
      <p className="text-gray-500 mt-2">The requested site does not exist on this browser's forge.</p>
      <a href="/" className="mt-8 text-blue-600 font-medium">Return to Dashboard</a>
    </div>
  );

  return <SiteRenderer site={site} />;
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/host/:slug" element={<HostedView />} />
      </Routes>
    </HashRouter>
  );
}
