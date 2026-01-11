import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Login from '@/components/Login';
import Dashboard from '@/components/sections/Dashboard';
import OrdersTable from '@/components/sections/OrdersTable';
import ClientsTable from '@/components/sections/ClientsTable';
import DevicesTable from '@/components/sections/DevicesTable';
import Diagnostics from '@/components/sections/Diagnostics';
import PartsTable from '@/components/sections/PartsTable';
import Warehouse from '@/components/sections/Warehouse';
import Finance from '@/components/sections/Finance';
import EmployeesTable from '@/components/sections/EmployeesTable';
import Calendar from '@/components/sections/Calendar';
import Statistics from '@/components/sections/Statistics';
import Notifications from '@/components/sections/Notifications';
import Knowledge from '@/components/sections/Knowledge';
import Settings from '@/components/sections/Settings';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'technician' | 'operator'>('admin');
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleLogin = (role: 'admin' | 'manager' | 'technician' | 'operator') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrdersTable />;
      case 'clients':
        return <ClientsTable />;
      case 'devices':
        return <DevicesTable />;
      case 'diagnostics':
        return <Diagnostics />;
      case 'parts':
        return <PartsTable />;
      case 'warehouse':
        return <Warehouse />;
      case 'finance':
        return <Finance />;
      case 'employees':
        return <EmployeesTable />;
      case 'calendar':
        return <Calendar />;
      case 'statistics':
        return <Statistics />;
      case 'notifications':
        return <Notifications />;
      case 'knowledge':
        return <Knowledge />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl gradient-purple flex items-center justify-center">
                <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-2xl font-bold">Раздел в разработке</h2>
              <p className="text-muted-foreground">
                Этот раздел скоро будет доступен
              </p>
            </div>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AdminLayout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      userRole={userRole}
    >
      {renderSection()}
    </AdminLayout>
  );
}