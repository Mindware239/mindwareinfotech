import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  robots,
  structuredData,
  noindex = false,
  nofollow = false
}) => {
  // Default values
  const defaultTitle = 'Mindware India - Leading Software Training Institute';
  const defaultDescription = 'India\'s leading software training institute offering courses in web development, mobile development, data science, AI/ML, and more. Expert instructors, hands-on training, and job placement assistance.';
  const defaultKeywords = 'software training, web development, mobile development, data science, AI ML, programming courses, IT training, job placement, Mindware India';
  const defaultImage = '/mindware-logo.png';
  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

  // Use provided values or fallback to defaults
  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoOgTitle = ogTitle || title || defaultTitle;
  const seoOgDescription = ogDescription || description || defaultDescription;
  const seoOgImage = ogImage || defaultImage;
  const seoTwitterTitle = twitterTitle || title || defaultTitle;
  const seoTwitterDescription = twitterDescription || description || defaultDescription;
  const seoTwitterImage = twitterImage || ogImage || defaultImage;
  const seoCanonicalUrl = canonicalUrl || ogUrl;
  const seoRobots = robots || (noindex ? 'noindex' : 'index') + (nofollow ? ',nofollow' : ',follow');

  // Ensure image URLs are absolute
  const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return defaultImage;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${baseUrl}${imageUrl}`;
    return `${baseUrl}/${imageUrl}`;
  };

  const absoluteOgImage = getAbsoluteImageUrl(seoOgImage);
  const absoluteTwitterImage = getAbsoluteImageUrl(seoTwitterImage);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="robots" content={seoRobots} />
      <meta name="author" content="Mindware India" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Canonical URL */}
      {seoCanonicalUrl && <link rel="canonical" href={seoCanonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoOgTitle} />
      <meta property="og:description" content={seoOgDescription} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoOgTitle} />
      <meta property="og:url" content={seoCanonicalUrl || window.location.href} />
      <meta property="og:site_name" content="Mindware India" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mindwareindia" />
      <meta name="twitter:creator" content="@mindwareindia" />
      <meta name="twitter:title" content={seoTwitterTitle} />
      <meta name="twitter:description" content={seoTwitterDescription} />
      <meta name="twitter:image" content={absoluteTwitterImage} />
      <meta name="twitter:image:alt" content={seoTwitterTitle} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Mindware India" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Structured Data for Organization */}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Mindware India",
            "url": baseUrl,
            "logo": `${baseUrl}/mindware-logo.png`,
            "description": "India's leading software training institute offering comprehensive courses in web development, mobile development, data science, AI/ML, and more.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Tech Park",
              "addressLocality": "Mumbai",
              "addressRegion": "Maharashtra",
              "postalCode": "400001",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9876543210",
              "contactType": "customer service",
              "email": "info@mindwareindia.com"
            },
            "sameAs": [
              "https://www.facebook.com/mindwareindia",
              "https://www.twitter.com/mindwareindia",
              "https://www.linkedin.com/company/mindwareindia",
              "https://www.instagram.com/mindwareindia"
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
