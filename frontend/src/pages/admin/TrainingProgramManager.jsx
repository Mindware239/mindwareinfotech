import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../styles/design-system.css';

const TrainingProgramManager = () => {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    original_price: '',
    discount_percentage: '',
    duration: '',
    level: '',
    location: '',
    start_date: '',
    image: '',
    skills: [],
    learning_outcomes: [],
    prerequisites: [],
    curriculum: [],
    instructor: {
      name: '',
      title: '',
      bio: '',
      profilePicture: '',
      rating: '',
      students: '',
      courses: ''
    },
    is_featured: false,
    status: 'active'
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    // Mock data for now
    setPrograms([
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        category: 'web-development',
        price: 25000,
        duration: '6 months',
        level: 'Beginner',
        status: 'active',
        is_featured: true,
        students: 150
      },
      {
        id: 2,
        title: 'Advanced React & Redux Mastery',
        category: 'web-development',
        price: 15000,
        duration: '3 months',
        level: 'Intermediate',
        status: 'active',
        is_featured: true,
        students: 89
      }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProgram) {
      // Update existing program
      setPrograms(programs.map(p => p.id === editingProgram.id ? { ...p, ...formData } : p));
    } else {
      // Add new program
      const newProgram = { id: Date.now(), ...formData, students: 0 };
      setPrograms([...programs, newProgram]);
    }
    setShowModal(false);
    setEditingProgram(null);
    resetForm();
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData(program);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      original_price: '',
      discount_percentage: '',
      duration: '',
      level: '',
      location: '',
      start_date: '',
      image: '',
      skills: [],
      learning_outcomes: [],
      prerequisites: [],
      curriculum: [],
      instructor: {
        name: '',
        title: '',
        bio: '',
        profilePicture: '',
        rating: '',
        students: '',
        courses: ''
      },
      is_featured: false,
      status: 'active'
    });
  };

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      });
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Training Programs</h2>
          <p className="text-gray-600">Manage your training programs and courses</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          Add New Program
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program, index) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.status === 'active' ? 'bg-success text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {program.status}
                  </span>
                  {program.is_featured && (
                    <span className="px-2 py-1 bg-warning text-white rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(program)}
                    className="text-primary hover:text-primary-dark"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(program.id)}
                    className="text-error hover:text-error-dark"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{program.category}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">₹{program.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{program.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-semibold">{program.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-semibold">{program.students}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="btn btn-secondary btn-sm flex-1">
                  <i className="fas fa-eye"></i>
                  View
                </button>
                <button className="btn btn-primary btn-sm flex-1">
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingProgram ? 'Edit Program' : 'Add New Program'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-development">Mobile Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="ui-ux-design">UI/UX Design</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="e.g., 6 months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Additional Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g., Online, Delhi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Program</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Skills Management */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Skills</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('skills', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addArrayItem('skills', input.value);
                        input.value = '';
                      }}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('skills', index)}
                          className="text-white hover:text-gray-200"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Learning Outcomes</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a learning outcome"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('learning_outcomes', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addArrayItem('learning_outcomes', input.value);
                        input.value = '';
                      }}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.learning_outcomes.map((outcome, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                      >
                        <i className="fas fa-check text-success"></i>
                        <span className="flex-1">{outcome}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('learning_outcomes', index)}
                          className="text-error hover:text-error-dark"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TrainingProgramManager;
