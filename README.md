# Ours. Platform

A premium platform for learning software development through building real-world projects. This application features a modern, high-performance frontend built with React and a robust Express backend integrated with Firebase and Razorpay.

## Features

### User Features
- **Project Catalog**: Browse and purchase premium software projects.
- **Course Learning**: Access structured courses and tutorials.
- **Blog Section**: Read articles on software development trends and tips.
- **User Authentication**: Secure login and signup via Firebase Auth.
- **Responsive Design**: Fully responsive UI optimized for desktop, tablet, and mobile devices.
- **PWA Support**: Installable as a Progressive Web App for a native-like experience.

### Admin Features
- **Dashboard**: Overview of user statistics and project sales.
- **Content Management**:
  - **Courses**: Create, edit, and manage course content.
  - **Blogs**: Publish and manage blog posts.
  - **Products**: Manage digital products and pricing.
  - **Coupons**: Create and manage discount codes.
- **User Management**: View user details and manage permissions.
- **Email System**: Send emails to users directly from the admin panel.
- **Project Requests**: specific feature requests from users.

## Tech Stack

### Frontend
- **React 19**: Modern UI library for building interactive interfaces.
- **Vite**: Next-generation frontend tooling for fast development and build.
- **Tailwind CSS**: Utility-first CSS framework for rapid and custom styling.
- **Framer Motion**: Library for production-ready animations.
- **Firebase**: Authentication, Firestore Database, and Hosting.
- **Lucide React**: Beautiful & consistent icons.
- **Recharts**: Composable charting library for React.

### Backend
- **Node.js & Express**: Fast and minimalist web framework for the API.
- **Firebase Admin SDK**: Secure server-side access to Firebase services.
- **Razorpay**: Payment gateway integration for processing transactions.
- **Cors**: Middleware to enable Cross-Origin Resource Sharing.

## Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- A **Firebase Project** with Authentication and Firestore enabled.
- A **Razorpay Account** for payment processing.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ours
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

## Environment Configuration

### Frontend (.env)
Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Firebase Service Account
1.  Go to your Firebase Project Settings > Service Accounts.
2.  Generate a new private key.
3.  Save the file as `serviceAccountKey.json` inside the `backend/` directory.

## Running Locally

### Start Backend Server
```bash
cd backend
node index.js
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
Open a new terminal window:
```bash
npm run dev
# App runs on http://localhost:3000 (usually)
```

## Deployment

### Frontend (Vercel)
The project is configured for Vercel deployment with a `vercel.json` file ensuring proper routing for Single Page Applications (SPA).

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Set the **Framework Preset** to Vite.
4.  Add the Frontend Environment Variables in the Vercel project settings.
5.  Deploy.

### Backend
The backend can be deployed to platforms like Render, Railway, or Heroku.
- Ensure you set the `PORT`, `RAZORPAY` keys, and provide the `serviceAccountKey.json` (via secure file upload or base64 environment variable if supported) on the hosting platform.

## Admin Management

The first admin user must be set manually or via a secure backend route if configured.
Once logged in as an admin, navigate to `/god-mode` (or the configured admin route) to access the Dashboard.
