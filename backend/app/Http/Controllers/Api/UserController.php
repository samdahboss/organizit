<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Get user plan information
     */
    public function getPlan(Request $request): JsonResponse
    {
        $user = $request->user();
        
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
        $user = $request->user();
        
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
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->update($request->only(['name', 'email']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $request->user()->fresh(),
        ]);
    }
} 