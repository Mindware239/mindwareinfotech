// Utility functions for handling image URLs

/**
 * Get the full image URL for backend-served images
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The full URL for the image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // For uploads, use the backend URL directly
  if (imageUrl.startsWith('/uploads/')) {
    return `http://localhost:5000${imageUrl}`;
  }
  
  // Use React backend URL for other images
  const baseUrl = 'http://localhost:5000';
  return `${baseUrl}${imageUrl}`;
};

/**
 * Get the full image URL for featured images in blogs
 * @param {string|object} featuredImage - The featured image data from the database
 * @returns {string} - The full URL for the image
 */
export const getBlogImageUrl = (featuredImage) => {
  if (!featuredImage) return '/images/blog-placeholder.jpg';
  
  if (typeof featuredImage === 'string') {
    // Handle JSON string format
    if (featuredImage.startsWith('{')) {
      try {
        const parsed = JSON.parse(featuredImage);
        if (parsed.url) {
          return parsed.url.startsWith('http') ? parsed.url : getImageUrl(parsed.url);
        }
      } catch (e) {
        // If parsing fails, treat as regular string
      }
    }
    
    // Handle regular string format
    if (featuredImage.startsWith('http')) {
      return featuredImage;
    }
    
    // If it starts with /uploads/, it's a backend image
    if (featuredImage.startsWith('/uploads/')) {
      return getImageUrl(featuredImage);
    }
    
    // If it starts with /images/, it's a frontend image (might not exist)
    if (featuredImage.startsWith('/images/')) {
      return getImageUrl(featuredImage);
    }
    
    // Default case
    return getImageUrl(featuredImage);
  }
  
  // Handle object format
  if (typeof featuredImage === 'object' && featuredImage.url) {
    return featuredImage.url.startsWith('http') ? featuredImage.url : getImageUrl(featuredImage.url);
  }
  
  return '/images/blog-placeholder.jpg';
};

/**
 * Get the full image URL for gallery images
 * @param {array|string} images - The images data from the database
 * @returns {string} - The full URL for the first image
 */
export const getGalleryImageUrl = (images) => {
  if (!images) return '';
  
  let imageArray = images;
  if (typeof images === 'string') {
    try {
      imageArray = JSON.parse(images);
    } catch (e) {
      return '';
    }
  }
  
  if (!Array.isArray(imageArray) || imageArray.length === 0) return '';
  
  const firstImage = imageArray[0];
  if (!firstImage || !firstImage.url) return '';
  
  return getImageUrl(firstImage.url);
};

/**
 * Get the full image URL for testimonial client images
 * @param {string} clientImage - The client image URL from the database
 * @returns {string} - The full URL for the image
 */
export const getTestimonialImageUrl = (clientImage) => {
  if (!clientImage) return '';
  return clientImage.startsWith('http') ? clientImage : getImageUrl(clientImage);
};

/**
 * Handle image load error by setting a fallback
 * @param {Event} e - The error event
 * @param {string} fallbackSrc - The fallback image source
 */
export const handleImageError = (e, fallbackSrc = '/images/placeholder.jpg') => {
  e.target.src = fallbackSrc;
};

/**
 * Handle image load error for testimonials (hide image and show placeholder)
 * @param {Event} e - The error event
 */
export const handleTestimonialImageError = (e) => {
  e.target.style.display = 'none';
  if (e.target.nextSibling) {
    e.target.nextSibling.style.display = 'flex';
  }
};
