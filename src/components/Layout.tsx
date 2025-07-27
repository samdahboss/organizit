import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Home, ListTodo, CreditCard, Settings, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userPlan?: {
    is_pro: boolean;
    plan: string;
  } | null;
}

const Layout: React.FC<LayoutProps> = ({ children, userPlan }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                {userPlan?.is_pro && (
                  <Crown className="ml-2 h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 