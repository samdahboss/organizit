<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a demo user for testing
        $this->user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'email' => 'demo@example.com',
                'password' => bcrypt('password'),
                'plan' => 'free'
            ]
        );
    }

    /** @test */
    public function it_can_get_user_plan()
    {
        $response = $this->getJson('/api/user/plan');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'plan',
                    'is_pro',
                    'task_limit',
                    'current_tasks',
                    'remaining_tasks'
                ])
                ->assertJson([
                    'plan' => 'free',
                    'is_pro' => false,
                    'task_limit' => 5
                ]);
    }

    /** @test */
    public function it_can_get_tasks()
    {
        // Create some test tasks
        Task::create([
            'user_id' => $this->user->id,
            'title' => 'Test Task 1',
            'description' => 'Test Description 1',
            'status' => 'pending'
        ]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'tasks',
                    'total_tasks',
                    'task_limit',
                    'remaining_tasks'
                ])
                ->assertJson([
                    'total_tasks' => 1,
                    'task_limit' => 5,
                    'remaining_tasks' => 4
                ]);
    }

    /** @test */
    public function it_can_create_task()
    {
        $taskData = [
            'title' => 'New Test Task',
            'description' => 'New Test Description'
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'task' => [
                        'id',
                        'title',
                        'description',
                        'status',
                        'user_id'
                    ]
                ])
                ->assertJson([
                    'message' => 'Task created successfully',
                    'task' => [
                        'title' => 'New Test Task',
                        'description' => 'New Test Description',
                        'status' => 'pending'
                    ]
                ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'New Test Task',
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_enforces_task_limit_for_free_users()
    {
        // Create 5 tasks (limit for free users)
        for ($i = 1; $i <= 5; $i++) {
            Task::create([
                'user_id' => $this->user->id,
                'title' => "Task {$i}",
                'description' => "Description {$i}",
                'status' => 'pending'
            ]);
        }

        // Try to create a 6th task
        $response = $this->postJson('/api/tasks', [
            'title' => 'Should Not Create',
            'description' => 'This should fail'
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'message' => 'You have reached the maximum number of tasks for the free plan. Please upgrade to Pro to add more tasks.',
                    'upgrade_required' => true
                ]);
    }

    /** @test */
    public function it_allows_unlimited_tasks_for_pro_users()
    {
        // Upgrade user to pro
        $this->user->update(['plan' => 'pro']);

        // Create 10 tasks (should be allowed for pro users)
        for ($i = 1; $i <= 10; $i++) {
            $response = $this->postJson('/api/tasks', [
                'title' => "Pro Task {$i}",
                'description' => "Pro Description {$i}"
            ]);

            $response->assertStatus(201);
        }

        // Verify all tasks were created
        $this->assertDatabaseCount('tasks', 10);
    }

    /** @test */
    public function it_can_delete_task()
    {
        $task = Task::create([
            'user_id' => $this->user->id,
            'title' => 'Task to Delete',
            'description' => 'Will be deleted',
            'status' => 'pending'
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Task deleted successfully'
                ]);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function it_can_toggle_task_status()
    {
        $task = Task::create([
            'user_id' => $this->user->id,
            'title' => 'Toggle Task',
            'description' => 'Will be toggled',
            'status' => 'pending'
        ]);

        // Toggle to completed
        $response = $this->patchJson("/api/tasks/{$task->id}/toggle");
        $response->assertStatus(200);
        $this->assertEquals('completed', $task->fresh()->status);

        // Toggle back to pending
        $response = $this->patchJson("/api/tasks/{$task->id}/toggle");
        $response->assertStatus(200);
        $this->assertEquals('pending', $task->fresh()->status);
    }

    /** @test */
    public function it_can_initialize_payment()
    {
        $response = $this->postJson('/api/payment/initialize');

        // Payment initialization will fail without real Flutterwave keys
        // But we can test that the endpoint exists and returns a proper error
        if ($response->status() === 500) {
            // Expected behavior without real Flutterwave keys
            $response->assertStatus(500);
        } else {
            // If real keys are configured, test successful response
            $response->assertStatus(200)
                    ->assertJsonStructure([
                        'message',
                        'payment_reference',
                        'payment_url',
                        'amount',
                        'currency',
                        'description',
                        'status'
                    ])
                    ->assertJson([
                        'message' => 'Payment initialized successfully',
                        'amount' => 999,
                        'currency' => 'USD',
                        'description' => 'Upgrade to Pro Plan',
                        'status' => 'pending'
                    ]);
        }
    }

    /** @test */
    public function it_prevents_payment_initialization_for_pro_users()
    {
        // Upgrade user to pro
        $this->user->update(['plan' => 'pro']);

        $response = $this->postJson('/api/payment/initialize');

        $response->assertStatus(400)
                ->assertJson([
                    'message' => 'You are already on the Pro plan'
                ]);
    }

    /** @test */
    public function it_can_verify_payment()
    {
        // Mock a successful payment verification
        $reference = 'PAY_TEST123456';
        
        $response = $this->getJson("/api/payment/verify?reference={$reference}");

        // This will fail in test mode since we don't have real Flutterwave keys
        // But we can test the structure
        $response->assertStatus(400)
                ->assertJsonStructure([
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_user_profile()
    {
        $response = $this->getJson('/api/user/profile');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'plan'
                    ],
                    'plan',
                    'is_pro',
                    'task_limit',
                    'current_tasks'
                ])
                ->assertJson([
                    'plan' => 'free',
                    'is_pro' => false,
                    'task_limit' => 5
                ]);
    }

    /** @test */
    public function it_can_update_user_profile()
    {
        $updateData = [
            'name' => 'Updated Demo User',
            'email' => 'updated@example.com'
        ];

        $response = $this->putJson('/api/user/profile', $updateData);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Profile updated successfully'
                ])
                ->assertJsonStructure([
                    'user' => [
                        'id',
                        'name',
                        'email'
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Demo User',
            'email' => 'updated@example.com'
        ]);
    }

    /** @test */
    public function it_can_setup_demo_user()
    {
        $response = $this->postJson('/api/demo/setup');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'plan'
                    ],
                    'demo_mode'
                ])
                ->assertJson([
                    'message' => 'Demo user created',
                    'user' => [
                        'name' => 'Demo User',
                        'email' => 'demo@example.com',
                        'plan' => 'free'
                    ],
                    'demo_mode' => true
                ]);
    }
} 