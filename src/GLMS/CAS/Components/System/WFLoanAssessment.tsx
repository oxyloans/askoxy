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

interface WFLoanAssessmentProps {}

const WFLoanAssessment: React.FC<WFLoanAssessmentProps> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    description: true,
    actors: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    mainFlow: true,
    alternateFlow: true,
    exceptionFlow: true,
    specialRequirements: true,
    businessRules: true,
    dataRequirements: true,
    frequency: true,
    notes: true,
    extensionPoints: true,
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
            Loan Assessment Process
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Description */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                The Loan Origination System (LOS) is a web-based solution
                developed to streamline the loan application process. It ensures
                uniform appraisal of loan proposals by adhering to the bank's
                guidelines. The system eliminates delays caused by manual
                exchanges between branches and zonal offices by facilitating
                electronic workflows. Once a loan application is received, the
                Bank Officer enters the required details, and the system
                automatically retrieves data like Rate of Interest, Margin, and
                Product Guidelines, ensuring compliance with discretionary
                powers for sanctioning. The user can generate reports such as
                Credit Score Sheet, Process Note, Sanction Letter, and
                Assessment Worksheet. After the Customer ID is created, linked
                to the loan account, and all relevant data (Proposed Asset
                Details, Asset & Liabilities, Loan Limit, etc.) are captured,
                the Bank Officer initiates the loan assessment process to
                determine the maximum loan amount that can be extended.
              </p>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                    Secondary Actors
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Credit Bureau (for Credit Score)</li>
                    <li>Legal Team (for Legal Documentation)</li>
                    <li>Valuation Experts (for Asset Valuation)</li>
                    <li>Internal Systems (for financial data validation)</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Trigger */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("trigger")}
              aria-expanded={expandedSections.trigger}
              aria-controls="trigger-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Trigger
              </span>
              {expandedSections.trigger ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.trigger && (
              <ul
                id="trigger-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  The Customer ID is created and linked to the loan account.
                </li>
                <li>
                  Customer data is fully entered in the Loan Origination System
                  (LOS).
                </li>
                <li>
                  The Appraisal Note and Process Note are generated, and risk
                  analysis is completed.
                </li>
                <li>Bank Officer initiates the loan assessment process.</li>
              </ul>
            )}
          </section>

          {/* Preconditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                  Customer ID is created and associated with the loan account.
                </li>
                <li>
                  All necessary details about the loan, including:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Proposed Asset Details</li>
                    <li>Asset & Liabilities Details</li>
                    <li>Loan Limit</li>
                    <li>Co-applicant/Guarantor/Co-obligant Information</li>
                    <li>Appraisal Note</li>
                    <li>Process Note</li>
                    <li>Risk Analysis</li>
                  </ul>
                </li>
                <li>
                  The loan application is ready for Loan Assessment to determine
                  the maximum loan that can be sanctioned.
                </li>
              </ul>
            )}
          </section>

          {/* Postconditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("postconditions")}
              aria-expanded={expandedSections.postconditions}
              aria-controls="postconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Postconditions
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
                <li>The Loan Assessment Process is completed.</li>
                <li>
                  The Bank Officer verifies the Maximum Loan Amount that can be
                  extended.
                </li>
                <li>
                  The Bank Officer proceeds to specify the Terms & Conditions
                  for the loan.
                </li>
                <li>
                  The Assessment Report is finalized and available for review.
                </li>
                <li>
                  The system generates reports, including the Sanction Letter
                  and Assessment Worksheet.
                </li>
              </ul>
            )}
          </section>

          {/* Main Flow (Basic Flow) */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("mainFlow")}
              aria-expanded={expandedSections.mainFlow}
              aria-controls="mainFlow-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Main Flow (Basic Flow)
              </span>
              {expandedSections.mainFlow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.mainFlow && (
              <ol
                id="mainFlow-section"
                className="list-decimal pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  Bank Officer logs into the Loan Origination System (LOS).
                </li>
                <li>
                  The Bank Officer opens the loan account for the respective
                  customer.
                </li>
                <li>
                  The system retrieves and displays the customer details,
                  including:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Proposed asset details</li>
                    <li>Asset & liabilities details</li>
                    <li>Loan limit</li>
                    <li>Co-applicant/guarantor/co-obligant details</li>
                  </ul>
                </li>
                <li>
                  The Bank Officer verifies that all necessary data has been
                  entered correctly and completely.
                </li>
                <li>
                  The system automatically computes the Maximum Loan Amount
                  based on:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Loan Amount requested by the customer</li>
                    <li>Present income of the customer</li>
                    <li>Present value of the security (collateral)</li>
                    <li>Rate of Interest</li>
                    <li>Loan Tenure</li>
                    <li>Future period of service</li>
                    <li>Repayment capacity of the customer</li>
                  </ul>
                </li>
                <li>
                  The Bank Officer reviews the computed loan details and adjusts
                  the Loan Assessment Amount if necessary, based on:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Margin Requirement</li>
                    <li>Maximum and Minimum Loan Cap</li>
                  </ul>
                </li>
                <li>The Bank Officer finalizes the Loan Assessment.</li>
                <li>
                  The Assessment Sheet is generated and stored in the system for
                  record-keeping and reporting purposes.
                </li>
                <li>
                  The Bank Officer proceeds with the specification of the Terms
                  & Conditions for the loan, to be communicated to the customer.
                </li>
              </ol>
            )}
          </section>

          {/* Alternate Flow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("alternateFlow")}
              aria-expanded={expandedSections.alternateFlow}
              aria-controls="alternateFlow-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Alternate Flow
              </span>
              {expandedSections.alternateFlow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.alternateFlow && (
              <ul
                id="alternateFlow-section"
                className="list-disc pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Insufficient Information:</strong> If essential data
                  (e.g., asset details, liabilities, or income) is missing or
                  incomplete, the system prompts the Bank Officer to complete
                  the data before proceeding with the assessment.
                </li>
                <li>
                  <strong>Adjustment of Loan Amount:</strong> If the Bank
                  Officer manually adjusts the loan amount (e.g., reducing it
                  based on margin requirements), the system allows manual input,
                  and the officer can add remarks for the change.
                </li>
                <li>
                  <strong>Request for Additional Documents:</strong> If
                  additional documents or reports (e.g., asset valuation, legal
                  clearance) are required, the system notifies the Bank Officer,
                  and the loan assessment is paused until the required documents
                  are provided.
                </li>
              </ul>
            )}
          </section>

          {/* Exception Flow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("exceptionFlow")}
              aria-expanded={expandedSections.exceptionFlow}
              aria-controls="exceptionFlow-section"
            >
              <span className="flex items-center">
                <AlertCircle size={20} className="mr-2 text-red-600" />
                Exception Flow
              </span>
              {expandedSections.exceptionFlow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.exceptionFlow && (
              <ul
                id="exceptionFlow-section"
                className="list-disc pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Data Validation Failure:</strong> If the loan data
                  (e.g., requested loan amount, collateral value, or repayment
                  capacity) does not meet the bank's predefined criteria, the
                  system generates an error, and the Bank Officer must correct
                  the data before proceeding.
                </li>
                <li>
                  <strong>Missing Report:</strong> If any reports required for
                  the loan assessment (e.g., credit report, valuation report)
                  are not available, the system pauses the assessment process
                  until the missing data is received.
                </li>
              </ul>
            )}
          </section>

          {/* Special Requirements */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("specialRequirements")}
              aria-expanded={expandedSections.specialRequirements}
              aria-controls="specialRequirements-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Special Requirements
              </span>
              {expandedSections.specialRequirements ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.specialRequirements && (
              <div
                id="specialRequirements-section"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Automation
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Automatically calculate the maximum loan amount based on
                      parameters like margin requirements and repayment
                      capacity.
                    </li>
                    <li>
                      Auto-generate the Assessment Report with pre-defined
                      templates.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Data Integrity
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Ensure all entered customer data passes integrity checks
                      for completeness and accuracy before assessment.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Report Generation
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Enable generation of key reports, including Credit Score
                      Sheet, Process Note, Sanction Letter, and Assessment
                      Worksheet.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Audit Trail
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Log all changes to the loan assessment with timestamps and
                      user identity for auditing purposes.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Business Rules */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("businessRules")}
              aria-expanded={expandedSections.businessRules}
              aria-controls="businessRules-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Business Rules
              </span>
              {expandedSections.businessRules ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.businessRules && (
              <ul
                id="businessRules-section"
                className="list-disc pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Margin Requirements:</strong> The loan amount cannot
                  exceed the margin limit set for the specific loan product.
                </li>
                <li>
                  <strong>Loan Limit Caps:</strong> The loan amount must adhere
                  to the minimum and maximum cap limits defined by the bank for
                  different products.
                </li>
                <li>
                  <strong>Discretionary Powers:</strong> The Bank Officer can
                  exercise discretionary powers when approving loans but must
                  follow bank guidelines to ensure fairness and consistency in
                  the appraisal process.
                </li>
              </ul>
            )}
          </section>

          {/* Data Requirements */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("dataRequirements")}
              aria-expanded={expandedSections.dataRequirements}
              aria-controls="dataRequirements-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Data Requirements
              </span>
              {expandedSections.dataRequirements ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.dataRequirements && (
              <div
                id="dataRequirements-section"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Customer Data
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Customer ID, loan account number, proposed asset details,
                      income details, liabilities, co-applicant/guarantor
                      details, etc.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Financial Data
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Income data, asset value, proposed loan limit,
                      security/collateral details, repayment capacity.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Reports
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Credit Score Sheet</li>
                    <li>Process Note</li>
                    <li>Sanction Letter</li>
                    <li>Assessment Worksheet</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Frequency of Use */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("frequency")}
              aria-expanded={expandedSections.frequency}
              aria-controls="frequency-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Frequency of Use
              </span>
              {expandedSections.frequency ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.frequency && (
              <p
                id="frequency-section"
                className="text-gray-600 leading-relaxed text-base"
              >
                This use case is executed every time a loan application is
                assessed for the maximum loan amount, occurring frequently based
                on the bank's loan application volume.
              </p>
            )}
          </section>

          {/* Notes and Issues */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("notes")}
              aria-expanded={expandedSections.notes}
              aria-controls="notes-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Notes and Issues
              </span>
              {expandedSections.notes ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.notes && (
              <ul
                id="notes-section"
                className="list-disc pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  Integration with external agencies (e.g., Credit Bureau, Asset
                  Valuation Team) should be seamless to avoid delays in the
                  assessment process.
                </li>
                <li>
                  The system must have robust data validation features to ensure
                  that no incomplete or incorrect data is submitted for
                  assessment.
                </li>
              </ul>
            )}
          </section>

          {/* Extension Points */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("extensionPoints")}
              aria-expanded={expandedSections.extensionPoints}
              aria-controls="extensionPoints-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Extension Points
              </span>
              {expandedSections.extensionPoints ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.extensionPoints && (
              <ul
                id="extensionPoints-section"
                className="list-decimal pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Document Uploads and Verification:</strong> Integrate
                  with document verification tools (e.g., e-signature platforms,
                  OCR for automatic document reading) during the loan
                  assessment.
                </li>
                <li>
                  <strong>Customer Communication Integration:</strong>{" "}
                  Automatically notify the customer via email or SMS once the
                  loan assessment is completed, providing sanction details or
                  additional information if required.
                </li>
                <li>
                  <strong>Automated Workflow Adjustments:</strong> Automate
                  manual processes, such as adjusting loan amounts based on
                  changing bank policies or re-evaluating when parameters (e.g.,
                  rate of interest) change.
                </li>
                <li>
                  <strong>
                    Integration with Third-party Risk Management Tools:
                  </strong>{" "}
                  Incorporate third-party services to assess credit risk or
                  analyze the customer's financial standing for comprehensive
                  assessments.
                </li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WFLoanAssessment;
