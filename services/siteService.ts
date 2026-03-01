
import { Site, SiteStore } from '../types';
import { STORAGE_KEY } from '../constants';

export const getSiteStore = (): SiteStore => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { sites: {} };
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Critical: Failed to parse site store. Data may be corrupted.", e);
    return { sites: {} };
  }
};

export const saveSite = (site: Site): void => {
  const store = getSiteStore();
  store.sites[site.id] = {
    ...site,
    updatedAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const deleteSite = (id: string): void => {
  const store = getSiteStore();
  delete store.sites[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const findSiteBySlug = (slug: string): Site | undefined => {
  const store = getSiteStore();
  return Object.values(store.sites).find(s => s.slug === slug);
};
