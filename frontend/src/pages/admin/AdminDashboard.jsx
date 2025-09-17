import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../styles/design-system.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalStudents: 0,
    totalRevenue: 0,
    activeEnrollments: 0
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'fas fa-chart-pie' },
    { id: 'programs', name: 'Training Programs', icon: 'fas fa-graduation-cap' },
    { id: 'students', name: 'Students', icon: 'fas fa-users' },
    { id: 'content', name: 'Content Management', icon: 'fas fa-edit' },
    { id: 'settings', name: 'Settings', icon: 'fas fa-cog' }
  ];

  const quickActions = [
    { title: 'Add New Program', icon: 'fas fa-plus', color: 'bg-primary', action: () => setActiveTab('programs') },
    { title: 'Manage Students', icon: 'fas fa-user-plus', color: 'bg-success', action: () => setActiveTab('students') },
    { title: 'Upload Content', icon: 'fas fa-upload', color: 'bg-warning', action: () => setActiveTab('content') },
    { title: 'View Analytics', icon: 'fas fa-chart-line', color: 'bg-purple', action: () => setActiveTab('overview') }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg border-b border-gray-200"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-crown text-white"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your training platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary">
                <i className="fas fa-bell"></i>
                Notifications
              </button>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gray-600"></i>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <div className="card-body p-0">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <i className={`${tab.icon} w-5`}></i>
                      <span className="font-medium">{tab.name}</span>
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
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div 
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="card"
                  >
                    <div className="card-body text-center">
                      <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-graduation-cap text-white text-xl"></i>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalPrograms}</h3>
                      <p className="text-gray-600">Training Programs</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="card"
                  >
                    <div className="card-body text-center">
                      <div className="w-12 h-12 gradient-success rounded-lg flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-users text-white text-xl"></i>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalStudents}</h3>
                      <p className="text-gray-600">Total Students</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="card"
                  >
                    <div className="card-body text-center">
                      <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-rupee-sign text-white text-xl"></i>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">₹{stats.totalRevenue.toLocaleString()}</h3>
                      <p className="text-gray-600">Total Revenue</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    data-aos="fade-up"
                    data-aos-delay="400"
                    className="card"
                  >
                    <div className="card-body text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-chart-line text-white text-xl"></i>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.activeEnrollments}</h3>
                      <p className="text-gray-600">Active Enrollments</p>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div 
                  data-aos="fade-up"
                  data-aos-delay="500"
                  className="card"
                >
                  <div className="card-body">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={action.action}
                          className={`${action.color} text-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow`}
                        >
                          <i className={`${action.icon} text-2xl mb-3`}></i>
                          <p className="font-semibold">{action.title}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div 
                  data-aos="fade-up"
                  data-aos-delay="600"
                  className="card"
                >
                  <div className="card-body">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                          <i className="fas fa-user-plus text-white"></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">New student enrolled</p>
                          <p className="text-gray-600 text-sm">John Doe enrolled in React Mastery</p>
                        </div>
                        <span className="text-gray-500 text-sm">2 hours ago</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <i className="fas fa-plus text-white"></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">New program added</p>
                          <p className="text-gray-600 text-sm">Advanced JavaScript Course</p>
                        </div>
                        <span className="text-gray-500 text-sm">5 hours ago</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-800">Training Programs</h2>
                  <button className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    Add New Program
                  </button>
                </div>
                <div className="card">
                  <div className="card-body">
                    <p className="text-gray-600">Program management interface will be implemented here.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-800">Students</h2>
                  <button className="btn btn-primary">
                    <i className="fas fa-user-plus"></i>
                    Add Student
                  </button>
                </div>
                <div className="card">
                  <div className="card-body">
                    <p className="text-gray-600">Student management interface will be implemented here.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-800">Content Management</h2>
                  <button className="btn btn-primary">
                    <i className="fas fa-upload"></i>
                    Upload Content
                  </button>
                </div>
                <div className="card">
                  <div className="card-body">
                    <p className="text-gray-600">Content management interface will be implemented here.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
                <div className="card">
                  <div className="card-body">
                    <p className="text-gray-600">Settings interface will be implemented here.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
