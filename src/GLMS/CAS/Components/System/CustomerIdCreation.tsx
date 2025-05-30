import React, { useState, useEffect } from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CustomerIdCreationProps {}

const CustomerIdCreation: React.FC<CustomerIdCreationProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalURL, setModalURL] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    description: true,
    actors: true,
    userActions: true,
    conditions: true,
    stp: true,
    alternative: true,
    exception: true,
    activity: true,
    parking: true,
    components: true,
    test: true,
    infra: true,
    dev: true,
  });

  const openModal = (url: string, title: string) => {
    setModalURL(url);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalURL("");
    setModalTitle("");
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
            Customer ID Creation in LOS
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() =>
                openModal(
                  "https://docs.google.com/document/d/1F8aXmDQpwGQ-bKGZpEPBDHrzltPxJ5bM/preview",
                  "Back End Code View"
                )
              }
              className="bg-[#008CBA] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#008CBA] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Back End Code
            </button>
            <button
              onClick={() =>
                openModal(
                  "https://docs.google.com/document/d/1ixT9000eGGKk7GBjeW6QOEMRsmX5YGqn/preview",
                  "Front End Code View"
                )
              }
              className="bg-[#04AA6D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#04AA6D] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Front End Code
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
                <h3
                  id="modal-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  {modalTitle}
                </h3>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold transition-colors duration-200"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <iframe
                  src={modalURL}
                  title={modalTitle}
                  className="w-full h-[60vh] sm:h-[70vh] border-0 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Description */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("description")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-indigo-600" />
                Description
              </span>
              {expandedSections.description ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.description && (
              <p className="text-gray-600 leading-relaxed">
                This use case outlines the process of creating a new Customer ID
                in the Loan Origination System (LOS). It starts when a customer
                submits a loan application with required documents. The Bank
                Officer enters customer data across multiple tabs (Personal,
                Communication, Employment, Income/Expenses) into LOS. The system
                validates the data and assigns a unique Customer ID, enabling
                downstream loan processing.
              </p>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-indigo-600" />
                Actors
              </span>
              {expandedSections.actors ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actors && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Customer-facing
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Customer: Initiates inquiry, submits loan form</li>
                    <li>
                      Bank Officer: Captures and verifies customer information
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    System Roles
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>LOS: Main processing system</li>
                    <li>CBS: Reference for existing customer data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Software Stakeholders
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>API Developer: Customer creation APIs, validations</li>
                    <li>QA Team: Tests data entry & validation flows</li>
                    <li>Infra/CloudOps: Ensures LOS availability</li>
                    <li>UI/UX Team: Designs Customer Capture Screens</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* User Actions & System Responses */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("userActions")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                User Actions & System Responses
              </span>
              {expandedSections.userActions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.userActions && (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-gray-600">
                  <thead className="sticky top-0 bg-indigo-50">
                    <tr>
                      <th className="p-4 font-medium">Step</th>
                      <th className="p-4 font-medium">User Action (UI/API)</th>
                      <th className="p-4 font-medium">System Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">1</td>
                      <td className="p-4">
                        Customer submits filled loan form & documents
                      </td>
                      <td className="p-4">N/A</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">2</td>
                      <td className="p-4">Bank Officer logs into LOS</td>
                      <td className="p-4">Authenticates & opens dashboard</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">3</td>
                      <td className="p-4">
                        Selects "Create New Customer" option
                      </td>
                      <td className="p-4">Loads Customer Master form</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">4</td>
                      <td className="p-4">
                        Fills in Personal, Communication, Employment, and Income
                        details
                      </td>
                      <td className="p-4">
                        Validates mandatory fields & formats
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">5</td>
                      <td className="p-4">N/A</td>
                      <td className="p-4">
                        LOS checks duplicates, integrates with CBS
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">6</td>
                      <td className="p-4">N/A</td>
                      <td className="p-4">
                        Confirmation shown, ID stored in DB
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4">7</td>
                      <td className="p-4">
                        Officer proceeds to loan application entry
                      </td>
                      <td className="p-4">
                        Links new Customer ID to loan workflow
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Precondition & Post Condition */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("conditions")}
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Conditions
              </span>
              {expandedSections.conditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.conditions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Precondition
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Completed loan application form received</li>
                    <li>
                      Required documents submitted (e.g., ID proof, address
                      proof, income proof)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Post Condition
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>
                      New Customer ID created and saved in Customer Master
                    </li>
                    <li>
                      Ready for further loan processing and eligibility checks
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Straight Through Process (STP) */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("stp")}
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-indigo-600" />
                Straight Through Process (STP)
              </span>
              {expandedSections.stp ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.stp && (
              <p className="text-gray-600 leading-relaxed">
                <span className="font-medium">Ideal Path:</span> Login → Fill
                Customer Details → Save → Customer ID Created → Proceed to Loan
                Processing → Logout
              </p>
            )}
          </section>

          {/* Alternative Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("alternative")}
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-indigo-600" />
                Alternative Flows
              </span>
              {expandedSections.alternative ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.alternative && (
              <ul className="list-disc pl-5 text-gray-600">
                <li>Assisted Mode: Officer assists customer at branch</li>
                <li>
                  Self-Service Mode: (Future scope) Digital form via app/portal
                </li>
                <li>
                  API Call: Pre-filled data fetched from national KYC registry
                  (CKYC, UIDAI)
                </li>
                <li>
                  Data Prefill: If PAN exists in CBS, auto-fetch basic data
                </li>
              </ul>
            )}
          </section>

          {/* Exception Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("exception")}
            >
              <span className="flex items-center">
                <AlertCircle size={20} className="mr-2 text-red-600" />
                Exception Flows
              </span>
              {expandedSections.exception ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.exception && (
              <ul className="list-disc pl-5 text-gray-600">
                <li>PAN already exists in LOS or CBS → Show duplicate alert</li>
                <li>Missing mandatory fields → Show validation errors</li>
                <li>
                  Invalid document types or expired proof → Show rejection
                  message
                </li>
                <li>CBS integration timeout → Show retry option</li>
                <li>System crash → Auto-save as draft</li>
              </ul>
            )}
          </section>

          {/* User Activity Diagram */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("activity")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                User Activity Diagram
              </span>
              {expandedSections.activity ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.activity && (
              <div className="bg-indigo-50 p-6 rounded-lg text-sm text-gray-800 font-mono border border-indigo-200">
                <pre>
                  {`Start
Customer submits loan form
→ Officer logs into LOS
Selects "Create New Customer"
Enters Customer Details in UI Tabs
[Validation]
- {Fail} → Show error → Revise & retry
- {Pass} → Save → System generates unique Customer ID
Show confirmation to officer
End {Proceed to Loan Entry}`}
                </pre>
              </div>
            )}
          </section>

          {/* Parking Lot */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("parking")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-indigo-600" />
                Parking Lot
              </span>
              {expandedSections.parking ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.parking && (
              <ul className="list-disc pl-5 text-gray-600">
                <li>
                  ML Model to auto-suggest missing fields (based on past
                  profiles)
                </li>
                <li>
                  OCR integration for auto-filling data from scanned documents
                </li>
                <li>Aadhaar/PAN-based digital KYC fetch via API</li>
                <li>Customer photo capture/upload</li>
                <li>Multi-lingual UI for vernacular data entry</li>
              </ul>
            )}
          </section>

          {/* System Components Involved */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("components")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-indigo-600" />
                System Components Involved
              </span>
              {expandedSections.components ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.components && (
              <ul className="list-disc pl-5 text-gray-600">
                <li>UI Screens: Customer Master Entry, ID Confirmation</li>
                <li>APIs: CreateCustomerAPI, ValidatePAN, FetchFromCBS</li>
                <li>Database Tables: customer_master, customer_documents</li>
                <li>External Services: CBS integration, PAN/KYC validation</li>
                <li>Queues: Async retry for CBS validation (if needed)</li>
              </ul>
            )}
          </section>

          {/* Test Scenarios */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("test")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                Test Scenarios
              </span>
              {expandedSections.test ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.test && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Functional</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Create customer with all valid fields</li>
                    <li>Duplicate PAN check</li>
                    <li>Missing mandatory field handling</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Edge Cases</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>100-character names</li>
                    <li>Special characters in address</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Negative</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Invalid DOB (e.g., future date)</li>
                    <li>Invalid email/mobile</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Integration
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>CBS lookup for existing PAN</li>
                    <li>PAN validation API down scenario</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Performance
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Load test for 100 concurrent customer creations</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Infra & Deployment Notes */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("infra")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-indigo-600" />
                Infra & Deployment Notes
              </span>
              {expandedSections.infra ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.infra && (
              <ul className="list-disc pl-5 text-gray-600">
                <li>
                  Hosted on private cloud (Bank's internal data center or AWS)
                </li>
                <li>Customer creation feature behind feature toggle</li>
                <li>Auto-scaling enabled for high-load weekdays</li>
                <li>Encrypted data storage (AES-256)</li>
                <li>Data masking in logs for PII fields</li>
              </ul>
            )}
          </section>

          {/* Dev Team Ownership */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("dev")}
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-indigo-600" />
                Dev Team Ownership
              </span>
              {expandedSections.dev ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.dev && (
              <ul className="list-disc pl-5 text-gray-600">
                <li>Team: LOS-Core Services Squad</li>
                <li>Contact: Anil Rao (Product Owner)</li>
                <li>Jira Epic: LOS-001-CustomerOnboarding</li>
                <li>Git Repo: bank-loan-os/customer-service</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default CustomerIdCreation;
