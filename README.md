# 🛒 MyStore — Full-Stack MERN E-Commerce Platform

A modern, scalable full-stack e-commerce web application built with the **MERN Stack (MongoDB, Express.js, React, Node.js)** and **Redux Toolkit**. It features role-based access control (Admin, Manager, User), Stripe online payments, server-side search & pagination, order status audit logs, and persistent cart/wishlist management.

🔗 **Live Demo:** [https://courses-managment-front-livid.vercel.app/](https://courses-managment-front-livid.vercel.app/)

---

## 📸 Screenshots

|        Home & Product Catalog        |          Checkout & Stripe Payment           |
| :----------------------------------: | :------------------------------------------: |
| ![Home Page](./screenshots/Home.png) | ![Checkout Page](./screenshots/CheckOut.png) |

|         Admin Dashboard & Analytics         |        Order Management & Timeline        |
| :-----------------------------------------: | :---------------------------------------: |
| ![Admin Dashboard](./screenshots/Admin.png) | ![Admin Orders](./screenshots/Orders.png) |

## ✨ Key Features

### 🛍️ Customer Experience

- **Product Catalog & Server-Side Search:** Instant debounced search across the entire database, category filtering, max price filtering, sorting (Low to High / High to Low), and dynamic pagination.
- **Persistent Cart & Wishlist:** Powered by Redux Toolkit and `localStorage` so items remain saved across browser sessions.
- **Flexible Checkout (Guest & Member):** Supports both fast **Guest Checkout** and **Logged-in User Checkout** (linking orders to user accounts).
- **Dual Payment Methods:** Supports **Cash on Delivery (COD)** and encrypted online card payments via **Stripe Checkout (Test Mode)**.
- **User Profile & Order Tracking:** Authenticated users can view their order history (`My Orders`), inspect full order details, and update their profile name and avatar.

### 🎛️ Admin & Manager Dashboard (RBAC)

- **Role-Based Access Control:** Three distinct permission tiers (`ADMIN`, `MANAGER`, `USER`) enforced on both the React frontend (`ProtectedRoute`) and Express backend (`verifyToken` & `allowedTo` middlewares).
- **Live Store Analytics:** Overview cards displaying total revenue, order counts (with pending alerts), catalog stats, and registered users.
- **Product Management (CRUD):** Add, edit, and delete products with image uploads handled via `Multer`.
- **Order Management & Audit Log:** Filter orders by status or customer phone number, update order statuses (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), and view a full **Status History Timeline** recording who updated each status and when.
- **User Management (Admin Only):** Search registered users, update user roles, and manage accounts with built-in protection for demo admin accounts.

---

## 🛠️ Tech Stack

**Frontend:**

- React.js (React Router v6)
- Redux Toolkit (Async Thunks & State Slices)
- Bootstrap 5 & Custom CSS
- SweetAlert2 (Toast notifications & confirmation modals)

**Backend:**

- Node.js & Express.js (ES Modules)
- MongoDB & Mongoose ODM
- JSON Web Tokens (JWT) & `bcryptjs` for authentication
- `Multer` for image uploads (Avatars & Products)
- Stripe API for payment processing

---

## 🔑 Demo Credentials

You can test the role-based dashboard directly on the live site using the **Quick Demo Login** buttons on the `/login` page:

| Role        | Access Level                                                       |
| :---------- | :----------------------------------------------------------------- |
| **ADMIN**   | Full access: Products, Orders, Analytics, and User Role Management |
| **MANAGER** | Operational access: Products, Orders, and View-Only Users list     |

_(For Stripe test payments, use card number `4242 4242 4242 4242` with any future expiry date and 3-digit CVC)._

---

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in both the backend and frontend directories:

### Backend (`.env`)

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```

### Frontend (`.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Getting Started Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com
   ```

2. **Install & run the Backend:**

   ```bash
   cd node
   npm install
   npm start
   ```

3. **Install & run the Frontend:**
   ```bash
   cd react
   npm install
   npm start
   ```

---

## 👨‍💻 Author

Developed by **Abdel-Rhman** — Full-Stack MERN Developer.
