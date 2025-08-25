// app/components/UserModal.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCog, 
  faSignOutAlt, 
  faTimes,
  faCreditCard,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  if (!isOpen) return null;

  const menuItems = [
    { icon: faUser, label: 'Profile', href: '#' },
    { icon: faCreditCard, label: 'Billing', href: '#' },
    { icon: faCog, label: 'Settings', href: '#' },
    { icon: faQuestionCircle, label: 'Help & Support', href: '#' },
    { icon: faSignOutAlt, label: 'Logout', href: '#' },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-opacity-20 z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        onClick={onClose}
      />
      
      <div className="fixed right-4 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 w-48">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <FontAwesomeIcon icon={item.icon} className="w-4 h-4 mr-3" />
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}