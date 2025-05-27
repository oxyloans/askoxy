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

interface WF_for_Check_LimitProps {}

const WF_for_Check_Limit: React.FC<WF_for_Check_LimitProps> = () => {
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
            Check Limit in LOS
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
                checks the customer’s eligibility and proposed loan limit using
                the Loan Calculator in the Loan Origination System (LOS). The
                process is based on information such as income, expenditure,
                asset cost, loan amount, and tenure. After calculating
                eligibility, the proposed loan limit is recorded in the system.
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
                    <li>Loan Calculator Engine</li>
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
                  <strong>User Action:</strong> Officer opens the Loan
                  Calculator screen after asset details are captured.
                  <br />
                  <strong>System Response:</strong> LOS presents calculator
                  input form.
                </li>
                <li>
                  <strong>User Action:</strong> Officer refers to the loan
                  application for financial and personal details.
                  <br />
                  <strong>System Response:</strong> N/A (manual lookup).
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters Loan Type and
                  Purpose of Loan.
                  <br />
                  <strong>System Response:</strong> LOS validates loan type
                  rules.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters DOB and
                  Occupation.
                  <br />
                  <strong>System Response:</strong> LOS checks age eligibility.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters Cost of Asset and
                  Requested Loan Amount.
                  <br />
                  <strong>System Response:</strong> LOS prepares to calculate
                  LTV and eligibility.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters Loan Tenure and
                  Retirement Age.
                  <br />
                  <strong>System Response:</strong> LOS validates tenure against
                  retirement.
                </li>
                <li>
                  <strong>User Action:</strong> Officer inputs Company Details
                  and Work Experience.
                  <br />
                  <strong>System Response:</strong> LOS stores employment data.
                </li>
                <li>
                  <strong>User Action:</strong> Officer enters Monthly Income,
                  Other Income, and Existing EMIs.
                  <br />
                  <strong>System Response:</strong> LOS uses data for
                  income-expense ratio calculation.
                </li>
                <li>
                  <strong>User Action:</strong> Officer inputs Co-Applicant
                  Details (if any).
                  <br />
                  <strong>System Response:</strong> LOS considers combined
                  eligibility.
                </li>
                <li>
                  <strong>User Action:</strong> Officer submits calculator form.
                  <br />
                  <strong>System Response:</strong> LOS calculates eligibility &
                  shows Proposed Loan Limit.
                </li>
                <li>
                  <strong>User Action:</strong> Officer captures the approved
                  limit in the LOS.
                  <br />
                  <strong>System Response:</strong> Data is saved and workflow
                  proceeds to next stage.
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
                    <li>Customer ID exists and is linked to a Loan Product</li>
                    <li>Proposed Asset details are already captured</li>
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
                      Customer eligibility and proposed loan limit are
                      calculated
                    </li>
                    <li>Proposed Loan Limit is saved in LOS</li>
                    <li>System is ready for capturing Assets & Liabilities</li>
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
Proposed Asset Details Captured
  |
  v
Open Loan Calculator
  |
  v
Enter Required Details (Loan, Income, Asset, EMI, etc.)
  |
  v
Submit Calculator Form
  |
  v
System Calculates Eligibility
  |
  v
Display and Capture Proposed Loan Limit
  |
  v
Proceed to Next Step
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
                  <strong>Co-Applicant present:</strong> System includes
                  co-applicant income and liabilities.
                </li>
                <li>
                  <strong>Retirement Age &lt; Loan Tenure:</strong> System
                  throws validation error.
                </li>
                <li>
                  <strong>High EMI burden:</strong> System reduces eligible loan
                  limit or flags exception.
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
                  <strong>Missing income or EMI details:</strong> Prompt to fill
                  required fields.
                </li>
                <li>
                  <strong>Invalid DOB or Retirement Age:</strong> Error shown
                  and prevents submission.
                </li>
                <li>
                  <strong>Loan amount exceeds asset value:</strong> System flags
                  LTV breach warning.
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
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-600 text-base"
              >
                <ul className="list-disc pl-5">
                  <li>Loan Type</li>
                  <li>Date of Birth</li>
                  <li>Purpose of Loan</li>
                  <li>Cost of Asset</li>
                  <li>Requested Loan Amount</li>
                </ul>
                <ul className="list-disc pl-5">
                  <li>Loan Tenure</li>
                  <li>Occupation</li>
                  <li>Company Details</li>
                  <li>Work Experience</li>
                  <li>Age of Retirement</li>
                </ul>
                <ul className="list-disc pl-5">
                  <li>Monthly Income</li>
                  <li>Other Income</li>
                  <li>Total EMI (existing liabilities)</li>
                  <li>Co-applicant Info (optional)</li>
                </ul>
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
                <li>Eligibility Check Result</li>
                <li>Proposed Loan Limit</li>
                <li>Message on Loan Eligibility Success/Failure</li>
                <li>Storage of result in LOS</li>
                <li>
                  Ready for next workflow stage: Assets & Liabilities Capture
                </li>
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
                <li>LOS UI (Loan Calculator Form)</li>
                <li>Eligibility & Loan Limit Engine</li>
                <li>
                  Business Rule Service (validates age, income, EMI thresholds)
                </li>
                <li>Data Store (for saving results)</li>
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
                  Valid income, DOB, and EMI data: Proposed Loan Limit
                  calculated
                </li>
                <li>
                  Invalid DOB or retirement age: Error preventing calculation
                </li>
                <li>
                  Co-applicant included: Loan limit adjusted based on combined
                  eligibility
                </li>
                <li>
                  Loan tenure exceeds remaining working years: System blocks
                  with warning
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
                <li>Capture Assets & Liabilities of the customer</li>
                <li>Proceed to Appraisal and Sanction Stages</li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Check_Limit;
