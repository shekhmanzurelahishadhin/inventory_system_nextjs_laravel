// app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faChartBar, 
  faUsers, 
  faShoppingCart, 
  faBox, 
  faCog,
  faTimes,
  faChevronDown,
  faChevronRight,
  faMinus,
  faDesktop,
  faShoppingBag,
  faFileInvoice,
  faCalendar,
  faMapMarker,
  faEnvelope,
  faComment,
  faAngleDoubleLeft
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isCollapsed: boolean;
  darkMode: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  children?: MenuItem[];
}

const Sidebar = ({ open, setOpen, isCollapsed, darkMode, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navigation: MenuItem[] = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: faChartLine,
    },
    { 
      name: 'Apps', 
      href: '#',
      icon: faDesktop,
      children: [
        { name: 'Calendar', href: '/apps/calendar', icon: faCalendar },
        { name: 'Chat', href: '/apps/chat', icon: faComment },
        { name: 'Email', href: '/apps/email', icon: faEnvelope },
        { 
          name: 'Ecommerce', 
          href: '#',
          icon: faShoppingCart,
          children: [
            { name: 'Products', href: '/apps/ecommerce/products', icon: faMinus },
            { name: 'Product Detail', href: '/apps/ecommerce/product-detail', icon: faMinus },
            { name: 'Orders', href: '/apps/ecommerce/orders', icon: faMinus },
            { name: 'Customers', href: '/apps/ecommerce/customers', icon: faMinus },
          ]
        },
      ]
    },
    { 
      name: 'Pages', 
      href: '#',
      icon: faFileInvoice,
      children: [
        { name: 'Profile', href: '/pages/profile', icon: faMinus },
        { name: 'Settings', href: '/pages/settings', icon: faMinus },
        { name: 'Pricing', href: '/pages/pricing', icon: faMinus },
        { name: 'Timeline', href: '/pages/timeline', icon: faMinus },
      ]
    },
  ];

  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.name}>
        <div 
          className={`
            flex items-center px-4 py-3 text-gray-100 hover:bg-gray-800 cursor-pointer transition-colors duration-200
            ${pathname === item.href ? 'bg-gray-800 border-r-4 border-blue-500' : ''}
          `}
          onClick={() => item.children ? toggleMenu(item.name) : setOpen(false)}
        >
          {item.icon && (
            <FontAwesomeIcon 
              icon={item.icon} 
              className={`mr-3 w-5 h-5 transition-transform duration-200 ${isCollapsed && level === 0 ? 'mx-auto' : ''}`} 
            />
          )}
          
          {!isCollapsed && (
            <>
              <span className="flex-1 transition-all duration-200">{item.name}</span>
              {item.children && (
                <FontAwesomeIcon 
                  icon={expandedMenus[item.name] ? faChevronDown : faChevronRight} 
                  className="w-3 h-3 transition-transform duration-200" 
                />
              )}
            </>
          )}
        </div>
        
        {item.children && !isCollapsed && (
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${expandedMenus[item.name] ? 'max-h-96' : 'max-h-0'}
            `}
          >
            <div className="ml-6">
              {renderMenuItems(item.children, level + 1)}
            </div>
          </div>
        )}
      </div>
    ));
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
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          {!isCollapsed && <div className="text-white font-bold text-xl transition-opacity duration-300">Valzon</div>}
          {isCollapsed && <div className="text-white font-bold text-xl transition-opacity duration-300">V</div>}
          <button 
            className="text-gray-400 hover:text-white lg:hidden transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        {/* Navigation with custom scrollbar */}
        <nav className="mt-4 flex-1 overflow-y-auto sidebar-scroll">
          {renderMenuItems(navigation)}
        </nav>
        
        <div className="p-4 bg-gray-800">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center transition-opacity duration-300">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white transition-colors duration-200">
                  JD
                </div>
                <div className="ml-3 transition-opacity duration-300">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs font-medium text-gray-400">Administrator</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                onClick={() => setIsCollapsed(true)}
              >
                <FontAwesomeIcon icon={faAngleDoubleLeft} className="transition-transform duration-200" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                onClick={() => setIsCollapsed(false)}
              >
                <FontAwesomeIcon icon={faAngleDoubleLeft} className="rotate-180 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;