import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { PlusCircle, X, Upload, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  city: string;
  speciality: string[];
  rating: number;
  description: string;
  numberOfDoctors: number;
  numberOfDepartments: number;
}

const specialityOptions = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Gynecology', 'Dermatology', 'Ophthalmology', 'Psychiatry', 'Urology',
  'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Nephrology', 'Rheumatology'
];

const CreateHospitalPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>();
  
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleSpeciality = (speciality: string) => {
    if (selectedSpecialities.includes(speciality)) {
      setSelectedSpecialities(selectedSpecialities.filter(s => s !== speciality));
    } else {
      setSelectedSpecialities([...selectedSpecialities, speciality]);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!imageFile) {
      toast.error('Please upload a hospital image');
      return;
    }

    if (selectedSpecialities.length === 0) {
      toast.error('Please select at least one speciality');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload image first
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const imageUploadResponse = await axios.post('http://localhost:5000/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Create hospital with image path
      const hospitalData = {
        ...data,
        speciality: selectedSpecialities,
        image: imageUploadResponse.data.filePath
      };
      
      const response = await axios.post('http://localhost:5000/api/v1/hospitals/create', hospitalData);
      
      toast.success('Hospital created successfully');
      navigate(`/hospitals/${response.data.data._id}`);
    } catch (error) {
      console.error('Error creating hospital:', error);
      toast.error('Failed to create hospital');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Hospital</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Name*
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter hospital name"
                  {...register('name', { required: 'Hospital name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  id="city"
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter city name"
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.city.message}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)*
                </label>
                <input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  className={`w-full px-4 py-2 border ${errors.rating ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  {...register('rating', { 
                    required: 'Rating is required',
                    min: { value: 1, message: 'Rating must be at least 1' },
                    max: { value: 5, message: 'Rating cannot exceed 5' }
                  })}
                />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.rating.message}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {imagePreview ? (
                    <div className="w-full text-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto h-32 object-cover mb-2" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Upload an image</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialities*
                </label>
                <div className="border border-gray-300 rounded-md p-3 h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {specialityOptions.map((speciality) => (
                      <div key={speciality} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`speciality-${speciality}`}
                          checked={selectedSpecialities.includes(speciality)}
                          onChange={() => toggleSpeciality(speciality)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`speciality-${speciality}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {speciality}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedSpecialities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSpecialities.map((speciality) => (
                      <span
                        key={speciality}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {speciality}
                        <button
                          type="button"
                          onClick={() => toggleSpeciality(speciality)}
                          className="ml-1.5 h-3.5 w-3.5 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter hospital description"
                  {...register('description', { required: 'Description is required' })}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="numberOfDoctors" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Doctors*
                  </label>
                  <input
                    id="numberOfDoctors"
                    type="number"
                    min="0"
                    className={`w-full px-4 py-2 border ${errors.numberOfDoctors ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    {...register('numberOfDoctors', { 
                      required: 'Number of doctors is required',
                      min: { value: 0, message: 'Cannot be negative' }
                    })}
                  />
                  {errors.numberOfDoctors && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.numberOfDoctors.message}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="numberOfDepartments" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Departments*
                  </label>
                  <input
                    id="numberOfDepartments"
                    type="number"
                    min="0"
                    className={`w-full px-4 py-2 border ${errors.numberOfDepartments ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    {...register('numberOfDepartments', { 
                      required: 'Number of departments is required',
                      min: { value: 0, message: 'Cannot be negative' }
                    })}
                  />
                  {errors.numberOfDepartments && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.numberOfDepartments.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/hospitals')}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Hospital
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHospitalPage;