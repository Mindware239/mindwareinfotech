import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import studentService from '../../services/studentService';
import './StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    status: 'active'
  });

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm
      };
      
      const response = await studentService.getStudents(params);
      setStudents(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('Failed to load students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await studentService.updateStudent(studentId, { is_active: newStatus });
      fetchStudents();
    } catch (err) {
      console.error('Error updating student status:', err);
      alert('Failed to update student status');
    }
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      course: student.course || '',
      status: student.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(studentId);
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Failed to delete student');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent._id, formData);
      } else {
        await studentService.createStudent(formData);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      alert('Failed to save student');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const columns = [
    {
      key: 'name',
      label: 'Student',
      render: (student) => (
        <div className="student-cell">
          <img 
            src={student.avatar || '/images/avatars/default-avatar.svg'} 
            alt={student.name}
            className="student-avatar"
            onError={(e) => {
              e.target.src = '/images/avatars/default-avatar.svg';
            }}
          />
          <div className="student-info">
            <h4>{student.name}</h4>
            <p>{student.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'student_id',
      label: 'Student ID',
      render: (student) => (
        <span className="student-id">{student.student_id}</span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (student) => student.phone || 'N/A'
    },
    {
      key: 'applications',
      label: 'Applications',
      render: (student) => (
        <span className="application-count">
          {student.applications?.length || 0}
        </span>
      )
    },
    {
      key: 'enrolled_courses',
      label: 'Courses',
      render: (student) => (
        <span className="course-count">
          {student.enrolled_courses?.length || 0}
        </span>
      )
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (student) => (
        <select 
          value={student.is_active}
          onChange={(e) => handleStatusChange(student.id, e.target.value === 'true')}
          className={`status-select status-${student.is_active ? 'active' : 'inactive'}`}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      )
    },
    {
      key: 'last_activity',
      label: 'Last Activity',
      render: (student) => (
        student.last_activity 
          ? new Date(student.last_activity).toLocaleDateString()
          : 'Never'
      )
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (student) => new Date(student.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (student) => (
        <div className="action-buttons">
          <button 
            onClick={() => handleEdit(student)}
            className="btn btn-sm btn-outline-primary"
            title="Edit Student"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            onClick={() => handleDelete(student._id)}
            className="btn btn-sm btn-outline-danger"
            title="Delete Student"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  if (loading && students.length === 0) {
    return (
      <div className="student-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-management">
      <div className="page-header">
        <div className="page-title">
          <h1>Student Management</h1>
          <p>Manage student accounts and track their progress</p>
        </div>
        <div className="page-actions">
          <button 
            onClick={handleAddNew}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i>
            Add New Student
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <div className="filters">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button onClick={fetchStudents} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={students}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <FormModal
          title={editingStudent ? 'Edit Student' : 'Add New Student'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Course</option>
              <option value="React Development">React Development</option>
              <option value="Node.js Backend">Node.js Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default StudentManagement;
