# DOJO Fitness - Frontend

A modern, production-grade React frontend for the DOJO Fitness gym management system. Built with Vite, React, Tailwind CSS, and designed to provide a premium gym experience similar to Cult.fit, Fitbod, and Trainerize.

## 🚀 Features

- **Authentication**: Secure JWT-based login and registration
- **Dashboard**: Visual statistics, activity charts, and quick actions
- **Workout Management**: Create, view, edit, and delete workouts
- **Exercise Library**: Browse and filter exercises by muscle group
- **User Profile**: View account information and manage settings
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Theme**: Modern gym-style UI with dark mode by default

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8000` (see backend setup)

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_API_PREFIX=/api
   ```
   
   Note: The default API prefix is `/api`. If your backend routes are directly at the root (e.g., `/auth/login` instead of `/api/auth/login`), set `VITE_API_PREFIX=` (empty).

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
gym-frontend/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── axios.js      # Axios configuration with interceptors
│   │   ├── auth.js       # Authentication API calls
│   │   ├── workouts.js    # Workout API calls (placeholder)
│   │   └── exercises.js  # Exercise API calls (placeholder)
│   ├── components/       # Reusable UI components
│   │   ├── Header.jsx    # Navigation header
│   │   ├── PrivateRoute.jsx  # Protected route wrapper
│   │   ├── Loading.jsx   # Loading spinner
│   │   ├── StatCard.jsx  # Dashboard stat card
│   │   └── forms/        # Form components
│   │       ├── Input.jsx
│   │       └── Button.jsx
│   ├── context/          # React Context providers
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.js    # Auth hook (re-export)
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Workouts.jsx
│   │   ├── WorkoutDetail.jsx
│   │   ├── Exercises.jsx
│   │   └── Profile.jsx
│   ├── utils/            # Utility functions
│   │   └── formatters.js # Date, currency, etc. formatters
│   ├── App.jsx           # Main app component with routing
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (create this)
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔌 API Integration

The frontend is configured to work with the FastAPI backend. The API base URL is configurable via environment variables.

### Available Endpoints

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Workouts**: `/api/workouts` (placeholder - backend not implemented)
- **Exercises**: `/api/exercises` (placeholder - backend not implemented)

### Authentication

- JWT tokens are stored in `localStorage`
- Tokens are automatically attached to API requests via axios interceptors
- On 401 responses, users are automatically logged out and redirected to login

## 🎨 Styling

This project uses **Tailwind CSS** for styling. The design follows a dark theme optimized for gym/fitness applications.

### Key Design Principles

- Dark background (`bg-gray-900`)
- Primary accent color: Blue (`primary-500`)
- Card-based layouts with subtle borders
- Smooth transitions and hover effects
- Responsive grid layouts

## 📱 Running Frontend & Backend Together

1. **Terminal 1 - Backend:**
   ```bash
   cd ..
   # Activate virtual environment
   source my_venv/Scripts/activate  # Windows
   # or
   source my_venv/bin/activate       # Mac/Linux
   
   # Start FastAPI server
   uvicorn app.main:app --reload
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd gym-frontend
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Keep components focused and reusable
- Add comments explaining WHY, not just WHAT

## 🚧 Known Limitations & TODOs

### Backend Endpoints Not Yet Implemented

The following features have placeholder API functions that will need backend implementation:

1. **Workouts API** (`/api/workouts`)
   - GET `/api/workouts` - List all workouts
   - GET `/api/workouts/{id}` - Get workout details
   - POST `/api/workouts` - Create workout
   - PUT `/api/workouts/{id}` - Update workout
   - DELETE `/api/workouts/{id}` - Delete workout

2. **Exercises API** (`/api/exercises`)
   - GET `/api/exercises` - List all exercises
   - GET `/api/exercises/{id}` - Get exercise details
   - GET `/api/exercises/muscle-groups` - Get available muscle groups

3. **Current User Endpoint**
   - GET `/api/auth/me` - Get current authenticated user (optional, currently uses token decode)

### Future Enhancements

- Workout creation/editing forms
- Exercise filtering and search improvements
- Progress tracking and analytics
- Photo uploads
- Social features
- Push notifications

## 🔒 Security Notes

- Never commit `.env` files
- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- All API requests include authentication headers automatically
- Protected routes redirect to login if unauthenticated

## 📄 License

This project is part of the DOJO Fitness system.

## 🤝 Contributing

When adding new features:

1. Follow the existing folder structure
2. Use the established component patterns
3. Add proper error handling
4. Include loading states
5. Test with the backend API
6. Update this README if needed

---

**Built with ❤️ for DOJO Fitness**
