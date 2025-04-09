
---
# ClipURL Frontend

This is the frontend for the ClipURL application, a URL shortening service with a dashboard and analytics. It interacts with the backend hosted at `https://clipurl-backend.onrender.com`.

## Login Credentials - sice hardcoded

email - intern@dacoid.com
password - Test123

## Features
- **Login**: User authentication.
- **Home**: Navigation to shorten URLs or view dashboard.
- **Dashboard**: View shortened URLs with click analytics and charts.
- **URL Shortening**: (Assumed feature, add if implemented in `ShortenForm.jsx`).
- **QR Code** : Generates the QR code for the url.
- **Pagination** : (Can be selected how many url's per page)
- **search** : (can be searched url)
  

## Tech Stack
- **React**: UI library.
- **Redux**: State management for authentication.
- **Axios**: HTTP requests.
- **Recharts**: Data visualization for analytics.
- **Tailwind CSS**: Styling.
- **React Router**: Navigation.
- **QR code**:  "react-qr-code": "^2.0.15",
- **Dependencies**: `axios`, `react-redux`, `@reduxjs/toolkit`, `react-router-dom`, `recharts`.

## Prerequisites
- Node.js (v16 or higher)
- Backend deployed at `https://clipurl-backend.onrender.com`

## Setup Instructions

### Local Development
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd client
2. **Configure Backend URL**:
   Update components (Dashboard.jsx, Login.jsx, etc.) with
   ```bash
   const backendURL = 'VITE_BACKEND_URL';
   VITE_BACKEND_URL = https://clipurl-backend.onrender.com

3. **Run the application**:
   ```bash
   npm run dev

##Improvements can be done
 Favourating the url

