// src/config/seo.js
export const defaultSEO = {
    siteName: 'Visit Masvingo',
    locale: 'en_US',
    twitterHandle: '@visitmasvingo',
    fbAppId: '', // Add your Facebook App ID if you have one
    type: 'website',
    image: '/images/masvingo-properties-og.jpg', // Path to your default OG image
    url: import.meta.env.VITE_SITE_URL || 'https://visitmasvingo.com', // Updated for Vite
    themeColor: '#1e40af', // blue-800
    defaultTitle: 'Visit Masvingo - Premium Properties in Zimbabwe',
    defaultDescription: 'Discover luxury properties and real estate opportunities in Masvingo, Zimbabwe'
  };