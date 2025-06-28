import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LinkingOfCustomerIdToLoanBusinessProps {}

const LinkingOfCustomerIdToLoanBusiness: React.FC<
  LinkingOfCustomerIdToLoanBusinessProps
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
            LOS Workflow for Linking of Customer ID to the Loan Product
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
                  Once the Customer ID is created, the Bank Officer links it to
                  the respective Loan Product before appraising the loan
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
              <ul className="list-disc ml-6 text-gray-600 space-y-2">
                <li>Links the Customer ID to the Loan product.</li>
                <li>
                  Enters customer details (personal, employment, income, loan,
                  repayment period, security, credit report) to generate and
                  forward the loan proposal for sanction/approval.
                </li>
              </ul>
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
                <li>Customer ID has already been created.</li>
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
                <li>The Customer ID is linked to a particular Loan account.</li>
                <li>Proposed asset particulars are updated for the loan.</li>
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
                    After creating or fetching the Customer ID from CBS for
                    existing customers, the Bank Officer initiates linking to a
                    loan product.
                  </li>
                  <li>Checks the application for the loan's purpose.</li>
                  <li>
                    Selects the appropriate loan product in LOS based on the
                    purpose.
                  </li>
                  <li>Enters the following details in LOS:</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Loan Product Details
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc ml-6">
                  <li>Loan Amount Requested</li>
                  <li>Project Cost</li>
                  <li>Interest Type</li>
                  <li>Interest Rate</li>
                  <li>Initial Holiday Period</li>
                  <li>Loan Period</li>
                  <li>Periodicity of Installments</li>
                  <li>% of Margin Required</li>
                  <li>Margin Offered by Customer</li>
                  <li>Purpose of Loan</li>
                </ul>

                <p>
                  The Bank Officer provides a brief description of the loan,
                  considering Income & Expenditure, Repayment Capacity, and
                  other parameters.
                </p>
                <p>
                  The record is saved, completing the linking of the Customer ID
                  with the Loan Product.
                </p>
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
              <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 font-mono overflow-x-auto border border-gray-200">
                {`
Start
  |
  v
Customer ID created or fetched from CBS
  |
  v
Bank Officer initiates linking process
  |
  v
Check loan application for purpose
  |
  v
Select Loan Product in LOS
  |
  v
Enter Loan Product Details:
- Loan Amount Requested
- Project Cost
- Interest Type
- Interest Rate
- Initial Holiday Period
- Loan Period
- Periodicity of Installments
- % of margin required
- Margin offered
- Purpose of Loan
  |
  v
Provide brief description:
- Income & Expenditure
- Repayment Capacity
- Other parameters
  |
  v
Save record
  |
  v
Customer ID linked to Loan Product
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

export default LinkingOfCustomerIdToLoanBusiness;
