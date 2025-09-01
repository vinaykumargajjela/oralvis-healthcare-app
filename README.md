# OralVis Healthcare - Dental Scan Management System

OralVis Healthcare is a full-stack web application designed for managing patient dental scans. The application provides a seamless interface for two distinct user roles: Technicians, who can upload patient scans, and Dentists, who can view, manage, and generate reports for these scans.

## Technology Stack

The application is built with a modern technology stack:

* **Frontend:**
    * React (with Vite)
    * React Router for navigation
    * Axios for API requests
    * jsPDF for generating PDF reports

* **Backend:**
    * Node.js with Express.js
    * SQLite for the database
    * Cloudinary for cloud image storage
    * JWT (JSON Web Tokens) for authentication
    * Bcrypt.js for password hashing
    * Multer for handling file uploads

* **Database:**
    * SQLite

## Features

* **Role-Based Access Control:** Separate dashboards and permissions for Technicians and Dentists.
* **Secure Authentication:** User login is secured with JWTs and hashed passwords.
* **Scan Upload:** Technicians can upload patient dental scans with relevant information.
* **Scan Viewer:** Dentists can view all uploaded scans in a clean and organized grid.
* **PDF Report Generation:** Dentists can download detailed PDF reports for each scan.
* **Cloud Image Storage:** All scan images are securely stored in the cloud via Cloudinary.

## Screenshots



* **Login Page:**





  <img width="690" height="638" alt="Image" src="https://github.com/user-attachments/assets/d4b65ca2-1ecd-4f3f-b283-3d800743a35b" />

   

* **Technician Dashboard:**





   <img width="1069" height="628" alt="Image" src="https://github.com/user-attachments/assets/f7666eb4-68eb-4c94-bd37-e9bbabef5e54" />



  



    
* **Dentist Dashboard:**
   




    <img width="1636" height="805" alt="Image" src="https://github.com/user-attachments/assets/e609be05-b3a4-4a9e-bf75-ce543a151d14" />


## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm installed on your machine.
* A Cloudinary account for image storage.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/vinaykumargajjela/oralvis-healthcare-app.git
    cd oralvis-healthcare-app
    ```

2.  **Backend Setup:**
    * Navigate to the backend directory:
        ```sh
        cd oralvis-backend
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Create a `.env` file in the `oralvis-backend` directory and add the following environment variables with your own credentials:
        ```
        VITE_API_URL=http://localhost:3001
        JWT_SECRET=your_super_secret_jwt_key
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```
    * Seed the database with initial user data:
        ```sh
        npm run seed
        ```
    * Start the backend server:
        ```sh
        npm start
        ```
    The backend will be running on `http://localhost:3001`.

3.  **Frontend Setup:**
    * Open a new terminal and navigate to the frontend directory:
        ```sh
        cd oralvis-frontend
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Create a `.env` file in the `oralvis-frontend` directory and add the following:
        ```
        VITE_API_URL=http://localhost:3001
        ```
    * Start the frontend development server:
        ```sh
        npm run dev
        ```
    The frontend will be accessible at `http://localhost:5173`.

## Default Login Credentials

You can use the following credentials to log in and test the application:

* **Technician:**
    * **Email:** `technician@oralvis.com`
    * **Password:** `password123`

* **Dentist:**
    * **Email:** `dentist@oralvis.com`
    * **Password:** `password123`

## Live Demo

A live demo of the application is available at: https://oralvis-healthcare-app-bvem.vercel.app/login
