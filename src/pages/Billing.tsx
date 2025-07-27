import React, { useState, useEffect } from "react";
import {
  Crown,
  CreditCard,
  CheckCircle,
  Zap
} from "lucide-react";
import { apiService, type UserPlan } from "../services/api";
import UpgradeDialog from "../components/UpgradeDialog";

const Billing: React.FC = () => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const planData = await apiService.getUserPlan();
      setUserPlan(planData);
    } catch (err) {
      console.error("Failed to load billing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSuccess = async () => {
    await loadData();
    setShowUpgradeDialog(false);
  };

  const mockPaymentHistory = [
    {
      id: 1,
      date: "2024-01-15",
      amount: 9.99,
      status: "completed",
      description: "Pro Plan - Monthly",
      reference: "PAY_ABC123456",
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Billing & Subscription
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage your subscription and billing information
          </p>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center space-x-3 mb-4'>
              {userPlan?.is_pro ? (
                <Crown className='h-8 w-8 text-yellow-300' />
              ) : (
                <div className='h-8 w-8 rounded-full bg-white bg-opacity-20'></div>
              )}
              <h2 className='text-2xl font-bold'>
                {userPlan?.is_pro ? "Pro Plan" : "Free Plan"}
              </h2>
            </div>
            <p className='text-blue-100 text-lg mb-6'>
              {userPlan?.is_pro
                ? "You have access to all premium features"
                : "Upgrade to unlock unlimited tasks and premium features"}
            </p>
            {!userPlan?.is_pro && (
              <button
                onClick={() => setShowUpgradeDialog(true)}
                className='bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
              >
                Upgrade to Pro
              </button>
            )}
          </div>
          <div className='hidden md:block'>
            <div className='w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
              <Crown className='w-10 h-10 text-yellow-300' />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Free Plan */}
        <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-200'>
          <div className='text-center mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>Free Plan</h3>
            <div className='mb-6'>
              <span className='text-5xl font-bold text-gray-900'>$0</span>
              <span className='text-gray-600 text-lg'>/month</span>
            </div>
            <p className='text-gray-600'>Perfect for getting started</p>
          </div>

          <div className='space-y-4 mb-8'>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <span className='text-gray-700'>Up to 5 tasks</span>
            </div>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <span className='text-gray-700'>Basic task management</span>
            </div>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <span className='text-gray-700'>Email support</span>
            </div>
            <div className='flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              <span className='text-gray-700'>Mobile responsive</span>
            </div>
          </div>

          {!userPlan?.is_pro && (
            <div className='p-4 bg-gray-50 rounded-xl text-center'>
              <p className='text-sm text-gray-600 font-medium'>Current Plan</p>
            </div>
          )}
        </div>

        {/* Pro Plan */}
        <div className='bg-white rounded-2xl p-8 shadow-lg border-2 border-yellow-300 relative'>
          {userPlan?.is_pro && (
            <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
              <span className='bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold'>
                Current Plan
              </span>
            </div>
          )}

          <div className='text-center mb-8'>
            <div className='flex items-center justify-center space-x-2 mb-2'>
              <Crown className='h-6 w-6 text-yellow-500' />
              <h3 className='text-2xl font-bold text-gray-900'>Pro Plan</h3>
            </div>
            <div className='mb-6'>
              <span className='text-5xl font-bold text-gray-900'>$9.99</span>
              <span className='text-gray-600 text-lg'>/month</span>
            </div>
            <p className='text-gray-600'>Unlock unlimited potential</p>
          </div>

          <div className='space-y-4 mb-8'>
            <div className='flex items-center space-x-3'>
              <Zap className='h-5 w-5 text-yellow-500' />
              <span className='text-gray-700 font-medium'>Unlimited tasks</span>
            </div>
            <div className='flex items-center space-x-3'>
              <Zap className='h-5 w-5 text-yellow-500' />
              <span className='text-gray-700 font-medium'>
                Advanced features
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <Zap className='h-5 w-5 text-yellow-500' />
              <span className='text-gray-700 font-medium'>
                Priority support
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <Zap className='h-5 w-5 text-yellow-500' />
              <span className='text-gray-700 font-medium'>
                Team collaboration
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <Zap className='h-5 w-5 text-yellow-500' />
              <span className='text-gray-700 font-medium'>
                Advanced analytics
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <Zap className='h-5 w-5 text-yellow-500' />
              <span className='text-gray-700 font-medium'>
                Custom integrations
              </span>
            </div>
          </div>

          {!userPlan?.is_pro && (
            <button
              onClick={() => setShowUpgradeDialog(true)}
              className='w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg'
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* Plan Details */}
      <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-900 mb-6'>
          Plan Details
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Current Usage
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700'>Task Limit</span>
                  <span className='font-semibold'>
                    {userPlan?.is_pro
                      ? "Unlimited"
                      : `${userPlan?.remaining_tasks || 0} remaining`}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700'>Current Tasks</span>
                  <span className='font-semibold'>
                    {userPlan?.current_tasks || 0}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700'>Plan Status</span>
                  <span
                    className={`font-semibold ${
                      userPlan?.is_pro ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {userPlan?.is_pro ? "Active" : "Free"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Plan Features
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  <span className='text-gray-700'>
                    {userPlan?.is_pro ? "Unlimited tasks" : "Up to 5 tasks"}
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  <span className='text-gray-700'>Task management</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  <span className='text-gray-700'>Basic support</span>
                </div>
                {userPlan?.is_pro && (
                  <>
                    <div className='flex items-center space-x-3'>
                      <Zap className='h-5 w-5 text-yellow-500' />
                      <span className='text-gray-700'>Priority support</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <Zap className='h-5 w-5 text-yellow-500' />
                      <span className='text-gray-700'>Advanced analytics</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <Zap className='h-5 w-5 text-yellow-500' />
                      <span className='text-gray-700'>Team collaboration</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {userPlan?.is_pro && (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='p-8 border-b border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Payment History
            </h2>
          </div>
          <div className='p-8'>
            <div className='space-y-4'>
              {mockPaymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className='flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='p-3 bg-green-100 rounded-lg'>
                      <CheckCircle className='h-5 w-5 text-green-600' />
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>
                        {payment.description}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {payment.reference}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-gray-900'>
                      ${payment.amount}
                    </p>
                    <p className='text-sm text-gray-500'>{payment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Billing Information */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='p-8 border-b border-gray-100'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Billing Information
          </h2>
        </div>
        <div className='p-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Payment Method
              </h3>
              <div className='flex items-center space-x-4 p-6 border border-gray-200 rounded-xl'>
                <div className='p-3 bg-blue-100 rounded-lg'>
                  <CreditCard className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>
                    Demo Payment Method
                  </p>
                  <p className='text-sm text-gray-500'>
                    This is a mock payment system
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Billing Address
              </h3>
              <div className='p-6 border border-gray-200 rounded-xl'>
                <p className='font-semibold text-gray-900'>Demo User</p>
                <p className='text-gray-600'>demo@example.com</p>
                <p className='text-gray-600'>Demo Address</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        onSuccess={handleUpgradeSuccess}
      />
    </div>
  );
};

export default Billing;
