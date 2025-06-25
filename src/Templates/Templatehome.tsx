import React from 'react';
import { useNavigate } from 'react-router-dom';
import AskOxyLogo from "../assets/img/askoxylogoblack.png";
import Template1Image from "../assets/img/template1.png";
import Template2Image from "../assets/img/template2.png";

interface Template {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  path: string;
}

const DesignTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const templates = [
    {
      id: 1,
      name: "Template 1",
      imageUrl: Template1Image,
      description: "Professional business template with modern layout",
      path: "/template1"
    },
    {
      id: 2,
      name: "Template 2",
      imageUrl: Template2Image,
      description: "Creative portfolio template with customizable sections",
      path: "/template2"
    }
  ];
  
  const handleEditClick = (templatePath: string) => {
    // Navigate to the specific template path
    navigate(templatePath);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <img src={AskOxyLogo} alt="ASKOXY.AI Logo" className="h-8 sm:h-10 w-auto" />
            <h1 className="ml-2 sm:ml-3 text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
              <span className="hidden sm:inline">ASKOXY.AI</span> Design Templates
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Choose a Template</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Select a template and start customizing your design with our intuitive editor</p>
        </div>
        
        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-4 sm:p-5 text-center">
                <h3 className="font-medium text-lg sm:text-xl text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>
              <div className="aspect-w-16 aspect-h-10 bg-gray-100 flex items-center justify-center p-4">
                <img 
                  src={template.imageUrl} 
                  alt={template.name}
                  className="max-w-full max-h-full object-contain rounded-md shadow-sm"
                />
              </div>
              <div className="p-4 sm:p-5">
                <button
                  onClick={() => handleEditClick(template.path)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-3 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Customize Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No templates found placeholder - conditionally rendered */}
        {templates.length === 0 && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-gray-500">Check back later for new template options</p>
          </div>
        )}
      </main>
      
      {/* CTA Section */}
      <section className="bg-purple-700 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to create your own custom template?</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">Start from scratch and build a unique design that perfectly fits your brand</p>
        </div>
      </section>
    </div>
  );
};

export default DesignTemplatesPage;