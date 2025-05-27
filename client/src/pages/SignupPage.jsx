import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import authService from '../services/authService.js'; 
import { AuthContext } from '../context/AuthContext.jsx'; 

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', // Changed from name to fullName
    email: '',
    password: '',
    confirmPassword: '',
    role: 'individual', 
    // User specific (if role is individual/admin)
    phoneNumber: '',
    state: '',
    preferredLanguage: '',
    // Lawyer specific fields
    specialization: '',
    barCouncilId: '',
    experienceYears: '',
    stateOfPractice: '', // Added for lawyer
    language: '', // Added for lawyer (can be same as preferredLanguage or different)
    bio: '', // Added for lawyer
  });
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext); 

  const { 
      fullName, email, password, confirmPassword, role, 
      phoneNumber, state, preferredLanguage, // User fields
      specialization, barCouncilId, experienceYears, stateOfPractice, language, bio // Lawyer fields
  } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setLoading(true);
    setError(''); 

    try {
      let userDataToSubmit = { fullName, email, password, role };
      
      if (role === 'lawyer') {
        if (!specialization || !barCouncilId || !experienceYears || !phoneNumber || !stateOfPractice || !language || !bio) {
            setError('All lawyer-specific fields are required.');
            setLoading(false);
            return;
        }
        userDataToSubmit = { 
            ...userDataToSubmit, 
            phoneNumber, specialization, barCouncilId, 
            experienceYears: Number(experienceYears), 
            stateOfPractice, language, bio
        };
      } else { // 'individual' or 'admin'
         if (!phoneNumber || !state || !preferredLanguage) {
            setError('Phone number, state, and preferred language are required for users.');
            setLoading(false);
            return;
        }
        userDataToSubmit = {
            ...userDataToSubmit,
            phoneNumber, state, preferredLanguage
        };
      }
      
      const data = await authService.register(userDataToSubmit); 
      contextLogin({ _id: data._id, fullName: data.fullName, email: data.email, role: data.role }, data.token);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.message || err.errors?.message || 'Registration failed. Please try again.');
      console.error("Signup error details:", err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 sm:mt-12 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Create Your LegalConnect Account</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Common Fields */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="fullName" id="fullName" value={fullName} onChange={handleChange} required 
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" name="email" id="email" value={email} onChange={handleChange} required 
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="tel" name="phoneNumber" id="phoneNumber" value={phoneNumber} onChange={handleChange} required 
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" id="password" value={password} onChange={handleChange} required 
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                 aria-describedby="password-help"/>
          <p className="mt-1 text-xs text-gray-500" id="password-help">Must be at least 6 characters.</p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={handleChange} required 
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
          <select name="role" id="role" value={role} onChange={handleChange} required
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="individual">An Individual User</option>
            <option value="lawyer">A Legal Professional</option>
            {/* Admin registration might be handled differently, e.g., seeded or by another admin */}
          </select>
        </div>

        {/* User (Individual/Admin) Specific Fields */}
        {(role === 'individual' || role === 'admin') && (
            <div className="space-y-5 p-4 border border-gray-200 rounded-md bg-gray-50">
                 <h3 className="text-md font-semibold text-gray-700">User Details</h3>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" name="state" id="state" value={state} onChange={handleChange} required={role === 'individual' || role === 'admin'}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                    <input type="text" name="preferredLanguage" id="preferredLanguage" value={preferredLanguage} onChange={handleChange} required={role === 'individual' || role === 'admin'}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
            </div>
        )}

        {/* Lawyer Specific Fields */}
        {role === 'lawyer' && (
          <div className="space-y-5 p-4 border border-blue-200 rounded-md bg-blue-50">
            <h3 className="text-md font-semibold text-blue-700">Legal Professional Details</h3>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Area of Specialization</label>
              <input type="text" name="specialization" id="specialization" placeholder="e.g., Criminal Law" value={specialization} onChange={handleChange} required={role === 'lawyer'}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="barCouncilId" className="block text-sm font-medium text-gray-700 mb-1">Bar Council ID</label>
              <input type="text" name="barCouncilId" id="barCouncilId" value={barCouncilId} onChange={handleChange} required={role === 'lawyer'}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="number" name="experienceYears" id="experienceYears" value={experienceYears} onChange={handleChange} required={role === 'lawyer'} min="0"
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="stateOfPractice" className="block text-sm font-medium text-gray-700 mb-1">State of Practice</label>
                <input type="text" name="stateOfPractice" id="stateOfPractice" value={stateOfPractice} onChange={handleChange} required={role === 'lawyer'}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Primary Language of Practice</label>
                <input type="text" name="language" id="language" value={language} onChange={handleChange} required={role === 'lawyer'}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Short Bio (Max 500 chars)</label>
                <textarea name="bio" id="bio" value={bio} onChange={handleChange} required={role === 'lawyer'} rows="3" maxLength="500"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
        )}

        <div>
          <button type="submit" disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition duration-150 ease-in-out">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;