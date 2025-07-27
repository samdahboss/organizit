<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Get or create demo user for testing
     */
    private function getDemoUser(): User
    {
        try {
            // For demo purposes, create or get a demo user
            $user = User::firstOrCreate(
                ['email' => 'demo@example.com'],
                [
                    'name' => 'Demo User',
                    'email' => 'demo@example.com',
                    'password' => bcrypt('password'),
                    'plan' => 'free'
                ]
            );

            // Ensure we have a valid User instance
            if (!$user instanceof User) {
                throw new \Exception('Failed to create or retrieve demo user');
            }

            return $user;
        } catch (\Exception $e) {
            Log::error('Error creating demo user', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Initialize Flutterwave payment for pro upgrade
     */
    public function initialize(Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();

        // Check if user is already pro
        if ($user->isPro()) {
            return response()->json([
                'message' => 'You are already on the Pro plan',
            ], 400);
        }

        try {
            // Flutterwave test credentials
            $secretKey = env('FLW_SECRET_KEY', 'FLWSECK_TEST-1234567890abcdef1234567890abcdef-X');
            $publicKey = env('FLW_PUBLIC_KEY', 'FLWPUBK_TEST-1234567890abcdef1234567890abcdef-X');

            // Generate a unique transaction reference
            $txRef = 'PAY_' . strtoupper(Str::random(10));

            // Prepare payment data
            $paymentData = [
                'tx_ref' => $txRef,
                'amount' => 2000, // N2000
                'currency' => 'NGN',
                'redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/payment/success?reference=' . $txRef,
                'customer' => [
                    'email' => $user->email,
                    'name' => $user->name,
                    'phone_number' => '1234567890'
                ],
                'customizations' => [
                    'title' => 'Organizit Pro Upgrade',
                    'description' => 'Upgrade to Pro Plan - Unlimited Tasks',
                    'logo' => env('APP_URL') . '/logo.png'
                ],
                'meta' => [
                    'user_id' => $user->id,
                    'plan' => 'pro'
                ]
            ];

            // Make request to Flutterwave API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secretKey,
                'Content-Type' => 'application/json'
            ])->post('https://api.flutterwave.com/v3/payments', $paymentData);

            if ($response->successful()) {
                $paymentData = $response->json();

                // Store payment reference in database or session
                session(['payment_reference_' . $user->id => $txRef]);

                return response()->json([
                    'message' => 'Payment initialized successfully',
                    'payment_reference' => $txRef,
                    'payment_url' => $paymentData['data']['link'],
                    'amount' => 2000,
                    'currency' => 'NGN',
                    'description' => 'Upgrade to Pro Plan',
                    'status' => 'pending'
                ]);
            } else {
                Log::error('Flutterwave payment initialization failed', [
                    'response' => $response->json(),
                    'user_id' => $user->id
                ]);

                return response()->json([
                    'message' => 'Payment initialization failed',
                    'error' => $response->json()['message'] ?? 'Unknown error'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Payment initialization error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);

            return response()->json([
                'message' => 'Payment initialization failed',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Verify Flutterwave payment and upgrade user to pro
     */
    public function verify(Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        $reference = $request->query('reference') ?? $request->input('reference');
        $transactionId = $request->query('transaction_id') ?? $request->input('transaction_id');

        // Use transaction_id if available, otherwise fall back to reference
        $verificationId = $transactionId ?? $reference;

        if (!$verificationId) {
            return response()->json([
                'message' => 'Payment reference or transaction ID is required',
            ], 400);
        }        // Check if user is already pro
        if ($user->isPro()) {
            return response()->json([
                'message' => 'You are already on the Pro plan',
            ], 400);
        }

        try {
            // Flutterwave test credentials
            $secretKey = env('FLW_SECRET_KEY', 'FLWSECK_TEST-1234567890abcdef1234567890abcdef-X');

            // Verify payment with Flutterwave
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secretKey,
                'Content-Type' => 'application/json'
            ])->get("https://api.flutterwave.com/v3/transactions/{$verificationId}/verify");

            if ($response->successful()) {
                $paymentData = $response->json();

                // Check if payment was successful
                if (
                    $paymentData['status'] === 'success' &&
                    $paymentData['data']['status'] === 'successful' &&
                    $paymentData['data']['amount'] >= 2000
                ) {

                    // Update user to pro plan
                    $user->update(['plan' => 'pro']);

                    // Clear payment reference from session
                    session()->forget('payment_reference_' . $user->id);

                    return response()->json([
                        'message' => 'Payment successful! You have been upgraded to Pro.',
                        'plan' => 'pro',
                        'is_pro' => true,
                        'task_limit' => $user->getTaskLimit(),
                        'payment_data' => $paymentData['data']
                    ]);
                } else {
                    return response()->json([
                        'message' => 'Payment verification failed - payment not successful',
                        'status' => $paymentData['data']['status'] ?? 'unknown'
                    ], 400);
                }
            } else {
                Log::error('Flutterwave payment verification failed', [
                    'response' => $response->json(),
                    'reference' => $reference,
                    'user_id' => $user->id
                ]);

                return response()->json([
                    'message' => 'Payment verification failed',
                    'error' => $response->json()['message'] ?? 'Unknown error'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Payment verification error', [
                'error' => $e->getMessage(),
                'reference' => $reference,
                'transaction_id' => $transactionId ?? 'not provided',
                'user_id' => $user->id
            ]);

            return response()->json([
                'message' => 'Payment verification failed',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Flutterwave webhook handler
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        $signature = $request->header('verif-hash');

        // Verify webhook signature (in production, you should verify this)
        $secretHash = env('FLW_SECRET_HASH', 'test_secret_hash');

        // For test purposes, we'll accept the webhook
        // In production, verify the signature properly

        Log::info('Flutterwave webhook received', $payload);

        if (
            isset($payload['data']['tx_ref']) &&
            isset($payload['data']['status']) &&
            $payload['data']['status'] === 'successful'
        ) {

            $txRef = $payload['data']['tx_ref'];
            $userId = $payload['data']['meta']['user_id'] ?? null;

            if ($userId) {
                $user = User::find($userId);

                if ($user && $user instanceof User && !$user->isPro()) {
                    $user->update(['plan' => 'pro']);

                    Log::info('User upgraded to pro via webhook', [
                        'user_id' => $user->id,
                        'tx_ref' => $txRef
                    ]);
                } elseif (!$user) {
                    Log::warning('User not found for webhook upgrade', [
                        'user_id' => $userId,
                        'tx_ref' => $txRef
                    ]);
                }
            }

            return response()->json([
                'message' => 'Webhook processed successfully',
                'status' => 'success'
            ]);
        }

        return response()->json([
            'message' => 'Webhook processed',
            'status' => 'received'
        ]);
    }
}
