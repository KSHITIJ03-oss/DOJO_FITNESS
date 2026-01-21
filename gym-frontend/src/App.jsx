/**
 * Main App component with routing configuration.
 * Handles both public marketing website and admin dashboard.
 * 
 * Public Routes: Home, Try Us, Join Us, Contact (with PublicNavbar & Footer)
 * Admin Routes: Login, Register, Dashboard, Workouts, etc. (with Header)
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ROLES } from './utils/roleConfig';
import Header from './components/Header';

// Public Marketing Components
import PublicNavbar from './components/public/Navbar';
import Footer from './components/public/Footer';

// Public Marketing Pages
import Home from './pages/public/Home';
import TryUs from './pages/public/TryUs';
import JoinUs from './pages/public/JoinUs';
import Contact from './pages/public/Contact';

// Admin Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import WorkoutEdit from './pages/WorkoutEdit';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';
import Trainers from './pages/Trainers';
import TrainerDetail from './pages/TrainerDetail';
import MembershipPlans from './pages/MembershipPlans';
import Queries from './pages/Queries';
import QueryDetail from './pages/QueryDetail';
import Profile from './pages/Profile';
import CursorGlow from "./components/ui/CursorGlow";

function App() {
  return (
    <div className="bg-black overflow-x-hidden min-h-screen relative">
    <AuthProvider>
      <CursorGlow/>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing Website Routes */}
          <Route
            path="/"
            element={
              <>
                <PublicNavbar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/try-us"
            element={
              <>
                <PublicNavbar />
                <TryUs />
                <Footer />
              </>
            }
          />
          <Route
            path="/join-us"
            element={
              <>
                <PublicNavbar />
                <JoinUs />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <PublicNavbar />
                <Contact />
                <Footer />
              </>
            }
          />

          {/* Admin Authentication Routes (No Header - uses own layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Dashboard Routes (Protected - uses Header) */}
          <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/workouts"
            element={
              <>
                <Header />
                <PrivateRoute>
                  <Workouts />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/workouts/:id"
            element={
              <>
                <Header />
                <PrivateRoute>
                  <WorkoutDetail />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/workouts/:id/edit"
            element={
              <>
                <Header />
                <PrivateRoute>
                  <WorkoutEdit />
                </PrivateRoute>
              </>
            }
          />
          
          <Route
            path="/members"
            element={
              <>
                <Header />
                <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER]}>
                  <Members />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/plans"
            element={
              <>
                <Header />
                <PrivateRoute>
                  <MembershipPlans />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/members/:id"
            element={
              <>
                <Header />
                <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER]}>
                  <MemberDetail />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/trainers"
            element={
              <>
                <Header />
                <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER]}>
                  <Trainers />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/trainers/:id"
            element={
              <>
                <Header />
                <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER]}>
                  <TrainerDetail />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/queries"
            element={
              <>
                <Header />
                <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER]}>
                  <Queries />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/queries/:id"
            element={
              <>
                <Header />
                <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER]}>
                  <QueryDetail />
                </PrivateRoute>
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header />
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              </>
            }
          />

          {/* Default redirect to public home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
   </div>
  );
}

export default App;
