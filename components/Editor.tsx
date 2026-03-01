
import React, { useState } from 'react';
import { Site, SiteComponent, ComponentType } from '../types';
import { SiteRenderer } from './SiteRenderer';
import { saveSite } from '../services/siteService';
import { downloadBundle } from '../services/exportService';

interface EditorProps {
  initialSite: Site;
  onExit: () => void;
}

export const Editor: React.FC<EditorProps> = ({ initialSite, onExit }) => {
  const [site, setSite] = useState<Site>(initialSite);
  const [activeTab, setActiveTab] = useState<'build' | 'preview'>('build');
  const [showExportModal, setShowExportModal] = useState(false);

  const updateSite = (updates: Partial<Site>) => {
    setSite(prev => ({ ...prev, ...updates }));
  };

  const addComponent = (type: ComponentType) => {
    const newComp: SiteComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      props: type === 'features' ? { items: [{title: 'Fast', description: 'Optimized for GitHub Pages'}] } : { title: 'New Section', content: 'Describe your project here...' }
    };
    updateSite({ components: [...site.components, newComp] });
  };

  const removeComponent = (id: string) => {
    updateSite({ components: site.components.filter(c => c.id !== id) });
  };

  const updateComponentProps = (id: string, newProps: any) => {
    updateSite({
      components: site.components.map(c => c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c)
    });
  };

  const handlePublish = () => {
    saveSite(site);
    alert('Progress saved to browser storage.');
  };

  const handleExport = () => {
    downloadBundle(site);
    setShowExportModal(true);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      <nav className="h-16 border-b flex items-center justify-between px-6 bg-white z-20">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">←</button>
          <div className="flex flex-col">
            <input 
              value={site.name} 
              onChange={e => updateSite({ name: e.target.value })}
              className="font-bold text-sm bg-transparent border-none focus:ring-0 p-0"
            />
            <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">Forge Workspace</span>
          </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('build')}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'build' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            EDITOR
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            BROWSER PREVIEW
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePublish}
            className="text-gray-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50"
          >
            SAVE DRAFT
          </button>
          <button 
            onClick={handleExport}
            className="bg-black text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-gray-900 flex items-center gap-2 transition-transform active:scale-95"
          >
            <span>EXPORT FOR GITHUB</span>
            <span className="bg-white/20 px-1 rounded text-[10px]">.html</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'build' ? (
          <>
            <aside className="w-72 border-r bg-white overflow-y-auto p-6">
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Repository Config</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 mb-1 block">Subdomain / Slug</label>
                    <div className="flex items-center gap-1 bg-gray-50 border p-2 rounded-lg font-mono text-xs text-gray-400">
                      <span>/</span>
                      <input 
                        value={site.slug} 
                        onChange={e => updateSite({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="bg-transparent border-none focus:ring-0 p-0 text-gray-900 w-full"
                        placeholder="site-slug"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Library</h4>
              <div className="grid grid-cols-1 gap-2">
                {(['hero', 'text', 'features', 'footer'] as ComponentType[]).map(type => (
                  <button 
                    key={type}
                    onClick={() => addComponent(type)}
                    className="group flex items-center gap-3 p-3 border rounded-xl text-left hover:border-black transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm group-hover:bg-black group-hover:text-white transition-colors">
                      {type === 'hero' ? 'H' : type === 'text' ? 'T' : type === 'features' ? 'F' : 'B'}
                    </div>
                    <div className="text-[11px] font-bold text-gray-700 capitalize">{type} block</div>
                  </button>
                ))}
              </div>
            </aside>

            <main className="flex-1 bg-gray-50 overflow-y-auto p-12">
              <div className="max-w-xl mx-auto space-y-3">
                {site.components.map((comp) => (
                  <div key={comp.id} className="bg-white border rounded-xl p-5 shadow-sm group hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{comp.type} node</span>
                      <button onClick={() => removeComponent(comp.id)} className="text-gray-200 hover:text-red-500 text-xs">remove</button>
                    </div>
                    
                    <div className="space-y-3">
                      {comp.type === 'hero' && (
                        <>
                          <input 
                            placeholder="Primary Heading" 
                            className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-white transition-colors outline-none border"
                            value={comp.props.title || ''}
                            onChange={e => updateComponentProps(comp.id, { title: e.target.value })}
                          />
                          <textarea 
                            placeholder="Sub-copy..." 
                            className="w-full bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 resize-none min-h-[60px] focus:bg-white transition-colors outline-none border"
                            value={comp.props.subtitle || ''}
                            onChange={e => updateComponentProps(comp.id, { subtitle: e.target.value })}
                          />
                        </>
                      )}
                      {comp.type === 'text' && (
                        <>
                          <input 
                            placeholder="Section Title" 
                            className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold focus:bg-white transition-colors outline-none border"
                            value={comp.props.heading || ''}
                            onChange={e => updateComponentProps(comp.id, { heading: e.target.value })}
                          />
                          <textarea 
                            placeholder="Content text..." 
                            className="w-full bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 min-h-[100px] focus:bg-white transition-colors outline-none border"
                            value={comp.props.content || ''}
                            onChange={e => updateComponentProps(comp.id, { content: e.target.value })}
                          />
                        </>
                      )}
                      {comp.type === 'footer' && (
                        <input 
                          placeholder="Legal / Copyright" 
                          className="w-full bg-gray-50 rounded-lg px-3 py-2 text-xs focus:bg-white transition-colors outline-none border"
                          value={comp.props.text || ''}
                          onChange={e => updateComponentProps(comp.id, { text: e.target.value })}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </>
        ) : (
          <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
             <div className="max-w-[1200px] mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[90vh]">
                <SiteRenderer site={site} />
             </div>
          </main>
        )}
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Ready for GitHub!</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              I've generated a standalone <span className="font-mono bg-gray-100 px-1 rounded">index.html</span> for you. It contains all functions and styles.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</div>
                <p className="text-[12px]">Create a new repository on GitHub.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</div>
                <p className="text-[12px]">Upload the downloaded <span className="font-bold">index.html</span> file.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</div>
                <p className="text-[12px]">Go to Settings &gt; Pages and set branch to <span className="font-bold">main</span>.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowExportModal(false)}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
