'use client';

import { useState, useEffect, ReactNode, ReactElement, isValidElement, Children, cloneElement } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import UserModal from './UserModal';

interface Props {
  children: ReactNode;
}

export default function ClientDashboardWrapper({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // default false for SSR
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode, mounted]);

  if (!mounted) return null;

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
          {Children.map(children, (child) =>
            isValidElement<{ darkMode: boolean }>(child)
              ? cloneElement(child as ReactElement<{ darkMode: boolean }>, { darkMode })
              : child
          )}
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
