import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Capturing_Proposed_Asset_Details_BusinessProps {}

const WF_for_Capturing_Proposed_Asset_Details_Business: React.FC<
  WF_for_Capturing_Proposed_Asset_Details_BusinessProps
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
            Workflow for Capturing Proposed Asset Details
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
                  The Bank Officer captures the Proposed Asset details in LOS to
                  facilitate further assessment and processing.
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
                  The Bank Officer captures the Proposed Asset details in the
                  LOS for further assessment & process.
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
                <li>Customer ID has already been created.</li>
                <li>Customer ID linked to the Loan Product.</li>
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
                <li>Proposed Asset details captured in LOS.</li>
                <li>The Bank Officer can check the proposed limit.</li>
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
                    Once the Customer ID is linked to the Loan Product, the Bank
                    Officer initiates the capturing of Proposed Asset details in
                    LOS.
                  </li>
                  <li>
                    The Bank Officer checks the application form for the Purpose
                    of the loan and Proposed Asset details.
                  </li>
                  <li>
                    The Bank Officer captures the Proposed Asset details in LOS,
                    including:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc ml-6">
                        <li>Loan Type</li>
                        <li>Type of Asset</li>
                        <li>Purpose of Loan</li>
                        <li>Asset Cost</li>
                        <li>Total Purchase Price of the Asset</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Incidental Cost (if any)</li>
                        <li>Other Cost (if any)</li>
                        <li>Market Value of the Property</li>
                        <li>Loan Outstanding (for refinance)</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Address of the Property (for home loan)</li>
                        <li>Area of Land (for home loan)</li>
                        <li>Built-up Area (for home loan)</li>
                        <li>Stage of Construction (for home loan)</li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    Once the above details are captured, the Bank Officer saves
                    the record and proceeds further for checking the proposed
                    limit/loan.
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
Customer ID created
  |
  v
Customer ID linked to Loan Product
  |
  v
Bank Officer initiates capturing of Proposed Asset details in LOS
  |
  v
Bank Officer checks application form for:
- Purpose of Loan
- Proposed Asset details
  |
  v
Bank Officer captures Proposed Asset details in LOS:
- Loan Type
- Type of Asset
- Purpose of Loan
- Asset Cost
- Total Purchase Price
- Incidental Cost (if any)
- Other Cost (if any)
- Market Value of Property
- Loan Outstanding (for refinance)
- Address of Property (for home loan)
- Area of Land (for home loan)
- Built-up Area (for home loan)
- Stage of Construction (for home loan)
  |
  v
Bank Officer saves record in LOS
  |
  v
Proceed to check proposed loan limit
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

export default WF_for_Capturing_Proposed_Asset_Details_Business;
