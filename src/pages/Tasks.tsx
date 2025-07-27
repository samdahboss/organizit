import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
  Calendar,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { apiService } from "../services/api";
import type { Task, UserPlan } from "../services/api";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      upgrade_required?: boolean;
    };
  };
}
import AddTaskDialog from "../components/AddTaskDialog";
import UpgradeDialog from "../components/UpgradeDialog";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  // Initialize demo user and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        await apiService.setupDemo();
        await loadData();
      } catch (err) {
        setError("Failed to initialize app");
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, planData] = await Promise.all([
        apiService.getTasks(),
        apiService.getUserPlan(),
      ]);
      setTasks(tasksData.tasks);
      setUserPlan(planData);
    } catch (err) {
      setError("Failed to load data");
      console.error("Data loading error:", err);
    }
  };

  const handleAddTask = async (title: string, description?: string) => {
    // Check if user has remaining tasks before attempting to create
    if (userPlan && userPlan.plan === "free" && userPlan.remaining_tasks <= 0) {
      setShowUpgradeDialog(true);
      setShowAddDialog(false);
      return;
    }

    try {
      const response = await apiService.createTask({ title, description });
      setTasks((prev) => [response.task, ...prev]);
      await loadData(); // Refresh plan data
      setShowAddDialog(false);
    } catch (err: unknown) {
      if (
        (err as ApiError)?.response?.status === 403 &&
        (err as ApiError)?.response?.data?.upgrade_required
      ) {
        setShowUpgradeDialog(true);
      } else {
        setError("Failed to create task");
      }
    }
  };

  const handleAddTaskClick = () => {
    // Check if user has remaining tasks before opening add dialog
    if (userPlan && userPlan.plan === "free" && userPlan.remaining_tasks <= 0) {
      setShowUpgradeDialog(true);
      return;
    }
    setShowAddDialog(true);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await apiService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      await loadData(); // Refresh plan data
    } catch (err: unknown) {
      console.log(err);
      setError("Failed to delete task");
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const response = await apiService.toggleTaskStatus(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.task : task))
      );
    } catch (err: unknown) {
      console.log(err);
      setError("Failed to update task");
    }
  };

  const handleUpgradeSuccess = async () => {
    await loadData();
    setShowUpgradeDialog(false);
  };

  // Filter and search tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (filter === "all") return matchesSearch;
      if (filter === "completed")
        return task.status === "completed" && matchesSearch;
      if (filter === "pending")
        return task.status === "pending" && matchesSearch;

      return matchesSearch;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = tasks.length;

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Loading your tasks...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-gray-800 dark:text-gray-200 mx-auto mb-4' />
          <p className='text-gray-800 dark:text-gray-200'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
            Tasks
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage and organize your tasks efficiently
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          {userPlan && (
            <div className='hidden sm:flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
              {userPlan.plan === "pro" ? (
                <div className='h-4 w-4 rounded-full bg-gray-800 dark:bg-gray-200'></div>
              ) : (
                <div className='h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600'></div>
              )}
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {userPlan.plan === "pro" ? "Pro" : "Free"}
              </span>
              {userPlan.plan !== "pro" && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  ({userPlan.remaining_tasks} left)
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleAddTaskClick}
            className='flex items-center space-x-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg'
          >
            <Plus className='h-4 w-4' />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Total Tasks
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {totalTasks}
              </p>
            </div>
            <div className='p-3 bg-gray-100 dark:bg-gray-700 rounded-lg'>
              <Circle className='h-6 w-6 text-gray-600 dark:text-gray-400' />
            </div>
          </div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Completed
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {completedTasks}
              </p>
            </div>
            <div className='p-3 bg-gray-100 dark:bg-gray-700 rounded-lg'>
              <CheckCircle className='h-6 w-6 text-gray-600 dark:text-gray-400' />
            </div>
          </div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Progress
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className='p-3 bg-gray-100 dark:bg-gray-700 rounded-lg'>
              <div className='w-6 h-6 border-2 border-gray-600 dark:border-gray-400 border-t-transparent rounded-full'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Banner for Free Users */}
      {userPlan &&
        userPlan.plan === "free" &&
        userPlan.remaining_tasks <= 2 && (
          <div className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                  <div className='h-5 w-5 rounded-full bg-gray-800 dark:bg-gray-200'></div>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                    Upgrade to Pro
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300 mt-1'>
                    You have {userPlan.remaining_tasks} tasks remaining. Upgrade
                    to Pro for unlimited tasks!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeDialog(true)}
                className='bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg'
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

      {/* Search and Filter */}
      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
            <input
              type='text'
              placeholder='Search tasks...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Filter className='h-4 w-4 text-gray-400 dark:text-gray-500' />
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "completed" | "pending")
              }
              className='px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent'
            >
              <option value='all'>All Tasks</option>
              <option value='pending'>Pending</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
        {filteredTasks.length === 0 ? (
          <div className='p-12 text-center'>
            <div className='h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='h-10 w-10 text-gray-400 dark:text-gray-500' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              {searchTerm ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first task to organize your work"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddTaskClick}
                className='bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg'
              >
                Add Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className='divide-y divide-gray-100 dark:divide-gray-700'>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className='p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200'
              >
                <div className='flex items-start space-x-4'>
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className='mt-1 flex-shrink-0 transition-all duration-200 hover:scale-110'
                  >
                    {task.status === "completed" ? (
                      <CheckCircle className='h-6 w-6 text-gray-800 dark:text-gray-200' />
                    ) : (
                      <Circle className='h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300' />
                    )}
                  </button>
                  <div className='flex-1 min-w-0'>
                    <h3
                      className={`text-lg font-semibold ${
                        task.status === "completed"
                          ? "text-gray-500 dark:text-gray-400 line-through"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p
                        className={`mt-2 text-sm ${
                          task.status === "completed"
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                    <div className='flex items-center space-x-4 mt-3'>
                      <div className='flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400'>
                        <Calendar className='h-3 w-3' />
                        <span>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className='flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400'>
                        <Clock className='h-3 w-3' />
                        <span>
                          {new Date(task.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className='flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddTaskDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleAddTask}
      />

      <UpgradeDialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        onSuccess={handleUpgradeSuccess}
      />
    </div>
  );
};

export default Tasks;
