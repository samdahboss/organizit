# Task Manager with Mocked Payment Upgrade

> **Take-Home Assignment Implementation** - A full-stack task manager with 5-task limit for free users and Flutterwave payment integration for Pro upgrades.

## ✅ Assignment Requirements Met

- ✅ **Task Management**: View, add, delete tasks with proper API endpoints
- ✅ **5-Task Limit**: Strictly enforced for free users
- ✅ **Payment Integration**: Flutterwave test-mode payment gateway
- ✅ **UI Features**: Task counter, upgrade prompts, clean interface
- ✅ **Bonus**: Loading states, error handling, animations

## 🚀 Quick Setup (2 minutes)

### Prerequisites

```bash
# Required software
PHP 8.2+, Node.js 18+, Composer, npm
# Database: PostgreSQL (or SQLite for quick testing)
```

### 1. Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Quick SQLite setup (or configure PostgreSQL in .env)
touch database/database.sqlite
php artisan migrate
php artisan serve  # Runs on http://localhost:8000
```

### 2. Frontend Setup

```bash
# From project root
npm install
npm run dev  # Runs on http://localhost:5173
```

### 3. Test the Application

1. Open http://localhost:5173
2. Add 5 tasks (free limit)
3. Try adding a 6th task → upgrade prompt appears
4. Click "Upgrade to Pro" → payment simulation
5. After payment → unlimited tasks enabled

## 🧪 Testing Payment Flow

### Mock Payment Process

1. **Reach 5-task limit** → "Upgrade to Pro" button appears
2. **Click upgrade** → Flutterwave payment modal opens
3. **Use test card**: 4187427415564246 (Visa)
4. **Payment simulates for 3 seconds** → Auto-upgrade to Pro
5. **Result**: Unlimited task creation + Pro indicator

### API Testing (Optional)

```bash
# Test API endpoints directly
curl http://localhost:8000/api/user/plan
curl -X POST http://localhost:8000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test Task"}'
```

## 🛠️ Tech Stack

**Backend**: Laravel 12, PostgreSQL/SQLite, Flutterwave API
**Frontend**: React 19 + TypeScript, Vite, Tailwind CSS, Radix UI

## 📋 Core API Endpoints (Assignment Requirements)

```bash
# Task Management
GET    /api/tasks              # Get all tasks
POST   /api/tasks              # Create task (enforces 5-task limit)
DELETE /api/tasks/:id          # Delete task

# User Plan
GET    /api/user/plan          # Returns "free" or "pro"

# Payment
POST   /api/payment/initialize # Returns mock payment URL
GET    /api/payment/verify     # Simulates payment success
```

## 🎯 Assignment Assumptions

1. **No Authentication Required**: Uses demo user for quick testing
2. **Flutterwave Test Mode**: Safe payment simulation with test cards
3. **Database Flexibility**: SQLite for quick setup, PostgreSQL for production
4. **Task Limit Enforcement**: Server-side validation prevents 6+ tasks for free users
5. **Payment Simulation**: 3-second mock payment for demo purposes

## 🔧 Production Configuration

### For PostgreSQL (Recommended)

```bash
# Update backend/.env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=organizit
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### For Flutterwave Live Mode

```bash
# Update backend/.env
FLW_PUBLIC_KEY=your_live_public_key
FLW_SECRET_KEY=your_live_secret_key
FLW_SECRET_HASH=your_webhook_secret_hash
```

## 📁 Project Structure

```
organizit/
├── backend/                    # Laravel API
│   ├── app/Http/Controllers/Api/
│   │   ├── TaskController.php     # Task CRUD + limit enforcement
│   │   ├── UserController.php     # Plan management
│   │   └── PaymentController.php  # Flutterwave integration
│   ├── app/Models/
│   │   ├── Task.php              # Task model
│   │   └── User.php              # User model with plan logic
│   └── routes/api.php            # API routes
├── src/                        # React Frontend
│   ├── components/
│   │   ├── TaskManager.tsx       # Main task interface
│   │   ├── AddTaskDialog.tsx     # Task creation modal
│   │   └── UpgradeDialog.tsx     # Payment flow modal
│   └── services/api.ts           # API client
└── README.md                   # This file
```

## � Troubleshooting

### Common Issues

1. **Port conflicts**: Backend (8000), Frontend (5173)
2. **Database errors**: Check `.env` configuration
3. **CORS issues**: Verify API_URL in frontend
4. **Payment test**: Use test card `4187427415564246`

### Quick Reset

```bash
# Reset database
cd backend && php artisan migrate:fresh
# Clear browser storage for clean state
```

---

**Note**: This is a demonstration project with mocked payments. No real transactions are processed.
