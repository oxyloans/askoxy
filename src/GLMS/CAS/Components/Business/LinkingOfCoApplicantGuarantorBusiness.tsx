import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LinkingOfCoApplicantGuarantorBusinessProps {}

const LinkingOfCoApplicantGuarantorBusiness: React.FC<
  LinkingOfCoApplicantGuarantorBusinessProps
> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: true,
    actors: true,
    actions: true,
    preconditions: true,
    postconditions: true,
    workflow: true,
    flowchart: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center sm:text-left">
            LOS Workflow for Linking of Co-Applicant/Co-Obligant/Guarantor
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("overview")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-indigo-600" />
                Overview
              </span>
              {expandedSections.overview ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.overview && (
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>
                  The Loan Origination System (LOS) is a centralized web-based
                  solution designed for processing loan applications
                  efficiently. It includes modules such as Retail and Corporate,
                  ensuring uniform guidelines across the bank and streamlining
                  electronic workflows to minimize delays.
                </p>
                <p>
                  Users input loan application details, and the system
                  automatically retrieves relevant data like interest rates,
                  margins, and product guidelines. It also generates reports
                  such as Credit Score Sheets, Process Notes, Sanction Letters,
                  and more.
                </p>
                <p>
                  After creating and linking a Customer ID to a loan product,
                  the Bank Officer links Co-applicants, Co-obligants, or
                  Guarantors to the proposed loan before appraising the loan
                  proposal.
                </p>
              </div>
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
              <p className="text-gray-600">User (Bank Officer)</p>
            )}
          </section>

          {/* Actions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("actions")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                Actions
              </span>
              {expandedSections.actions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actions && (
              <p className="text-gray-600">
                The user links Co-applicant/Co-obligant/Guarantors to the
                proposed loan of the customer.
              </p>
            )}
          </section>

          {/* Preconditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("preconditions")}
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Preconditions
              </span>
              {expandedSections.preconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.preconditions && (
              <ol className="list-decimal ml-6 text-gray-600">
                <li>
                  Customer ID and linking to the loan product are completed.
                </li>
                <li>
                  All required documents for the proposed loan are submitted.
                </li>
              </ol>
            )}
          </section>

          {/* Post Conditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("postconditions")}
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Post Conditions
              </span>
              {expandedSections.postconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.postconditions && (
              <ol className="list-decimal ml-6 text-gray-600">
                <li>
                  Co-applicant/Co-obligant/Guarantor particulars are updated.
                </li>
                <li>
                  Customer IDs for Co-applicant/Co-obligant/Guarantor are
                  created.
                </li>
              </ol>
            )}
          </section>

          {/* Workflow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("workflow")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                Workflow
              </span>
              {expandedSections.workflow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.workflow && (
              <div className="space-y-4 text-gray-600">
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Customer submits the loan application with required
                    documents.
                  </li>
                  <li>
                    Bank Officer verifies documents, requesting corrections if
                    needed.
                  </li>
                  <li>
                    Upon verification, issues acknowledgment and initiates
                    Customer Creation.
                  </li>
                  <li>
                    Captures customer details (Personal, Communication,
                    Employment, Income) and links in LOS for Customer ID
                    creation.
                  </li>
                  <li>
                    Links Customer ID to the proposed loan product and asset
                    details.
                  </li>
                  <li>
                    Creates Customer IDs for
                    Co-applicant(s)/Co-obligant(s)/Guarantor(s).
                  </li>
                </ul>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Personal Details
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6">
                  <li>First Name</li>
                  <li>Middle Name</li>
                  <li>Last Name</li>
                  <li>Father Name</li>
                  <li>Date of Birth</li>
                  <li>Age</li>
                  <li>Gender</li>
                  <li>Marital Status</li>
                  <li>Nominee Name</li>
                  <li>Nominee Relation</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Communication Details
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6">
                  <li>Phone Number</li>
                  <li>Mobile Number</li>
                  <li>Email ID</li>
                  <li>Residence Address</li>
                  <li>Office Address</li>
                  <li>Permanent Address</li>
                  <li>District</li>
                  <li>State</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Employment Details
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6">
                  <li>Employment Type</li>
                  <li>Company Name</li>
                  <li>Designation</li>
                  <li>Office Address</li>
                  <li>Experience Years</li>
                  <li>Experience Months</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Income & Expenses Details
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6">
                  <li>Monthly Income</li>
                  <li>Monthly Expenses</li>
                  <li>EMI Payment</li>
                </ul>
              </div>
            )}
          </section>

          {/* Flowchart */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("flowchart")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                Flowchart
              </span>
              {expandedSections.flowchart ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.flowchart && (
              <div className="text-gray-600">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 font-mono overflow-x-auto border border-gray-200 whitespace-pre-wrap">
                  {`
Start
  |
  v
Customer submits loan application + documents
  |
  v
Bank Officer verifies documents
  |                           Yes
  v----------------------------> Any discrepancies?
  |                                   |
  | No                                v
  v                             Request customer for details/documents
Issue acknowledgement                 |
  |                                   v
  v                             Documents corrected
Initiate Customer Creation           
  |                                   
  v                                 
Capture Customer Details:
- Personal (Name, DOB, PAN, etc.)
- Communication (Address, Phone, Email)
- Employment (Company, Designation, etc.)
- Income & Expenses (Income, Savings, etc.)
  |
  v
Link Customer ID to Loan Product + Asset Details
  |
  v
Create Customer IDs for Co-applicant/Co-obligant/Guarantor
  |
  v
Capture Co-applicant Details:
- Personal (Name, DOB, PAN, etc.)
- Communication (Address, Phone, Email)
- Employment (Company, Designation, etc.)
- Income & Expenses (Income, Savings, etc.)
- Assets & Liabilities (Net Worth)
  |
  v
Save Co-applicant Customer IDs
  |
  v
Link Co-applicant to Loan Application:
- Select Type (Co-applicant/Co-obligant/Guarantor)
- Customer ID
- Name
- Relationship
- Include Income
- Remarks
  |
  v
Save Linking Details
  |
  v
Proceed with Loan Details Capture
  |
  v
End
  `}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default LinkingOfCoApplicantGuarantorBusiness;
