// app/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsGrid from './StatsGrid';
import ActivityChart from './ActivityChart';
import RecentTransactions from './RecentTransactions';
import TopProducts from './TopProducts';
import UserModal from './UserModal';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        darkMode={darkMode}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setUserModalOpen={setUserModalOpen}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatsGrid darkMode={darkMode} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ActivityChart darkMode={darkMode} />
            <RecentTransactions darkMode={darkMode} />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <TopProducts darkMode={darkMode} />
          </div>
        </main>
      </div>

      <UserModal 
        isOpen={userModalOpen} 
        onClose={() => setUserModalOpen(false)} 
        darkMode={darkMode}
      />
    </div>
  );
}