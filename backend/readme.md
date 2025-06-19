# 📚 Book Review Platform – Backend

A scalable and modular backend for a Book Review Platform built with **Express.js**, **MongoDB**, and **Node.js**. This API enables user authentication, book management, and image uploading — structured with best practices in error handling, response formatting, and folder organization.

---

## 🚀 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **Cloudinary** for image storage
- **Multer** for file uploads
- **dotenv** for environment variable management
- **cookie-parser**, **bcrypt**, **uuid**
- Dev Tooling: **nodemon**

---

## 📁 Project Structure

```bash
backend/
│
├── node_modules/               # Installed packages
├── package.json                # Project metadata and dependencies
├── package-lock.json
├── src/
│   ├── app.js                  # Express app setup (middlewares, routes)
│   ├── config.js               # Environment variables management
│   ├── constant.js             # Centralized constants (e.g., DB name, roles)
│   ├── index.js                # Entry point – DB connection + server start
│   │
│   ├── database/
│   │   └── index.js            # MongoDB connection logic
│   │
│   ├── controllers/            # Business logic (books, users, reviews)
│   │   ├── books.controller.js
│   │   ├── user.controller.js
│   │   └── review.controller.js  # Review business logic
│   │
│   ├── routes/                 # API endpoints
│   │   ├── book.route.js
│   │   ├── user.route.js
│   │   └── review.route.js      # Review endpoints
│   │
│   ├── model/                  # Mongoose models (schemas)
│   │   ├── book.model.js
│   │   ├── user.model.js
│   │   └── review.model.js      # Review model
│   │
│   ├── middlewares/            # Middlewares (auth, multer, etc.)
│   │   └── multer.middleware.js
│   │
│   └── utils/                  # Reusable helpers
│       ├── apiError.utils.js        # Custom error class
│       ├── apiResponse.utils.js     # Standard API response class
│       ├── asyncHandler.utils.js    # Async wrapper for controllers
│       └── cloudinary.utils.js      # Image upload helper
```
