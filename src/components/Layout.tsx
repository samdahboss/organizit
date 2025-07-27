import React, { useEffect } from "react";
import { apiService } from "../services/api";
import DarkModeToggle from "./DarkModeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const loadUserPlan = async () => {
      try {
        await apiService.getUserPlan();
      } catch (error) {
        console.error("Failed to load user plan:", error);
      }
    };
    loadUserPlan();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      {/* Header with dark mode toggle */}
      <div className='lg:mx-32'>
        <div className='flex justify-end p-4'>
          <DarkModeToggle />
        </div>
        {/* Page content */}
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
