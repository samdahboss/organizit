import React, { useState, useEffect } from "react";
import {
  Crown,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";
import { apiService, UserPlan } from "../services/api";
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
          <h1 className='text-3xl font-bold text-gray-900'>
            Billing & Subscription
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage your subscription and billing information
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>
              Current Plan
            </h2>
            <div className='flex items-center space-x-2 mt-2'>
              {userPlan?.is_pro ? (
                <Crown className='h-5 w-5 text-yellow-500' />
              ) : (
                <div className='h-5 w-5 rounded-full bg-gray-300'></div>
              )}
              <span className='text-lg font-medium'>
                {userPlan?.is_pro ? "Pro Plan" : "Free Plan"}
              </span>
            </div>
          </div>
          {!userPlan?.is_pro && (
            <button
              onClick={() => setShowUpgradeDialog(true)}
              className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all'
            >
              Upgrade to Pro
            </button>
          )}
        </div>

        {/* Plan Details */}
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Plan Features</h3>
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

          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Plan Limits</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700'>Task Limit</span>
                <span className='font-medium'>
                  {userPlan?.is_pro
                    ? "Unlimited"
                    : `${userPlan?.remaining_tasks || 0} remaining`}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700'>Current Tasks</span>
                <span className='font-medium'>
                  {userPlan?.current_tasks || 0}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700'>Plan Status</span>
                <span
                  className={`font-medium ${
                    userPlan?.is_pro ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {userPlan?.is_pro ? "Active" : "Free"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Free Plan */}
        <div className='bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200'>
          <div className='text-center'>
            <h3 className='text-xl font-semibold text-gray-900'>Free Plan</h3>
            <div className='mt-4'>
              <span className='text-4xl font-bold text-gray-900'>$0</span>
              <span className='text-gray-600'>/month</span>
            </div>
            <ul className='mt-6 space-y-3 text-left'>
              <li className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span className='text-gray-700'>Up to 5 tasks</span>
              </li>
              <li className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span className='text-gray-700'>Basic task management</span>
              </li>
              <li className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span className='text-gray-700'>Email support</span>
              </li>
            </ul>
            {!userPlan?.is_pro && (
              <div className='mt-6 p-3 bg-gray-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Current Plan</p>
              </div>
            )}
          </div>
        </div>

        {/* Pro Plan */}
        <div className='bg-white rounded-lg shadow-sm p-6 border-2 border-yellow-300 relative'>
          {userPlan?.is_pro && (
            <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
              <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                Current Plan
              </span>
            </div>
          )}
          <div className='text-center'>
            <div className='flex items-center justify-center space-x-2 mb-2'>
              <Crown className='h-5 w-5 text-yellow-500' />
              <h3 className='text-xl font-semibold text-gray-900'>Pro Plan</h3>
            </div>
            <div className='mt-4'>
              <span className='text-4xl font-bold text-gray-900'>$9.99</span>
              <span className='text-gray-600'>/month</span>
            </div>
            <ul className='mt-6 space-y-3 text-left'>
              <li className='flex items-center space-x-2'>
                <Zap className='h-4 w-4 text-yellow-500' />
                <span className='text-gray-700'>Unlimited tasks</span>
              </li>
              <li className='flex items-center space-x-2'>
                <Zap className='h-4 w-4 text-yellow-500' />
                <span className='text-gray-700'>Advanced features</span>
              </li>
              <li className='flex items-center space-x-2'>
                <Zap className='h-4 w-4 text-yellow-500' />
                <span className='text-gray-700'>Priority support</span>
              </li>
              <li className='flex items-center space-x-2'>
                <Zap className='h-4 w-4 text-yellow-500' />
                <span className='text-gray-700'>Team collaboration</span>
              </li>
            </ul>
            {!userPlan?.is_pro && (
              <button
                onClick={() => setShowUpgradeDialog(true)}
                className='mt-6 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all'
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      {userPlan?.is_pro && (
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Payment History
          </h2>
          <div className='space-y-4'>
            {mockPaymentHistory.map((payment) => (
              <div
                key={payment.id}
                className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
              >
                <div className='flex items-center space-x-4'>
                  <div className='p-2 bg-green-100 rounded-lg'>
                    <CheckCircle className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {payment.description}
                    </p>
                    <p className='text-sm text-gray-500'>{payment.reference}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium text-gray-900'>${payment.amount}</p>
                  <p className='text-sm text-gray-500'>{payment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Information */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Billing Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Payment Method
            </h3>
            <div className='flex items-center space-x-3 p-4 border border-gray-200 rounded-lg'>
              <CreditCard className='h-6 w-6 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Demo Payment Method</p>
                <p className='text-sm text-gray-500'>
                  This is a mock payment system
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Billing Address
            </h3>
            <div className='p-4 border border-gray-200 rounded-lg'>
              <p className='text-gray-900'>Demo User</p>
              <p className='text-gray-600'>demo@example.com</p>
              <p className='text-gray-600'>Demo Address</p>
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
