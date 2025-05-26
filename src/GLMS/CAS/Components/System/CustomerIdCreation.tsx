import React, { useState } from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface CustomerIdCreationProps {}

const CustomerIdCreation: React.FC<CustomerIdCreationProps> = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalURL, setModalURL] = useState("");
   const [modalTitle, setModalTitle] = useState("");
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
  
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-serif">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900">
      Customer ID Creation in LOS
    </h1>

    <div className="flex gap-4">
      <button
        onClick={() =>
          openModal(
            "https://docs.google.com/document/d/1F8aXmDQpwGQ-bKGZpEPBDHrzltPxJ5bM/preview",
            "Back End Code View"
          )
        }
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        View Front End Code
      </button>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full relative shadow-xl">
            <h3 className="text-xl font-bold mb-4">{modalTitle}</h3>
            <iframe
              src={modalURL}
              title={modalTitle}
              className="w-full h-[500px] border rounded"
            ></iframe>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-600 font-bold text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed">
          This use case outlines the process of creating a new Customer ID in
          the Loan Origination System (LOS). It starts when a customer submits a
          loan application with required documents. The Bank Officer enters
          customer data across multiple tabs (Personal, Communication,
          Employment, Income/Expenses) into LOS. The system validates the data
          and assigns a unique Customer ID, enabling downstream loan processing.
        </p>
      </section>

      {/* Actors */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users size={20} className="mr-2 text-indigo-600" />
          Actors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Customer-facing</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Customer: Initiates inquiry, submits loan form</li>
              <li>Bank Officer: Captures and verifies customer information</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>LOS (Loan Origination System): Main processing system</li>
              <li>
                CBS (Core Banking System): Reference for existing customer data
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">
              Software Stakeholders
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>API Developer: Customer creation APIs, validations</li>
              <li>QA Team: Tests data entry & validation flows</li>
              <li>Infra/CloudOps: Ensures LOS availability & performance</li>
              <li>UI/UX Team: Designs Customer Capture Screens</li>
            </ul>
          </div>
        </div>
      </section>

      {/* User Actions & System Responses */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-indigo-600" />
          User Actions & System Responses
        </h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-gray-700">
            <thead>
              <tr className="bg-indigo-50">
                <th className="p-4 font-medium">Step</th>
                <th className="p-4 font-medium">User Action (UI/API)</th>
                <th className="p-4 font-medium">System Response</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">1</td>
                <td className="p-4">
                  Customer submits filled loan form & documents
                </td>
                <td className="p-4">N/A</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">2</td>
                <td className="p-4">Bank Officer logs into LOS</td>
                <td className="p-4">Authenticates & opens dashboard</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">3</td>
                <td className="p-4">Selects "Create New Customer" option</td>
                <td className="p-4">Loads Customer Master form</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">4</td>
                <td className="p-4">
                  Fills in Personal, Communication, Employment, and Income
                  details
                </td>
                <td className="p-4">Validates mandatory fields & formats</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">5</td>
                <td className="p-4">N/A</td>
                <td className="p-4">
                  LOS checks duplicates, integrates with CBS
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4">6</td>
                <td className="p-4">N/A</td>
                <td className="p-4">Confirmation shown, ID stored in DB</td>
              </tr>
              <tr>
                <td className="p-4">7</td>
                <td className="p-4">
                  Officer proceeds to loan application entry
                </td>
                <td className="p-4">Links new Customer ID to loan workflow</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Precondition & Post Condition */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-green-600" />
              Precondition
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Completed loan application form received</li>
              <li>
                Required documents submitted (e.g., ID proof, address proof,
                income proof)
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-green-600" />
              Post Condition
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>New Customer ID created and saved in Customer Master</li>
              <li>Ready for further loan processing and eligibility checks</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Straight Through Process (STP) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ChevronRight size={20} className="mr-2 text-indigo-600" />
          Straight Through Process (STP)
        </h2>
        <p className="text-gray-700 leading-relaxed">
          <span className="font-medium">Ideal Path:</span> Login → Fill Customer
          Details → Save → Customer ID Created → Proceed to Loan Processing →
          Logout
        </p>
      </section>

      {/* Alternative Flows */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ChevronRight size={20} className="mr-2 text-indigo-600" />
          Alternative Flows
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Assisted Mode: Officer assists customer at branch</li>
          <li>Self-Service Mode: (Future scope) Digital form via app/portal</li>
          <li>
            API Call: Pre-filled data fetched from national KYC registry (CKYC,
            UIDAI)
          </li>
          <li>Data Prefill: If PAN exists in CBS, auto-fetch basic data</li>
        </ul>
      </section>

      {/* Exception Flows */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle size={20} className="mr-2 text-red-600" />
          Exception Flows
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>PAN already exists in LOS or CBS → Show duplicate alert</li>
          <li>Missing mandatory fields → Show validation errors</li>
          <li>
            Invalid document types or expired proof → Show rejection message
          </li>
          <li>CBS integration timeout → Show retry option</li>
          <li>System crash → Auto-save as draft</li>
        </ul>
      </section>

      {/* User Activity Diagram */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-indigo-600" />
          User Activity Diagram
        </h2>
        <div className="bg-indigo-50 p-6 rounded-lg text-sm text-gray-800 font-mono border border-indigo-200">
          <pre>
            Start Customer submits loan form → Officer logs into LOS Selects
            "Create New Customer" Enters Customer Details in UI Tabs
            [Validation] - {`{Fail}`} → Show error → Revise & retry - {`{Pass}`}{" "}
            → Save → System generates unique Customer ID Show confirmation to
            officer End {`{Proceed to Loan Entry}`}
          </pre>
        </div>
      </section>

      {/* Parking Lot */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          Parking Lot
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>
            ML Model to auto-suggest missing fields (based on past profiles)
          </li>
          <li>OCR integration for auto-filling data from scanned documents</li>
          <li>Aadhaar/PAN-based digital KYC fetch via API</li>
          <li>Customer photo capture/upload</li>
          <li>Multi-lingual UI for vernacular data entry</li>
        </ul>
      </section>

      {/* System Components Involved */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          System Components Involved
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>UI Screens: Customer Master Entry, ID Confirmation</li>
          <li>APIs: CreateCustomerAPI, ValidatePAN, FetchFromCBS</li>
          <li>Database Tables: customer_master, customer_documents</li>
          <li>External Services: CBS integration, PAN/KYC validation</li>
          <li>Queues: Async retry for CBS validation (if needed)</li>
        </ul>
      </section>

      {/* Test Scenarios */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-indigo-600" />
          Test Scenarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Functional</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Create customer with all valid fields</li>
              <li>Duplicate PAN check</li>
              <li>Missing mandatory field handling</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Edge Cases</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>100-character names</li>
              <li>Special characters in address</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Negative</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Invalid DOB (e.g., future date)</li>
              <li>Invalid email/mobile</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Integration</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>CBS lookup for existing PAN</li>
              <li>PAN validation API down scenario</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Performance</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Load test for 100 concurrent customer creations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Infra & Deployment Notes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          Infra & Deployment Notes
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Hosted on private cloud (Bank's internal data center or AWS)</li>
          <li>Customer creation feature behind feature toggle</li>
          <li>Auto-scaling enabled for high-load weekdays</li>
          <li>Encrypted data storage (AES-256)</li>
          <li>Data masking in logs for PII fields</li>
        </ul>
      </section>

      {/* Dev Team Ownership */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users size={20} className="mr-2 text-indigo-600" />
          Dev Team Ownership
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Team: LOS-Core Services Squad</li>
          <li>Contact: Anil Rao (Product Owner)</li>
          <li>Jira Epic: LOS-001-CustomerOnboarding</li>
          <li>Git Repo: bank-loan-os/customer-service</li>
        </ul>
      </section>
    </main>
  );
};

export default CustomerIdCreation;
