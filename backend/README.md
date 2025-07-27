# Task Manager API Backend

A Laravel-based REST API for the Task Manager application with PostgreSQL database and mock payment integration.

## Features

-   ✅ Task management (CRUD operations)
-   ✅ User plan management (Free/Pro)
-   ✅ Task limits enforcement (5 tasks for free users)
-   ✅ Mock payment system for Pro upgrades
-   ✅ PostgreSQL database
-   ✅ RESTful API endpoints
-   ✅ CORS support for frontend integration

## Requirements

-   PHP 8.1+
-   Composer
-   PostgreSQL
-   Laravel 12.x

## Installation

1. **Clone and navigate to the server directory:**

    ```bash
    cd server
    ```

2. **Install dependencies:**

    ```bash
    composer install
    ```

3. **Set up environment:**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Configure PostgreSQL in `.env`:**

    ```env
    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=task_manager
    DB_USERNAME=postgres
    DB_PASSWORD=your_password
    ```

5. **Create PostgreSQL database:**

    ```sql
    CREATE DATABASE task_manager;
    ```

6. **Run migrations:**

    ```bash
    php artisan migrate
    ```

7. **Start the server:**
    ```bash
    php artisan serve
    ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication (Optional - Demo Mode)

-   `POST /api/demo/setup` - Create demo user

### Tasks

-   `GET /api/tasks` - Get all tasks
-   `POST /api/tasks` - Create new task
-   `GET /api/tasks/{id}` - Get specific task
-   `PUT /api/tasks/{id}` - Update task
-   `DELETE /api/tasks/{id}` - Delete task
-   `PATCH /api/tasks/{id}/toggle` - Toggle task status

### User Management

-   `GET /api/user/plan` - Get user plan info
-   `GET /api/user/profile` - Get user profile
-   `PUT /api/user/profile` - Update user profile

### Payment (Mock)

-   `POST /api/payment/initialize` - Initialize payment
-   `GET /api/payment/verify` - Verify payment
-   `POST /api/payment/webhook` - Payment webhook

## API Usage Examples

### Create a Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task manager app"
  }'
```

### Get User Plan

```bash
curl http://localhost:8000/api/user/plan
```

### Initialize Payment

```bash
curl -X POST http://localhost:8000/api/payment/initialize
```

## Database Schema

### Users Table

-   `id` - Primary key
-   `name` - User name
-   `email` - User email
-   `password` - Hashed password
-   `plan` - 'free' or 'pro'
-   `created_at`, `updated_at` - Timestamps

### Tasks Table

-   `id` - Primary key
-   `user_id` - Foreign key to users
-   `title` - Task title
-   `description` - Task description (nullable)
-   `status` - 'pending' or 'completed'
-   `created_at`, `updated_at` - Timestamps

## Task Limits

-   **Free Plan**: Maximum 5 tasks
-   **Pro Plan**: Unlimited tasks

## Mock Payment System

The payment system is mocked for demonstration:

1. **Initialize Payment**: Creates a mock payment reference
2. **Verify Payment**: Simulates successful payment and upgrades user to Pro
3. **Webhook**: Handles payment notifications (mock)

### Testing Payment Flow

1. Create a user (or use demo setup)
2. Add 5 tasks (free plan limit)
3. Try to add a 6th task (should fail)
4. Initialize payment: `POST /api/payment/initialize`
5. Verify payment: `GET /api/payment/verify?reference=PAY_XXXXXXXXXX`
6. User is now Pro and can add unlimited tasks

## CORS Configuration

The API is configured to accept requests from the frontend. Update the CORS configuration in `config/cors.php` if needed.

## Development

### Running Tests

```bash
php artisan test
```

### Database Seeding

```bash
php artisan db:seed
```

### Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## Production Deployment

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false` in `.env`
3. Configure proper database credentials
4. Set up proper CORS origins
5. Configure web server (Apache/Nginx)
6. Set up SSL certificates

## Troubleshooting

### Database Connection Issues

-   Ensure PostgreSQL is running
-   Check database credentials in `.env`
-   Verify database exists: `CREATE DATABASE task_manager;`

### Migration Issues

-   Clear cache: `php artisan config:clear`
-   Reset migrations: `php artisan migrate:fresh`

### CORS Issues

-   Check CORS configuration in `config/cors.php`
-   Ensure frontend URL is in allowed origins

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
