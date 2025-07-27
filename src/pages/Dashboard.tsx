import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Crown, TrendingUp, Calendar, ListTodo } from 'lucide-react';
import { apiService, Task, UserPlan } from '../services/api';
import AddTaskDialog from '../components/AddTaskDialog';
import UpgradeDialog from '../components/UpgradeDialog';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, planData] = await Promise.all([
        apiService.getTasks(),
        apiService.getUserPlan(),
      ]);
      setTasks(tasksData.tasks);
      setUserPlan(planData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string, description?: string) => {
    try {
      const response = await apiService.createTask({ title, description });
      setTasks(prev => [response.task, ...prev]);
      await loadData();
      setShowAddDialog(false);
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.upgrade_required) {
        setShowUpgradeDialog(true);
      }
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const response = await apiService.toggleTaskStatus(id);
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? response.task : task
        )
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleUpgradeSuccess = async () => {
    await loadData();
    setShowUpgradeDialog(false);
  };

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const recentTasks = tasks.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your task overview.</p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ListTodo className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Plan</p>
              <p className="text-2xl font-bold text-gray-900">
                {userPlan?.is_pro ? 'Pro' : 'Free'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Status */}
      {userPlan && !userPlan.is_pro && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Upgrade to Pro</h3>
              <p className="text-yellow-700 mt-1">
                You have {userPlan.remaining_tasks} tasks remaining. Upgrade to Pro for unlimited tasks!
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeDialog(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tasks yet. Create your first task to get started!
            </div>
          ) : (
            recentTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium ${
                      task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`mt-1 text-sm ${
                        task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Created {new Date(task.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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

export default Dashboard; 