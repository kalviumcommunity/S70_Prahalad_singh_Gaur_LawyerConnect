import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import authService from '../services/authService.js'; 
import { AuthContext } from '../context/AuthContext.jsx'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [googleLoading, setGoogleLoading] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation(); 
  const { login: contextLogin } = useContext(AuthContext); 

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const oauthError = queryParams.get('error');
    const message = queryParams.get('message');

    if (oauthError) {
      setError(message || 'Google sign-in failed. Please try again or use email/password.');
    }
    if (oauthError || message) {
        navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 
    try {
      const data = await authService.login(formData.email, formData.password); 
      contextLogin({ _id: data._id, fullName: data.fullName, email: data.email, role: data.role }, data.token);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true }); 
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    setError(''); 
    setGoogleLoading(true);
    authService.googleSignIn(); 
  };

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-12 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Login to LegalConnect</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
      
      <form onSubmit={handleEmailPasswordLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required 
                 autoComplete="email"
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required 
                 autoComplete="current-password"
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <button type="submit" disabled={loading || googleLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition duration-150 ease-in-out">
            {loading ? 'Logging In...' : 'Login with Email'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <button onClick={handleGoogleLogin} disabled={loading || googleLoading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition duration-150 ease-in-out">
            {googleLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM9.456 15.827c-2.825 0-5.207-1.02-6.988-2.792l1.302-1.017c1.135 1.083 2.55 1.742 4.384 1.742 1.62 0 3.036-.52 4.008-1.43l1.353 1.036c-1.275 1.282-3.12 2.05-5.059 2.05zm0-4.086c-1.834 0-3.25-.66-4.222-1.742L3.93 8.982C2.79 7.7 2.22 5.92 2.22 4.183c0-1.738.57-3.518 1.71-4.798L5.232.4C6.204-.48 7.62-.95 9.456-.95c2.825 0 5.208 1.02 6.988 2.792l-1.302 1.017C13.98 1.775 12.565 1.116 10.73 1.116c-1.62 0-3.036.52-4.008 1.43L5.37 3.563C6.512 4.843 7.08 6.623 7.08 8.36c0 1.737-.568 3.518-1.708 4.798l-1.353-1.036zM17.78 10c0-.608-.057-1.187-.158-1.738H9.456v2.93h4.66c-.202.946-.773 1.737-1.578 2.27l1.353 1.036c1.62-.947 2.76-2.62 2.76-4.5z" clipRule="evenodd" />
              </svg>
            )}
            Sign in with Google
          </button>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up now
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;