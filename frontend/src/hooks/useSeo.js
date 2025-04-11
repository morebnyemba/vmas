import { useEffect } from 'react';

const useSEO = ({ 
  title = '', 
  description = '', 
  url = '', 
  image = '', 
  type = 'website', 
  keywords = '', 
  canonicalUrl = '',
  noindex = false,
  structuredData = null,
  locale = 'en_US',
  siteName = 'Visit Masvingo',
  twitterHandle = '',
  fbAppId = '',
  themeColor = '#1e40af'
}) => {
  useEffect(() => {
    try {
      // New helper function to find meta tags safely
      const findMetaTag = (attrName, attrValue) => {
        const metas = document.getElementsByTagName('meta');
        for (let i = 0; i < metas.length; i++) {
          if (metas[i].getAttribute(attrName) === attrValue) {
            return metas[i];
          }
        }
        return null;
      };

      // Updated helper function to update or create meta tags
      const updateMetaTag = (attrName, attrValue, content) => {
        if (content === undefined || content === null) return;
        
        let tag = findMetaTag(attrName, attrValue);
        
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute(attrName, attrValue);
          document.head.appendChild(tag);
        }
        
        tag.setAttribute('content', content);
      };

      // Set document title with fallback
      const finalTitle = title || 'Premium Properties in Masvingo, Zimbabwe';
      document.title = `${finalTitle}${finalTitle.includes('|') ? '' : ` | ${siteName}`}`;

      // Set description with fallback
      const finalDescription = description || 'Discover luxury real estate opportunities in Masvingo with our expert team';

      // Standard meta tags
      updateMetaTag('name', 'description', finalDescription);
      if (keywords) updateMetaTag('name', 'keywords', keywords);
      
      // OpenGraph/Facebook meta tags
      updateMetaTag('property', 'og:title', finalTitle);
      updateMetaTag('property', 'og:description', finalDescription);
      updateMetaTag('property', 'og:type', type);
      updateMetaTag('property', 'og:url', url || window.location.href);
      if (image) updateMetaTag('property', 'og:image', image);
      updateMetaTag('property', 'og:locale', locale);
      updateMetaTag('property', 'og:site_name', siteName);
      
      // Facebook App ID
      if (fbAppId) {
        updateMetaTag('property', 'fb:app_id', fbAppId);
      }
      
      // Twitter meta tags
      updateMetaTag('name', 'twitter:card', 'summary_large_image');
      updateMetaTag('name', 'twitter:title', finalTitle);
      updateMetaTag('name', 'twitter:description', finalDescription);
      if (image) updateMetaTag('name', 'twitter:image', image);
      
      if (twitterHandle) {
        updateMetaTag('name', 'twitter:site', twitterHandle);
        updateMetaTag('name', 'twitter:creator', twitterHandle);
      }
      
      // Robots meta tag
      updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
      
      // Canonical URL
      let canonicalLink = document.querySelector("link[rel='canonical']");
      const finalCanonicalUrl = canonicalUrl || url || window.location.href;
      if (finalCanonicalUrl) {
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', finalCanonicalUrl);
      }

      // Handle structured data
      if (structuredData) {
        // Remove existing structured data
        document.querySelectorAll('script[type="application/ld+json"]')
          .forEach(el => el.remove());

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }

      // Additional recommended tags
      updateMetaTag('name', 'theme-color', themeColor);
      updateMetaTag('name', 'mobile-web-app-capable', 'yes');
      updateMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
      updateMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'black-translucent');

    } catch (error) {
      console.error('Error updating SEO tags:', error);
    }
  }, [
    title, 
    description, 
    url, 
    image, 
    type, 
    keywords, 
    canonicalUrl, 
    noindex, 
    structuredData,
    locale,
    siteName,
    twitterHandle,
    fbAppId,
    themeColor
  ]);
};

export default useSEO;