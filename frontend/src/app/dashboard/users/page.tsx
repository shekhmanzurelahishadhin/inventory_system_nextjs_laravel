'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEye, 
  faEdit, 
  faTrash,
  faSearch,
  faCircleCheck,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons';
// Make sure the path is correct and the file exists. If your AuthContext is actually in 'src/app/context/AuthContext.tsx', update the import as follows:
import { useAuth} from '../../context/AuthContext';
import { api } from '../../lib/api';
// Update the import path below if the actual location is different
import AccessRoute from '../../components/AccessRoute';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  created_at: string;
  updated_at: string;
  status: string;
}

interface Role {
  id: number;
  name: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { user: currentUser, hasPermission } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setErrorMessage('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation'),
      roles: formData.getAll('roles')
    };

    try {
      await api.post('/users', data);
      setSuccessMessage('User created successfully');
      setShowCreateModal(false);
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrorMessage('Failed to create user');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    if (!selectedUser) return;
    
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      confirm_password: formData.get('confirm_password'),
      roles: formData.getAll('roles'),
      status: formData.get('status')
    };

    try {
      await api.put(`/users/${selectedUser.id}`, data);
      setSuccessMessage('User updated successfully');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrorMessage('Failed to update user');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${userId}`);
      setSuccessMessage('User deleted successfully');
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to delete user');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setErrors({});
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
        </div>
      )}

      {/* Page Title */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0 text-xl font-semibold">Manage User</h4>
            <div className="page-title-right">
              <nav className="breadcrumb m-0">
                <div className="breadcrumb-item">User Role</div>
                <div className="breadcrumb-item">User</div>
                <div className="breadcrumb-item active">Manage User</div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0 text-lg font-semibold">User List</h5>
              <AccessRoute>
                <button 
                  className="btn btn-success d-flex align-items-center"
                  onClick={() => setShowCreateModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add New
                </button>
              </AccessRoute>
            </div>
            <div className="card-body">
              {/* Search Box */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="table-responsive">
                <table className="table table-bordered" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '3%' }}>Sl No</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Roles</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.roles.map(role => (
                              <span key={role} className="badge bg-primary me-1">{role}</span>
                            ))}
                          </td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>{new Date(user.updated_at).toLocaleDateString()}</td>
                          <td>
                            {user.status === 'active' ? (
                              <span className="badge bg-success">
                                <FontAwesomeIcon icon={faCircleCheck} className="me-1" />
                                Active
                              </span>
                            ) : (
                              <span className="badge bg-danger">
                                <FontAwesomeIcon icon={faCircleXmark} className="me-1" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <AccessRoute>
                                <button 
                                  className="btn btn-info btn-sm"
                                  onClick={() => openEditModal(user)}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                              </AccessRoute>
                              <AccessRoute>
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => openEditModal(user)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                              </AccessRoute>
                              <AccessRoute>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={user.id === currentUser?.id}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </AccessRoute>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light p-3">
                <h5 className="modal-title">Create User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowCreateModal(false);
                    setErrors({});
                  }}
                ></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger">
                      <ul className="mb-0">
                        {Object.entries(errors).map(([field, messages]) => (
                          messages.map((message, idx) => (
                            <li key={`${field}-${idx}`}>{message}</li>
                          ))
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      User Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Enter User Name"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter User Email"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Enter Password"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password_confirmation" className="form-label">
                      Repeat Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_confirmation"
                      name="password_confirmation"
                      placeholder="Repeat Password"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="roles" className="form-label">
                      Roles <span className="text-danger">*</span>
                    </label>
                    <select
                      name="roles"
                      id="roles"
                      className="form-control form-select"
                      multiple
                      required
                      style={{ width: '100%' }}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-light" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light p-3">
                <h5 className="modal-title">Edit User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setErrors({});
                  }}
                ></button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body">
                  {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger">
                      <ul className="mb-0">
                        {Object.entries(errors).map(([field, messages]) => (
                          messages.map((message, idx) => (
                            <li key={`${field}-${idx}`}>{message}</li>
                          ))
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <input type="hidden" name="data_id" value={selectedUser.id} />
                  
                  <div className="mb-3">
                    <label htmlFor="username2" className="form-label">
                      User Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username2"
                      name="username"
                      defaultValue={selectedUser.username}
                      placeholder="Enter User Name"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email2" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email2"
                      name="email"
                      defaultValue={selectedUser.email}
                      readOnly
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="position-relative auth-pass-inputgroup mb-3">
                      <input
                        type="password"
                        className="form-control pe-5"
                        id="password"
                        name="password"
                        placeholder="Enter password"
                      />
                      <button 
                        type="button" 
                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                    <div className="position-relative auth-pass-inputgroup mb-3">
                      <input
                        type="password"
                        className="form-control pe-5"
                        id="confirm_password"
                        name="confirm_password"
                        placeholder="Enter confirm password"
                      />
                      <button 
                        type="button" 
                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="role_id2" className="form-label">
                      Roles <span className="text-danger">*</span>
                    </label>
                    <select
                      name="roles"
                      id="role_id2"
                      className="form-control form-select"
                      multiple
                      required
                      style={{ width: '100%' }}
                      defaultValue={selectedUser.roles}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="status2" className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-control form-select"
                      id="status2"
                      defaultValue={selectedUser.status}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-light" 
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                    }}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-success">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}