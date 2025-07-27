<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Initialize a mock payment for pro upgrade
     */
    public function initialize(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Check if user is already pro
        if ($user->isPro()) {
            return response()->json([
                'message' => 'You are already on the Pro plan',
            ], 400);
        }

        // Generate a mock payment reference
        $paymentReference = 'PAY_' . strtoupper(Str::random(10));
        
        // Store payment reference in session for verification
        session(['payment_reference' => $paymentReference]);

        return response()->json([
            'message' => 'Payment initialized successfully',
            'payment_reference' => $paymentReference,
            'payment_url' => env('APP_URL') . '/api/payment/verify?reference=' . $paymentReference,
            'amount' => 999, // $9.99 in cents
            'currency' => 'USD',
            'description' => 'Upgrade to Pro Plan',
        ]);
    }

    /**
     * Verify payment and upgrade user to pro
     */
    public function verify(Request $request): JsonResponse
    {
        $user = $request->user();
        $reference = $request->query('reference');
        
        // Check if user is already pro
        if ($user->isPro()) {
            return response()->json([
                'message' => 'You are already on the Pro plan',
            ], 400);
        }

        // In a real implementation, you would verify the payment with the payment gateway
        // For this mock implementation, we'll simulate a successful payment
        if ($reference && Str::startsWith($reference, 'PAY_')) {
            // Update user to pro plan
            $user->update(['plan' => 'pro']);
            
            return response()->json([
                'message' => 'Payment successful! You have been upgraded to Pro.',
                'plan' => 'pro',
                'is_pro' => true,
                'task_limit' => $user->getTaskLimit(),
            ]);
        }

        return response()->json([
            'message' => 'Payment verification failed',
        ], 400);
    }

    /**
     * Mock payment webhook (for testing purposes)
     */
    public function webhook(Request $request): JsonResponse
    {
        // In a real implementation, this would be called by the payment gateway
        // For testing, we'll simulate a successful payment webhook
        
        $user = $request->user();
        
        if ($user && !$user->isPro()) {
            $user->update(['plan' => 'pro']);
            
            return response()->json([
                'message' => 'Webhook processed successfully',
                'plan' => 'pro',
            ]);
        }

        return response()->json([
            'message' => 'Webhook processed',
        ]);
    }
} 