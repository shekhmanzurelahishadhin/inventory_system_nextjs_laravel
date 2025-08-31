// components/Breadcrumb.jsx
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex text-gray-700">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/dashboard"  style={{ fontSize:"12px" }}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <FontAwesomeIcon icon={faHome} style={{ width: "12px", height: "12px" }} className="me-2" />
            Dashboard
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
             <FontAwesomeIcon icon={faChevronRight} style={{ width: "10px", height: "10px" }} className="mx-1" />
              
              {index === items.length - 1 ? (
                <span style={{ fontSize:"12px" }} className="ml-1 font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}  style={{ fontSize:"12px" }}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;