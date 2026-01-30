# Galaxy Backend API

This is the backend server for the Galaxy application, a platform designed to manage interactions between students, teachers, and administrators in an educational context. It handles user registration, authentication, class management, contracts, and file uploads.

## ✨ Features

*   **Role-based User System**: Separate registration and functionalities for Students, Teachers, and Admins.
*   **Authentication**: Secure login system.
*   **Profile Management**: Users can upload and update their profile pictures.
*   **Contract Management**: Admins can create, view, update, and terminate contracts.
*   **Class Management**: Teachers can create classes, and users can view them.
*   **File Uploads**: Handles file uploads to Google Cloud Storage for profile pictures and class materials.

## 🛠️ Technologies Used

*   **Backend Framework**: [Express.js](https://expressjs.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database ORM**: [Prisma](https://www.prisma.io/)
*   **Authentication**: [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing, JWT for sessions (implied by `tokenValidator`).
*   **File Handling**: Multer for handling `multipart/form-data` and Google Cloud Storage for file persistence.
*   **Validation**: Middleware-based schema validation.

## 📂 Project Structure

The project follows a layered architecture to separate concerns:

```
src/
├── config/         # Database (Prisma) and cloud service configuration.
├── controllers/    # Handle incoming HTTP requests and send responses.
├── middlewares/    # Express middlewares for validation, auth, and error handling.
├── repository/     # Direct database interaction logic using Prisma.
├── routes/         # API route definitions.
├── services/       # Business logic of the application.
├── schemas/        # (Inferred) Validation schemas for request bodies.
└── app.ts          # Main Express application setup.
```

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

*   Node.js (v16 or later)
*   npm, yarn, or pnpm
*   A running PostgreSQL database (or any other database supported by Prisma).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd galaxy_back
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables. This file is used to store sensitive information like database credentials.

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    
    # Add credentials for Google Cloud Storage if you are using it
    GCS_PROJECT_ID="your-gcs-project-id"
    GCS_BUCKET_NAME="your-gcs-bucket-name"
    ```

4.  **Run database migrations:**
    Apply the database schema to your database using Prisma.
    ```sh
    npx prisma migrate dev
    ```

5.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The server will start, typically on a port defined in your startup script or defaulting to one (e.g., 3000 or 5000).

## 🛣️ API Endpoints

Here are the main API routes available:

### Authentication
*   `POST /login`: Authenticate a user and receive a token.

### Registration
*   `POST /register/teacher`: Register a new teacher.
*   `POST /register/student`: Register a new student.
*   `POST /register/admin`: Register a new administrator.
*   `PUT /register/profile`: Upload a profile picture for the authenticated user.

### Contracts (Admin access)
*   `POST /contracts`: Create a new contract.
*   `GET /contracts`: Get a list of all contracts.
*   `GET /contracts/:id`: Get a specific contract by ID.
*   `PUT /contracts`: Update an existing contract.
*   `DELETE /contracts/:id`: Terminate a contract.

### Classes
*   `POST /classes`: Create a new class (requires file upload).
*   `GET /classes`: Get a list of all classes.
*   `GET /classes/:id`: Get a specific class by ID.

### Users
*   Endpoints for managing students and teachers (e.g., `GET /students`, `GET /teachers/:id`).

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
