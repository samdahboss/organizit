import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Crown, Settings, Bell, Shield, Download, Trash2 } from 'lucide-react';
import { apiService, UserPlan } from '../services/api';

const Profile: React.FC = () => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    created_at: '2024-01-01'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const planData = await apiService.getUserPlan();
      setUserPlan(planData);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Plan</p>
                <p className="text-gray-900">{userPlan?.is_pro ? 'Pro Plan' : 'Free Plan'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Account Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Tasks</span>
                <span className="font-medium">{userPlan?.current_tasks || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Task Limit</span>
                <span className="font-medium">
                  {userPlan?.is_pro ? 'Unlimited' : `${userPlan?.remaining_tasks || 0} remaining`}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Account Status</span>
                <span className={`font-medium ${
                  userPlan?.is_pro ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {userPlan?.is_pro ? 'Active' : 'Free'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Auto-save</p>
                  <p className="text-sm text-gray-500">Automatically save changes</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Two-factor Auth</p>
                  <p className="text-sm text-gray-500">Enhanced security</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Export Data</p>
                  <p className="text-sm text-gray-500">Download your tasks and data</p>
                </div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Account Settings</p>
                  <p className="text-sm text-gray-500">Manage account preferences</p>
                </div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {userPlan?.is_pro ? (
                <Crown className="h-6 w-6 text-yellow-500" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>
              )}
              <h3 className="text-lg font-medium text-gray-900">
                {userPlan?.is_pro ? 'Pro Plan' : 'Free Plan'}
              </h3>
            </div>
            <p className="text-gray-600">
              {userPlan?.is_pro ? 'Unlimited tasks and features' : 'Basic task management'}
            </p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Task Usage</h3>
            <p className="text-2xl font-bold text-gray-900">{userPlan?.current_tasks || 0}</p>
            <p className="text-sm text-gray-600">
              {userPlan?.is_pro ? 'of unlimited' : `of ${userPlan?.task_limit || 5}`}
            </p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              userPlan?.is_pro 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {userPlan?.is_pro ? 'Active' : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Support & Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Get Help</h3>
            <div className="space-y-3">
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Documentation</p>
                <p className="text-sm text-gray-500">Learn how to use the app</p>
              </a>
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Contact Support</p>
                <p className="text-sm text-gray-500">Get help from our team</p>
              </a>
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">FAQ</p>
                <p className="text-sm text-gray-500">Frequently asked questions</p>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">Update your password</p>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Privacy Settings</p>
                <p className="text-sm text-gray-500">Manage your privacy</p>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">API Access</p>
                <p className="text-sm text-gray-500">Manage API keys</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 