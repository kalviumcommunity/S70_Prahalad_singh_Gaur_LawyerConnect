import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GoogleAuthSuccessHandler from './components/GoogleAuthSuccessHandler.jsx';
import { AuthContext } from './context/AuthContext.jsx'; 

function App() {
  const { user, logout, loading: authLoading } = useContext(AuthContext); 
  const navigate = useNavigate();
  const location = useLocation(); // Added to pass to protected route

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading LegalConnect...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <nav className="bg-white shadow-lg sticky top-0 z-50"> 
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                LegalConnect
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              {!user ? (
                <>
                  <Link to="/signup" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Sign Up</Link>
                  <Link to="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">Login</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                  <button 
                    onClick={handleLogout} 
                    className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                  <span className="hidden sm:inline ml-3 text-sm text-gray-500">
                    Hi, {user.fullName || user.name}! {/* Display fullName or name */}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          
          <Route path="/auth/google/success" element={<GoogleAuthSuccessHandler />} />
          
          <Route 
            path="/dashboard" 
            element={user ? <DashboardPage /> : <Navigate to="/login" state={{ from: location }} replace />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} /> 
        </Routes>
      </main>
       <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} LegalConnect. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Connecting you to justice, powered by AI.</p>
      </footer>
    </div>
  );
}

export default App;
