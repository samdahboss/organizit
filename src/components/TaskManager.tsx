import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Crown,
  AlertCircle,
} from "lucide-react";
import { apiService } from "../services/api";
import type { Task, UserPlan } from "../services/api";
import AddTaskDialog from "./AddTaskDialog";
import UpgradeDialog from "./UpgradeDialog";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

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
      const error = err as {
        response?: { status: number; data?: { upgrade_required: boolean } };
      };
      if (
        error.response?.status === 403 &&
        error.response?.data?.upgrade_required
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
      console.log(err);
      setError("Failed to update task");
    }
  };

  const handleAddTaskClick = () => {
    console.log(userPlan)
    // Check if user has remaining tasks before opening add dialog
    // if (userPlan && userPlan.plan === "free" && userPlan.remaining_tasks <= 0) {
    //   setShowUpgradeDialog(true);
    //   return;
    // }
    // setShowAddDialog(true);
  };

  const handleUpgradeSuccess = async () => {
    await loadData();
    setShowUpgradeDialog(false);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <p className='text-red-600'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto p-6'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Task Manager</h1>
              <p className='text-gray-600 mt-1'>
                Organize your tasks efficiently
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              {userPlan && (
                <div className='text-right'>
                  <div className='flex items-center space-x-2'>
                    {userPlan.plan === "pro" ? (
                      <Crown className='h-5 w-5 text-yellow-500' />
                    ) : (
                      <div className='h-5 w-5 rounded-full bg-gray-300'></div>
                    )}
                    <span className='text-sm font-medium'>
                      {userPlan.plan === "pro" ? "Pro Plan" : "Free Plan"}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500'>
                    {userPlan.remaining_tasks} tasks remaining
                  </p>
                </div>
              )}
              <button
                onClick={handleAddTaskClick}
                className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Plus className='h-4 w-4' />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className='bg-white rounded-lg shadow-sm'>
          {tasks.length === 0 ? (
            <div className='p-8 text-center'>
              <div className='h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No tasks yet
              </h3>
              <p className='text-gray-600 mb-4'>
                Get started by adding your first task
              </p>
              <button
                onClick={handleAddTaskClick}
                className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                Add Your First Task
              </button>
            </div>
          ) : (
            <div className='divide-y divide-gray-200'>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className='p-6 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-start space-x-4'>
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className='mt-1 flex-shrink-0'
                    >
                      {task.status === "completed" ? (
                        <CheckCircle className='h-5 w-5 text-green-500' />
                      ) : (
                        <Circle className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                      )}
                    </button>
                    <div className='flex-1 min-w-0'>
                      <h3
                        className={`text-lg font-medium ${
                          task.status === "completed"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`mt-1 text-sm ${
                            task.status === "completed"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      <p className='text-xs text-gray-400 mt-2'>
                        Created {new Date(task.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className='flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors'
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
        {userPlan &&
          userPlan.plan === "free" &&
          userPlan.remaining_tasks <= 2 && (
            <div className='mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-medium text-yellow-800'>
                    Upgrade to Pro
                  </h3>
                  <p className='text-yellow-700 mt-1'>
                    You have {userPlan.remaining_tasks} tasks remaining. Upgrade
                    to Pro for unlimited tasks!
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgradeDialog(true)}
                  className='bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors'
                >
                  Upgrade Now
                </button>
              </div>
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

export default TaskManager;
