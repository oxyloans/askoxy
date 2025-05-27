import React, { useState } from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Server,
  GitBranch,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Evaluating_the_Networth_of_the_PartiesProps {}

const WF_for_Evaluating_the_Networth_of_the_Parties: React.FC<
  WF_for_Evaluating_the_Networth_of_the_PartiesProps
> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    description: true,
    actors: true,
    userActions: true,
    preconditions: true,
    postconditions: true,
    normalFlow: true,
    alternativeFlows: true,
    exceptionFlows: true,
    dataInputs: true,
    outputs: true,
    systemComponents: true,
    testScenarios: true,
    nextStep: true,
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
            Evaluating the Net Worth of the Parties in LOS
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Description */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("description")}
              aria-expanded={expandedSections.description}
              aria-controls="description-section"
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
              <p
                id="description-section"
                className="text-gray-600 leading-relaxed text-base"
              >
                This use case describes the process by which a Bank Officer
                evaluates the net worth of the applicant, co-applicant(s),
                co-obligant(s), and guarantor(s) in the Loan Origination System
                (LOS). The system evaluates the assets and liabilities of the
                parties involved to calculate their net worth, which is then
                used for loan assessment.
              </p>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
              <div
                id="actors-section"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Primary Actor
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Bank Officer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Supporting Systems
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Loan Origination System (LOS)</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* User Actions & System Responses */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("userActions")}
              aria-expanded={expandedSections.userActions}
              aria-controls="userActions-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                User Actions & System Responses
              </span>
              {expandedSections.userActions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.userActions && (
              <ol
                id="userActions-section"
                className="list-decimal pl-5 text-gray-600 text-base space-y-4"
              >
                <li>
                  <strong>User Action:</strong> Officer verifies Customer ID and
                  links Co-applicant, Co-obligant, and Guarantor to the proposed
                  loan.
                  <br />
                  <strong>System Response:</strong> LOS links IDs and displays
                  relevant details.
                </li>
                <li>
                  <strong>User Action:</strong> Officer initiates the process
                  for evaluating net worth.
                  <br />
                  <strong>System Response:</strong> LOS presents forms for
                  Assets & Liabilities data.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters the Asset details
                  for the applicant, co-applicant, co-obligant, and guarantor.
                  <br />
                  <strong>System Response:</strong> System stores data in LOS.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters the Liability
                  details for the applicant, co-applicant, co-obligant, and
                  guarantor.
                  <br />
                  <strong>System Response:</strong> System stores data in LOS.
                </li>
                <li>
                  <strong>User Action:</strong> Officer submits the form.
                  <br />
                  <strong>System Response:</strong> LOS calculates the net worth
                  (Assets - Liabilities).
                </li>
                <li>
                  <strong>User Action:</strong> System displays the calculated
                  net worth of all parties.
                  <br />
                  <strong>System Response:</strong> LOS displays net worth
                  summary.
                </li>
                <li>
                  <strong>User Action:</strong> Officer captures the net worth
                  details into the LOS.
                  <br />
                  <strong>System Response:</strong> System stores the calculated
                  net worth for further appraisal.
                </li>
                <li>
                  <strong>User Action:</strong> Proceed to the next workflow
                  step (Appraisal of the loan).
                  <br />
                  <strong>System Response:</strong> LOS prepares for the next
                  workflow.
                </li>
              </ol>
            )}
          </section>

          {/* Preconditions & Post Conditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <button
                  className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                    className="list-disc pl-5 text-gray-600 text-base"
                  >
                    <li>
                      Customer ID and Co-applicant/Co-obligant/Guarantor IDs
                      exist and are linked to the proposed loan
                    </li>
                    <li>
                      Proposed Asset details are already captured in the LOS
                    </li>
                  </ul>
                )}
              </div>
              <div>
                <button
                  className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                    className="list-disc pl-5 text-gray-600 text-base"
                  >
                    <li>
                      The net worth of the applicant, co-applicant, co-obligant,
                      and guarantor is calculated and saved
                    </li>
                    <li>The system is ready for further loan appraisal</li>
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Normal Flow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("normalFlow")}
              aria-expanded={expandedSections.normalFlow}
              aria-controls="normalFlow-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Normal Flow
              </span>
              {expandedSections.normalFlow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.normalFlow && (
              <pre
                id="normalFlow-section"
                className="bg-gray-100 p-4 rounded-lg text-base text-gray-700 font-mono overflow-x-auto border border-gray-200"
              >
                {`
Start
  |
  v
Verify Customer and Linked IDs (Co-applicant/Co-obligant/Guarantor)
  |
  v
Enter Assets Details (Savings, Properties, Deposits, Investments, LIC Policies)
  |
  v
Enter Liabilities Details (Borrowings, Liabilities with Employer/others)
  |
  v
Submit the form to calculate Net Worth
  |
  v
System calculates and displays Net Worth (Assets - Liabilities)
  |
  v
Bank officer captures and saves the Net Worth details in LOS
  |
  v
Proceed to next workflow step: Appraisal of Loan
  |
  v
End
                `}
              </pre>
            )}
          </section>

          {/* Alternative Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("alternativeFlows")}
              aria-expanded={expandedSections.alternativeFlows}
              aria-controls="alternativeFlows-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Alternative Flows
              </span>
              {expandedSections.alternativeFlows ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.alternativeFlows && (
              <ul
                id="alternativeFlows-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  <strong>Missing Asset or Liability data:</strong> System
                  prompts user to fill all required fields.
                </li>
                <li>
                  <strong>Assets and Liabilities not balanced:</strong> System
                  flags an alert for incomplete data.
                </li>
                <li>
                  <strong>Multiple guarantors:</strong> Net worth calculated for
                  each and displayed separately.
                </li>
              </ul>
            )}
          </section>

          {/* Exception Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("exceptionFlows")}
              aria-expanded={expandedSections.exceptionFlows}
              aria-controls="exceptionFlows-section"
            >
              <span className="flex items-center">
                <AlertCircle size={20} className="mr-2 text-red-600" />
                Exception Flows
              </span>
              {expandedSections.exceptionFlows ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.exceptionFlows && (
              <ul
                id="exceptionFlows-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  <strong>Invalid or missing Customer ID:</strong> System throws
                  an error message.
                </li>
                <li>
                  <strong>Insufficient data on assets or liabilities:</strong>{" "}
                  System prevents calculation and prompts user for completion.
                </li>
                <li>
                  <strong>Inconsistent financial data:</strong> System flags
                  potential discrepancies and asks for verification.
                </li>
              </ul>
            )}
          </section>

          {/* Data Inputs Required */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("dataInputs")}
              aria-expanded={expandedSections.dataInputs}
              aria-controls="dataInputs-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Data Inputs Required
              </span>
              {expandedSections.dataInputs ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.dataInputs && (
              <div
                id="dataInputs-section"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 text-base"
              >
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Assets Details
                  </h3>
                  <ul className="list-disc pl-5">
                    <li>Savings in Bank</li>
                    <li>Immovable Properties/Assets with current value</li>
                    <li>Deposits in Banks</li>
                    <li>Investments in shares/Mutual Funds/others</li>
                    <li>
                      LIC Policies with Sum Assured, Date of Maturity &
                      Surrender Value
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Liabilities Details
                  </h3>
                  <ul className="list-disc pl-5">
                    <li>
                      Borrowings from the Banks/others with the present
                      outstanding balance
                    </li>
                    <li>
                      Liabilities with the employer with the present outstanding
                      balance
                    </li>
                    <li>
                      Liabilities with others with the present outstanding
                      balance
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Outputs / System Actions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("outputs")}
              aria-expanded={expandedSections.outputs}
              aria-controls="outputs-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Outputs / System Actions
              </span>
              {expandedSections.outputs ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.outputs && (
              <ul
                id="outputs-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  Calculated Net Worth for Applicant, Co-applicant, Co-obligant,
                  and Guarantor (Assets - Liabilities)
                </li>
                <li>Display of Net Worth summary for all parties</li>
                <li>Captured Net Worth data stored in LOS</li>
                <li>Message to proceed to loan appraisal workflow</li>
              </ul>
            )}
          </section>

          {/* System Components Involved */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("systemComponents")}
              aria-expanded={expandedSections.systemComponents}
              aria-controls="systemComponents-section"
            >
              <span className="flex items-center">
                <Server size={20} className="mr-2 text-blue-600" />
                System Components Involved
              </span>
              {expandedSections.systemComponents ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.systemComponents && (
              <ul
                id="systemComponents-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>LOS UI (Net Worth Input Forms)</li>
                <li>Asset & Liability Calculation Engine</li>
                <li>
                  Business Rule Service (validates asset/liability values)
                </li>
                <li>Data Store (for storing Net Worth data)</li>
              </ul>
            )}
          </section>

          {/* Test Scenarios */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("testScenarios")}
              aria-expanded={expandedSections.testScenarios}
              aria-controls="testScenarios-section"
            >
              <span className="flex items-center">
                <Code size={20} className="mr-2 text-blue-600" />
                Test Scenarios
              </span>
              {expandedSections.testScenarios ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.testScenarios && (
              <ul
                id="testScenarios-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  Complete Assets and Liabilities entered: Net Worth calculated
                  and saved successfully
                </li>
                <li>
                  Missing assets or liabilities data: Error preventing
                  submission and prompting for missing fields
                </li>
                <li>
                  Multiple guarantors with data: System calculates individual
                  net worth for each party
                </li>
                <li>
                  Inconsistent data in assets/liabilities: System flags
                  discrepancy for further verification
                </li>
              </ul>
            )}
          </section>

          {/* Next Step in Workflow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("nextStep")}
              aria-expanded={expandedSections.nextStep}
              aria-controls="nextStep-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Next Step in Workflow
              </span>
              {expandedSections.nextStep ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.nextStep && (
              <ul
                id="nextStep-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  Proceed with Appraisal of the proposed loan, using the
                  calculated net worth as one of the evaluation parameters
                </li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Evaluating_the_Networth_of_the_Parties;
