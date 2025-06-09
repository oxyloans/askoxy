import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, Calendar, Users, BookOpen, Heart, Star, ChevronRight } from 'lucide-react';

const Support = () => {
  const [activeSupport, setActiveSupport] = useState('counselor');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    concern: '',
    urgency: 'normal'
  });

  const supportTypes = [
    {
      id: 'counselor',
      title: 'Counselor Support',
      icon: MessageCircle,
      description: 'Get expert guidance from experienced counselors',
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 'academic',
      title: 'Academic Help',
      icon: BookOpen,
      description: 'Subject-specific tutoring and study assistance',
      color: 'from-blue-500 to-indigo-500'
    },
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleFormSubmit = () => {
    if (consultationForm.name && consultationForm.email && consultationForm.phone && consultationForm.concern) {
      alert('Consultation request submitted successfully!');
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        concern: '',
        urgency: 'normal'
      });
      setSelectedTimeSlot('');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setConsultationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Student <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Support</span>
          </h3>
          <p className="text-gray-600">
            We're here to help you succeed. Choose from our comprehensive support services designed for your academic and personal growth.
          </p>
        </div>

        {/* Support Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => setActiveSupport(type.id)}
                className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeSupport === type.id
                    ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-3`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{type.title}</h4>
                <p className="text-gray-600 text-sm">{type.description}</p>
                {activeSupport === type.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Support Content */}
        <div className="lg:col-span-2">
          {activeSupport === 'counselor' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Professional Counselor Support
                </h4>
                <p className="text-gray-600">
                  Connect with our licensed counselors for personalized guidance on academic, personal, and career matters.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>Book Session</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl hover:bg-blue-100 transition-all duration-300 font-medium border border-blue-200">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-green-50 text-green-600 px-4 py-3 rounded-xl hover:bg-green-100 transition-all duration-300 font-medium border border-green-200">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
              </div>

              {/* Time Slot Selection */}
              <div className="mb-6">
                <h5 className="font-bold text-gray-900 mb-3">Available Time Slots</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-lg text-center transition-all duration-300 ${
                        selectedTimeSlot === slot
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-sm font-medium">{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Form */}
              <div className="space-y-4">
                <h5 className="font-bold text-gray-900">Schedule Your Consultation</h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={consultationForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={consultationForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={consultationForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Concern/Topic</label>
                  <textarea
                    value={consultationForm.concern}
                    onChange={(e) => handleInputChange('concern', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="Briefly describe what you'd like to discuss..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                  <select
                    value={consultationForm.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <button
                  onClick={handleFormSubmit}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          )}

          {/* Other support types content */}
          {activeSupport !== 'counselor' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h4>
              <p className="text-gray-600 mb-4">
                We're working on bringing you the best {supportTypes.find(t => t.id === activeSupport)?.title.toLowerCase()} experience.
              </p>
              <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                Get Notified
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h5 className="font-bold text-gray-900 mb-4">Emergency Contact</h5>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Phone className="w-4 h-4 text-red-600" />
                <div>
                  <div className="font-medium text-red-900 text-sm">Crisis Hotline</div>
                  <div className="text-xs text-red-700">Available 24/7</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900 text-sm">support@university.edu</div>
                  <div className="text-xs text-blue-700">General inquiries</div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Support;