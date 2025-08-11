# HireMe - Job Posting Platform Backend

This is the backend system for "HireMe", a job platform where companies can post jobs and job seekers can apply. The system is built with a focus on role-based access control, file uploads, and a mock payment system.

## Table of Contents

1.  [Features](#features)
2.  [Tech Stack](#tech-stack)
3.  [Roles & Permissions](#roles--permissions)
4.  [Setup & Installation](#setup--installation)
5.  [API Endpoints](#api-endpoints)
6.  [Payment Flow](#payment-flow)
7.  [ERD](#erd)
8.  [Postman Documentation](#postman-documentation)

## Features

-   **Role-Based Authentication**: Secure routes using JWT with distinct roles for Admins, Employees, and Job Seekers.
-   **Job Management**: Employees can post, edit, and delete jobs for their company. Admins can manage all jobs.
-   **Job Application**: Job Seekers can apply for jobs by uploading their CV and completing a mock payment of 100 Taka.
-   **File Upload**: CVs are uploaded in PDF or DOCX format with a file size limit of 5MB.
-   **Application Management**: Employees can view applicants and accept or reject them.
-   **Admin Panel (Backend-Only)**: Admins have full control to view all users, jobs, and applications.

## Tech Stack

-   **Language**: TypeScript
-   **Framework**: Express.js
-   **Database**: MongoDB
-   **Authentication**: JWT (JSON Web Tokens)
-   **File Upload**: Multer
-   **Validation**: Zod
-   **Environment Configs**: dotenv

## Roles & Permissions

-   **Admin**:
    -   Manage all users (create/update/delete).
    -   Manage jobs.
    -   See company analytics.
-   **Employee (Recruiter)**:
    -   Post, edit, and delete jobs for their company.
    -   View applicants and accept or reject them.
-   **Job Seeker**:
    -   View jobs.
    -   Apply by uploading CV + paying 100 Taka.
    -   View their application history.

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/your-username/hireme-backend.git](https://github.com/your-username/hireme-backend.git)
    cd hireme-backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**:
    -   Create a `.env` file in the root directory.
    -   Add your MongoDB connection string and a JWT secret.
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://admin:niloy12345admin@emihub-cluster.7xjkny.mongodb.net/?retryWrites=true&w=majority&appName=emihub-cluster
    JWT_SECRET=YOUR_SECRET_KEY
    ```
4.  **Run the application**:
    ```bash
    npm run dev
    ```

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

-   `POST /api/auth/register` - Register a new user.
-   `POST /api/auth/login` - Log in and get a JWT token.

### Jobs

-   `POST /api/jobs` - Create a new job post (Protected: Employee, Admin).
-   `GET /api/jobs` - Get all job listings (Public).
-   `GET /api/jobs/:id` - Get a single job by ID (Public).
-   `PUT /api/jobs/:id` - Update a job (Protected: Employee, Admin).
-   `DELETE /api/jobs/:id` - Delete a job (Protected: Employee, Admin).

### Applications

-   `POST /api/applications/apply` - Apply for a job (Protected: Job Seeker). Requires `multipart/form-data` with `jobId` and `cv` file.
-   `GET /api/applications/my-applications` - View a job seeker's application history (Protected: Job Seeker).
-   `GET /api/applications/:jobId` - View all applications for a specific job (Protected: Employee, Admin).
-   `PATCH /api/applications/status/:applicationId` - Update an application's status (Protected: Employee, Admin).

## Payment Flow

1.  A **Job Seeker** authenticates and obtains a JWT token.
2.  They send a `POST` request to `/api/applications/apply` with the `jobId` and their CV file.
3.  The backend simulates a successful payment of 100 Taka using a mock service.
4.  Upon successful "payment", an invoice is stored in the database.
5.  The application is saved with a `paymentStatus` of `true` and a `status` of `pending`.

## ERD

The ERD (Entity-Relationship Diagram) for the project can be found in the repository.
![ERD Image](erd.png)

## Postman Documentation

The Postman documentation for this API is available [here](https://www.postman.com/collections/your-postman-collection-id).
