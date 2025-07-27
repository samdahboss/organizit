# Task Manager App

A full-stack Task Manager application with a mocked payment upgrade system. Built with Laravel (backend) and React + TypeScript (frontend).

## 🚀 Features

- **Task Management**: Create, view, and delete tasks
- **Free Plan Limit**: Free users are limited to 5 tasks
- **Pro Upgrade**: Mock payment system to upgrade to unlimited tasks
- **Modern UI**: Clean interface built with Tailwind CSS and Radix UI
- **Real-time Updates**: Task status updates and plan changes
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend

- **Laravel 12** - PHP framework
- **PostgreSQL** - Database
- **Laravel Sanctum** - API authentication
- **CORS** - Cross-origin resource sharing

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Vite** - Build tool

## 📋 Prerequisites

- PHP 8.2+
- Node.js 18+
- PostgreSQL
- Composer
- npm

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd organizit
```

### 2. Backend Setup (Laravel)

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# Update DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD

# Run migrations
php artisan migrate

# Start the development server
php artisan serve
```

The Laravel backend will be running at `http://localhost:8000`

### 3. Frontend Setup (React)

```bash
# From the project root
npm install

# Start the development server
npm run dev
```

The React frontend will be running at `http://localhost:5173`

## 🎯 How to Test

### 1. Basic Task Management

1. Open the app in your browser
2. Add a few tasks using the "Add Task" button
3. Toggle task completion by clicking the circle icon
4. Delete tasks using the trash icon

### 2. Free Plan Limit Testing

1. Add exactly 5 tasks
2. Try to add a 6th task
3. You should see an upgrade prompt

### 3. Mock Payment Flow

1. When you reach the 5-task limit, click "Upgrade Now"
2. The app will simulate a payment process
3. After 3 seconds, the payment will be "verified"
4. Your account will be upgraded to Pro
5. You can now add unlimited tasks

### 4. Pro Plan Features

- Unlimited task creation
- Crown icon in the header
- No more upgrade prompts

## 🔧 API Endpoints

### Authentication

- `POST /api/demo/setup` - Create demo user and get token

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/toggle` - Toggle task status

### User Plan

- `GET /api/user/plan` - Get user plan information

### Payment

- `POST /api/payment/initialize` - Initialize mock payment
- `GET /api/payment/verify` - Verify payment (mock)

## 🎨 UI Components

### TaskManager

Main component that handles:

- Task list display
- Add/delete task functionality
- Plan status display
- Upgrade prompts

### AddTaskDialog

Modal dialog for creating new tasks with:

- Form validation
- Loading states
- Error handling

### UpgradeDialog

Payment flow dialog with:

- Plan benefits display
- Mock payment simulation
- Success/error states
- Animated transitions

## 🔒 Security Features

- **CORS Configuration**: Properly configured for cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and user feedback
- **Mock Authentication**: Demo user setup for testing

## 🧪 Testing the Payment System

The payment system is completely mocked for demonstration purposes:

1. **Payment Initialization**: Creates a mock payment reference
2. **Payment Simulation**: 3-second delay to simulate processing
3. **Payment Verification**: Automatically "verifies" the payment
4. **Plan Upgrade**: User is upgraded to Pro plan

In a real implementation, you would:

- Integrate with actual payment gateways (Stripe, Paystack, etc.)
- Implement proper webhook handling
- Add payment verification logic
- Handle failed payments

## 📱 Responsive Design

The app is fully responsive and works on:

- Desktop browsers
- Tablets
- Mobile devices

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design
- **Smooth Animations**: Loading states and transitions
- **Accessibility**: Built with Radix UI for accessibility
- **Color Coding**: Visual indicators for task status and plan type
- **Gradient Elements**: Beautiful gradients for premium features

## 🚀 Deployment

### Backend (Laravel)

1. Set up a web server (Apache/Nginx)
2. Configure environment variables
3. Run `php artisan migrate --force`
4. Set up SSL certificate

### Frontend (React)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to a web server
3. Configure API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify the Laravel server is running
3. Ensure database migrations are complete
4. Check CORS configuration

## 🎯 Project Structure

```
organizit/
├── backend/                 # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── TaskController.php
│   │   │   ├── UserController.php
│   │   │   └── PaymentController.php
│   │   └── Models/
│   │       ├── Task.php
│   │       └── User.php
│   ├── database/migrations/
│   └── routes/api.php
├── src/                     # React frontend
│   ├── components/
│   │   ├── TaskManager.tsx
│   │   ├── AddTaskDialog.tsx
│   │   └── UpgradeDialog.tsx
│   ├── services/
│   │   └── api.ts
│   └── App.tsx
└── README.md
```

---

**Note**: This is a demonstration project. The payment system is mocked and no real payments are processed.
