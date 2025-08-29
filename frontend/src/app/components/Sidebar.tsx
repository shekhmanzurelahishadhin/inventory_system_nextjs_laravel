// app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isCollapsed: boolean;
  // darkMode: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  getInitials: (name?: string) => string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  children?: MenuItem[];
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

const Sidebar = ({ open, setOpen, isCollapsed, setIsCollapsed, getInitials }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const { user,hasRole, hasPermission } = useAuth();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navigation: MenuItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: solidIcons.faChartLine,
    },
     { 
      name: 'User Role', 
      href: '#',
      icon: solidIcons.faUserCheck,
      children: [
        { name: 'Role', href: '/apps/calendar', icon: solidIcons.faMinus, requiredPermissions: ["view-products"] },
        { name: 'Role Permission', href: '/apps/chat', icon: solidIcons.faMinus },
        { 
          name: 'User', 
          href: '#',
          icon: solidIcons.faMinus,
          children: [
            { name: 'Manage User', href: '/dashboard/users', icon: solidIcons.faMinus },
            { name: 'User Permission', href: '/apps/ecommerce/product-detail', icon: solidIcons.faMinus },
          ]
        },
      ]
    },
    { 
      name: 'Apps', 
      href: '#',
      icon: solidIcons.faDesktop,
      children: [
        { name: 'Calendar', href: '/apps/calendar', icon: solidIcons.faCalendar, requiredPermissions: ["view-productss"] },
        { name: 'Chat', href: '/apps/chat', icon: solidIcons.faComment },
        { name: 'Email', href: '/apps/email', icon: solidIcons.faEnvelope },
        { 
          name: 'Ecommerce', 
          href: '#',
          icon: solidIcons.faShoppingCart,
          children: [
            { name: 'Products', href: '/apps/ecommerce/products', icon: solidIcons.faMinus },
            { name: 'Product Detail', href: '/apps/ecommerce/product-detail', icon: solidIcons.faMinus },
            { name: 'Orders', href: '/apps/ecommerce/orders', icon: solidIcons.faMinus },
            { name: 'Customers', href: '/apps/ecommerce/customers', icon: solidIcons.faMinus },
          ]
        },
      ]
    },
    { 
      name: 'Pages', 
      href: '#',
      icon: solidIcons.faFileInvoice,
      children: [
        { name: 'Profile', href: '/pages/profile', icon: solidIcons.faMinus },
        { name: 'Settings', href: '/pages/settings', icon: solidIcons.faMinus },
        { name: 'Pricing', href: '/pages/pricing', icon: solidIcons.faMinus },
        { name: 'Timeline', href: '/pages/timeline', icon: solidIcons.faMinus },
      ]
    },
  ];

const renderMenuItems = (items: MenuItem[], level = 0) => {
  return items
    .filter(item => {
      if (item.requiredRoles && !item.requiredRoles.some(r => hasRole(r))) return false;
      if (item.requiredPermissions && !item.requiredPermissions.some(p => hasPermission(p))) return false;
      return true;
    })
    .map((item) => {
      const isActive = pathname === item.href;
      const hasChildren = !!item.children;

      // Common content inside link/div
      const content = (
        <>
          {item.icon && (
            <FontAwesomeIcon 
              icon={item.icon} 
              className={`mr-2 w-1 h-1 transition-transform duration-200 ${isCollapsed && level === 0 ? 'mx-auto' : ''}`} 
            />
          )}
          {!isCollapsed && (
            <>
              <span className="flex-1 transition-all duration-200 text-sm">{item.name}</span>
              {hasChildren && (
                <FontAwesomeIcon 
                  icon={expandedMenus[item.name] ? solidIcons.faChevronDown : solidIcons.faChevronRight} 
                  className="w-1 h-1 transition-transform duration-200" 
                />
              )}
            </>
          )}
        </>
      );

      // Wrapper class
      const wrapperClass = `
        flex items-center px-4 py-3 text-gray-100 hover:bg-gray-800 cursor-pointer transition-colors duration-200
        ${isActive ? 'bg-gray-800 border-r-4 border-blue-500' : ''}
      `;

      return (
        <div key={item.name}>
          {item.href && item.href !== "#" ? (
            // ✅ If href exists and not "#", wrap with Link
            <Link 
              href={item.href} 
              className={wrapperClass}
              onClick={() => !hasChildren && setOpen(false)}
            >
              {content}
            </Link>
          ) : (
            //  If href is "#" (or missing), use div
            <div 
              className={wrapperClass}
              onClick={() => hasChildren ? toggleMenu(item.name) : setOpen(false)}
            >
              {content}
            </div>
          )}

          {hasChildren && !isCollapsed && (
            <div 
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${expandedMenus[item.name] ? 'max-h-96' : 'max-h-0'}
              `}
            >
              <div className="ml-6">
                {item.children && renderMenuItems(item.children, level + 1)}
              </div>
            </div>
          )}
        </div>
      );
    });
};
  return (
    <>
      {/* Mobile overlay - using z-30 */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar - using z-40 */}
      <div className={`
        fixed inset-y-0 left-0 z-40 bg-gray-900 transform transition-all duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-auto flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <Link href="/dashboard" >
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          {!isCollapsed && <div className="text-white font-bold text-xl transition-opacity duration-300">Admin Dashboard</div>}
          {isCollapsed && <div className="text-white font-bold text-xl transition-opacity duration-300">{getInitials('Admin Dashboard')}</div>}
          <button 
            className="text-gray-400 hover:text-white lg:hidden transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={solidIcons.faTimes} />
          </button>
        </div>
        </Link>
        
        {/* Navigation with custom scrollbar */}
        <nav className="mt-4 flex-1 overflow-y-auto sidebar-scroll">
          {renderMenuItems(navigation)}
        </nav>
        
        <div className="p-4 bg-gray-800">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center transition-opacity duration-300">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white transition-colors duration-200">
                  {getInitials(user?.name)}
                </div>
                <div className="ml-3 transition-opacity duration-300">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-400">Administrator</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                onClick={() => setIsCollapsed(true)}
              >
                <FontAwesomeIcon icon={solidIcons.faAngleDoubleLeft} className="transition-transform duration-200" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                onClick={() => setIsCollapsed(false)}
              >
                <FontAwesomeIcon icon={solidIcons.faAngleDoubleLeft} className="rotate-180 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;