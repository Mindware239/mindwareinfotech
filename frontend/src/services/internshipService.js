const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class InternshipService {
  // Get all internships
  async getInternships(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.featured) queryParams.append('featured', params.featured);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('search', params.search);
      
      const url = `${API_BASE_URL}/internships${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch internships');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching internships:', error);
      throw error;
    }
  }

  // Get internship by ID
  async getInternshipById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/internships/${id}`);
      if (!response.ok) throw new Error('Failed to fetch internship');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching internship:', error);
      throw error;
    }
  }

  // Get internships by category
  async getInternshipsByCategory(categorySlug) {
    try {
      const response = await fetch(`${API_BASE_URL}/internships?category=${categorySlug}&status=active`);
      if (!response.ok) throw new Error('Failed to fetch internships by category');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching internships by category:', error);
      throw error;
    }
  }

  // Get featured internships
  async getFeaturedInternships(limit = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/internships?featured=true&status=active&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch featured internships');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured internships:', error);
      throw error;
    }
  }

  // Get internship categories
  async getInternshipCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/course-categories/active`);
      if (!response.ok) throw new Error('Failed to fetch internship categories');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching internship categories:', error);
      throw error;
    }
  }

  // Search internships
  async searchInternships(query, filters = {}) {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('search', query);
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) searchParams.append(key, filters[key]);
      });
      
      const response = await fetch(`${API_BASE_URL}/internships?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to search internships');
      
      return await response.json();
    } catch (error) {
      console.error('Error searching internships:', error);
      throw error;
    }
  }

  // Get internship pricing info
  getInternshipPricing(internship) {
    const originalPrice = parseFloat(internship.original_price) || parseFloat(internship.price);
    const currentPrice = parseFloat(internship.price);
    const discountPercentage = parseFloat(internship.discount_percentage) || 0;
    
    const hasDiscount = discountPercentage > 0 && originalPrice > currentPrice;
    const savings = hasDiscount ? originalPrice - currentPrice : 0;
    
    return {
      originalPrice,
      currentPrice,
      discountPercentage,
      hasDiscount,
      savings,
      currency: internship.currency || 'INR',
      isFree: internship.is_free || currentPrice === 0,
      installmentAvailable: internship.installment_available || false,
      installmentCount: internship.installment_count || 1,
      enrollmentFee: parseFloat(internship.enrollment_fee) || 0
    };
  }

  // Format price for display
  formatPrice(price, currency = 'INR') {
    if (price === 0) return 'Free';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    
    return formatter.format(price);
  }

  // Get internship duration in readable format
  getInternshipDuration(internship) {
    const duration = internship.duration || 0;
    const durationUnit = internship.duration_unit || 'months';
    
    if (durationUnit === 'weeks') {
      if (duration < 4) {
        return `${duration} week${duration > 1 ? 's' : ''}`;
      } else {
        const months = Math.round(duration / 4);
        return `${months} month${months > 1 ? 's' : ''}`;
      }
    } else if (durationUnit === 'months') {
      return `${duration} month${duration > 1 ? 's' : ''}`;
    }
    
    return `${duration} ${durationUnit}`;
  }

  // Get internship type display
  getInternshipType(type) {
    const typeMap = {
      'remote': 'Remote',
      'onsite': 'On-site',
      'hybrid': 'Hybrid'
    };
    
    return typeMap[type] || type;
  }

  // Get internship status display
  getInternshipStatus(status) {
    const statusMap = {
      'draft': 'Draft',
      'active': 'Active',
      'paused': 'Paused',
      'closed': 'Closed',
      'completed': 'Completed'
    };
    
    return statusMap[status] || status;
  }

  // Apply for internship
  async applyForInternship(internshipId, applicationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/internships/${internshipId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });
      
      if (!response.ok) throw new Error('Failed to apply for internship');
      
      return await response.json();
    } catch (error) {
      console.error('Error applying for internship:', error);
      throw error;
    }
  }
}

export default new InternshipService();