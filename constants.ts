
import { Site } from './types';

export const STORAGE_KEY = 'webforge_data_v1';

export const DEFAULT_SITE: Partial<Site> = {
  theme: {
    primaryColor: '#3b82f6',
    fontFamily: 'sans-serif'
  },
  components: [
    {
      id: 'initial-hero',
      type: 'hero',
      props: {
        title: 'Welcome to My New Site',
        subtitle: 'Built with WebForge Architecture'
      }
    }
  ]
};
