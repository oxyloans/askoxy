import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WF_for_Risk_Analysis_BusinessProps {}

const WF_for_Risk_Analysis_Business: React.FC<
  WF_for_Risk_Analysis_BusinessProps
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center sm:text-left">
            Work Flow for Risk Analysis
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("overview")}
              aria-expanded={expandedSections.overview}
              aria-controls="overview-section"
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
                  The first step in limiting credit risk involves screening
                  customers to ensure their willingness and ability to repay the
                  loan. This requires scrutinizing the customer's character
                  history with banks under risk analysis.
                </p>
              </div>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
              aria-expanded={expandedSections.actors}
              aria-controls="actors-section"
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
              <p id="actors-section" className="text-gray-600 text-base">
                Bank Officer
              </p>
            )}
          </section>

          {/* Actions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("actions")}
              aria-expanded={expandedSections.actions}
              aria-controls="actions-section"
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
              <p id="actions-section" className="text-gray-600 text-base">
                The Bank Officer initiates the risk rating process by evaluating
                the customer’s Financial Details, Employment Details, Personal
                Details, Security Details, and other relevant information.
              </p>
            )}
          </section>

          {/* Preconditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
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
                  Customer ID created and linked to the loan account, with all
                  customer details captured in LOS, including proposed asset
                  details, assets and liabilities, proposed loan limit,
                  particulars of the Co-applicant/Guarantor/Co-Obligant, and
                  appraisal note/process note generated.
                </li>
              </ul>
            )}
          </section>

          {/* Post Conditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
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
                <li>
                  Risk Analysis is completed, and the Bank Officer proceeds with
                  the Loan Assessment.
                </li>
              </ul>
            )}
          </section>

          {/* Workflow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("workflow")}
              aria-expanded={expandedSections.workflow}
              aria-controls="workflow-section"
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
              <div
                id="workflow-section"
                className="space-y-4 text-gray-600 text-base"
              >
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    After the Customer ID is created, linked to the loan
                    account, and all customer details (proposed asset, assets
                    and liabilities, loan limit,
                    Co-applicant/Guarantor/Co-Obligant particulars, and
                    appraisal note/process note) are captured in LOS, the Bank
                    Officer initiates the Risk Rating process.
                  </li>
                  <li>
                    The Bank Officer obtains and verifies reports such as Legal
                    Scrutiny Report, Technical Report, Financial Verification
                    Report, and Employment/Personal Verification Report from
                    various departments/agencies.
                  </li>
                  <li>
                    The Bank Officer verifies the Loan Application for Financial
                    Details, Employment Details, Personal Details, and Security
                    Details.
                  </li>
                  <li>
                    The Bank Officer evaluates the customer’s risk rating based
                    on:
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Personal Data
                        </h4>
                        <ul className="list-disc ml-6">
                          <li>Age</li>
                          <li>Education</li>
                          <li>Occupation</li>
                          <li>No of dependents</li>
                          <li>
                            Length of Service in present Job/Current Business
                          </li>
                          <li>Existing Relationship with the Bank</li>
                          <li>Other Business support</li>
                          <li>Period of Stay in current Address</li>
                          <li>Type of ownership of the residence</li>
                          <li>Whether owning Two Wheeler/Four Wheeler</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Income/Net Worth
                        </h4>
                        <ul className="list-disc ml-6">
                          <li>Present Annual Income</li>
                          <li>Income Proof</li>
                          <li>
                            Present Monthly deductions & proposed loan deduction
                          </li>
                          <li>Net worth</li>
                          <li>
                            Undertaking letter for EMI deduction/Salary Credit
                          </li>
                          <li>Income of spouse</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Loan Details
                        </h4>
                        <ul className="list-disc ml-6">
                          <li>Repayment Period</li>
                          <li>Security coverage</li>
                          <li>Enforceability of the security</li>
                          <li>Guarantor’s Net worth</li>
                          <li>Type of Loan</li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    The Bank Officer assigns weightages to the above parameters
                    to calculate the Risk Rating score.
                  </li>
                  <li>
                    Based on the Risk Rating score, the customer is categorized
                    into different risk ratings, and this is captured in LOS.
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* Flowchart */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("flowchart")}
              aria-expanded={expandedSections.flowchart}
              aria-controls="flowchart-section"
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
  |
  v
Bank Officer initiates Risk Rating process
  |
  v
Obtain and verify reports:
- Legal Scrutiny Report
- Technical Report
- Financial Verification Report
- Employment/Personal Verification Report
  |
  v
Verify Loan Application for:
- Financial Details
- Employment Details
- Personal Details
- Security Details
  |
  v
Evaluate Risk Rating based on:
- Personal Data:
  - Age
  - Education
  - Occupation
  - No of dependents
  - Length of Service
  - Bank Relationship
  - Business support
  - Period of Stay
  - Residence ownership
  - Vehicle ownership
- Income/Net Worth:
  - Annual Income
  - Income Proof
  - Monthly deductions
  - Net worth
  - EMI undertaking
  - Spouse’s income
- Loan Details:
  - Repayment Period
  - Security coverage
  - Security enforceability
  - Guarantor’s Net worth
  - Type of Loan
  |
  v
Assign weightages to parameters
Calculate Risk Rating score
  |
  v
Categorize customer into risk rating
Capture in LOS
  |
  v
Risk Analysis completed
  |
  v
Proceed to Loan Assessment
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

export default WF_for_Risk_Analysis_Business;
