import React, { useState, useEffect } from 'react';
import './SEOForm.css';

const SEOForm = ({ 
  data = {}, 
  onChange, 
  title = '', 
  description = '', 
  excerpt = '',
  featuredImage = null,
  showAdvanced = true 
}) => {
  const [seoData, setSeoData] = useState({
    meta_title: data.meta_title || '',
    meta_description: data.meta_description || '',
    meta_keywords: data.meta_keywords || '',
    og_title: data.og_title || '',
    og_description: data.og_description || '',
    og_image: data.og_image || null,
    twitter_title: data.twitter_title || '',
    twitter_description: data.twitter_description || '',
    twitter_image: data.twitter_image || null,
    canonical_url: data.canonical_url || '',
    robots_meta: data.robots_meta || 'index, follow',
    focus_keyword: data.focus_keyword || '',
    seo_score: data.seo_score || 0
  });

  const [autoGenerate, setAutoGenerate] = useState(true);

  // Auto-generate SEO fields when title or description changes
  useEffect(() => {
    if (autoGenerate && (title || description || excerpt)) {
      const newSeoData = { ...seoData };
      
      if (title && !seoData.meta_title) {
        newSeoData.meta_title = title.length > 60 ? title.substring(0, 57) + '...' : title;
      }
      
      if ((description || excerpt) && !seoData.meta_description) {
        const desc = description || excerpt;
        newSeoData.meta_description = desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
      }
      
      if (title && !seoData.og_title) {
        newSeoData.og_title = title.length > 100 ? title.substring(0, 97) + '...' : title;
      }
      
      if ((description || excerpt) && !seoData.og_description) {
        const desc = description || excerpt;
        newSeoData.og_description = desc.length > 200 ? desc.substring(0, 197) + '...' : desc;
      }
      
      if (title && !seoData.twitter_title) {
        newSeoData.twitter_title = title.length > 70 ? title.substring(0, 67) + '...' : title;
      }
      
      if ((description || excerpt) && !seoData.twitter_description) {
        const desc = description || excerpt;
        newSeoData.twitter_description = desc.length > 200 ? desc.substring(0, 197) + '...' : desc;
      }
      
      setSeoData(newSeoData);
      if (onChange) onChange(newSeoData);
    }
  }, [title, description, excerpt, autoGenerate]);

  const handleChange = (field, value) => {
    const newSeoData = { ...seoData, [field]: value };
    setSeoData(newSeoData);
    if (onChange) onChange(newSeoData);
  };

  const calculateSeoScore = () => {
    let score = 0;
    const checks = [
      { field: 'meta_title', weight: 20, maxLength: 60 },
      { field: 'meta_description', weight: 20, maxLength: 160 },
      { field: 'meta_keywords', weight: 10, minLength: 10 },
      { field: 'og_title', weight: 15, maxLength: 100 },
      { field: 'og_description', weight: 15, maxLength: 200 },
      { field: 'focus_keyword', weight: 10, minLength: 2 },
      { field: 'canonical_url', weight: 10, minLength: 10 }
    ];

    checks.forEach(check => {
      const value = seoData[check.field];
      if (value) {
        if (check.maxLength && value.length <= check.maxLength) {
          score += check.weight;
        } else if (check.minLength && value.length >= check.minLength) {
          score += check.weight;
        } else {
          score += check.weight * 0.5;
        }
      }
    });

    return Math.min(100, Math.max(0, score));
  };

  const seoScore = calculateSeoScore();

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="seo-form">
      <div className="seo-form-header">
        <h3>SEO Settings</h3>
        <div className="seo-score">
          <span className="score-label">SEO Score:</span>
          <span 
            className="score-value" 
            style={{ color: getScoreColor(seoScore) }}
          >
            {seoScore}/100
          </span>
        </div>
      </div>

      <div className="seo-form-content">
        {/* Auto-generate toggle */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
            />
            Auto-generate SEO fields from title and description
          </label>
        </div>

        {/* Basic SEO Fields */}
        <div className="seo-section">
          <h4>Basic SEO</h4>
          
          <div className="form-group">
            <label htmlFor="meta_title">
              Meta Title <span className="required">*</span>
              <span className="char-count">{seoData.meta_title.length}/60</span>
            </label>
            <input
              type="text"
              id="meta_title"
              value={seoData.meta_title}
              onChange={(e) => handleChange('meta_title', e.target.value)}
              maxLength={60}
              placeholder="Enter meta title (max 60 characters)"
              className={seoData.meta_title.length > 60 ? 'error' : ''}
            />
            <small>This appears in search engine results as the clickable headline.</small>
          </div>

          <div className="form-group">
            <label htmlFor="meta_description">
              Meta Description <span className="required">*</span>
              <span className="char-count">{seoData.meta_description.length}/160</span>
            </label>
            <textarea
              id="meta_description"
              value={seoData.meta_description}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Enter meta description (max 160 characters)"
              className={seoData.meta_description.length > 160 ? 'error' : ''}
            />
            <small>This appears as the description in search engine results.</small>
          </div>

          <div className="form-group">
            <label htmlFor="meta_keywords">
              Meta Keywords
              <span className="char-count">{seoData.meta_keywords.length}/500</span>
            </label>
            <input
              type="text"
              id="meta_keywords"
              value={seoData.meta_keywords}
              onChange={(e) => handleChange('meta_keywords', e.target.value)}
              maxLength={500}
              placeholder="Enter keywords separated by commas"
            />
            <small>Enter 4-8 relevant keywords separated by commas.</small>
          </div>

          <div className="form-group">
            <label htmlFor="focus_keyword">Focus Keyword</label>
            <input
              type="text"
              id="focus_keyword"
              value={seoData.focus_keyword}
              onChange={(e) => handleChange('focus_keyword', e.target.value)}
              placeholder="Enter primary keyword for this content"
            />
            <small>The main keyword you want to rank for.</small>
          </div>

          <div className="form-group">
            <label htmlFor="canonical_url">Canonical URL</label>
            <input
              type="url"
              id="canonical_url"
              value={seoData.canonical_url}
              onChange={(e) => handleChange('canonical_url', e.target.value)}
              placeholder="https://example.com/canonical-url"
            />
            <small>Preferred URL for this content (optional).</small>
          </div>

          <div className="form-group">
            <label htmlFor="robots_meta">Robots Meta</label>
            <select
              id="robots_meta"
              value={seoData.robots_meta}
              onChange={(e) => handleChange('robots_meta', e.target.value)}
            >
              <option value="index, follow">Index, Follow</option>
              <option value="index, nofollow">Index, No Follow</option>
              <option value="noindex, follow">No Index, Follow</option>
              <option value="noindex, nofollow">No Index, No Follow</option>
            </select>
            <small>Tell search engines how to handle this page.</small>
          </div>
        </div>

        {showAdvanced && (
          <>
            {/* Open Graph Fields */}
            <div className="seo-section">
              <h4>Open Graph (Facebook, LinkedIn)</h4>
              
              <div className="form-group">
                <label htmlFor="og_title">
                  OG Title
                  <span className="char-count">{seoData.og_title.length}/100</span>
                </label>
                <input
                  type="text"
                  id="og_title"
                  value={seoData.og_title}
                  onChange={(e) => handleChange('og_title', e.target.value)}
                  maxLength={100}
                  placeholder="Enter Open Graph title"
                />
                <small>Title for social media sharing.</small>
              </div>

              <div className="form-group">
                <label htmlFor="og_description">
                  OG Description
                  <span className="char-count">{seoData.og_description.length}/200</span>
                </label>
                <textarea
                  id="og_description"
                  value={seoData.og_description}
                  onChange={(e) => handleChange('og_description', e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder="Enter Open Graph description"
                />
                <small>Description for social media sharing.</small>
              </div>

              <div className="form-group">
                <label htmlFor="og_image">OG Image</label>
                <input
                  type="url"
                  id="og_image"
                  value={seoData.og_image?.url || ''}
                  onChange={(e) => handleChange('og_image', { url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <small>Image for social media sharing (1200x630px recommended).</small>
              </div>
            </div>

            {/* Twitter Card Fields */}
            <div className="seo-section">
              <h4>Twitter Card</h4>
              
              <div className="form-group">
                <label htmlFor="twitter_title">
                  Twitter Title
                  <span className="char-count">{seoData.twitter_title.length}/70</span>
                </label>
                <input
                  type="text"
                  id="twitter_title"
                  value={seoData.twitter_title}
                  onChange={(e) => handleChange('twitter_title', e.target.value)}
                  maxLength={70}
                  placeholder="Enter Twitter title"
                />
                <small>Title for Twitter sharing.</small>
              </div>

              <div className="form-group">
                <label htmlFor="twitter_description">
                  Twitter Description
                  <span className="char-count">{seoData.twitter_description.length}/200</span>
                </label>
                <textarea
                  id="twitter_description"
                  value={seoData.twitter_description}
                  onChange={(e) => handleChange('twitter_description', e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder="Enter Twitter description"
                />
                <small>Description for Twitter sharing.</small>
              </div>

              <div className="form-group">
                <label htmlFor="twitter_image">Twitter Image</label>
                <input
                  type="url"
                  id="twitter_image"
                  value={seoData.twitter_image?.url || ''}
                  onChange={(e) => handleChange('twitter_image', { url: e.target.value })}
                  placeholder="https://example.com/twitter-image.jpg"
                />
                <small>Image for Twitter sharing (1200x600px recommended).</small>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SEOForm;
