import React, { useEffect } from "react";
import { apiService } from "../services/api";

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
    <div className='min-h-screen bg-gray-100'>
      {/* Main content */}
      <div className='lg:mx-32'>
        {/* Page content */}
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
