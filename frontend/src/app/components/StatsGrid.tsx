// app/components/StatsGrid.tsx
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
  faFileInvoice, 
  faShoppingBag, 
  faUsers,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

interface StatsGridProps {
  darkMode: boolean;
}

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: IconDefinition;
  color: string;
  bgColor: string;
  darkBgColor: string;
}

const StatsGrid = ({ darkMode }: StatsGridProps) => {
  const stats: StatItem[] = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20% from last month',
      icon: faDollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      darkBgColor: 'dark:bg-blue-900/20'
    },
    {
      title: 'Subscriptions',
      value: '+2350',
      change: '+180% from last month',
      icon: faFileInvoice,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      darkBgColor: 'dark:bg-green-900/20'
    },
    {
      title: 'Sales',
      value: '+12,234',
      change: '+19% from last month',
      icon: faShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      darkBgColor: 'dark:bg-purple-900/20'
    },
    {
      title: 'Active Now',
      value: '+573',
      change: '+201 since last hour',
      icon: faUsers,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      darkBgColor: 'dark:bg-red-900/20'
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <div key={index} className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className="text-xs text-green-500">{stat.change}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.darkBgColor} ${stat.color}`}>
              <FontAwesomeIcon icon={stat.icon} className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatsGrid;