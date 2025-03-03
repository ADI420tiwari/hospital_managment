import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Stethoscope, Building2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Hospital {
  _id: string;
  name: string;
  city: string;
  image: string;
  speciality: string[];
  rating: number;
  numberOfDoctors: number;
  numberOfDepartments: number;
}

const HospitalListPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchCity, setSearchCity] = useState<string>('');
  const [searchSpeciality, setSearchSpeciality] = useState<string>('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/hospitals');
      setHospitals(response.data.data);
      setFilteredHospitals(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('Failed to fetch hospitals');
      setLoading(false);
    }
  };

  const handleCitySearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/v1/hospitals?city=${searchCity}`);
      setFilteredHospitals(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching hospitals:', error);
      toast.error('Failed to search hospitals');
      setLoading(false);
    }
  };

  const handleSpecialityFilter = () => {
    if (!searchSpeciality) {
      setFilteredHospitals(hospitals);
      return;
    }
    
    const filtered = hospitals.filter(hospital => 
      hospital.speciality.some(spec => 
        spec.toLowerCase().includes(searchSpeciality.toLowerCase())
      )
    );
    setFilteredHospitals(filtered);
  };

  const handleReset = () => {
    setSearchCity('');
    setSearchSpeciality('');
    setFilteredHospitals(hospitals);
  };

  // Render star rating
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hospitals Directory</h1>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="citySearch" className="block text-sm font-medium text-gray-700 mb-1">
              Search by City
            </label>
            <div className="flex">
              <input
                type="text"
                id="citySearch"
                placeholder="Enter city name"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <button
                onClick={handleCitySearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="specialityFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Speciality
            </label>
            <input
              type="text"
              id="specialityFilter"
              placeholder="e.g. Cardiology, Pediatrics"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchSpeciality}
              onChange={(e) => {
                setSearchSpeciality(e.target.value);
                if (e.target.value === '') {
                  setFilteredHospitals(hospitals);
                }
              }}
              onKeyUp={(e) => e.key === 'Enter' && handleSpecialityFilter()}
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSpecialityFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Hospital List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Hospitals Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new hospital.</p>
          <Link 
            to="/hospitals/create" 
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New Hospital
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <div key={hospital._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={hospital.image.startsWith('http') ? hospital.image : `http://localhost:5000${hospital.image}`} 
                alt={hospital.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{hospital.name}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hospital.city}</span>
                </div>
                <div className="flex items-center mb-3">
                  {renderRating(hospital.rating)}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {hospital.speciality.slice(0, 3).map((spec, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                  {hospital.speciality.length > 3 && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      +{hospital.speciality.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-1" />
                    <span>{hospital.numberOfDoctors} Doctors</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{hospital.numberOfDepartments} Departments</span>
                  </div>
                </div>
                <Link 
                  to={`/hospitals/${hospital._id}`} 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalListPage;