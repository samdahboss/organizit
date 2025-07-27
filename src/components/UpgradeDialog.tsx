import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Crown, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState<'initial' | 'processing' | 'success' | 'error'>('initial');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInitializePayment = async () => {
    try {
      setStep('processing');
      const response = await apiService.initializePayment();
      setPaymentUrl(response.payment_url);
      
      // Simulate payment verification after a delay
      setTimeout(async () => {
        try {
          await apiService.verifyPayment(response.payment_reference);
          setStep('success');
          setTimeout(() => {
            onSuccess();
            handleClose();
          }, 2000);
        } catch (err) {
          setStep('error');
          setError('Payment verification failed. Please try again.');
        }
      }, 3000);
    } catch (err) {
      setStep('error');
      setError('Failed to initialize payment. Please try again.');
    }
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('initial');
      setPaymentUrl('');
      setError('');
      onClose();
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                This is a mock payment. In a real application, you would be redirected to a payment gateway.
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">You have been upgraded to Pro plan.</p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-green-700">Pro Plan Activated</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                You now have unlimited tasks and access to all premium features.
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleInitializePayment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return (
          <>
            <div className="text-center mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upgrade to Pro</h3>
              <p className="text-gray-600">Unlock unlimited tasks and premium features</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Pro Plan Benefits:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Unlimited tasks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Team collaboration</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Pro Plan</h4>
                    <p className="text-sm text-blue-700">One-time payment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">$9.99</p>
                    <p className="text-xs text-blue-600">USD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleInitializePayment}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
              >
                <CreditCard className="h-4 w-4" />
                <span>Upgrade Now</span>
              </button>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                This is a demo payment. No real charges will be made.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              {step === 'processing' ? 'Processing Payment' : 
               step === 'success' ? 'Payment Successful' :
               step === 'error' ? 'Payment Failed' : 'Upgrade to Pro'}
            </Dialog.Title>
            {step !== 'processing' && (
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            )}
          </div>

          {renderContent()}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default UpgradeDialog; 