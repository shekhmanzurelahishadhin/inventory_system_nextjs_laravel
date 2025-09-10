'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isCollapsed: boolean;
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
  const { user, hasRole, hasPermission } = useAuth();

  // Automatically expand parent menus if a child is active
  useEffect(() => {
    const expandActiveParents = (items: MenuItem[], parents: string[] = []) => {
      items.forEach(item => {
        const hasChildren = !!item.children;
        const childMatches = hasChildren && checkChildActive(item.children);
        const isActive = item.href === pathname || childMatches;

        if (isActive && parents.length) {
          parents.forEach(parentName => {
            setExpandedMenus(prev => ({ ...prev, [parentName]: true }));
          });
        }

        if (hasChildren) {
          expandActiveParents(item.children, [...parents, item.name]);
        }
      });
    };

    const checkChildActive = (children: MenuItem[]): boolean => {
      return children.some(child =>
        child.href === pathname || (child.children && checkChildActive(child.children))
      );
    };

    expandActiveParents(navigation);
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navigation: MenuItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: solidIcons.faChartLine },
    { 
      name: 'User Role', 
      href: '#',
      icon: solidIcons.faUserCheck,
      children: [
        { 
          name: 'Role', 
          href: '/dashboard/authorization/roles', 
          icon: solidIcons.faShieldAlt,
          requiredPermissions: ['role.view', 'role.create', 'role.edit', 'role.delete']
        },
        { 
          name: 'Permission', 
          href: '/dashboard/authorization/permissions',  
          icon: solidIcons.faKey,
          requiredPermissions: ['permission.view', 'permission.create', 'permission.edit', 'permission.delete']
        },
        { 
          name: 'User', 
          href: '#',
          icon: solidIcons.faUsers,
          children: [
            { name: 'Manage User', href: '/dashboard/users', icon: solidIcons.faUserCog },
            { name: 'User Permission', href: '/apps/ecommerce/product-detail', icon: solidIcons.faUserLock },
          ]
        },
      ]
    },
    { 
      name: 'Apps', 
      href: '#',
      icon: solidIcons.faThLarge,
      children: [
        { name: 'Calendar', href: '/apps/calendar', icon: solidIcons.faCalendar },
        { name: 'Chat', href: '/apps/chat', icon: solidIcons.faComment },
        { name: 'Email', href: '/apps/email', icon: solidIcons.faEnvelope },
        { 
          name: 'Ecommerce', 
          href: '#',
          icon: solidIcons.faShoppingBag,
          children: [
            { name: 'Products', href: '/apps/ecommerce/products', icon: solidIcons.faBox },
            { name: 'Product Detail', href: '/apps/ecommerce/product-detail', icon: solidIcons.faBoxOpen },
            { name: 'Orders', href: '/apps/ecommerce/orders', icon: solidIcons.faReceipt },
            { name: 'Customers', href: '/apps/ecommerce/customers', icon: solidIcons.faUserFriends },
          ]
        },
      ]
    },
    { 
      name: 'Pages', 
      href: '#',
      icon: solidIcons.faFile,
      children: [
        { name: 'Profile', href: '/pages/profile', icon: solidIcons.faUserCircle },
        { name: 'Settings', href: '/pages/settings', icon: solidIcons.faCog },
        { name: 'Pricing', href: '/pages/pricing', icon: solidIcons.faTag },
        { name: 'Timeline', href: '/pages/timeline', icon: solidIcons.faStream },
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
      .map(item => {
        const isActive = pathname === item.href;
        const hasChildren = !!item.children;

        const content = (
          <>
            {item.icon && (
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`transition-all duration-200 ${isCollapsed && level === 0 ? 'mx-auto text-lg' : 'text-base'} ${isActive ? 'text-blue-400' : 'text-gray-400'}`} 
              />
            )}
            {!isCollapsed && (
              <>
                <span className={`flex-1 transition-all duration-200 text-sm ml-3 ${isActive ? 'text-white font-medium' : 'text-gray-300'}`}>
                  {item.name}
                </span>
                {hasChildren && (
                  <FontAwesomeIcon 
                    icon={expandedMenus[item.name] ? solidIcons.faChevronDown : solidIcons.faChevronRight} 
                    className={`w-3 h-3 transition-transform duration-200 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} 
                  />
                )}
              </>
            )}
          </>
        );

        const wrapperClass = `
          flex items-center p-3 rounded-lg mx-2 my-1 transition-all duration-200
          ${isActive ? 'bg-blue-900/30 text-white' : 'text-gray-300 hover:bg-gray-800'}
          ${level > 0 ? 'pl-8' : ''}
        `;

        return (
          <div key={item.name}>
            {item.href && item.href !== "#" ? (
              <Link 
                href={item.href} 
                className={wrapperClass}
                onClick={() => !hasChildren && setOpen(false)}
              >
                {content}
              </Link>
            ) : (
              <div 
                className={`${wrapperClass} cursor-pointer`}
                onClick={() => hasChildren ? toggleMenu(item.name) : setOpen(false)}
              >
                {content}
              </div>
            )}

            {hasChildren && !isCollapsed && (
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenus[item.name] ? 'max-h-96' : 'max-h-0'}`}>
                <div className="ml-2">
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
      {open && (
        <div 
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          className="fixed inset-0 bg-opacity-50 z-30 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-40 bg-gray-900 transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-800 shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-900/30 to-gray-900 border-b border-gray-800">
          {!isCollapsed ? (
            <div className="text-white font-bold text-xl flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-2">
                <FontAwesomeIcon icon={solidIcons.faCube} className="text-white text-sm" />
              </div>
              Admin Panel
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto">
              <FontAwesomeIcon icon={solidIcons.faCube} className="text-white text-sm" />
            </div>
          )}
          <button className="text-gray-400 hover:text-white lg:hidden transition-colors duration-200" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={solidIcons.faTimes} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto sidebar-scroll px-2">
          {renderMenuItems(navigation)}
        </nav>

        {/* User section */}
        <div className="p-4 bg-gray-800/50 border-t border-gray-800">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center transition-opacity duration-300">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md transition-colors duration-200">
                  {getInitials(user?.name)}
                </div>
                <div className="ml-3 transition-opacity duration-300">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-400">Administrator</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200 p-1 rounded hover:bg-gray-700"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
              >
                <FontAwesomeIcon icon={solidIcons.faChevronLeft} className="transition-transform duration-200" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                {getInitials(user?.name)}
              </div>
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200 p-1 rounded hover:bg-gray-700"
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand sidebar"
              >
                <FontAwesomeIcon icon={solidIcons.faChevronRight} className="transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;