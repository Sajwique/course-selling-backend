# Online Course Platform API

An API backend for an online course platform where users can signup, login, purchase courses, comment on course videos, and admins can create and manage courses. Built using Node.js, Express, MongoDB, and JWT authentication.

## Features

- User registration and login with secure password hashing and JWT authentication
- Admins can create, update, and delete courses
- Users can purchase courses and comment on course videos with replies and reactions
- Input validation using Zod for robust API request validation
- API rate limiting to prevent abuse
- Middleware for JWT token verification and role-based access control
- User profile management and updates
- Security best practices including helmet, cors integration recommended

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- Zod for request validation
- express-rate-limit for rate limiting
