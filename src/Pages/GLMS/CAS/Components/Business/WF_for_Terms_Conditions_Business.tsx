import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Terms_Conditions_BusinessProps {}

const WF_for_Terms_Conditions_Business: React.FC<WF_for_Terms_Conditions_BusinessProps> = () => {
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
            Work Flow for Terms & Conditions
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
                  Once the Customer ID is created, linked to the loan account, and all customer details are captured in the LOS (e.g., Proposed Asset details, Assets & Liabilities, Proposed Loan Limit, Co-applicant/Guarantor details, Appraisal/Process Note), with Risk Analysis completed and Loan Amount assessed, the Bank Officer initiates the process for adding Terms & Conditions for the proposed loan.
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
                <li>Bank Officer: Initiates the process for adding the Terms & Conditions for the proposed Loan.</li>
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
                <li>
                  Customer ID created and linked to the loan account with all customer details captured in the LOS, including Proposed Asset details, Assets & Liabilities details, Proposed Loan Limit, Co-applicant/Guarantor/Co-Obligant details, Appraisal note/Process note generated, Risk Analysis completed, and Proposed Loan Amount assessed.
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
              <ul id="postconditions-section" className="list-disc ml-6 text-gray-600 text-base">
                <li>Process for finalization of Terms & Conditions is completed, and the Bank Officer proceeds further for recommendation.</li>
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
                    Once the Customer ID is created, linked to the loan account, and all customer details are captured in the LOS, including:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc ml-6">
                        <li>Proposed Asset details</li>
                        <li>Assets & Liabilities details</li>
                        <li>Proposed Loan Limit</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Co-applicant/Guarantor details</li>
                        <li>Appraisal/Process Note generated</li>
                        <li>Risk Analysis completed</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Loan Amount assessed</li>
                      </ul>
                    </div>
                    The Bank Officer initiates the process for adding Terms & Conditions.
                  </li>
                  <li>LOS displays the generic and product-specific Terms & Conditions.</li>
                  <li>
                    The Bank Officer reviews the Terms & Conditions and can modify/delete them in LOS.
                  </li>
                  <li>
                    The Bank Officer adds any required additional terms & conditions to the Appraisal note/Process note in LOS.
                  </li>
                  <li>
                    Once finalized, the Bank Officer saves the Terms & Conditions and proceeds for recommendation.
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
Customer ID created and linked to loan account
All customer details captured in LOS:
- Proposed Asset details
- Asset & Liabilities details
- Proposed Loan Limit
- Co-applicant/Guarantor/Co-Obligant details
- Appraisal note/Process note generated
- Risk Analysis completed
- Proposed Loan Amount assessed
  |
  v
Bank Officer initiates Terms & Conditions process
  |
  v
LOS displays generic and product-specific Terms & Conditions
  |
  v
Bank Officer reviews Terms & Conditions
  |
  v
Modify or delete Terms & Conditions?
  | Yes
  v
Bank Officer modifies/deletes Terms & Conditions in LOS
  |
  v
Add additional Terms & Conditions?
  | Yes
  v
Bank Officer adds additional Terms & Conditions to Appraisal Note/Process Note
  |
  v
Finalize Terms & Conditions
  |
  v
Bank Officer saves record in LOS
  |
  v
Proceed to recommendation
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

export default WF_for_Terms_Conditions_Business;