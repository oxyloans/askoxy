import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Check_Limit_BusinessProps {}

const WF_for_Check_Limit_Business: React.FC<
  WF_for_Check_Limit_BusinessProps
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
            Workflow for Checking the Eligibility of the Customer & Proposed
            Loan Limit
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("overview")}
              aria-expanded={expandedSections.overview}
              aria-controls="overview-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Overview
              </span>
              {expandedSections.overview ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.overview && (
              <div
                id="overview-section"
                className="text-gray-600 leading-relaxed space-y-4 text-base"
              >
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
                  The Bank Officer checks the proposed loan limit by considering
                  the customer’s Income, Expenditure, Asset cost, requested loan
                  amount, and tenure.
                </p>
              </div>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
              aria-expanded={expandedSections.actors}
              aria-controls="actors-section"
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
              <ul
                id="actors-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>Bank Officer</li>
              </ul>
            )}
          </section>

          {/* Actions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("actions")}
              aria-expanded={expandedSections.actions}
              aria-controls="actions-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Actions
              </span>
              {expandedSections.actions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actions && (
              <ul
                id="actions-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>
                  The Bank Officer checks the proposed loan limit by considering
                  the customer Income, Expenditure, Asset cost & requested loan
                  amount & tenure.
                </li>
              </ul>
            )}
          </section>

          {/* Preconditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("preconditions")}
              aria-expanded={expandedSections.preconditions}
              aria-controls="preconditions-section"
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
              <ul
                id="preconditions-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>
                  Customer ID has already been created, linked to the Loan
                  product & proposed asset details captured.
                </li>
              </ul>
            )}
          </section>

          {/* Post Conditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("postconditions")}
              aria-expanded={expandedSections.postconditions}
              aria-controls="postconditions-section"
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
              <ul
                id="postconditions-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>Loan Limit checked & captured in LOS.</li>
                <li>
                  The Bank Officer can proceed further for capturing the Asset &
                  Liabilities details of the customer.
                </li>
              </ul>
            )}
          </section>

          {/* Workflow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("workflow")}
              aria-expanded={expandedSections.workflow}
              aria-controls="workflow-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Workflow
              </span>
              {expandedSections.workflow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.workflow && (
              <div
                id="workflow-section"
                className="space-y-4 text-gray-600 text-base"
              >
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Once the Proposed Asset details are captured into the LOS,
                    the Bank Officer initiates the process for checking the Loan
                    limit & capturing the same in the LOS.
                  </li>
                  <li>
                    The Bank Officer checks the application form for the Income,
                    Expenditure, Asset details & Loan Amount & tenure.
                  </li>
                  <li>
                    The Bank Officer enters the following customer details in
                    the Loan calculator to check the primary eligibility of the
                    customer & to arrive at the proposed loan limit:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc ml-6">
                        <li>Loan Type</li>
                        <li>Date of Birth</li>
                        <li>Purpose of Loan</li>
                        <li>Asset Details</li>
                        <li>Cost of Asset</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Loan Amount</li>
                        <li>Loan Tenure</li>
                        <li>Occupation</li>
                        <li>Company Details</li>
                        <li>Total Work Experience</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Age of Retirement</li>
                        <li>Monthly Income</li>
                        <li>Other Income</li>
                        <li>Total EMI for the Existing Liabilities</li>
                        <li>Co-Applicant Details</li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    Once the above details are captured, the Bank Officer
                    submits the record to arrive at the eligibility of the
                    customer & the proposed Loan Limit.
                  </li>
                  <li>
                    Once the Proposed Loan limit is obtained, the Bank Officer
                    captures the same into the LOS.
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* Flowchart */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("flowchart")}
              aria-expanded={expandedSections.flowchart}
              aria-controls="flowchart-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Flowchart
              </span>
              {expandedSections.flowchart ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.flowchart && (
              <pre
                id="flowchart-section"
                className="bg-gray-100 p-4 rounded-lg text-base text-gray-700 font-mono overflow-x-auto border border-gray-200"
              >
                {`
Start
  |
  v
Customer ID created and linked to Loan Product
Proposed Asset details captured in LOS
  |
  v
Bank Officer initiates Loan Limit checking process in LOS
  |
  v
Bank Officer checks application form for:
- Income
- Expenditure
- Asset Details
- Loan Amount
- Tenure
  |
  v
Bank Officer enters customer details into Loan Calculator:
- Loan Type
- Date of Birth
- Purpose of Loan
- Asset Details
- Cost of Asset
- Loan Amount
- Loan Tenure
- Occupation
- Company Details
- Total Work Experience
- Age of Retirement
- Monthly Income
- Other Income
- Total EMI for Existing Liabilities
- Co-Applicant Details
  |
  v
Bank Officer submits record to determine:
- Customer Eligibility
- Proposed Loan Limit
  |
  v
Bank Officer captures Proposed Loan Limit in LOS
  |
  v
Proceed to capture Asset & Liabilities details
  |
  v
End
`}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Check_Limit_Business;
