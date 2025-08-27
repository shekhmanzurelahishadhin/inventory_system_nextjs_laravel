"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import UserModal from "./UserModal";
import { DarkModeProvider } from "../context/DarkModeContext"; // We'll create this
import { AuthProvider, useAuth } from "../context/AuthContext"; // Add this import
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import Preloader from "./Preloader";

interface Props {
  children: ReactNode;
}

export default function ClientDashboardWrapper({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const { isAuthenticated, loading: authLoading } = useAuth();
  // Hydration-safe mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("darkMode");
    if (stored === "false") setDarkMode(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode, mounted]);

  if (!mounted) return null;
 
  function getInitials(name?: string) {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }
 
  // If loading, render only preloader
  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
        <Preloader />
      </div>
    );
  }
  return (
    <>
     
        {isAuthPage ? (
          children
        ) : (
          <ProtectedRoute>
            <DarkModeProvider value={{ darkMode, setDarkMode }}>
              <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar
                  open={sidebarOpen}
                  setOpen={setSidebarOpen}
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
                  getInitials={getInitials}
                />

                <div className="flex flex-col flex-1 overflow-hidden">
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    setUserModalOpen={setUserModalOpen}
                    getInitials={getInitials}
                  />

                  <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                  </main>
                </div>

                <UserModal
                  isOpen={userModalOpen}
                  onClose={() => setUserModalOpen(false)}
                  getInitials={getInitials}
                />
              </div>
            </DarkModeProvider>
          </ProtectedRoute>
        )}
      
    </>
  );
}
