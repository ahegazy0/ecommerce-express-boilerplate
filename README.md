# 🛒 E-commerce API

> Complete production-ready e-commerce platform with authentication, product management, shopping cart, orders, payments & admin dashboard | Built with Express, MongoDB & Stripe

[![Node.js](https://img.shields.io/badge/Node.js-v14+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-008CDD?logo=stripe&logoColor=white)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Live API](https://ecommerce-express-boilerplate.onrender.com/api/v1) | [API Documentation](https://ecommerce-express-boilerplate.onrender.com/api/v1/docs)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Payment Integration](#-payment-integration)
- [Admin Features](#-admin-features)
- [Contributing](#-contributing)
- [License](#-license)

---
## ⚠️ Warning

If you're using the deployed API on Render (not local), **email features will NOT work**.

### Why?
Render's free tier blocks outgoing SMTP connections on ports 25, 465, and 587 for security reasons. This affects:
* ✉️ Email verification during registration
* 🔐 Password reset emails
* 📧 Any email-based features

### Solutions:

**Quick Test Account** (Pre-verified, skip email verification):
* **Email:** `nijevyto@denipl.net`
* **Password:** `asd@123AAA`

**Option 1: Run Locally** ✅
Clone the repo and run it on your machine for full email functionality.

**Option 2: Switch Email Provider** 🔄
Replace Gmail SMTP with MailerSend, Resend, or SendGrid (HTTP-based APIs that work on Render free tier).

---

## ✨ Features

### 🔑 Authentication & User Management
- ✅ **JWT Authentication** - Secure access & refresh token system
- ✅ **Google OAuth Integration** - One-click social login
- ✅ **Email Verification** - Account activation via email
- ✅ **Password Management** - Secure reset and change functionality
- ✅ **Role-Based Access** - User and Admin roles with permissions
- ✅ **User Profiles** - Complete profile management with preferences

### 🛍️ E-commerce Core Features
- ✅ **Product Catalog** - Browse, search, and filter products
- ✅ **Shopping Cart** - Add, update, remove items with real-time calculations
- ✅ **Order Management** - Complete order lifecycle tracking
- ✅ **Product Reviews** - Customer ratings and comments system
- ✅ **Category Management** - Organized product categorization
- ✅ **Featured Products** - Highlight special products
- ✅ **Advanced Search** - Multi-criteria product search with filters

### 💳 Payment & Checkout
- ✅ **Stripe Integration** - Secure payment processing
- ✅ **Checkout Sessions** - Hosted checkout experience
- ✅ **Webhook Handler** - Real-time payment event processing
- ✅ **Order Confirmation** - Automated payment status updates
- ✅ **Price Calculations** - Automatic tax and shipping calculations

### 🔐 Admin Dashboard Features
- ✅ **User Management** - View, search, and manage users
- ✅ **Product Management** - CRUD operations with image uploads
- ✅ **Order Management** - View, update, and track all orders
- ✅ **Inventory Control** - Stock management and updates
- ✅ **Order Status Updates** - Tracking number and status management

### 🛡️ Security & Performance
- ✅ **Rate Limiting** - 1000 req/hour per IP, 100 req/min for authenticated users
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Secure Authentication** - HTTP-only cookies for refresh tokens
- ✅ **CORS Configuration** - Cross-origin resource sharing
- ✅ **Error Handling** - Centralized error management
- ✅ **Image Upload** - Cloudinary integration for product images

### 📚 Developer Experience
- ✅ **OpenAPI/Swagger** - Complete interactive API documentation
- ✅ **Clean Architecture** - Modular and maintainable code structure
- ✅ **Environment Config** - Easy configuration management
- ✅ **Comprehensive Examples** - Request/response examples in documentation

---

## 🚀 Tech Stack

### Core
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + Passport.js (Google OAuth)

### Libraries & Tools
- **Payment Processing:** Stripe
- **Image Storage:** Cloudinary, multer upload
- **Validation:** Joi / Express-validator
- **Email:** Nodemailer
- **Security:** Helmet, bcrypt, express-rate-limit, cors
- **Documentation:** Swagger UI Express (OpenAPI 3.0)

---

## 🏗️ Architecture

This project follows the **MVC (Model-View-Controller) Pattern** with service layer abstraction:

```
┌─────────────┐
│   Routes    │ ← API endpoints definition
└──────┬──────┘
       │
┌──────▼──────┐
│ Controllers │ ← Request/response handling
└──────┬──────┘
       │
┌──────▼──────┐
│   Models    │ ← Data models & database interaction
└─────────────┘
```

**Key Principles:**
- Separation of concerns
- Single responsibility
- Middleware-based architecture
- RESTful API design

---

## 📁 Project Structure

```
ecoapp/
├── config/                # Configuration files          
├── controllers/           # Route controllers
├── services/              # Business logic
├── models/                # Mongoose schemas
├── routes/                # API routes
├── middlewares/           # Express middleware
├── validations/           # Input validation schemas
├── utils/                 # Utility functions
├── docs/                  # OpenAPI documentation
├── server.js              # Application entry point
├── .env                       # Environment variables
├── .env.examples              # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies & scripts
├── package-lock.json               # Dependencies & scripts
└── README.md                  # Project documentation
```

---

## 🎯 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 8.0.0
MongoDB >= 4.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ahegazy0/ecommerce-express-boilerplate
cd ecommerce-express-boilerplate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables))

4. **Set up Stripe webhooks (for local development)**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/webhook

# Copy the webhook signing secret to .env
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. **Run the application**

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

6. **Access the API**
- API Base URL: `http://localhost:5000/api`
- Swagger Documentation: `http://localhost:5000/api/docs`

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| POST   | `/register`                | Public | Register new user              |
| POST   | `/login`                   | Public | User login                     |
| POST   | `/google-login`            | Public | Google OAuth login             |
| POST   | `/logout`                  | Public | Logout user                    |
| POST   | `/verify-email`            | Public | Verify email address           |
| POST   | `/resend-verification`     | Public | Resend verification email      |
| POST   | `/forgot-password`         | Public | Request password reset         |
| POST   | `/reset-password`          | Public | Reset password with token      |
| PATCH  | `/change-password`         | Bearer | Change current password        |
| GET    | `/profile`                 | Bearer | Get user profile               |
| PATCH  | `/profile`                 | Bearer | Update user profile            |
| POST   | `/refresh`                 | Cookie | Refresh access token           |

### 🛍️ Products

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| GET    | `/products`                | Public | Get all products (paginated)   |
| GET    | `/products/featured`       | Public | Get featured products          |
| GET    | `/products/categories`     | Public | Get product categories         |
| GET    | `/products/search`         | Public | Search products                |
| GET    | `/products/{id}`           | Public | Get single product details     |

### 🛒 Shopping Cart

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| GET    | `/cart`                    | Bearer | Get user's cart                |
| POST   | `/cart`                    | Bearer | Add item to cart               |
| PUT    | `/cart`                    | Bearer | Update cart item quantity      |
| DELETE | `/cart`                    | Bearer | Clear entire cart              |
| DELETE | `/cart/{productId}`        | Bearer | Remove item from cart          |

### 📦 Orders

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| GET    | `/orders`                  | Bearer | Get user's orders              |
| POST   | `/orders`                  | Bearer | Create new order               |
| GET    | `/orders/{id}`             | Bearer | Get single order details       |
| PATCH  | `/orders/{id}`             | Bearer | Cancel order (if pending)      |

### ⭐ Reviews

| Method | Endpoint                         | Auth   | Description                    |
|--------|----------------------------------|--------|--------------------------------|
| POST   | `/reviews`                       | Bearer | Create product review          |
| GET    | `/reviews/my-reviews`            | Bearer | Get user's reviews             |
| GET    | `/reviews/product/{productId}`   | Public | Get product reviews            |
| PATCH  | `/reviews/{id}`                  | Bearer | Update own review              |
| DELETE | `/reviews/{id}`                  | Bearer | Delete own review              |

### 💳 Payments

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| POST   | `/payment/checkout`        | Bearer | Create Stripe checkout session |
| GET    | `/payment/success`         | Public | Payment success callback       |
| GET    | `/payment/cancel`          | Public | Payment cancel callback        |
| POST   | `/webhook`                 | Stripe | Stripe webhook handler         |

### 👨‍💼 Admin - Users

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| GET    | `/admin/users`             | Admin  | Get all users (paginated)      |
| GET    | `/admin/users/{id}`        | Admin  | Get single user details        |
| DELETE | `/admin/users/{id}`        | Admin  | Delete user account            |

### 📦 Admin - Products

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| POST   | `/admin/products`          | Admin  | Create new product             |
| PATCH  | `/admin/products/{id}`     | Admin  | Update product                 |
| DELETE | `/admin/products/{id}`     | Admin  | Delete product                 |

### 📋 Admin - Orders

| Method | Endpoint                    | Auth   | Description                    |
|--------|----------------------------|--------|--------------------------------|
| GET    | `/admin/orders`            | Admin  | Get all orders (paginated)     |
| GET    | `/admin/orders/{id}`       | Admin  | Get single order details       |
| PATCH  | `/admin/orders/{id}`       | Admin  | Update order status            |
| DELETE | `/admin/orders/{id}`       | Admin  | Delete order                   |

### 📖 Interactive Documentation

For complete API documentation with request/response examples and testing interface, visit:
- **Local:** `http://localhost:5000/api/docs`
- **Production:** [Onrender](https://ecommerce-express-boilerplate.onrender.com/api/docs)

---

Absolutely — here’s your `.env.example` rewritten in that clean, sectioned format 👇

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### 🧩 Core Configuration

```env
NODE_ENV=development
PORT=4444
APP_NAME=E-Commerce Demo
FRONTEND_BASE_URL=http://localhost:4444/api/v1

# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
MONGODB_USERNAME=
MONGODB_PASSWORD=

# Or use local MongoDB
# MONGODB_URI=mongodb://localhost:27017/ecommerce_demo
```

---

### 🔐 Authentication & JWT

```env
JWT_ACCESS_SECRET=your_jwt_access_secret_here_minimum_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here_minimum_32_characters
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cookie Settings
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
COOKIE_HTTP_ONLY=true
```

---

### 📧 Email Configuration (Nodemailer)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_SECURE=true
```

---

### 🔑 Google OAuth

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here
GOOGLE_USER=your_google_user_email_here
GMAIL_APP_PASSWORD=your_gmail_app_password_here
```

---

### 💳 Stripe Payment

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_KEY=whsec_your_stripe_webhook_key_here
```

---

### ☁️ Cloudinary (Image Uploads)

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

### 🌐 Frontend URL & CORS

```env
CORS_ORIGIN=http://localhost:4444/api/v1
CORS_CREDENTIALS=true
CLIENT_URL=http://localhost:3000
```


---

## 💳 Payment Integration

### Setting Up Stripe

1. **Create a Stripe account** at [stripe.com](https://stripe.com)

2. **Get your API keys** from the Stripe Dashboard
   - Test mode keys for development
   - Live mode keys for production

3. **Set up webhooks** for payment events:
   ```bash
   # For local development
   stripe listen --forward-to localhost:5000/api/webhook
   
   # For production, add webhook endpoint in Stripe Dashboard:
   # https://yourdomain.com/api/webhook
   ```

4. **Webhook events to listen for:**
   - `checkout.session.completed` - Payment successful
   - `checkout.session.async_payment_succeeded` - Async payment completed
   - `checkout.session.async_payment_failed` - Async payment failed

### Payment Flow

1. User adds items to cart
2. User creates an order
3. Frontend calls `/payment/checkout` with order ID
4. Backend creates Stripe checkout session
5. User is redirected to Stripe hosted checkout
6. User completes payment
7. Stripe sends webhook to `/webhook` endpoint
8. Backend updates order status to "paid"
9. User is redirected to success page

---

## 👨‍💼 Admin Features

### Admin Access

Admin users have access to additional endpoints for managing the platform:

- **User Management:** View, search, and deactivate user accounts
- **Product Management:** Create, update, delete products with image uploads
- **Order Management:** View all orders, update status, add tracking numbers
- **Inventory Control:** Update product stock levels

### Creating an Admin User

Option 1: Manually in MongoDB
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Option 2: Through registration (then manually update role)
```bash
# 1. Register normally through API
# 2. Update role in database
```

### Admin Permissions

Admin-only endpoints require:
- Valid JWT token in Authorization header
- User role set to "admin"

Attempting to access admin endpoints with a regular user account will return `403 Forbidden`.

---

## 🚀 Deployment

### Deploy to Production

1. **Set environment to production**
```env
NODE_ENV=production
COOKIE_SECURE=true
```

2. **Use production MongoDB**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

3. **Configure Stripe webhook**
   - Add production webhook endpoint in Stripe Dashboard
   - Update `STRIPE_WEBHOOK_SECRET` with production secret

4. **Set production URLs**
```env
API_BASE_URL=https://yourdomain.com/api
CLIENT_URL=https://yourfrontend.com
STRIPE_SUCCESS_URL=https://yourfrontend.com/payment/success
STRIPE_CANCEL_URL=https://yourfrontend.com/payment/cancel
```

5. **Build and start**
```bash
npm start
```

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Add webhook URL in Stripe Dashboard: `https://your-app.onrender.com/api/webhook`

---

## 🧪 Testing

### Manual Testing with Swagger

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:5000/api/v1/docs`
3. Use the interactive Swagger UI to test endpoints

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions are **greatly appreciated**.

### How to Contribute

1. Fork the Project
2. Create your Feature Branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the Branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Write meaningful commit messages
- Add JSDoc comments for functions
- Update API documentation (swagger.yaml) for new endpoints
- Test thoroughly before submitting PR
- Update README if adding new features

### Reporting Bugs

Please use GitHub Issues and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

---

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - API documentation

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

<div align="center">
  
### 🚀 Ready to build your e-commerce empire?

[Get Started](#-getting-started)

---

Made with ❤️ by [Abdulrahman Hegazy](https://github.com/ahegazy0)

</div>
