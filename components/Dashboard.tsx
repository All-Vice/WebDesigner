
import React, { useState, useEffect } from 'react';
import { Site } from '../types';
import { getSiteStore, deleteSite } from '../services/siteService';

interface DashboardProps {
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onEdit, onCreate }) => {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    const store = getSiteStore();
    setSites(Object.values(store.sites));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this site? This action is irreversible.')) {
      deleteSite(id);
      setSites(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Project Forge</h1>
          <p className="text-gray-500 mt-2">Manage your isomorphic browser-hosted web projects.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Build New Site
        </button>
      </header>

      {sites.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed rounded-3xl bg-gray-50">
          <p className="text-gray-400 text-lg">No projects found. Start building today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map(site => (
            <div key={site.id} className="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-32 bg-gray-100 flex items-center justify-center border-b group-hover:bg-blue-50 transition-colors">
                <span className="text-4xl">🌐</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{site.name}</h3>
                <p className="text-sm text-gray-500 mb-4 truncate">/{site.slug}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(site.id)}
                    className="flex-1 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 text-sm font-medium"
                  >
                    Edit Layout
                  </button>
                  <a 
                    href={`#/host/${site.slug}`}
                    target="_blank"
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-50 text-sm text-center font-medium"
                  >
                    View Live
                  </a>
                  <button 
                    onClick={() => handleDelete(site.id)}
                    className="px-3 border border-red-100 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
