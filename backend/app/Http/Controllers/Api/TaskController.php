<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
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
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        $tasks = $user->tasks()->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'tasks' => $tasks,
            'total_tasks' => $tasks->count(),
            'task_limit' => $user->getTaskLimit(),
            'remaining_tasks' => $user->getTaskLimit() - $tasks->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        // Check task limit for free users
        if (!$user->isPro() && $user->tasks()->count() >= 5) {
            return response()->json([
                'message' => 'You have reached the maximum number of tasks for the free plan. Please upgrade to Pro to add more tasks.',
                'upgrade_required' => true,
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task = $user->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task, Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        // Ensure user can only access their own tasks
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['task' => $task]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        // Ensure user can only update their own tasks
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,completed',
        ]);

        $task->update($request->only(['title', 'description', 'status']));

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        // Ensure user can only delete their own tasks
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }

    /**
     * Toggle task status
     */
    public function toggleStatus(Task $task, Request $request): JsonResponse
    {
        $user = $request->user() ?? $this->getDemoUser();
        
        // Ensure user can only toggle their own tasks
        if ($task->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update([
            'status' => $task->status === 'pending' ? 'completed' : 'pending',
        ]);

        return response()->json([
            'message' => 'Task status updated successfully',
            'task' => $task,
        ]);
    }
} 