import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx'; 
import axios from 'axios'; 

const DashboardPage = () => {
  const { user, token } = useContext(AuthContext); 
  const [profileData, setProfileData] = useState(null); 
  const [loadingProfile, setLoadingProfile] = useState(true); // Renamed to avoid conflict with authLoading
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && token) {
        setLoadingProfile(true);
        setError('');
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/users/profile`, config);
          setProfileData(response.data);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          setError("Could not load detailed profile information.");
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false); 
      }
    };

    fetchProfile();
  }, [user, token]); 

  if (loadingProfile && !profileData) { // Show loading only if profile data isn't there yet
    return <div className="text-center p-10"><p className="text-lg text-gray-600">Loading dashboard...</p></div>;
  }
  
  if (!user) { 
    return <div className="text-center p-10"><p className="text-lg text-red-600">User not authenticated. Please login.</p></div>;
  }
  
  const displayUser = profileData || user; // Use fetched profileData if available

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">User Dashboard</h1>
      <div className="space-y-3 text-gray-700">
        <p><span className="font-semibold">Full Name:</span> {displayUser.fullName || displayUser.name}</p> {/* Use fullName */}
        <p><span className="font-semibold">Email:</span> {displayUser.email}</p>
        <p><span className="font-semibold">Role:</span> <span className="capitalize bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">{displayUser.role}</span></p>
        <p><span className="font-semibold">Phone:</span> {displayUser.phoneNumber || "Not provided"}</p>
      </div>
      
      {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

      {displayUser.role === 'individual' && profileData && (
         <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">My Details:</h2>
            <div className="space-y-2 text-gray-600 text-sm">
                <p><span className="font-medium">State:</span> {displayUser.state || "Not specified"}</p>
                <p><span className="font-medium">Preferred Language:</span> {displayUser.preferredLanguage || "Not specified"}</p>
            </div>
        </div>
      )}

      {displayUser.role === 'lawyer' && profileData && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Lawyer Profile:</h2>
          <div className="space-y-2 text-gray-600 text-sm">
              <p><span className="font-medium">Specialization:</span> {displayUser.specialization || "Not specified"}</p>
              <p><span className="font-medium">Bar Council ID:</span> {displayUser.barCouncilId || "Not specified"}</p>
              <p><span className="font-medium">Years of Experience:</span> {displayUser.experienceYears !== undefined ? `${displayUser.experienceYears} years` : "Not specified"}</p>
              <p><span className="font-medium">State of Practice:</span> {displayUser.stateOfPractice || "Not specified"}</p>
              <p><span className="font-medium">Language(s):</span> {displayUser.language || "Not specified"}</p>
              <p><span className="font-medium">Bio:</span> {displayUser.bio || "Not specified"}</p>
              <p><span className="font-medium">Verified:</span> {displayUser.isVerified ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}</p>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">What's Next?</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            {displayUser.role === 'individual' && <li>Search for legal professionals based on your needs.</li>}
            {displayUser.role === 'individual' && <li>Manage your case documents securely.</li>}
            {displayUser.role === 'lawyer' && <li>Complete or update your professional profile to attract clients.</li>}
            {displayUser.role === 'lawyer' && <li>View and respond to client inquiries.</li>}
            <li>Explore the AI Legal Assistant for quick legal information.</li>
            <li>Customize your notification settings.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;