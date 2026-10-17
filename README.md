# Bazarna Store API

The backend API for **Bazarna Store**, an e-commerce platform built with Node.js, Express.js, and MongoDB.

Bazarna Store API provides the backend foundation for managing users, products, categories, shopping carts, and orders through a RESTful API.

## 🚀 Features

- **Authentication & Authorization** — User registration, login, and role-based access control.
- **Product Management** — Create, retrieve, update, and delete products.
- **Category Management** — Organize products into categories.
- **Shopping Cart** — Add, update, and remove products from the cart.
- **Order Management** — Create and manage customer orders.
- **User Management** — Manage user profiles and account information.
- **Data Validation** — Validate incoming requests.
- **Error Handling** — Centralized error handling for consistent API responses.

*Features will be implemented progressively as development continues.*

## 🛠️ Tech Stack

- **Node.js** — JavaScript runtime.
- **Express.js** — Backend web framework.
- **MongoDB** — NoSQL database.
- **Mongoose** — MongoDB object modeling.
- **JWT** — Token-based authentication.
- **bcrypt** — Password hashing.
- **dotenv** — Environment variable management.

## 📁 Project Structure

A suggested structure for the API:

```text
bazarna-store-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
