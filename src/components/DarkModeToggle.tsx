import React from "react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className='p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className='h-5 w-5 text-gray-800 dark:text-gray-200' />
      ) : (
        <Moon className='h-5 w-5 text-gray-800 dark:text-gray-200' />
      )}
    </button>
  );
};

export default DarkModeToggle;
