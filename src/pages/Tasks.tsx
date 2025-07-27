import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";
import { apiService, Task, UserPlan } from "../services/api";
import AddTaskDialog from "../components/AddTaskDialog";
import UpgradeDialog from "../components/UpgradeDialog";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [sortBy, setSortBy] = useState<"created_at" | "title" | "status">(
    "created_at"
  );

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
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string, description?: string) => {
    try {
      const response = await apiService.createTask({ title, description });
      setTasks((prev) => [response.task, ...prev]);
      await loadData();
      setShowAddDialog(false);
    } catch (err: any) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.upgrade_required
      ) {
        setShowUpgradeDialog(true);
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await apiService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      await loadData();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const response = await apiService.toggleTaskStatus(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.task : task))
      );
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleUpgradeSuccess = async () => {
    await loadData();
    setShowUpgradeDialog(false);
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        case "created_at":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const pendingTasks = tasks.filter((task) => task.status === "pending");

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Tasks</h1>
          <p className='text-gray-600 mt-1'>Manage and organize your tasks</p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        >
          <Plus className='h-4 w-4' />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Circle className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Tasks</p>
              <p className='text-2xl font-bold text-gray-900'>{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <Circle className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Pending</p>
              <p className='text-2xl font-bold text-gray-900'>
                {pendingTasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <CheckCircle className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Completed</p>
              <p className='text-2xl font-bold text-gray-900'>
                {completedTasks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search tasks...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='completed'>Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='created_at'>Sort by Date</option>
              <option value='title'>Sort by Title</option>
              <option value='status'>Sort by Status</option>
            </select>
          </div>

          <div className='text-sm text-gray-500'>
            {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className='bg-white rounded-lg shadow-sm'>
        {filteredTasks.length === 0 ? (
          <div className='p-8 text-center'>
            <div className='h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Circle className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {tasks.length === 0
                ? "No tasks yet"
                : "No tasks match your filters"}
            </h3>
            <p className='text-gray-600 mb-4'>
              {tasks.length === 0
                ? "Get started by adding your first task"
                : "Try adjusting your search or filters"}
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => setShowAddDialog(true)}
                className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                Add Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {filteredTasks.map((task) => (
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
                    <div className='flex items-center space-x-4 mt-2'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status === "completed" ? "Completed" : "Pending"}
                      </span>
                      <p className='text-xs text-gray-400'>
                        Created {new Date(task.created_at).toLocaleDateString()}
                      </p>
                    </div>
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
