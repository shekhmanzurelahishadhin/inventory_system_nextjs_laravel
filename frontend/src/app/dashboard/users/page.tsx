'use client';
// pages/admin/posts/index.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faEye, faSearch
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumb';


const PostManagement = () => {
  // Sample data for demonstration
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      category: 'Web Development',
      views: 1245,
      status: 'Published',
      publishedAt: '2023-06-15',
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      slug: 'advanced-react-patterns',
      category: 'Programming',
      views: 876,
      status: 'Draft',
      publishedAt: '2023-07-22',
    },
    {
      id: 3,
      title: 'Tailwind CSS Best Practices',
      slug: 'tailwind-css-best-practices',
      category: 'CSS',
      views: 1532,
      status: 'Published',
      publishedAt: '2023-05-10',
    },
    {
      id: 4,
      title: 'State Management in React',
      slug: 'state-management-in-react',
      category: 'Programming',
      views: 987,
      status: 'Published',
      publishedAt: '2023-08-05',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/admin/dashboard' },
    { label: 'Content Management', href: '/admin/content' },
    { label: 'Posts', href: '#' },
  ];

  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Section */}
        <div className="flex flex-wrap mb-6">
          <div className="w-full bg-white shadow rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Post Management</h1>
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header with Search and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b">
            <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <FontAwesomeIcon icon={faSearch}  className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
               <FontAwesomeIcon icon={faPlus}  className="mr-2" />
              Add New Post
            </button>
          </div>

          {/* Posts Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.views.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'Published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.publishedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                           <FontAwesomeIcon icon={faEye}  />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                           <FontAwesomeIcon icon={faEdit}  />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                           <FontAwesomeIcon icon={faTrash}  />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                <span className="font-medium">{posts.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManagement;