import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { apiService } from "../services/api";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      const transactionId = searchParams.get("transaction_id");
      const tx_ref = searchParams.get("tx_ref");

      // Flutterwave typically redirects with transaction_id, status, and tx_ref
      // Use transaction_id as primary, fallback to tx_ref, then reference
      const verificationId = transactionId || tx_ref || reference;

      if (!verificationId) {
        setStatus("error");
        setMessage("Invalid payment reference. Please contact support.");
        return;
      }

      try {
        let response;

        // Determine which verification method to use based on available parameters
        if (transactionId) {
          // Flutterwave redirect typically includes transaction_id
          response = await apiService.verifyPayment(
            transactionId,
            "transaction_id"
          );
        } else if (tx_ref) {
          // Sometimes tx_ref is used
          response = await apiService.verifyPayment(tx_ref, "reference");
        } else if (reference) {
          // Fallback to reference
          response = await apiService.verifyPayment(reference, "reference");
        } else {
          throw new Error("No valid payment identifier found");
        }

        if (response.is_pro) {
          // Redirect immediately after successful verification
          navigate("/tasks");
        } else {
          setStatus("error");
          setMessage(
            "Payment verification failed. Please try again or contact support."
          );
        }
      } catch (error: unknown) {
        console.error("Payment verification error:", error);
        setStatus("error");

        let errorMessage =
          "Payment verification failed. Please try again or contact support.";
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as {
            response?: { data?: { message?: string } };
          };
          errorMessage = apiError.response?.data?.message || errorMessage;
        }

        setMessage(errorMessage);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const handleBackToTasks = () => {
    navigate("/tasks");
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
        {status === "verifying" && (
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 dark:border-gray-200 mx-auto mb-6'></div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              Verifying Payment
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Please wait while we verify your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className='text-center'>
            <div className='h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='h-10 w-10 text-green-600 dark:text-green-400' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              Payment Successful!
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>{message}</p>
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6'>
              <div className='flex items-center justify-center space-x-2'>
                <div className='h-5 w-5 rounded-full bg-gray-800 dark:bg-gray-200'></div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Pro Plan Activated
                </span>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                You now have unlimited tasks and access to all premium features.
              </p>
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
              Redirecting you to your tasks in a few seconds...
            </p>
            <button
              onClick={handleBackToTasks}
              className='flex items-center space-x-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all mx-auto'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>Go to Tasks</span>
            </button>
          </div>
        )}

        {status === "error" && (
          <div className='text-center'>
            <div className='h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6'>
              <AlertCircle className='h-10 w-10 text-red-600 dark:text-red-400' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              Payment Failed
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>{message}</p>
            <div className='space-y-3'>
              <button
                onClick={handleBackToTasks}
                className='w-full flex items-center justify-center space-x-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all'
              >
                <ArrowLeft className='h-4 w-4' />
                <span>Back to Tasks</span>
              </button>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Need help? Contact our support team.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
