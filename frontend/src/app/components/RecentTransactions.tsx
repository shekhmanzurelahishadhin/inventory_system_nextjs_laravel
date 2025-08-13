// app/components/RecentTransactions.tsx
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faClock, 
  faTimesCircle,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

interface RecentTransactionsProps {
  darkMode: boolean;
}

interface Transaction {
  id: number;
  name: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const RecentTransactions = ({ darkMode }: RecentTransactionsProps) => {
  const transactions: Transaction[] = [
    { id: 1, name: 'John Doe', date: '2023-07-01', amount: '$250.00', status: 'Completed' },
    { id: 2, name: 'Sarah Smith', date: '2023-07-02', amount: '$150.00', status: 'Pending' },
    { id: 3, name: 'Robert Johnson', date: '2023-07-02', amount: '$350.00', status: 'Completed' },
    { id: 4, name: 'Emily Davis', date: '2023-07-03', amount: '$450.00', status: 'Completed' },
    { id: 5, name: 'Michael Wilson', date: '2023-07-04', amount: '$550.00', status: 'Failed' },
  ];

  const getStatusIcon = (status: Transaction['status']): IconDefinition => {
    switch (status) {
      case 'Completed': return faCheckCircle;
      case 'Pending': return faClock;
      case 'Failed': return faTimesCircle;
      default: return faClock;
    }
  };

  const getStatusColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIconColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'Completed': return 'text-green-500';
      case 'Pending': return 'text-yellow-500';
      case 'Failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer</th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount</th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.name}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.date}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.amount}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    <FontAwesomeIcon 
                      icon={getStatusIcon(transaction.status)} 
                      className={`mr-1 ${getStatusIconColor(transaction.status)}`} 
                    />
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;