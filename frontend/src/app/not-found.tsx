// app/not-found.tsx
'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-6xl mb-8" />
        </div>
        <h1 className="text-9xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}