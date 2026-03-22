🛒 Retail Billing System

The Retail Billing System is a full-stack web application built using a microservices architecture with Spring Boot on the backend and React (Vite) on the frontend. This system is designed to simulate a real-world retail environment where users can create orders, generate invoices, and complete payments through an integrated payment gateway.

The backend is divided into multiple independent services, including Auth Service, Order Service, Product Service, Billing Service, and Payment Service, all routed through an API Gateway. Authentication and authorization are handled using JWT-based security, ensuring that only authorized users can access protected resources. The system supports role-based access control, allowing both ADMIN and USER roles with different levels of permissions.

Users can browse products, add items to a cart, create orders, and generate bills. Once a bill is generated, the system integrates with Razorpay to initiate and process payments. After a successful transaction, the payment status is updated, and the order is marked as paid. The billing service also maintains invoice history, allowing users or admins to view previously generated bills.

The frontend is built using React with Vite, providing a fast and responsive user interface. It includes separate dashboards for users and administrators, with features like product management, order handling, billing, and payment processing. The UI communicates with the backend through REST APIs exposed via the API Gateway.

This project demonstrates key software engineering concepts such as microservices architecture, secure authentication, API gateway routing, payment integration, and full-stack development. It is designed to be scalable, modular, and easy to extend with additional features like invoice PDF generation, email notifications, or deployment using Docker and Kubernetes.

## 🚀 Tech Stack
 - Backend: Java, Spring Boot, Spring Security, Spring Cloud Gateway, Hibernate, MySQL
 - Frontend: React (Vite), JavaScript, Bootstrap
 - Other Tools: Razorpay, Postman, Git, GitHub

## 🔗 Key Features
 - JWT-based Authentication & Role Management
 - Order Creation and Item Management
 - Invoice Generation System
 - Razorpay Payment Integration
 - Admin Dashboard for System Management
 - Microservices with API Gateway Routing
   
## ⚙️ How to Run
 - Start all backend microservices (Ports: 8081–8085)
 - Start API Gateway (Port: 8080)

 - Run frontend using:
     - npm install
     -  npm run dev

## 🖥️ Frontend Features
 - 👤 User
    - Login / Register
    - View Products
    - Add to Cart
    - Checkout
    - Generate Bill
    - Make Payment
      
## 👨‍💼 Admin
  - Manage Products
  - Manage Categories
  - Manage Orders
  - Manage Users
  - View Billing History

 ## Backend Setup
  - Start each service:
  - auth-service      → 8081
  - order-service     → 8082
  - product-service   → 8083
  - billing-service   → 8084
  - payment-service   → 8085
  - api-gateway       → 8080

## 👨‍💻 Author
 - Priyanshu Barsagade
