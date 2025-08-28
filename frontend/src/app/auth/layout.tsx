'use client';
// app/(auth)/layout.tsx
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Preloader from '../components/Preloader';
import { useRouter } from 'next/navigation';


export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    // Redirect if already authenticated
    useEffect(() => {
      if (isAuthenticated && !authLoading) {
        router.replace('/dashboard'); // Redirect to dashboard if authenticated
      }
    }, [isAuthenticated, authLoading, router]);
  // If loading, render only preloader
  if (isAuthenticated || authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
        <Preloader />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        
        {/* Auth Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {children}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {/* © {new Date().getFullYear()} Valzon. All rights reserved. */}
          </p>
        </div>
      </div>
    </div>
  );
}