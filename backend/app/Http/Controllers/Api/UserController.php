<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Get or create demo user for testing
     */
    private function getDemoUser(): User
    {
        // For demo purposes, create or get a demo user
        return User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'email' => 'demo@example.com',
                'password' => bcrypt('password'),
                'plan' => 'free'
            ]
        );
    }

    /**
     * Get user plan information
     */
    public function getPlan(Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        return response()->json([
            'plan' => $user->plan,
            'is_pro' => $user->isPro(),
            'task_limit' => $user->getTaskLimit(),
            'current_tasks' => $user->tasks()->count(),
            'remaining_tasks' => $user->getTaskLimit() - $user->tasks()->count(),
        ]);
    }

    /**
     * Get user profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        return response()->json([
            'user' => $user,
            'plan' => $user->plan,
            'is_pro' => $user->isPro(),
            'task_limit' => $user->getTaskLimit(),
            'current_tasks' => $user->tasks()->count(),
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only(['name', 'email']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }
} 