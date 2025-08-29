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
import { useAuth} from '../../context/AuthContext';
import { api } from '../../lib/api';
import AccessRoute from '../../components/AccessRoute';

interface User {
  id: number;
  name: string;
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
      setUsers(response.data.users);
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
      name: formData.get('name'),
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
      name: formData.get('name'),
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
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="container mx-auto py-4 px-4">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
          <button type="button" className="absolute top-0 right-0 p-3" onClick={() => setSuccessMessage('')}>
            <span className="text-green-700">×</span>
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
          <button type="button" className="absolute top-0 right-0 p-3" onClick={() => setErrorMessage('')}>
            <span className="text-red-700">×</span>
          </button>
        </div>
      )}

      {/* Page Title */}
      <div className="flex flex-wrap mb-4">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-xl font-semibold mb-2 sm:mb-0">Manage User</h4>
            <div className="text-sm">
              <nav className="flex space-x-2">
                <div className="text-gray-500">User Role</div>
                <div className="text-gray-500">/</div>
                <div className="text-gray-500">User</div>
                <div className="text-gray-500">/</div>
                <div className="text-blue-600 font-medium">Manage User</div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h5 className="text-lg font-semibold">User List</h5>
              <AccessRoute>
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => setShowCreateModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add New
                </button>
              </AccessRoute>
            </div>
            <div className="p-6">
              {/* Search Box */}
              <div className="mb-4">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 w-1/24">Sl No</th>
                      <th className="border border-gray-300 px-4 py-2">User Name</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Roles</th>
                      <th className="border border-gray-300 px-4 py-2">Created At</th>
                      <th className="border border-gray-300 px-4 py-2">Updated At</th>
                      <th className="border border-gray-300 px-4 py-2">Status</th>
                      <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="border border-gray-300 px-4 py-4 text-center">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {/* {user.roles.map(role => (
                              <span key={role} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded mr-1">{role}</span>
                            ))} */}
                          </td>
                          <td className="border border-gray-300 px-4 py-2"></td>
                          <td className="border border-gray-300 px-4 py-2"></td>
                          <td className="border border-gray-300 px-4 py-2">
                            {user.status === 'active' ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded flex items-center w-fit">
                                <FontAwesomeIcon icon={faCircleCheck} className="mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded flex items-center w-fit">
                                <FontAwesomeIcon icon={faCircleXmark} className="mr-1" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex space-x-2">
                              <AccessRoute>
                                <button 
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded"
                                  onClick={() => openEditModal(user)}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                              </AccessRoute>
                              <AccessRoute>
                                <button 
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                                  onClick={() => openEditModal(user)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                              </AccessRoute>
                              <AccessRoute>
                                <button 
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b bg-gray-100 rounded-t-lg">
              <h5 className="text-lg font-medium">Create User</h5>
              <button 
                type="button" 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowCreateModal(false);
                  setErrors({});
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="p-6 max-h-96 overflow-y-auto">
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <ul className="list-disc list-inside">
                      {Object.entries(errors).map(([field, messages]) => (
                        messages.map((message, idx) => (
                          <li key={`${field}-${idx}`}>{message}</li>
                        ))
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    id="name"
                    name="name"
                    placeholder="Enter User Name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    id="email"
                    name="email"
                    placeholder="Enter User Email"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Repeat Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="Repeat Password"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-1">
                    Roles <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="roles"
                    id="roles"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    multiple
                    required
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowCreateModal(false)}
                >
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b bg-gray-100 rounded-t-lg">
              <h5 className="text-lg font-medium">Edit User</h5>
              <button 
                type="button" 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setErrors({});
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="p-6 max-h-96 overflow-y-auto">
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <ul className="list-disc list-inside">
                      {Object.entries(errors).map(([field, messages]) => (
                        messages.map((message, idx) => (
                          <li key={`${field}-${idx}`}>{message}</li>
                        ))
                      ))}
                    </ul>
                  </div>
                )}
                
                <input type="hidden" name="data_id" value={selectedUser.id} />
                
                <div className="mb-4">
                  <label htmlFor="name2" className="block text-sm font-medium text-gray-700 mb-1">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    id="name2"
                    name="name"
                    defaultValue={selectedUser.name}
                    placeholder="Enter User Name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email2" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    id="email2"
                    name="email"
                    defaultValue={selectedUser.email}
                    readOnly
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                      id="password"
                      name="password"
                      placeholder="Enter password"
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="Enter confirm password"
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="role_id2" className="block text-sm font-medium text-gray-700 mb-1">
                    Roles <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="roles"
                    id="role_id2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    multiple
                    required
                    defaultValue={selectedUser.roles}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="status2" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    id="status2"
                    defaultValue={selectedUser.status}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}