
import React from 'react';
import { Site, SiteComponent } from '../types';

interface SiteRendererProps {
  site: Site;
}

const Hero: React.FC<{ props: any }> = ({ props }) => (
  <section className="py-20 px-6 text-center bg-gray-50">
    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{props.title || 'New Site'}</h1>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">{props.subtitle || 'Built with WebForge'}</p>
  </section>
);

const TextBlock: React.FC<{ props: any }> = ({ props }) => (
  <section className="py-12 px-6 max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">{props.heading}</h2>
    <p className="text-gray-700 leading-relaxed">{props.content}</p>
  </section>
);

const FeatureBlock: React.FC<{ props: any }> = ({ props }) => (
  <section className="py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {(props.items || []).map((item: any, i: number) => (
      <div key={i} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
        <p className="text-gray-600">{item.description}</p>
      </div>
    ))}
  </section>
);

const Footer: React.FC<{ props: any }> = ({ props }) => (
  <footer className="py-8 px-6 border-t mt-20 text-center text-gray-500">
    <p>{props.text || '© 2024 Your Site'}</p>
  </footer>
);

export const SiteRenderer: React.FC<SiteRendererProps> = ({ site }) => {
  const renderComponent = (comp: SiteComponent) => {
    switch (comp.type) {
      case 'hero': return <Hero key={comp.id} props={comp.props} />;
      case 'text': return <TextBlock key={comp.id} props={comp.props} />;
      case 'features': return <FeatureBlock key={comp.id} props={comp.props} />;
      case 'footer': return <Footer key={comp.id} props={comp.props} />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: site.theme.fontFamily }} className="min-h-screen bg-white">
      {site.components.map(renderComponent)}
    </div>
  );
};
