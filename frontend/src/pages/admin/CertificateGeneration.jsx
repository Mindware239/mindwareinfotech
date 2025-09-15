import React, { useState, useEffect } from 'react';
import './CertificateGeneration.css';

const CertificateGeneration = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);

  // Mock data
  const [students] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', course: 'Web Development', completionDate: '2024-01-15', status: 'completed' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'React Development', completionDate: '2024-01-20', status: 'completed' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', course: 'Node.js', completionDate: '2024-01-25', status: 'completed' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', course: 'Python Programming', completionDate: '2024-02-01', status: 'completed' },
    { id: 5, name: 'David Brown', email: 'david@example.com', course: 'JavaScript', completionDate: '2024-02-05', status: 'completed' }
  ]);

  const [templates] = useState([
    { id: 1, name: 'Classic Blue', preview: '/api/placeholder/300/200', description: 'Professional blue-themed certificate' },
    { id: 2, name: 'Modern Gradient', preview: '/api/placeholder/300/200', description: 'Modern gradient design' },
    { id: 3, name: 'Elegant Gold', preview: '/api/placeholder/300/200', description: 'Elegant gold and black theme' },
    { id: 4, name: 'Minimalist', preview: '/api/placeholder/300/200', description: 'Clean minimalist design' }
  ]);

  const [certificates] = useState([
    { id: 1, studentName: 'John Doe', course: 'Web Development', template: 'Classic Blue', generatedDate: '2024-01-15', status: 'generated' },
    { id: 2, studentName: 'Jane Smith', course: 'React Development', template: 'Modern Gradient', generatedDate: '2024-01-20', status: 'generated' },
    { id: 3, studentName: 'Mike Johnson', course: 'Node.js', template: 'Elegant Gold', generatedDate: '2024-01-25', status: 'generated' }
  ]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleGenerateCertificates = async () => {
    if (selectedStudents.length === 0 || !selectedTemplate) {
      alert('Please select students and a template');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCertificates = selectedStudents.map(studentId => {
      const student = students.find(s => s.id === studentId);
      return {
        id: Date.now() + studentId,
        studentName: student.name,
        course: student.course,
        template: selectedTemplate.name,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'generated'
      };
    });

    setGeneratedCertificates(prev => [...prev, ...newCertificates]);
    setSelectedStudents([]);
    setSelectedTemplate(null);
    setLoading(false);
    alert('Certificates generated successfully!');
  };

  const handleDownloadCertificate = (certificateId) => {
    // Simulate download
    alert('Certificate download started');
  };

  const handlePreviewCertificate = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const renderTemplates = () => (
    <div className="templates-section">
      <div className="section-header">
        <h3>Certificate Templates</h3>
        <p>Choose a template for your certificates</p>
      </div>
      
      <div className="templates-grid">
        {templates.map(template => (
          <div 
            key={template.id} 
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="template-preview">
              <img src={template.preview} alt={template.name} />
              <div className="template-overlay">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewCertificate(template);
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
            <div className="template-info">
              <h4>{template.name}</h4>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudentSelection = () => (
    <div className="student-selection">
      <div className="section-header">
        <h3>Select Students</h3>
        <div className="selection-actions">
          <button 
            className="btn btn-sm btn-secondary"
            onClick={handleSelectAll}
          >
            {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="selection-count">
            {selectedStudents.length} selected
          </span>
        </div>
      </div>
      
      <div className="students-list">
        {students.map(student => (
          <div 
            key={student.id} 
            className={`student-item ${selectedStudents.includes(student.id) ? 'selected' : ''}`}
            onClick={() => handleStudentSelect(student.id)}
          >
            <div className="student-checkbox">
              <input 
                type="checkbox" 
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentSelect(student.id)}
              />
            </div>
            <div className="student-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="student-info">
              <h4>{student.name}</h4>
              <p>{student.email}</p>
              <span className="course-badge">{student.course}</span>
            </div>
            <div className="student-status">
              <span className={`status-badge ${student.status}`}>
                {student.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGeneration = () => (
    <div className="generation-section">
      <div className="section-header">
        <h3>Generate Certificates</h3>
        <p>Review your selections and generate certificates</p>
      </div>
      
      <div className="generation-summary">
        <div className="summary-card">
          <h4>Selected Template</h4>
          <p>{selectedTemplate ? selectedTemplate.name : 'None selected'}</p>
        </div>
        <div className="summary-card">
          <h4>Selected Students</h4>
          <p>{selectedStudents.length} students</p>
        </div>
        <div className="summary-card">
          <h4>Ready to Generate</h4>
          <p>{selectedStudents.length > 0 && selectedTemplate ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      <div className="generation-actions">
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleGenerateCertificates}
          disabled={selectedStudents.length === 0 || !selectedTemplate || loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="fas fa-certificate"></i>
              Generate Certificates
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="history-section">
      <div className="section-header">
        <h3>Generated Certificates</h3>
        <p>View and manage previously generated certificates</p>
      </div>
      
      <div className="certificates-table">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Template</th>
              <th>Generated Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...certificates, ...generatedCertificates].map(cert => (
              <tr key={cert.id}>
                <td>{cert.studentName}</td>
                <td>{cert.course}</td>
                <td>{cert.template}</td>
                <td>{cert.generatedDate}</td>
                <td>
                  <span className={`status-badge ${cert.status}`}>
                    {cert.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon download"
                      onClick={() => handleDownloadCertificate(cert.id)}
                      title="Download"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    <button 
                      className="btn-icon preview"
                      title="Preview"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="certificate-generation-page">
      <div className="page-header">
        <h1>Certificate Generation</h1>
        <p>Manage and generate certificates for students</p>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
                onClick={() => setActiveTab('templates')}
              >
                <i className="fas fa-palette"></i>
                Templates
              </button>
              <button 
                className={`tab ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <i className="fas fa-users"></i>
                Select Students
              </button>
              <button 
                className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
                onClick={() => setActiveTab('generate')}
              >
                <i className="fas fa-certificate"></i>
                Generate
              </button>
              <button 
                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <i className="fas fa-history"></i>
                History
              </button>
            </div>
          </div>
          
          <div className="card-body">
            {activeTab === 'templates' && renderTemplates()}
            {activeTab === 'students' && renderStudentSelection()}
            {activeTab === 'generate' && renderGeneration()}
            {activeTab === 'history' && renderHistory()}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Certificate Preview</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPreview(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="certificate-preview">
                <img src={selectedTemplate.preview} alt="Certificate Preview" />
                <div className="preview-overlay">
                  <h2>John Doe</h2>
                  <p>Web Development Course</p>
                  <p>Completed on January 15, 2024</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowPreview(false);
                  setActiveTab('students');
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGeneration;
