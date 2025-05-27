import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext.jsx'; 

const GoogleAuthSuccessHandler = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext); 

  useEffect(() => {
    const params = new URLSearchParams(location.search); 
    const token = params.get('token');
    const id = params.get('id');
    const name = params.get('name'); // This should be 'fullName' from backend
    const email = params.get('email');
    const role = params.get('role');

    if (token && id && name && email && role) {
      const userData = { _id: id, fullName: name, email, role }; // Use fullName
      contextLogin(userData, token); 
      navigate('/dashboard', { replace: true }); 
    } else {
      console.error('Google OAuth callback is missing required parameters.');
      navigate('/login?error=google_auth_failed_params&message=Failed to process Google login. Please try again.', { replace: true });
    }
  }, [location, navigate, contextLogin]); 

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-xl text-gray-700 font-semibold">Finalizing your Google login...</p>
      <p className="text-sm text-gray-500">Please wait, you'll be redirected shortly.</p>
    </div>
  );
};

export default GoogleAuthSuccessHandler;

