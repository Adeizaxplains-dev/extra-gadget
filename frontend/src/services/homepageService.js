import { api } from './api.js';

// Public storefront homepage configuration
export const getHomepageContent = () =>
  api.get('/homepage').then((r) => r.data);

// Admin: retrieve the full configuration
export const getHomepageContentForAdmin = () =>
  api.get('/homepage/admin').then((r) => r.data);

// Admin: save homepage configuration
export const saveHomepageContent = (payload) =>
  api.put('/homepage', payload).then((r) => r.data);

// Admin: restore the default configuration
export const resetHomepageContent = () =>
  api.post('/homepage/reset').then((r) => r.data);