// app/(auth)/layout.tsx
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
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