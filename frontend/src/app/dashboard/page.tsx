'use client';
import StatsGrid from '../components/StatsGrid';
import ActivityChart from '../components/ActivityChart';
import RecentTransactions from '../components/RecentTransactions';
import TopProducts from '../components/TopProducts';
import { useDarkMode } from '../context/DarkModeContext';
import AccessRoute from '../components/AccessRoute';

export default function DashboardPage() {
  const { darkMode } = useDarkMode();

  return (
    <>
     <AccessRoute
      // requiredRoles={['Admin', 'Super Admin']} // only these roles can access
      // requiredPermissions={['view-products']} // or required permission
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatsGrid darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivityChart darkMode={darkMode} />
        <RecentTransactions darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TopProducts darkMode={darkMode} />
      </div>
      </AccessRoute>
    </>
  );
}