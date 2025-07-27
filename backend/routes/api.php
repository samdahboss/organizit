<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required for demo)
Route::get('/user/plan', [UserController::class, 'getPlan']);

// Task management routes
Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::get('/tasks/{task}', [TaskController::class, 'show']);
Route::put('/tasks/{task}', [TaskController::class, 'update']);
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
Route::patch('/tasks/{task}/toggle', [TaskController::class, 'toggleStatus']);

// User profile routes
Route::get('/user/profile', [UserController::class, 'profile']);
Route::put('/user/profile', [UserController::class, 'updateProfile']);

// Payment routes
Route::post('/payment/initialize', [PaymentController::class, 'initialize']);
Route::get('/payment/verify', [PaymentController::class, 'verify']);
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);

// For testing purposes - create a demo user
Route::post('/demo/setup', function () {
    // This would normally be handled by authentication
    // For demo purposes, we'll create a user if none exists
    $user = \App\Models\User::firstOrCreate(
        ['email' => 'demo@example.com'],
        [
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => bcrypt('password'),
            'plan' => 'free'
        ]
    );
    
    return response()->json([
        'message' => 'Demo user created',
        'user' => $user,
        'demo_mode' => true
    ]);
}); 