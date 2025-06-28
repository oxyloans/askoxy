import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-feather";

const useCasesData = [
  {
    path: "customer-id-creation",
    title: "Customer ID Creation",
    description: "Generate unique customer ID and link it to the Core Banking System (CBS)",
    detailedDescription: "This use case involves creating a unique customer identification system that integrates seamlessly with the Core Banking System. The process includes customer data validation, ID generation algorithms, and real-time CBS integration to ensure data consistency across all banking operations.",
    image: "/images/customer-id.jpg",
    features: [
      "Unique ID generation with validation",
      "Real-time CBS integration",
      "Customer data verification",
      "Audit trail maintenance"
    ]
  },
  {
    path: "co-applicant-linking",
    title: "Co-applicant & Guarantor Linking",
    description: "Upload and link KYC/supporting documents for co-applicants or guarantors",
    detailedDescription: "Streamline the process of linking co-applicants and guarantors to loan applications. This includes KYC document management, relationship mapping, and compliance verification to ensure all parties are properly documented and linked.",
    image: "/images/co-applicant.jpg",
    features: [
      "KYC document upload and verification",
      "Relationship mapping between parties",
      "Compliance checks and validation",
      "Document version control"
    ]
  },
  // Add more detailed data for other use cases...
];

const CASUseCaseDetail = () => {
  const { useCasePath } = useParams();
  const navigate = useNavigate();

  const useCase = useCasesData.find(uc => uc.path === useCasePath);

  if (!useCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Use Case Not Found</h1>
          <button
            onClick={() => navigate('/cas')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleBusinessUseCase = () => {
    navigate(`/cas/${useCasePath}/business`);
  };

  const handleSystemUseCase = () => {
    navigate(`/cas/${useCasePath}/system`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/cas')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Use Cases
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{useCase.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Image */}
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={useCase.image}
                alt={useCase.title}
                className="w-full h-64 lg:h-80 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x400/4F46E5/ffffff?text=${encodeURIComponent(useCase.title)}`;
                }}
              />
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h3>
              <ul className="space-y-2">
                {useCase.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side - Content and Buttons */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {useCase.detailedDescription || useCase.description}
              </p>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Choose Your View
                </h3>
                <p className="text-gray-600 mb-6">
                  Select how you'd like to explore this use case - from a business perspective or technical system perspective.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleBusinessUseCase}
                    className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-between group"
                  >
                    <div className="text-left">
                      <div className="font-semibold">Business Use Case</div>
                      <div className="text-indigo-200 text-sm">
                        Explore business requirements and workflows
                      </div>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={handleSystemUseCase}
                    className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-between group"
                  >
                    <div className="text-left">
                      <div className="font-semibold">System Use Case</div>
                      <div className="text-green-200 text-sm">
                        Explore technical implementation and system design
                      </div>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CASUseCaseDetail;