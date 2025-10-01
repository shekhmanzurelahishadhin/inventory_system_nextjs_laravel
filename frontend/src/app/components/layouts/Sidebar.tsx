"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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

const Sidebar = ({
  open,
  setOpen,
  isCollapsed,
  setIsCollapsed,
  getInitials,
}: SidebarProps) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<{name: string; item: MenuItem; x: number; y: number} | null>(null);
  const [nestedHoveredItem, setNestedHoveredItem] = useState<{name: string; item: MenuItem; x: number; y: number} | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, hasRole, hasPermission } = useAuth();

  // Automatically expand parent menus if a child is active
  useEffect(() => {
    const expandActiveParents = (items: MenuItem[], parents: string[] = []) => {
      items.forEach((item) => {
        const hasChildren = !!item.children;
        const childMatches = hasChildren && checkChildActive(item.children);
        const isActive = item.href === pathname || childMatches;

        if (isActive && parents.length) {
          parents.forEach((parentName) => {
            setExpandedMenus((prev) => ({ ...prev, [parentName]: true }));
          });
        }

        if (hasChildren) {
          expandActiveParents(item.children, [...parents, item.name]);
        }
      });
    };

    const checkChildActive = (children: MenuItem[]): boolean => {
      return children.some(
        (child) =>
          child.href === pathname ||
          (child.children && checkChildActive(child.children))
      );
    };

    expandActiveParents(navigation);
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleMouseEnter = (item: MenuItem, event: React.MouseEvent) => {
    if (!isCollapsed || !item.children) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredItem({
      name: item.name,
      item: item,
      x: rect.right + 10,
      y: rect.top
    });
  };

  const handleNestedMouseEnter = (item: MenuItem, event: React.MouseEvent) => {
    if (!item.children) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    setNestedHoveredItem({
      name: item.name,
      item: item,
      x: rect.right,
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleNestedMouseLeave = () => {
    setNestedHoveredItem(null);
  };

  const navigation: MenuItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: solidIcons.faChartLine },
    {
      name: "User Role",
      href: "#",
      icon: solidIcons.faUserCheck,
      children: [
        {
          name: "Role",
          href: "/dashboard/authorization/roles",
          icon: solidIcons.faShieldAlt,
          requiredPermissions: ["role.view"],
        },
        {
          name: "Permission",
          href: "/dashboard/authorization/permissions",
          icon: solidIcons.faKey,
          requiredPermissions: ["permission.view"],
        },
        {
          name: "User",
          href: "/dashboard/users",
          icon: solidIcons.faUserCog,
          requiredPermissions: ["user.view"],
        },
      ],
    },
    {
      name: "Configure",
      href: "#",
      icon: solidIcons.faCogs,
      children: [
        {
          name: "Lookup",
          href: "/dashboard/configure/lookups",
          icon: solidIcons.faTable,
          requiredPermissions: ["lookup.view"],
        },
        {
          name: "Company",
          href: "/dashboard/configure/companies",
          icon: solidIcons.faBuilding,
          requiredPermissions: ["company.view"],
        },
        {
          name: "Category",
          href: "/dashboard/configure/categories",
          icon: solidIcons.faTags,
          requiredPermissions: ["category.view"],
        },
        {
          name: "Sub Category",
          href: "/dashboard/configure/sub-categories",
          icon: solidIcons.faLayerGroup,
          requiredPermissions: ["subcategory.view"],
        },
        {
          name: "Brand",
          href: "/dashboard/configure/brands",
          icon: solidIcons.faTrademark,
          requiredPermissions: ["brand.view"],
        },
        {
          name: "Model",
          href: "/dashboard/configure/models",
          icon: solidIcons.faCubes,
          requiredPermissions: ["model.view"],
        },
        {
          name: "Unit",
          href: "/dashboard/configure/units",
          icon: solidIcons.faRuler,
          requiredPermissions: ["unit.view"],
        },
        {
          name: "Store",
          href: "/dashboard/configure/stores",
          icon: solidIcons.faStore,
          requiredPermissions: ["store.view"],
        },
        {
          name: "Location",
          href: "/dashboard/configure/locations",
          icon: solidIcons.faMapMarkerAlt,
          requiredPermissions: ["location.view"],
        },
      ],
    },
    {
      name: "Apps",
      href: "#",
      icon: solidIcons.faThLarge,
      children: [
        {
          name: "Calendar",
          href: "/apps/calendar",
          icon: solidIcons.faCalendar,
        },
        { name: "Chat", href: "/apps/chat", icon: solidIcons.faComment },
        { name: "Email", href: "/apps/email", icon: solidIcons.faEnvelope },
        {
          name: "Ecommerce",
          href: "#",
          icon: solidIcons.faShoppingBag,
          children: [
            {
              name: "Products",
              href: "/apps/ecommerce/products",
              icon: solidIcons.faBox,
            },
            {
              name: "Product Detail",
              href: "/apps/ecommerce/product-detail",
              icon: solidIcons.faBoxOpen,
            },
            {
              name: "Orders",
              href: "/apps/ecommerce/orders",
              icon: solidIcons.faReceipt,
            },
            {
              name: "Customers",
              href: "/apps/ecommerce/customers",
              icon: solidIcons.faUserFriends,
            },
          ],
        },
      ],
    },
    {
      name: "Pages",
      href: "#",
      icon: solidIcons.faFile,
      children: [
        {
          name: "Profile",
          href: "/pages/profile",
          icon: solidIcons.faUserCircle,
        },
        { name: "Settings", href: "/pages/settings", icon: solidIcons.faCog },
        { name: "Pricing", href: "/pages/pricing", icon: solidIcons.faTag },
        {
          name: "Timeline",
          href: "/pages/timeline",
          icon: solidIcons.faStream,
        },
      ],
    },
  ];

  const renderHoverMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const hasRequiredRoles = !item.requiredRoles || item.requiredRoles.some((r) => hasRole(r));
    const hasRequiredPermissions = !item.requiredPermissions || item.requiredPermissions.some((p) => hasPermission(p));

    if (!hasRequiredRoles || !hasRequiredPermissions) {
      return null;
    }

    const isActive = pathname === item.href;

    if (item.href && item.href !== "#") {
      return (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          } ${level > 0 ? 'pl-8' : ''}`}
          onClick={() => {
            setOpen(false);
            setHoveredItem(null);
            setNestedHoveredItem(null);
          }}
        >
          <FontAwesomeIcon
            icon={item.icon}
            className="w-4 h-4 mr-3 text-gray-400"
          />
          <span>{item.name}</span>
        </Link>
      );
    } else if (hasChildren) {
      return (
        <div
          key={item.name}
          className="relative"
          onMouseEnter={(e) => handleNestedMouseEnter(item, e)}
          onMouseLeave={handleNestedMouseLeave}
        >
          <div
            className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-200 cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            } ${level > 0 ? 'pl-8' : ''}`}
          >
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={item.icon}
                className="w-4 h-4 mr-3 text-gray-400"
              />
              <span>{item.name}</span>
            </div>
            <FontAwesomeIcon
              icon={solidIcons.faChevronRight}
              className="w-3 h-3 ml-2 text-gray-400"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderHoverMenu = (item: {name: string; item: MenuItem; x: number; y: number}, isNested = false) => {
    if (!item.item.children) return null;

    const filteredChildren = item.item.children.filter(child => {
      const hasRequiredRoles = !child.requiredRoles || child.requiredRoles.some((r) => hasRole(r));
      const hasRequiredPermissions = !child.requiredPermissions || child.requiredPermissions.some((p) => hasPermission(p));
      return hasRequiredRoles && hasRequiredPermissions;
    });

    if (filteredChildren.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: isNested ? 10 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isNested ? 10 : -20 }}
        className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50 min-w-48"
        style={{
          left: item.x,
          top: Math.max(item.y, 10), // Ensure it doesn't go above the viewport
        }}
        onMouseEnter={() => !isNested ? setHoveredItem(item) : setNestedHoveredItem(item)}
        onMouseLeave={isNested ? handleNestedMouseLeave : handleMouseLeave}
      >
        <div className="px-3 py-2 border-b border-gray-700">
          <span className="text-white font-medium text-sm">{item.name}</span>
        </div>
        <div className="py-1">
          {filteredChildren.map((child) => renderHoverMenuItem(child))}
        </div>
      </motion.div>
    );
  };

  const renderMenuItems = (items: MenuItem[], level = 0): JSX.Element[] => {
    return items
      .map((item) => {
        // Check if item has children
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;

        // Recursively filter children first
        const allowedChildren = hasChildren
          ? renderMenuItems(item.children, level + 1)
          : [];

        // Check parent permissions
        const hasRequiredRoles = !item.requiredRoles || item.requiredRoles.some((r) => hasRole(r));
        const hasRequiredPermissions = !item.requiredPermissions || item.requiredPermissions.some((p) => hasPermission(p));

        // Hide parent if no permission
        if (!hasRequiredRoles || !hasRequiredPermissions) {
          return null;
        }

        // Hide parent if children exist but none allowed
        if (hasChildren && allowedChildren.length === 0) {
          return null;
        }

        // Determine if the item is active
        const isActive = pathname === item.href;

        const content = (
          <>
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                className={`transition-all duration-200 ${
                  isCollapsed && level === 0 ? "mx-auto text-lg" : "text-base"
                } ${isActive ? "text-blue-400" : "text-gray-400"}`}
              />
            )}
            {!isCollapsed && (
              <>
                <span
                  className={`flex-1 transition-all duration-200 text-sm ml-3 ${
                    isActive ? "text-white font-medium" : "text-gray-300"
                  }`}
                >
                  {item.name}
                </span>
                {hasChildren && (
                  <FontAwesomeIcon
                    icon={expandedMenus[item.name] ? solidIcons.faChevronDown : solidIcons.faChevronRight}
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isActive ? "text-blue-400" : "text-gray-400"
                    }`}
                  />
                )}
              </>
            )}
          </>
        );

        // Wrapper classes based on state and level for indentation and styling
        const wrapperClass = `
          flex items-center p-3 rounded-lg mx-2 my-1 transition-all duration-200 relative group
          ${
            isActive
              ? "bg-blue-900/30 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }
          ${level > 0 ? "pl-8" : ""}
          ${isCollapsed && level === 0 ? "justify-center" : ""}
        `;

        return (
          <div 
            key={item.name}
            className="relative"
            onMouseEnter={(e) => isCollapsed && level === 0 && handleMouseEnter(item, e)}
            onMouseLeave={isCollapsed && level === 0 ? handleMouseLeave : undefined}
          >
            {item.href && item.href !== "#" ? (
              <Link
                href={item.href}
                className={wrapperClass}
                onClick={() => !hasChildren && setOpen(false)}
              >
                {content}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && level === 0 && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40 whitespace-nowrap">
                    {item.name}
                    {hasChildren && " →"}
                  </div>
                )}
              </Link>
            ) : (
              <div
                className={`${wrapperClass} cursor-pointer`}
                onClick={() => hasChildren && !isCollapsed ? toggleMenu(item.name) : setOpen(false)}
              >
                {content}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && level === 0 && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40 whitespace-nowrap">
                    {item.name}
                    {hasChildren && " →"}
                  </div>
                )}
              </div>
            )}

            {hasChildren && !isCollapsed && allowedChildren.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expandedMenus[item.name] ? "auto" : 0,
                  opacity: expandedMenus[item.name] ? 1 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden ml-2"
              >
                {allowedChildren}
              </motion.div>
            )}
          </div>
        );
      })
      .filter(Boolean) as JSX.Element[];
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main sidebar container with proper overflow handling */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 bg-gray-900 transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-16" : "w-64"} border-r border-gray-800 shadow-xl overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-900/30 to-gray-900 border-b border-gray-800 shrink-0">
          {!isCollapsed ? (
            <div className="text-white font-bold text-xl flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-2">
                <FontAwesomeIcon
                  icon={solidIcons.faCube}
                  className="text-white text-sm"
                />
              </div>
              Admin Panel
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto">
              <FontAwesomeIcon
                icon={solidIcons.faCube}
                className="text-white text-sm"
              />
            </div>
          )}
          <button
            className="text-gray-400 hover:text-white lg:hidden transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={solidIcons.faTimes} />
          </button>
        </div>

        {/* Navigation - Fixed with proper scroll handling */}
        <nav className="mt-4 flex-1 overflow-y-auto overflow-x-hidden px-2">
          {renderMenuItems(navigation)}
        </nav>

        {/* User section */}
        <div className="p-4 bg-gray-800/50 border-t border-gray-800 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center transition-opacity duration-300">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md transition-colors duration-200">
                  {getInitials(user?.name)}
                </div>
                <div className="ml-3 transition-opacity duration-300">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200 p-1 rounded hover:bg-gray-700"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
              >
                <FontAwesomeIcon
                  icon={solidIcons.faChevronLeft}
                  className="transition-transform duration-200"
                />
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
                <FontAwesomeIcon
                  icon={solidIcons.faChevronRight}
                  className="transition-transform duration-200"
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hover Menus - Placed outside the sidebar container */}
      <AnimatePresence>
        {hoveredItem && renderHoverMenu(hoveredItem)}
      </AnimatePresence>

      <AnimatePresence>
        {nestedHoveredItem && renderHoverMenu(nestedHoveredItem, true)}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;