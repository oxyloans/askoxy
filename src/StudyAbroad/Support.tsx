import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, Calendar, Users, BookOpen, Heart, Star, ChevronRight, Send, CheckCircle } from 'lucide-react';
import { message } from 'antd';

interface SupportProps {
  onNavigate?: (tab: string) => void;
}

const Support: React.FC<SupportProps> = ({ onNavigate }) => {
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
      description: 'Subject tutoring and study assistance',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'career',
      title: 'Career Guidance',
      icon: Users,
      description: 'Professional development and career planning',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'wellness',
      title: 'Mental Wellness',
      icon: Heart,
      description: 'Mental health support and wellness resources',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleFormSubmit = () => {
    if (consultationForm.name && consultationForm.email && consultationForm.phone && consultationForm.concern && selectedTimeSlot) {
      alert('Consultation request submitted successfully! We will contact you soon.');
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        concern: '',
        urgency: 'normal'
      });
      setSelectedTimeSlot('');
    } else {
      message.error('Please fill in all required fields and select a time slot.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setConsultationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderCounselorSupport = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">Schedule a Consultation</h4>
          <p className="text-gray-600 text-sm">Book a session with our experienced counselors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultation Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={consultationForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={consultationForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={consultationForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
            <select
              value={consultationForm.urgency}
              onChange={(e) => handleInputChange('urgency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
            >
              <option value="low">Low - General guidance</option>
              <option value="normal">Normal - Standard consultation</option>
              <option value="high">High - Urgent assistance needed</option>
              <option value="critical">Critical - Immediate attention required</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your Concern *</label>
            <textarea
              value={consultationForm.concern}
              onChange={(e) => handleInputChange('concern', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors resize-none"
              placeholder="Please describe what you'd like to discuss during the consultation..."
            />
          </div>
        </div>

        {/* Time Slot Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Available Time Slot *</label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    selectedTimeSlot === slot
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white border-violet-500'
                      : 'border-gray-300 text-gray-700 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFormSubmit}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Schedule Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderOtherSupport = (type: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
      <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <type.icon className="w-8 h-8 text-white" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h4>
      <p className="text-gray-600 mb-6">{type.description}</p>
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <h6 className="font-medium text-gray-900 text-sm mb-2">Coming Soon</h6>
          <p className="text-gray-600 text-xs">
            We're working on bringing you the best {type.title.toLowerCase()} experience.
          </p>
        </div>
        <button className={`w-full bg-gradient-to-r ${type.color} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-300 font-medium`}>
          Get Notified
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Student <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Support</span>
          </h3>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            We're here to help you succeed. Choose from our comprehensive support services designed for your academic and personal growth.
          </p>
        </div>

        {/* Support Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {supportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => setActiveSupport(type.id)}
                className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeSupport === type.id
                    ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 transform scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-3`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{type.title}</h4>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{type.description}</p>
                {activeSupport === type.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-4 h-4 text-violet-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Main Support Content */}
        <div className="lg:col-span-2">
          {activeSupport === 'counselor' ? 
            renderCounselorSupport() : 
            renderOtherSupport(supportTypes.find(t => t.id === activeSupport))
          }
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h5 className="font-bold text-gray-900 mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Contact
            </h5>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-red-900 text-sm">+90 89196 36330</div>
                  <div className="text-xs text-red-700">Available on WhatsApp</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-blue-900 text-sm break-all">studyabroad@askoxy.ai</div>
                  <div className="text-xs text-blue-700">General inquiries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h5 className="font-bold text-gray-900 mb-4 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Quick Actions
            </h5>
            <div className="space-y-2">
              {[
                { label: 'Complete Profile', action: 'profile' },
                { label: 'Upload Documents', action: 'documents' },
                { label: 'Search Universities', action: 'universities' },
                { label: 'View Applications', action: 'applications' }
              ].map((item) => (
                <button
                  key={item.action}
                  onClick={() => onNavigate?.(item.action)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl p-4 md:p-6 text-white">
            <h5 className="font-bold mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Support Hours
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Emergency Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;