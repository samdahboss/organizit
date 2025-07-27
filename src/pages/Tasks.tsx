import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Crown,
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
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <p className='text-red-600'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
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
          <h1 className='text-3xl font-bold text-gray-900'>Tasks</h1>
          <p className='text-gray-600 mt-1'>
            Manage and organize your tasks efficiently
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          {userPlan && (
            <div className='hidden sm:flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200'>
              {userPlan.is_pro ? (
                <Crown className='h-4 w-4 text-yellow-500' />
              ) : (
                <div className='h-4 w-4 rounded-full bg-gray-300'></div>
              )}
              <span className='text-sm font-medium text-gray-700'>
                {userPlan.is_pro ? "Pro" : "Free"}
              </span>
              {!userPlan.is_pro && (
                <span className='text-xs text-gray-500'>
                  ({userPlan.remaining_tasks} left)
                </span>
              )}
            </div>
          )}
          <button
            onClick={() => setShowAddDialog(true)}
            className='flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg'
          >
            <Plus className='h-4 w-4' />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Tasks</p>
              <p className='text-2xl font-bold text-gray-900'>{totalTasks}</p>
            </div>
            <div className='p-3 bg-blue-100 rounded-lg'>
              <Circle className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Completed</p>
              <p className='text-2xl font-bold text-green-600'>
                {completedTasks}
              </p>
            </div>
            <div className='p-3 bg-green-100 rounded-lg'>
              <CheckCircle className='h-6 w-6 text-green-600' />
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Progress</p>
              <p className='text-2xl font-bold text-purple-600'>
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className='p-3 bg-purple-100 rounded-lg'>
              <div className='w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search tasks...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Filter className='h-4 w-4 text-gray-400' />
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "completed" | "pending")
              }
              className='px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>All Tasks</option>
              <option value='pending'>Pending</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        {filteredTasks.length === 0 ? (
          <div className='p-12 text-center'>
            <div className='h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='h-10 w-10 text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              {searchTerm ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first task to organize your work"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddDialog(true)}
                className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg'
              >
                Add Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className='p-6 hover:bg-gray-50 transition-all duration-200'
              >
                <div className='flex items-start space-x-4'>
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className='mt-1 flex-shrink-0 transition-all duration-200 hover:scale-110'
                  >
                    {task.status === "completed" ? (
                      <CheckCircle className='h-6 w-6 text-green-500' />
                    ) : (
                      <Circle className='h-6 w-6 text-gray-400 hover:text-blue-500' />
                    )}
                  </button>
                  <div className='flex-1 min-w-0'>
                    <h3
                      className={`text-lg font-semibold ${
                        task.status === "completed"
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p
                        className={`mt-2 text-sm ${
                          task.status === "completed"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                    <div className='flex items-center space-x-4 mt-3'>
                      <div className='flex items-center space-x-1 text-xs text-gray-500'>
                        <Calendar className='h-3 w-3' />
                        <span>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className='flex items-center space-x-1 text-xs text-gray-500'>
                        <Clock className='h-3 w-3' />
                        <span>
                          {new Date(task.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className='flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Banner for Free Users */}
      {userPlan && !userPlan.is_pro && userPlan.remaining_tasks <= 2 && (
        <div className='bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <Crown className='h-5 w-5 text-yellow-600' />
              </div>
              <div>
                <h3 className='text-lg font-semibold text-yellow-800'>
                  Upgrade to Pro
                </h3>
                <p className='text-yellow-700 mt-1'>
                  You have {userPlan.remaining_tasks} tasks remaining. Upgrade
                  to Pro for unlimited tasks!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeDialog(true)}
              className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg'
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

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
