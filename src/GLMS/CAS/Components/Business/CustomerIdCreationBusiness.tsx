import React, { useState } from "react";

const CustomerIdCreation: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalURL, setModalURL] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
            Customer ID Creation Workflow
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
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
        <div className="space-y-12">
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Overview
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The Loan Origination System (LOS) is a centralized web-based
                solution designed for processing loan applications efficiently.
                It supports various modules such as Retail and Corporate,
                ensuring uniform guidelines across the bank and streamlined
                electronic workflow.
              </p>
              <p>
                Users input loan application details, and the system
                automatically retrieves relevant data like interest rates,
                margins, and product guidelines. It also generates reports such
                as Credit Score Sheets, Process Notes, and Sanction Letters.
              </p>
              <p>
                Every customer is assigned a unique Customer ID, a prerequisite
                for any banking relationship. Customer details are captured and
                maintained in the Customer Master.
              </p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Actors
            </h2>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Customer</li>
              <li>Bank Officer</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Actions
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Customer:</strong> Submits a completed loan application
                with required documents.
              </p>
              <p>
                <strong>Bank Officer:</strong> Enters customer details into LOS
                to create a Customer ID.
              </p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Preconditions
            </h2>
            <p className="text-gray-600">
              Receipt of a completed loan application and required documents
              from the customer.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Post Conditions
            </h2>
            <p className="text-gray-600">
              Customer ID is created, enabling the Bank Officer to capture loan
              details in LOS.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Workflow
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600">
              <li>Customer inquires about loan processes at a bank branch.</li>
              <li>
                Bank Officer explains loan products and document requirements.
              </li>
              <li>Customer submits the loan application and documents.</li>
              <li>
                Bank Officer verifies documents and requests corrections if
                needed.
              </li>
              <li>
                Upon verification, issues an acknowledgment and initiates
                Customer ID creation.
              </li>
              <li>
                Captures customer details in LOS under Personal, Communication,
                Employment, and Income & Expenses tabs.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              Personal Details
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6 text-gray-600">
              <li>First Name</li>
              <li>Middle Name</li>
              <li>Last Name</li>
              <li>Father Name</li>
              <li>Date of Birth</li>
              <li>Gender</li>
              <li>Pan No</li>
              <li>Passport Details</li>
              <li>Marital Status</li>
              <li>No of Dependents</li>
              <li>Age of Dependents</li>
              <li>Nationality</li>
              <li>Residential Status</li>
              <li>Religion</li>
              <li>Educational Qualification</li>
              <li>Earning Member in Family</li>
              <li>Length of Relationship with Bank</li>
              <li>Existing Borrower Status</li>
              <li>Staff</li>
              <li>Account No</li>
              <li>Deposits with Bank</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              Communication Details
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6 text-gray-600">
              <li>Current Address</li>
              <li>Current Residence Ownership</li>
              <li>Living Duration in Current Residence</li>
              <li>Permanent Address</li>
              <li>Mobile No</li>
              <li>Landline No</li>
              <li>Email ID</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              Employment Details
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6 text-gray-600">
              <li>Occupation</li>
              <li>Name of the Company</li>
              <li>Address of the Company</li>
              <li>Designation</li>
              <li>Department</li>
              <li>Employee No</li>
              <li>Office Phone No</li>
              <li>Ext</li>
              <li>Fax</li>
              <li>Years in Current Company</li>
              <li>Previous Employment History</li>
              <li>Total Length of Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              Income & Expenses Details
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6 text-gray-600">
              <li>Monthly Income</li>
              <li>Other Income</li>
              <li>Monthly Expenses</li>
              <li>Savings</li>
              <li>EMI Payment</li>
              <li>Stability of Income</li>
            </ul>

            <p className="mt-4 text-gray-600">
              After capturing details, the Bank Officer saves the record to
              create the Customer ID, enabling further loan processing.
            </p>
            <p className="mt-2 text-gray-600 italic">
              <strong>Note:</strong> Existing customer details can be fetched
              from the Core Banking System (CBS) using their Customer ID.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Flowchart
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 overflow-x-auto">
              {`
Start
  |
  v
Customer enquires about loan
  |
  v
Bank Officer explains loan products & documents
  |
  v
Customer submits application + documents
  |
  v
Bank Officer verifies documents
  |                           Yes
  v----------------------------> Any discrepancies?
  |                                   |
  | No                                v
  v                             Request customer for corrections
Issue acknowledgement                |
  |                                   v
  v                             Documents corrected
Initiate Customer Creation           |
  |                                   |
  v                                   |
Capture Customer Details:
- Personal (Name, DOB, PAN, etc.)
- Communication (Address, Phone, etc.)
- Employment (Company, Designation, etc.)
- Income & Expenses (Income, Savings, etc.)
  |
  v
Save Customer Details
  |
  v
Customer ID Created
  |
  v
Proceed with Loan Details Capture
  |
  v
End
`}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerIdCreation;
