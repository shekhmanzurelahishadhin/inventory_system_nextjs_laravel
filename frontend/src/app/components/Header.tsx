'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faSearch, 
  faBell, 
  faComment,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  setUserModalOpen: (open: boolean) => void;
  getInitials: (name?: string) => string;
}

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  isCollapsed, 
  setIsCollapsed,
  setUserModalOpen,
  getInitials
}: HeaderProps) {
  const { darkMode, setDarkMode } = useDarkMode();
  const { user,hasPermission,hasRole } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Left section */}
      <div className="flex items-center">
        <button 
          className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        
        <button 
          className="ml-4 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hidden lg:block"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        
        {/* Search bar - hidden on mobile by default, shown when search icon is clicked */}
        <div className={`relative ml-4 lg:ml-4 ${showSearch ? 'flex' : 'hidden'} lg:flex`}>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </span>
          <input
            type="text"
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Search..."
          />
          {/* Close search button for mobile */}
          <button 
            className="lg:hidden ml-2 text-gray-500"
            onClick={() => setShowSearch(false)}
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center">
        {/* Search icon for mobile - only shows when search bar is hidden */}
        {!showSearch && (
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mx-1 lg:hidden"
            onClick={() => setShowSearch(true)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        )}
        
        <button 
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mx-1 hidden sm:block"
          onClick={() => setDarkMode(!darkMode)}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mx-1">
          <FontAwesomeIcon icon={faBell} />
        </button>
        {hasPermission('view-chat') && (
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mx-1 hidden sm:block">
            <FontAwesomeIcon icon={faComment} />
          </button>
        )}
        <div className="ml-2 relative">
          <button 
            className="flex items-center"
            onClick={() => setUserModalOpen(true)}
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
              {getInitials(user?.name)}
            </div>
            <span className="ml-2 text-gray-700 dark:text-gray-300 hidden md:block">{user?.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
}