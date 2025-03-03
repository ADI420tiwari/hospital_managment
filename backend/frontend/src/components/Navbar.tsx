import React from 'react';
import { Link } from 'react-router-dom';
import { Guitar as Hospital } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Hospital className="h-8 w-8" />
            <span className="text-xl font-bold">MediCare</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/hospitals" className="hover:text-blue-200 transition-colors">
              Hospitals
            </Link>
            <Link to="/hospitals/create" className="hover:text-blue-200 transition-colors">
              Add Hospital
            </Link>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;