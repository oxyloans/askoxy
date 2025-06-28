import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Evaluating_the_Networth_of_the_Parties_BusinessProps {}

const WF_for_Evaluating_the_Networth_of_the_Parties_Business: React.FC<WF_for_Evaluating_the_Networth_of_the_Parties_BusinessProps> = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
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
            Workflow for Evaluating the Net Worth of the Parties
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
              <div id="overview-section" className="text-gray-600 leading-relaxed space-y-4 text-base">
                <p>
                  The Loan Origination System (LOS) is a centralized web-based solution designed for processing loan applications efficiently. It includes modules such as Retail and Corporate, ensuring uniform guidelines across the bank and streamlining electronic workflows to minimize delays.
                </p>
                <p>
                  Users input loan application details, and the system automatically retrieves relevant data like interest rates, margins, and product guidelines. It also generates reports such as Credit Score Sheets, Process Notes, Sanction Letters, and more.
                </p>
                <p>
                  The Bank Officer evaluates the Assets and Liabilities of the parties to arrive at their net worth.
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
              <ul id="actors-section" className="list-disc ml-6 text-gray-600 text-base">
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
              <ul id="actions-section" className="list-disc ml-6 text-gray-600 text-base">
                <li>The Bank Officer evaluates the Assets and Liabilities of the parties for arriving at the net worth.</li>
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
              <ul id="preconditions-section" className="list-disc ml-6 text-gray-600 text-base">
                <li>Customer IDs have already been created for all the parties and linked to the proposed Loan.</li>
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
              <ul id="postconditions-section" className="list-disc ml-6 text-gray-600 text-base">
                <li>Net Worth of all parties evaluated and captured in LOS.</li>
                <li>The Bank Officer can proceed further for the Appraisal of the proposed loan.</li>
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
              <div id="workflow-section" className="space-y-4 text-gray-600 text-base">
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Once the Proposed Asset details are captured in the LOS, the Bank Officer checks the primary eligibility of the customer in LOS.
                  </li>
                  <li>
                    The Bank Officer creates the Customer IDs for the Co-applicant / Co-obligant / Guarantor and links the same to the proposed loan of the customer.
                  </li>
                  <li>
                    The Bank Officer initiates the process for evaluating the Assets & Liabilities of the Customer / Co-applicant / Co-obligant / Guarantor for arriving at the Net Worth of all the parties.
                  </li>
                  <li>
                    The Bank Officer enters the following details regarding the Assets & Liabilities of the parties in LOS:
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <strong>Assets Details (A):</strong>
                        <ul className="list-disc ml-6 mt-1">
                          <li>Savings in Bank</li>
                          <li>Immovable Properties/Assets with Current Value</li>
                          <li>Deposits in Banks</li>
                          <li>Investments in Shares/Mutual Funds/Others</li>
                          <li>LIC Policies with Sum Assured, Date of Maturity & Surrender Value</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Liabilities Details (B):</strong>
                        <ul className="list-disc ml-6 mt-1">
                          <li>Borrowings from Banks/Others with Present Outstanding Balance</li>
                          <li>Liabilities with Employer with Present Outstanding Balance</li>
                          <li>Liabilities with Others with Present Outstanding Balance</li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    The Bank Officer evaluates the above assets and liabilities of the Applicant / Co-applicant / Co-obligant / Guarantor and captures the same in LOS and arrives at the net worth of the parties (A-B).
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
Customer IDs created and linked to Proposed Loan
Proposed Asset details captured in LOS
  |
  v
Bank Officer checks primary customer eligibility in LOS
  |
  v
Bank Officer creates and links Customer IDs for:
- Co-applicant
- Co-obligant
- Guarantor
  |
  v
Bank Officer initiates evaluation of Assets & Liabilities
  |
  v
Bank Officer enters Assets & Liabilities details in LOS:
- Assets (A):
  - Savings in Bank
  - Immovable Properties/Assets (Current Value)
  - Deposits in Banks
  - Investments (Shares/Mutual Funds/Others)
  - LIC Policies (Sum Assured, Maturity, Surrender Value)
- Liabilities (B):
  - Borrowings (Banks/Others, Outstanding Balance)
  - Liabilities with Employer (Outstanding Balance)
  - Liabilities with Others (Outstanding Balance)
  |
  v
Bank Officer evaluates and captures in LOS:
- Net Worth = Assets (A) - Liabilities (B)
  |
  v
Proceed to Appraisal of Proposed Loan
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

export default WF_for_Evaluating_the_Networth_of_the_Parties_Business;