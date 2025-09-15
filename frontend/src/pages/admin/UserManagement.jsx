import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2025-09-15',
        avatar: 'https://via.placeholder.com/40'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'instructor',
        status: 'active',
        lastLogin: '2025-09-14',
        avatar: 'https://via.placeholder.com/40'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'user',
        status: 'inactive',
        lastLogin: '2025-09-10',
        avatar: 'https://via.placeholder.com/40'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        role: 'user',
        status: 'active',
        lastLogin: '2025-09-15',
        avatar: 'https://via.placeholder.com/40'
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david@example.com',
        role: 'instructor',
        status: 'active',
        lastLogin: '2025-09-13',
        avatar: 'https://via.placeholder.com/40'
      }
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      const newUser = {
        id: users.length + 1,
        ...formData,
        lastLogin: new Date().toISOString().split('T')[0],
        avatar: 'https://via.placeholder.com/40'
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user', status: 'active' });
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'instructor': return 'role-badge instructor';
      case 'user': return 'role-badge user';
      default: return 'role-badge';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'status-badge active' : 'status-badge inactive';
  };

  if (loading) {
    return (
      <div className="user-management-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div className="page-title">
          <h1>User Management</h1>
          <p>Manage users and their permissions</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus"></i>
            Add New User
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            <div className="data-table">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-header">User</th>
                      <th className="table-header">Email</th>
                      <th className="table-header">Role</th>
                      <th className="table-header">Status</th>
                      <th className="table-header">Last Login</th>
                      <th className="table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="table-row">
                        <td className="table-cell">
                          <div className="user-cell">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="user-avatar"
                            />
                            <div className="user-info">
                              <h4>{user.name}</h4>
                              <p>ID: #{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">{user.email}</td>
                        <td className="table-cell">
                          <span className={getRoleBadgeClass(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={getStatusBadgeClass(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="table-cell">{user.lastLogin}</td>
                        <td className="table-cell">
                          <div className="action-buttons">
                            <button 
                              className="btn-icon edit"
                              onClick={() => handleEdit(user)}
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn-icon delete"
                              onClick={() => handleDelete(user.id)}
                              title="Delete User"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
