// SEO utility functions

export const generateMetaTitle = (title, siteName = 'Mindware India', maxLength = 60) => {
  if (!title) return siteName;
  
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  return fullTitle.length > maxLength ? fullTitle.substring(0, maxLength - 3) + '...' : fullTitle;
};

export const generateMetaDescription = (description, maxLength = 160) => {
  if (!description) return 'India\'s leading software training institute offering courses in web development, mobile development, data science, AI/ML, and more. Expert instructors, hands-on training, and job placement assistance.';
  
  return description.length > maxLength ? description.substring(0, maxLength - 3) + '...' : description;
};

export const generateKeywords = (keywords, defaultKeywords = 'software training, web development, mobile development, data science, AI ML, programming courses, IT training, job placement, Mindware India') => {
  if (!keywords || keywords.length === 0) return defaultKeywords;
  
  if (Array.isArray(keywords)) {
    return keywords.join(', ');
  }
  
  return keywords;
};

export const generateStructuredData = (type, data) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
  
  switch (type) {
    case 'organization':
      return {
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
      };

    case 'course':
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": data.title,
        "description": data.description,
        "provider": {
          "@type": "Organization",
          "name": "Mindware India",
          "url": baseUrl
        },
        "courseMode": "online",
        "inLanguage": "en",
        "isAccessibleForFree": data.is_free || false,
        "offers": {
          "@type": "Offer",
          "price": data.price || 0,
          "priceCurrency": data.currency || "INR",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": data.rating ? {
          "@type": "AggregateRating",
          "ratingValue": data.rating.average,
          "ratingCount": data.rating.count
        } : undefined
      };

    case 'job':
      return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": data.title,
        "description": data.description,
        "datePosted": data.created_at,
        "validThrough": data.application_deadline,
        "employmentType": data.type,
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Mindware India",
          "url": baseUrl
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": data.location,
            "addressCountry": "IN"
          }
        },
        "baseSalary": data.salary_min ? {
          "@type": "MonetaryAmount",
          "currency": data.currency || "INR",
          "value": {
            "@type": "QuantitativeValue",
            "minValue": data.salary_min,
            "maxValue": data.salary_max,
            "unitText": "MONTH"
          }
        } : undefined
      };

    case 'event':
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": data.title,
        "description": data.description,
        "startDate": data.event_date,
        "location": {
          "@type": "Place",
          "name": data.location,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": data.location,
            "addressCountry": "IN"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "Mindware India",
          "url": baseUrl
        }
      };

    default:
      return null;
  }
};

export const getImageUrl = (image, defaultImage = '/mindware-logo.png') => {
  if (!image) return defaultImage;
  
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${process.env.REACT_APP_BASE_URL || 'http://localhost:3000'}${image}`;
  }
  
  if (typeof image === 'object' && image.url) {
    return image.url.startsWith('http') ? image.url : `${process.env.REACT_APP_BASE_URL || 'http://localhost:3000'}${image.url}`;
  }
  
  return defaultImage;
};

export const calculateReadingTime = (content) => {
  if (!content) return 1;
  
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const generateCanonicalUrl = (path, baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000') => {
  return `${baseUrl}${path}`;
};

export const validateSeoData = (seoData) => {
  const errors = {};
  
  if (seoData.meta_title && seoData.meta_title.length > 60) {
    errors.meta_title = 'Meta title should be 60 characters or less';
  }
  
  if (seoData.meta_description && seoData.meta_description.length > 160) {
    errors.meta_description = 'Meta description should be 160 characters or less';
  }
  
  if (seoData.og_title && seoData.og_title.length > 100) {
    errors.og_title = 'OG title should be 100 characters or less';
  }
  
  if (seoData.og_description && seoData.og_description.length > 200) {
    errors.og_description = 'OG description should be 200 characters or less';
  }
  
  if (seoData.twitter_title && seoData.twitter_title.length > 70) {
    errors.twitter_title = 'Twitter title should be 70 characters or less';
  }
  
  if (seoData.twitter_description && seoData.twitter_description.length > 200) {
    errors.twitter_description = 'Twitter description should be 200 characters or less';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateSitemapData = (pages) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
  
  return pages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastmod: page.lastmod || new Date().toISOString().split('T')[0],
    changefreq: page.changefreq || 'weekly',
    priority: page.priority || 0.5
  }));
};
