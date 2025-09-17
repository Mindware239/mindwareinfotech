import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../styles/design-system.css';

const ContentManager = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({
    hero: {
      title: 'Master MERN Full Stack Development, Secure Top Placements: Your Future Starts Here!',
      subtitle: 'Curriculum designed and taught by Alumni from IITs & Leading Tech Companies.',
      ctaText: 'Know More ↓',
      backgroundImage: '',
      animationType: 'fade-in-up'
    },
    features: {
      title: 'Unlock Opportunities With 500+ Elite Hiring Partners',
      subtitle: 'Check out why our hiring partner trust us.',
      animationType: 'slide-in-left'
    },
    successStories: {
      title: 'Student Success Stories',
      subtitle: 'Real transformations from our students',
      stories: [
        {
          id: 1,
          name: 'Pradyot Verma',
          before: 'Mechanical Engineer',
          after: 'Software Developer',
          company: 'make my trip',
          image: '',
          animationType: 'fade-in-up'
        },
        {
          id: 2,
          name: 'Stuti Pandey',
          before: 'Btech',
          after: 'Software Engineer',
          company: 'Walmart',
          image: '',
          animationType: 'fade-in-up'
        }
      ]
    },
    courses: {
      title: 'Offline, Live Online and Self Paced courses tailored for you!',
      subtitle: 'Courses and placement assistance with 60+ hiring drives each month to help you land your dream tech job!',
      animationType: 'fade-in-up'
    },
    placement: {
      title: 'Our Dedicated Placement Team Is Committed To Get You A Job',
      subtitle: 'PLACEMENT WORRIES?',
      features: [
        {
          title: 'EXCLUSIVE ACCESS TO OUR PARTNER COMPANIES',
          icon: 'fas fa-building',
          animationType: 'slide-in-left'
        },
        {
          title: '1V1 EXPERTS SESSIONS',
          icon: 'fas fa-graduation-cap',
          animationType: 'slide-in-right'
        },
        {
          title: 'RESUME, LINKEDIN, PORTFOLIO BUILDING',
          icon: 'fas fa-file-alt',
          animationType: 'slide-in-left'
        },
        {
          title: 'SOFT SKILLS, HR INTERVIEW & APTITUDE TRAINING',
          icon: 'fas fa-lightbulb',
          animationType: 'slide-in-right'
        }
      ]
    }
  });

  const [editingStory, setEditingStory] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, []);

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: 'fas fa-home' },
    { id: 'features', name: 'Features', icon: 'fas fa-star' },
    { id: 'successStories', name: 'Success Stories', icon: 'fas fa-users' },
    { id: 'courses', name: 'Courses', icon: 'fas fa-graduation-cap' },
    { id: 'placement', name: 'Placement', icon: 'fas fa-briefcase' }
  ];

  const animationTypes = [
    { value: 'fade-in-up', label: 'Fade In Up' },
    { value: 'fade-in-down', label: 'Fade In Down' },
    { value: 'fade-in-left', label: 'Fade In Left' },
    { value: 'fade-in-right', label: 'Fade In Right' },
    { value: 'slide-in-up', label: 'Slide In Up' },
    { value: 'slide-in-down', label: 'Slide In Down' },
    { value: 'slide-in-left', label: 'Slide In Left' },
    { value: 'slide-in-right', label: 'Slide In Right' },
    { value: 'scale-in', label: 'Scale In' },
    { value: 'zoom-in', label: 'Zoom In' }
  ];

  const handleContentChange = (section, field, value) => {
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [field]: value
      }
    });
  };

  const handleStoryChange = (field, value) => {
    setEditingStory({
      ...editingStory,
      [field]: value
    });
  };

  const saveStory = () => {
    if (editingStory.id) {
      // Update existing story
      setContent({
        ...content,
        successStories: {
          ...content.successStories,
          stories: content.successStories.stories.map(story => 
            story.id === editingStory.id ? editingStory : story
          )
        }
      });
    } else {
      // Add new story
      const newStory = { ...editingStory, id: Date.now() };
      setContent({
        ...content,
        successStories: {
          ...content.successStories,
          stories: [...content.successStories.stories, newStory]
        }
      });
    }
    setShowStoryModal(false);
    setEditingStory(null);
  };

  const deleteStory = (id) => {
    setContent({
      ...content,
      successStories: {
        ...content.successStories,
        stories: content.successStories.stories.filter(story => story.id !== id)
      }
    });
  };

  const addStory = () => {
    setEditingStory({
      name: '',
      before: '',
      after: '',
      company: '',
      image: '',
      animationType: 'fade-in-up'
    });
    setShowStoryModal(true);
  };

  const editStory = (story) => {
    setEditingStory(story);
    setShowStoryModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Content Management</h2>
        <p className="text-gray-600">Manage your website content, animations, and visual elements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <div className="card-body p-0">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className={`${section.icon} w-5`}></i>
                    <span className="font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Hero Section</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                      <input
                        type="text"
                        value={content.hero.title}
                        onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <textarea
                        value={content.hero.subtitle}
                        onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action Text</label>
                      <input
                        type="text"
                        value={content.hero.ctaText}
                        onChange={(e) => handleContentChange('hero', 'ctaText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                      <input
                        type="url"
                        value={content.hero.backgroundImage}
                        onChange={(e) => handleContentChange('hero', 'backgroundImage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Animation Type</label>
                      <select
                        value={content.hero.animationType}
                        onChange={(e) => handleContentChange('hero', 'animationType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {animationTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Stories Section */}
          {activeSection === 'successStories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Success Stories</h3>
                <button onClick={addStory} className="btn btn-primary">
                  <i className="fas fa-plus"></i>
                  Add Story
                </button>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={content.successStories.title}
                        onChange={(e) => handleContentChange('successStories', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                      <input
                        type="text"
                        value={content.successStories.subtitle}
                        onChange={(e) => handleContentChange('successStories', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.successStories.stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {story.name.charAt(0)}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => editStory(story)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => deleteStory(story.id)}
                            className="text-error hover:text-error-dark"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-gray-800 mb-2">{story.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-error text-white px-2 py-1 rounded text-xs">Before</span>
                          <span>{story.before}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-arrow-right text-primary"></i>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-success text-white px-2 py-1 rounded text-xs">After</span>
                          <span>{story.after}</span>
                        </div>
                        <div className="text-gray-600">
                          <i className="fas fa-building mr-1"></i>
                          {story.company}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Other sections would be implemented similarly */}
          {activeSection === 'features' && (
            <div className="card">
              <div className="card-body">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Features Section</h3>
                <p className="text-gray-600">Features management interface will be implemented here.</p>
              </div>
            </div>
          )}

          {activeSection === 'courses' && (
            <div className="card">
              <div className="card-body">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Courses Section</h3>
                <p className="text-gray-600">Courses management interface will be implemented here.</p>
              </div>
            </div>
          )}

          {activeSection === 'placement' && (
            <div className="card">
              <div className="card-body">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Placement Section</h3>
                <p className="text-gray-600">Placement management interface will be implemented here.</p>
              </div>
            </div>
          )}
        </motion.main>
      </div>

      {/* Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingStory?.id ? 'Edit Story' : 'Add New Story'}
                </h3>
                <button 
                  onClick={() => setShowStoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={editingStory?.name || ''}
                    onChange={(e) => handleStoryChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={editingStory?.company || ''}
                    onChange={(e) => handleStoryChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Before Role</label>
                  <input
                    type="text"
                    value={editingStory?.before || ''}
                    onChange={(e) => handleStoryChange('before', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">After Role</label>
                  <input
                    type="text"
                    value={editingStory?.after || ''}
                    onChange={(e) => handleStoryChange('after', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                <input
                  type="url"
                  value={editingStory?.image || ''}
                  onChange={(e) => handleStoryChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Animation Type</label>
                <select
                  value={editingStory?.animationType || 'fade-in-up'}
                  onChange={(e) => handleStoryChange('animationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {animationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowStoryModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStory}
                  className="btn btn-primary"
                >
                  {editingStory?.id ? 'Update Story' : 'Add Story'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
