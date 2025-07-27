import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Settings,
  Edit,
  Save,
  X,
  Crown,
  CheckCircle,
} from "lucide-react";
import { apiService, type UserPlan } from "../services/api";

const Profile: React.FC = () => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Demo User",
    email: "demo@example.com",
    company: "Demo Company",
    role: "User",
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        await apiService.setupDemo();
        const plan = await apiService.getUserPlan();
        setUserPlan(plan);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "Demo User",
      email: "demo@example.com",
      company: "Demo Company",
      role: "User",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Profile</h1>
          <p className='text-gray-600 mt-1'>
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className='flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200'
        >
          {isEditing ? <X className='h-4 w-4' /> : <Edit className='h-4 w-4' />}
          <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white'>
          <div className='flex items-center space-x-6'>
            <div className='w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
              <User className='w-10 h-10' />
            </div>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold mb-2'>{formData.name}</h2>
              <p className='text-blue-100'>{formData.email}</p>
              <div className='flex items-center space-x-2 mt-3'>
                {userPlan?.is_pro ? (
                  <Crown className='h-5 w-5 text-yellow-300' />
                ) : (
                  <div className='h-5 w-5 rounded-full bg-white bg-opacity-20'></div>
                )}
                <span className='text-sm'>
                  {userPlan?.is_pro ? "Pro Plan" : "Free Plan"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='p-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Personal Information */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Personal Information
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  ) : (
                    <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                      <User className='h-5 w-5 text-gray-400' />
                      <span className='text-gray-900'>{formData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  ) : (
                    <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                      <Mail className='h-5 w-5 text-gray-400' />
                      <span className='text-gray-900'>{formData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  ) : (
                    <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                      <div className='h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center'>
                        <span className='text-xs font-medium text-blue-600'>
                          C
                        </span>
                      </div>
                      <span className='text-gray-900'>{formData.company}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value='User'>User</option>
                      <option value='Admin'>Admin</option>
                      <option value='Manager'>Manager</option>
                    </select>
                  ) : (
                    <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                      <Shield className='h-5 w-5 text-gray-400' />
                      <span className='text-gray-900'>{formData.role}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className='flex space-x-3 pt-4'>
                  <button
                    onClick={handleSave}
                    className='flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                  >
                    <Save className='h-4 w-4' />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className='flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors'
                  >
                    <X className='h-4 w-4' />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Account Information
              </h3>

              <div className='space-y-4'>
                <div className='p-4 bg-blue-50 rounded-xl border border-blue-200'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                      <Calendar className='h-5 w-5 text-blue-600' />
                    </div>
                    <div>
                      <p className='font-medium text-blue-900'>Member Since</p>
                      <p className='text-sm text-blue-700'>January 2024</p>
                    </div>
                  </div>
                </div>

                <div className='p-4 bg-green-50 rounded-xl border border-green-200'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-green-100 rounded-lg'>
                      <CheckCircle className='h-5 w-5 text-green-600' />
                    </div>
                    <div>
                      <p className='font-medium text-green-900'>
                        Account Status
                      </p>
                      <p className='text-sm text-green-700'>Active</p>
                    </div>
                  </div>
                </div>

                <div className='p-4 bg-purple-50 rounded-xl border border-purple-200'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-purple-100 rounded-lg'>
                      <Crown className='h-5 w-5 text-purple-600' />
                    </div>
                    <div>
                      <p className='font-medium text-purple-900'>
                        Subscription
                      </p>
                      <p className='text-sm text-purple-700'>
                        {userPlan?.is_pro ? "Pro Plan" : "Free Plan"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='p-4 bg-gray-50 rounded-xl border border-gray-200'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-gray-100 rounded-lg'>
                      <Settings className='h-5 w-5 text-gray-600' />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>Preferences</p>
                      <p className='text-sm text-gray-700'>Default settings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
        <h3 className='text-lg font-semibold text-gray-900 mb-6'>
          Account Actions
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <button className='flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Shield className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='font-medium text-gray-900'>Change Password</p>
                <p className='text-sm text-gray-600'>Update your password</p>
              </div>
            </div>
            <div className='text-gray-400'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>
          </button>

          <button className='flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <Settings className='h-5 w-5 text-orange-600' />
              </div>
              <div>
                <p className='font-medium text-gray-900'>
                  Notification Settings
                </p>
                <p className='text-sm text-gray-600'>
                  Manage your notifications
                </p>
              </div>
            </div>
            <div className='text-gray-400'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>
          </button>

          <button className='flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <User className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className='font-medium text-gray-900'>Privacy Settings</p>
                <p className='text-sm text-gray-600'>Manage your privacy</p>
              </div>
            </div>
            <div className='text-gray-400'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>
          </button>

          <button className='flex items-center justify-between p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <svg
                  className='h-5 w-5 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </div>
              <div>
                <p className='font-medium text-gray-900'>Delete Account</p>
                <p className='text-sm text-gray-600'>
                  Permanently delete your account
                </p>
              </div>
            </div>
            <div className='text-gray-400'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
