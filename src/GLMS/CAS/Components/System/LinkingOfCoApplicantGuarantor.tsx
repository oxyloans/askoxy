import React, { useState } from "react";
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

interface LinkingOfCoApplicantGuarantorProps {}

const LinkingOfCoApplicantGuarantor: React.FC<
  LinkingOfCoApplicantGuarantorProps
> = () => {
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-indigo-600 pb-4 text-center sm:text-left">
            Linking Co-Applicant / Co-Obligant / Guarantor in LOS
          </h1>
        </div>

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
                This use case describes the process by which a Bank Officer
                links one or more Co-Applicants, Co-Obligants, or Guarantors to
                a primary loan application using the Loan Origination System
                (LOS). It covers the creation (if new) and linking (if existing)
                of customer IDs for these related parties and associates them
                with the main loan application to proceed for appraisal.
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
                    <li>Bank Officer</li>
                    <li>Applicant</li>
                    <li>Co-applicant / Co-obligant / Guarantor</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    System Roles
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Loan Origination System (LOS)</li>
                    <li>Core Banking System (CBS)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Software Stakeholders
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>API Developers</li>
                    <li>QA Engineers</li>
                    <li>DevOps / CloudOps</li>
                    <li>Database Admins</li>
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
                      <th className="p-4 font-medium">User Action</th>
                      <th className="p-4 font-medium">System Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">1</td>
                      <td className="p-4">
                        Customer submits loan application and documents
                      </td>
                      <td className="p-4">N/A</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">2</td>
                      <td className="p-4">Bank Officer verifies documents</td>
                      <td className="p-4">
                        Highlights any missing or invalid data
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">3</td>
                      <td className="p-4">
                        Bank Officer initiates Customer ID creation (if needed)
                      </td>
                      <td className="p-4">
                        LOS captures and saves customer details
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">4</td>
                      <td className="p-4">
                        Bank Officer enters details for Co-applicant /
                        Co-obligant / Guarantor
                      </td>
                      <td className="p-4">
                        System validates and creates new Cust ID (if not fetched
                        from CBS)
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">5</td>
                      <td className="p-4">
                        Bank Officer links Co-applicant / Co-obligant /
                        Guarantor to the loan
                      </td>
                      <td className="p-4">
                        LOS stores relationship and eligibility flags
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4">6</td>
                      <td className="p-4">Bank Officer saves linkage</td>
                      <td className="p-4">
                        System updates the loan application with associated
                        parties
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
                    <li>
                      Primary Customer ID created and linked to loan product
                    </li>
                    <li>
                      Loan application form and mandatory documents submitted
                    </li>
                    <li>Basic KYC and verification completed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Post Condition
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>
                      Co-applicant / Co-obligant / Guarantor details linked to
                      the loan application
                    </li>
                    <li>Cust IDs created (if new)</li>
                    <li>
                      Loan application updated with eligibility-related income
                      data
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
                <span className="font-medium">Ideal Path:</span> Login →
                Validate Application → Create/Fetch Cust ID → Link to Loan →
                Save → Proceed to Loan Details
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
                <li>Assisted Mode: Bank Officer helps applicant in-person</li>
                <li>
                  CBS Lookup: Fetches existing customer details using Cust ID
                </li>
                <li>
                  Mobile / Web App (Future enhancement): Applicant submits
                  associated party details directly
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
                <li>Document mismatch or missing information</li>
                <li>Cust ID creation failure due to invalid fields</li>
                <li>CBS unresponsive or slow</li>
                <li>Duplicate Cust ID error</li>
                <li>Incorrect relationship mapping</li>
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
Bank officer logs in
Verify Documents
Create/Fetch Cust ID for Associated Party
Capture Personal/Income/Asset Details
Link to Loan Application
Save Record
End`}
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
                <li>Integration with Aadhaar/UID for instant verification</li>
                <li>Auto-fetch data using PAN/CKYC API</li>
                <li>ML model to validate document completeness</li>
                <li>Partner CRM integration for automated status updates</li>
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
                <li>UI Screens: Customer Info, Income, Employment, Linking</li>
                <li>APIs: Cust ID Creation API, CBS Lookup API, Linking API</li>
                <li>
                  DB Tables: customers, loan_applications,
                  applicant_relationships, income_details
                </li>
                <li>
                  External Services: CBS System, Document Verification API
                </li>
                <li>Message Queues (optional): For async data sync with CBS</li>
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
                    <li>Create Cust ID</li>
                    <li>Link Cust ID</li>
                    <li>Save Form</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Edge Cases</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Duplicate PAN</li>
                    <li>Long names</li>
                    <li>Empty mandatory fields</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Negative</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Missing documents</li>
                    <li>Invalid DOB format</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Integration
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>CBS fetch</li>
                    <li>Cust ID validation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Performance
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Cust ID creation under load</li>
                    <li>CBS fetch timeout handling</li>
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
                <li>Microservices-based deployment</li>
                <li>Config flags for CBS integration toggle</li>
                <li>Ensure data encryption in transit</li>
                <li>API throttling for Cust ID creation during peak hours</li>
                <li>Rollout: UAT → Staging → Production</li>
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
                <li>Squad: LOS-Customer-Management</li>
                <li>POC: Ramesh Nair (ramesh.nair@bank.com)</li>
                <li>JIRA: LOS-324</li>
                <li>Git Repo: git.bank.com/los/customer-module</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default LinkingOfCoApplicantGuarantor;
