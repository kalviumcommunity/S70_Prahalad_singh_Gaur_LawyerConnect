import React from 'react';
import { Link } from 'react-router-dom'; 

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Welcome to LegalConnect
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Your AI-Powered Legal Assistance Platform. Bridging the gap between you and legal clarity with cutting-edge technology.
        </p>
      </header>

      <div className="mb-12 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center">
        <Link 
          to="/signup" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out text-lg"
        >
          Get Started - Sign Up
        </Link>
        <Link 
          to="/login" 
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out text-lg"
        >
          Login to Your Account
        </Link>
      </div>

      <section className="w-full max-w-4xl p-6 sm:p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">Platform Features</h2>
        <ul className="space-y-4 text-left text-gray-700">
          {[
            { icon: '🤖', title: 'AI Legal Assistant', description: 'Location-aware chatbot explaining IPC sections and legal procedures in simple terms.' },
            { icon: '🤝', title: 'Smart Lawyer Matching', description: 'Algorithm connecting clients with suitable lawyers based on case type, language, and budget.' },
            { icon: '📁', title: 'Digital Case File', description: 'Secure document storage with AI-powered analysis of legal papers for key insights.' },
            { icon: '⚖️', title: 'Legal CRM for Professionals', description: 'Tools for matter management, deadline tracking, and streamlined client communication.' },
            { icon: '🌐', title: 'Regional Language Support', description: 'Accessible in Hindi and 5 other Indian languages for wider reach.' },
            { icon: '📹', title: 'Integrated Video Consultation', description: 'Secure and convenient video calls with legal professionals.' },
          ].map(feature => (
            <li key={feature.title} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-2xl flex-shrink-0">{feature.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-blue-700">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default LandingPage;