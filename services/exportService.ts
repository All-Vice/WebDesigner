
import { Site } from '../types';

export const generateGitHubBundle = (site: Site): string => {
  const siteData = JSON.stringify(site);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${site.name}</title>
    <meta name="description" content="${site.description || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@^19.2.4",
        "react-dom": "https://esm.sh/react-dom@^19.2.4",
        "react-dom/client": "https://esm.sh/react-dom@^19.2.4/client"
      }
    }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="module">
        import React from 'react';
        import ReactDOM from 'react-dom/client';

        const site = ${siteData};

        const Hero = ({ props }) => React.createElement('section', { className: 'py-20 px-6 text-center bg-gray-50' }, [
            React.createElement('h1', { key: 'h1', className: 'text-5xl font-extrabold text-gray-900 mb-4' }, props.title || 'New Site'),
            React.createElement('p', { key: 'p', className: 'text-xl text-gray-600 max-w-2xl mx-auto' }, props.subtitle || '')
        ]);

        const TextBlock = ({ props }) => React.createElement('section', { className: 'py-12 px-6 max-w-3xl mx-auto' }, [
            React.createElement('h2', { key: 'h2', className: 'text-3xl font-bold mb-4' }, props.heading),
            React.createElement('p', { key: 'p', className: 'text-gray-700 leading-relaxed' }, props.content)
        ]);

        const FeatureBlock = ({ props }) => React.createElement('section', { className: 'py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto' }, 
            (props.items || []).map((item, i) => React.createElement('div', { key: i, className: 'p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow' }, [
                React.createElement('h3', { key: 'h3', className: 'text-xl font-bold mb-2' }, item.title),
                React.createElement('p', { key: 'p', className: 'text-gray-600' }, item.description)
            ]))
        );

        const Footer = ({ props }) => React.createElement('footer', { className: 'py-8 px-6 border-t mt-20 text-center text-gray-500' }, 
            React.createElement('p', null, props.text || '© 2024 Your Site')
        );

        const SiteRenderer = ({ site }) => {
            const renderComponent = (comp) => {
                const components = { hero: Hero, text: TextBlock, features: FeatureBlock, footer: Footer };
                const Comp = components[comp.type];
                return Comp ? React.createElement(Comp, { key: comp.id, props: comp.props }) : null;
            };
            return React.createElement('div', { style: { fontFamily: site.theme.fontFamily }, className: 'min-h-screen bg-white' }, 
                site.components.map(renderComponent)
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(SiteRenderer, { site }));
    </script>
</body>
</html>`;
};

export const downloadBundle = (site: Site) => {
  const content = generateGitHubBundle(site);
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
