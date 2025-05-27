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

interface WFLoanOrganizationSystemAppraisalProps {}

const WFLoanOrganizationSystemAppraisal: React.FC<
  WFLoanOrganizationSystemAppraisalProps
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
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-blue-600 pb-4 text-center sm:text-left">
            Loan Organization System Appraisal
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Description */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("description")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Description
              </span>
              {expandedSections.description ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.description && (
              <p className="text-gray-600 leading-relaxed text-base">
                This use case captures the loan appraisal process where the Bank
                Officer assesses the customer's loan eligibility based on
                financial, personal, employment, and verification data. The
                outcome is the generation of a Loan Appraisal Note / Process
                Note, which is used for risk analysis and further loan
                processing.
              </p>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-blue-600" />
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
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Customer-facing
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Bank Officer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    System Roles
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Loan Origination System (LOS)</li>
                    <li>
                      External Services (Legal, Engineering, Employment
                      Verification, Credit Bureaus)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Software Stakeholders
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>API Developers</li>
                    <li>QA Team</li>
                    <li>CloudOps</li>
                    <li>Infra</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* User Actions & System Responses */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("userActions")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
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
                <table className="w-full text-left text-gray-600 text-base">
                  <thead className="sticky top-0 bg-blue-100">
                    <tr>
                      <th className="p-4 font-medium">User Action</th>
                      <th className="p-4 font-medium">System Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">Logs into LOS</td>
                      <td className="p-4">
                        Authenticates and displays dashboard
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        Selects linked Customer ID and Loan Account
                      </td>
                      <td className="p-4">
                        Fetches and displays customer and loan details
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">Initiates Appraisal Process</td>
                      <td className="p-4">Loads appraisal input screen</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        Requests Legal Scrutiny Report (LSR)
                      </td>
                      <td className="p-4">
                        Triggers request to external legal API / document upload
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        Requests Security Valuation Report
                      </td>
                      <td className="p-4">
                        Interfaces with engineering agency or document upload
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        Requests Income and Employment Verification
                      </td>
                      <td className="p-4">
                        Sends verification requests via internal/external API
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">Fetches Credit Reports</td>
                      <td className="p-4">
                        Integrates with Credit Bureau APIs to retrieve reports
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">Inputs and reviews appraisal data</td>
                      <td className="p-4">Validates and saves input</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4">Saves appraisal note</td>
                      <td className="p-4">
                        System generates Loan Appraisal / Process Note
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
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Precondition
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Customer ID is created and linked to a loan account</li>
                    <li>
                      Customer details captured: assets, liabilities,
                      co-applicants, proposed loan limit, etc.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Post Condition
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Appraisal note / process note is generated</li>
                    <li>Data available for Risk Analysis module</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Straight Through Process (STP) */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("stp")}
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Straight Through Process (STP)
              </span>
              {expandedSections.stp ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.stp && (
              <p className="text-gray-600 leading-relaxed text-base">
                <span className="font-medium">Ideal Path:</span> Login → Select
                Customer → Request Reports → Input Appraisal → Generate
                Appraisal Note → Logout
              </p>
            )}
          </section>

          {/* Alternative Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("alternative")}
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Alternative Flows
              </span>
              {expandedSections.alternative ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.alternative && (
              <ul className="list-disc pl-5 text-gray-600 text-base">
                <li>Reports uploaded manually instead of fetched via API</li>
                <li>Verification steps bypassed in pre-approved cases</li>
                <li>Assisted input by branch support team</li>
              </ul>
            )}
          </section>

          {/* Exception Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
              <ul className="list-disc pl-5 text-gray-600 text-base">
                <li>Missing report (e.g., Credit Bureau unresponsive)</li>
                <li>Invalid/mismatched verification data</li>
                <li>Incomplete customer information in LOS</li>
                <li>LOS server downtime or session timeout</li>
              </ul>
            )}
          </section>

          {/* User Activity Diagram */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("activity")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                User Activity Diagram
              </span>
              {expandedSections.activity ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.activity && (
              <div className="bg-blue-50 p-6 rounded-lg text-base text-gray-800 font-mono border border-blue-200">
                <pre>
                  {`Start
Login to LOS
Select Customer ID + Loan
Initiate Appraisal Process
Request Legal/Security/Verification Reports
Input Appraisal Details
Generate Appraisal Note
End`}
                </pre>
              </div>
            )}
          </section>

          {/* Parking Lot */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("parking")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Parking Lot
              </span>
              {expandedSections.parking ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.parking && (
              <ul className="list-disc pl-5 text-gray-600 text-base">
                <li>Integration with AI for auto-risk rating</li>
                <li>ML-based suggestion engine for appraisal remarks</li>
                <li>Partner dashboard for report status tracking</li>
                <li>API for instant employment/income verification</li>
              </ul>
            )}
          </section>

          {/* System Components Involved */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("components")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                System Components Involved
              </span>
              {expandedSections.components ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.components && (
              <ul className="list-disc pl-5 text-gray-600 text-base">
                <li>UI: Appraisal Input Form, Customer Detail Screen</li>
                <li>
                  APIs: Legal Report, Engineer Valuation, Employment
                  Verification, Credit Bureau
                </li>
                <li>DB: Loan, Customer, Asset, Liabilities, Co-Applicant</li>
                <li>
                  External Systems: CIBIL/Experian, Internal Verification
                  Systems
                </li>
                <li>Message Queues: Report status notifications</li>
              </ul>
            )}
          </section>

          {/* Test Scenarios */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("test")}
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
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
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Functional
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Successful appraisal note creation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Edge Cases
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Missing one or more reports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Negative
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Mismatched verification data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Integration
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>API with Credit Bureau</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Performance
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Load test with concurrent appraisal sessions</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Infra & Deployment Notes */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("infra")}
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Infra & Deployment Notes
              </span>
              {expandedSections.infra ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.infra && (
              <ul className="list-disc pl-5 text-gray-600 text-base">
                <li>Secure APIs for external reports</li>
                <li>Cloud DB with encrypted storage</li>
                <li>Feature toggle for manual vs API-based verification</li>
                <li>Role-based access controls</li>
              </ul>
            )}
          </section>

          {/* Dev Team Ownership */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("dev")}
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-blue-600" />
                Dev Team Ownership
              </span>
              {expandedSections.dev ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.dev && (
              <ul className="list-disc pl-5 text-gray-600 text-base">
                <li>Squad: Lending LOS Appraisal Team</li>
                <li>Contact: Lead Dev - Rajesh Kumar</li>
                <li>Jira Reference: LOS-APP-UC102</li>
                <li>Repo: gitlab.com/bank-loan/los/appraisal-module</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WFLoanOrganizationSystemAppraisal;
