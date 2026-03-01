
export type ComponentType = 'hero' | 'text' | 'image' | 'features' | 'footer';

export interface SiteComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
  components: SiteComponent[];
}

export interface SiteStore {
  sites: Record<string, Site>;
}
