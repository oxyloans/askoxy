import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, CheckCircle, ArrowRight, Shield } from 'lucide-react';

const PersonalDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, selectedCountry } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', mobile: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Navigate to the next page with all collected data
      navigate('/applicationsupload', {
        state: {
          userRole,
          selectedCountry,
          personalDetails: formData
        }
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-fadeIn">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center group transition-all"
            >
              <div className="bg-purple-600 text-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-all duration-200">
                <ArrowLeft size={18} />
              </div>
            </button>
            <h3 className="text-2xl mt-2 font-bold text-purple-600">
              Personal Details
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="animate-slideUp">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`block w-full pl-10 pr-4 py-3 text-gray-700 bg-white border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'} rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all duration-300`}
                  />
                  {formData.name && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`block w-full pl-10 pr-4 py-3 text-gray-700 bg-white border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'} rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all duration-300`}
                  />
                  {formData.email && !errors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    className={`block w-full pl-10 pr-4 py-3 text-gray-700 bg-white border ${errors.mobile ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'} rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all duration-300`}
                  />
                  {formData.mobile && !errors.mobile && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
                {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-gray-400 text-xs">(optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="block w-full pl-10 pr-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  />
                  {formData.city && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4 px-6 font-medium transition-all duration-300 shadow-lg hover:shadow-purple-200 transform hover:translate-y-[-2px]"
              >
                <span>Continue</span>
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center text-xs text-gray-500">
              <Shield size={14} className="text-purple-500 mr-1" />
              <span>Your data is secure and protected</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            © 2025 ASKOXY.AI • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

// Make sure to include the animations from the previous component as well
// Add these CSS animations to your global styles or component
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}Step 4/5

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.4s ease-out forwards;
}
`;
document.head.appendChild(styleSheet);

export default PersonalDetailsPage;