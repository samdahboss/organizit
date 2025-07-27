import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Crown,
  Home,
  ListTodo,
  CreditCard,
  User,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { apiService } from "../services/api";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [userPlan, setUserPlan] = useState<{
    is_pro: boolean;
    remaining_tasks: number;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadUserPlan = async () => {
      try {
        const plan = await apiService.getUserPlan();
        setUserPlan(plan);
      } catch (error) {
        console.error("Failed to load user plan:", error);
      }
    };
    loadUserPlan();
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Tasks", href: "/tasks", icon: ListTodo },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo and close button */}
          <div className='flex items-center justify-between p-6 border-b border-gray-100'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <Zap className='w-5 h-5 text-white' />
              </div>
              <h1 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                Organizit
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className='lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* User plan indicator */}
          {userPlan && (
            <div className='p-4 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  {userPlan.is_pro ? (
                    <Crown className='w-5 h-5 text-yellow-500' />
                  ) : (
                    <div className='w-5 h-5 rounded-full bg-gray-300' />
                  )}
                  <span className='text-sm font-medium text-gray-700'>
                    {userPlan.is_pro ? "Pro Plan" : "Free Plan"}
                  </span>
                </div>
                {!userPlan.is_pro && (
                  <span className='text-xs text-gray-500'>
                    {userPlan.remaining_tasks} tasks left
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className='flex-1 px-4 py-6 space-y-2'>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className='p-4 border-t border-gray-100'>
            <div className='text-xs text-gray-500 text-center'>
              © 2024 Organizit
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='lg:ml-64'>
        {/* Mobile header */}
        <div className='lg:hidden bg-white shadow-sm border-b border-gray-100'>
          <div className='flex items-center justify-between px-4 py-3'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            >
              <Menu className='w-5 h-5' />
            </button>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <Zap className='w-5 h-5 text-white' />
              </div>
              <h1 className='text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                Organizit
              </h1>
            </div>
            <div className='w-10' /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
