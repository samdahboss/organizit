import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Circle,
  Crown,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  Zap,
  CreditCard,
  User,
} from "lucide-react";
import { apiService } from "../services/api";
import type { Task, UserPlan } from "../services/api";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await apiService.setupDemo();
        const [tasksData, planData] = await Promise.all([
          apiService.getTasks(),
          apiService.getUserPlan(),
        ]);
        setTasks(tasksData.tasks);
        setUserPlan(planData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentTasks = tasks.slice(0, 5);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16'>
      {/* Welcome Header */}
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Welcome back!</h1>
            <p className='text-blue-100 text-lg'>
              Here's what's happening with your tasks today
            </p>
          </div>
          <div className='hidden sm:block'>
            <div className='w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
              <Zap className='w-8 h-8' />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
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
              <p className='text-sm font-medium text-gray-600'>Pending</p>
              <p className='text-2xl font-bold text-orange-600'>
                {pendingTasks}
              </p>
            </div>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <Clock className='h-6 w-6 text-orange-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Progress</p>
              <p className='text-2xl font-bold text-purple-600'>
                {progressPercentage}%
              </p>
            </div>
            <div className='p-3 bg-purple-100 rounded-lg'>
              <TrendingUp className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Task Progress</h2>
          <span className='text-sm text-gray-600'>
            {completedTasks} of {totalTasks} completed
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-3'>
          <div
            className='bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Link
          to='/tasks'
          className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Manage Tasks
              </h3>
              <p className='text-gray-600 text-sm'>
                View and organize all your tasks
              </p>
            </div>
            <div className='p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors'>
              <Circle className='h-6 w-6 text-blue-600' />
            </div>
          </div>
          <div className='flex items-center mt-4 text-blue-600 group-hover:text-blue-700'>
            <span className='text-sm font-medium'>View Tasks</span>
            <ArrowRight className='h-4 w-4 ml-2' />
          </div>
        </Link>

        <Link
          to='/billing'
          className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Billing
              </h3>
              <p className='text-gray-600 text-sm'>Manage your subscription</p>
            </div>
            <div className='p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
              <CreditCard className='h-6 w-6 text-green-600' />
            </div>
          </div>
          <div className='flex items-center mt-4 text-green-600 group-hover:text-green-700'>
            <span className='text-sm font-medium'>View Billing</span>
            <ArrowRight className='h-4 w-4 ml-2' />
          </div>
        </Link>

        <Link
          to='/profile'
          className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Profile
              </h3>
              <p className='text-gray-600 text-sm'>
                Update your account settings
              </p>
            </div>
            <div className='p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors'>
              <User className='h-6 w-6 text-purple-600' />
            </div>
          </div>
          <div className='flex items-center mt-4 text-purple-600 group-hover:text-purple-700'>
            <span className='text-sm font-medium'>View Profile</span>
            <ArrowRight className='h-4 w-4 ml-2' />
          </div>
        </Link>
      </div>

      {/* Recent Tasks */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Recent Tasks
            </h2>
            <Link
              to='/tasks'
              className='text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center'
            >
              View All
              <ArrowRight className='h-4 w-4 ml-1' />
            </Link>
          </div>
        </div>

        {recentTasks.length === 0 ? (
          <div className='p-8 text-center'>
            <div className='h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Circle className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No tasks yet
            </h3>
            <p className='text-gray-600 mb-4'>
              Get started by adding your first task
            </p>
            <Link
              to='/tasks'
              className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200'
            >
              Add Task
            </Link>
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className='p-6 hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-start space-x-4'>
                  <div className='mt-1'>
                    {task.status === "completed" ? (
                      <CheckCircle className='h-5 w-5 text-green-500' />
                    ) : (
                      <Circle className='h-5 w-5 text-gray-400' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3
                      className={`text-sm font-medium ${
                        task.status === "completed"
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className='flex items-center space-x-2 mt-1'>
                      <div className='flex items-center space-x-1 text-xs text-gray-500'>
                        <Calendar className='h-3 w-3' />
                        <span>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Status */}
      {userPlan && (
        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {userPlan.is_pro ? (
                <div className='p-2 bg-yellow-100 rounded-lg'>
                  <Crown className='h-5 w-5 text-yellow-600' />
                </div>
              ) : (
                <div className='p-2 bg-gray-100 rounded-lg'>
                  <div className='h-5 w-5 rounded-full bg-gray-400'></div>
                </div>
              )}
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {userPlan.is_pro ? "Pro Plan" : "Free Plan"}
                </h3>
                <p className='text-gray-600 text-sm'>
                  {userPlan.is_pro
                    ? "Unlimited tasks and premium features"
                    : `${userPlan.remaining_tasks} tasks remaining`}
                </p>
              </div>
            </div>
            {!userPlan.is_pro && (
              <Link
                to='/billing'
                className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200'
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
