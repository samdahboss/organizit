# Organizit Task Manager API

A Laravel-based REST API for managing tasks with Flutterwave payment integration for Pro plan upgrades.

## 🚀 Features

-   **Task Management**: Create, read, update, delete, and toggle task status
-   **Plan Management**: Free (5 tasks) vs Pro (unlimited tasks)
-   **Flutterwave Integration**: Test-mode payment processing for plan upgrades
-   **Demo Mode**: No authentication required for testing

## 📋 API Endpoints

### Task Management

-   `GET /api/tasks` - Get all tasks for the current user
-   `POST /api/tasks` - Create a new task (enforces 5-task limit for free users)
-   `GET /api/tasks/{id}` - Get a specific task
-   `PUT /api/tasks/{id}` - Update a task
-   `DELETE /api/tasks/{id}` - Delete a task
-   `PATCH /api/tasks/{id}/toggle` - Toggle task status (pending/completed)

### User Management

-   `GET /api/user/plan` - Get current user plan and limits
-   `GET /api/user/profile` - Get user profile
-   `PUT /api/user/profile` - Update user profile

### Payment Integration

-   `POST /api/payment/initialize` - Initialize Flutterwave payment for Pro upgrade
-   `GET /api/payment/verify` - Verify payment and upgrade user to Pro
-   `POST /api/payment/webhook` - Flutterwave webhook handler

### Demo Setup

-   `POST /api/demo/setup` - Create demo user for testing

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the backend directory:

```env
APP_NAME="Organizit Task Manager"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=organizit
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Flutterwave Test Keys (Replace with your actual test keys)
FLW_SECRET_KEY=FLWSECK_TEST-your-secret-key-here
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-public-key-here
FLW_SECRET_HASH=your-secret-hash-here

# For testing, you can use these placeholder keys
# FLW_SECRET_KEY=FLWSECK_TEST-1234567890abcdef1234567890abcdef-X
# FLW_PUBLIC_KEY=FLWPUBK_TEST-1234567890abcdef1234567890abcdef-X
# FLW_SECRET_HASH=test_secret_hash
```

### 2. Database Setup

```bash
# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 3. Flutterwave Test Keys Setup

1. **Get Test Keys**:

    - Sign up at [Flutterwave Dashboard](https://dashboard.flutterwave.com/)
    - Go to Settings → API Keys
    - Copy your test secret key and public key

2. **Update Environment**:

    - Replace the placeholder keys in `.env` with your actual test keys
    - Set `FLW_SECRET_HASH` to a secure random string for webhook verification

3. **Test Mode**:
    - All payments will be processed in test mode
    - Use test card numbers from [Flutterwave Test Documentation](https://developer.flutterwave.com/docs/collecting-payments/test-payments)

### 4. Start the Server

```bash
# Start Laravel development server
php artisan serve

# Or use Laravel Sail (if configured)
./vendor/bin/sail up
```

## 🧪 Testing

### Run All Tests

```bash
php artisan test
```

### Run Specific Test Suite

```bash
# Run API tests
php artisan test --filter=ApiTest

# Run with coverage
php artisan test --coverage
```

### Manual Testing with Postman

1. **Setup Demo User**:

    ```
    POST http://localhost:8000/api/demo/setup
    ```

2. **Get User Plan**:

    ```
    GET http://localhost:8000/api/user/plan
    ```

3. **Create Tasks**:

    ```
    POST http://localhost:8000/api/tasks
    Content-Type: application/json

    {
      "title": "Test Task",
      "description": "Test Description"
    }
    ```

4. **Initialize Payment**:

    ```
    POST http://localhost:8000/api/payment/initialize
    ```

5. **Verify Payment** (after completing payment):
    ```
    GET http://localhost:8000/api/payment/verify?reference=PAY_XXXXXXXXXX
    ```

## 💳 Flutterwave Integration Details

### Test Card Numbers

-   **Visa**: 4187427415564246
-   **Mastercard**: 5438898014560229
-   **Verve**: 5061460410120223210

### Test Payment Flow

1. Call `/api/payment/initialize` to get payment URL
2. Redirect user to the payment URL
3. User completes payment with test card
4. Flutterwave redirects to your verification URL
5. Call `/api/payment/verify` to confirm and upgrade user

### Webhook Setup (Optional)

For production, configure webhook URL in Flutterwave dashboard:

```
https://your-domain.com/api/payment/webhook
```

## 🔒 Security Notes

-   **Test Mode Only**: This implementation uses Flutterwave test keys
-   **No Authentication**: Demo mode without user authentication
-   **Production Ready**: Add proper authentication middleware for production
-   **Webhook Verification**: Implement proper signature verification for webhooks

## 📊 Database Schema

### Users Table

-   `id` - Primary key
-   `name` - User's full name
-   `email` - User's email address
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

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**:

    - Check PostgreSQL is running
    - Verify database credentials in `.env`
    - Run `php artisan migrate:status`

2. **Flutterwave API Errors**:

    - Verify test keys are correct
    - Check network connectivity
    - Review Laravel logs: `storage/logs/laravel.log`

3. **Task Limit Not Enforced**:

    - Ensure user plan is set to 'free'
    - Check task count in database
    - Verify User model `getTaskLimit()` method

4. **Payment Verification Fails**:
    - Use correct transaction reference
    - Check Flutterwave dashboard for payment status
    - Verify webhook configuration

### Debug Mode

Enable debug mode in `.env`:

```env
APP_DEBUG=true
LOG_LEVEL=debug
```

## 📝 API Response Examples

### Successful Task Creation

```json
{
    "message": "Task created successfully",
    "task": {
        "id": 1,
        "title": "New Task",
        "description": "Task description",
        "status": "pending",
        "user_id": 1,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    }
}
```

### Task Limit Reached

```json
{
    "message": "You have reached the maximum number of tasks for the free plan. Please upgrade to Pro to add more tasks.",
    "upgrade_required": true
}
```

### Payment Initialization

```json
{
    "message": "Payment initialized successfully",
    "payment_reference": "PAY_ABC123DEF",
    "payment_url": "https://checkout.flutterwave.com/v3/hosted/pay/...",
    "amount": 999,
    "currency": "USD",
    "description": "Upgrade to Pro Plan",
    "status": "pending"
}
```

### Successful Payment Verification

```json
{
    "message": "Payment successful! You have been upgraded to Pro.",
    "plan": "pro",
    "is_pro": true,
    "task_limit": 2147483647,
    "payment_data": {
        "id": 123456,
        "tx_ref": "PAY_ABC123DEF",
        "status": "successful",
        "amount": 999
    }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
