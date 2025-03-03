import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Building2, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Hospital Management System</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A comprehensive solution for managing hospitals, doctors, and healthcare services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/hospitals" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors"
            >
              View Hospitals
            </Link>
            <Link 
              to="/hospitals/create" 
              className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Add New Hospital
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Hospitals</h3>
              <p className="text-gray-600">
                Search and filter hospitals by city, speciality, and ratings to find the perfect match for your healthcare needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Add New Hospitals</h3>
              <p className="text-gray-600">
                Easily add new hospitals to the system with comprehensive details including specialities and departments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manage Hospital Data</h3>
              <p className="text-gray-600">
                Update hospital information, add images, and manage specialities with our intuitive management interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-4xl font-bold text-blue-600 mb-2">500+</h4>
              <p className="text-gray-600">Hospitals Registered</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-4xl font-bold text-blue-600 mb-2">50+</h4>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-4xl font-bold text-blue-600 mb-2">10,000+</h4>
              <p className="text-gray-600">Healthcare Professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our platform to manage your hospital data efficiently and connect with patients.
          </p>
          <Link 
            to="/hospitals/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Your Hospital
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;