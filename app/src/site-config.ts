// Set VITE_SITE_URL to the final domain before a production build.
export const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://boldtake-studio.vercel.app').replace(/\/$/, '');
