import React, { useState } from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface RecommendationsWorkflowProps {}

const RecommendationsWorkflow: React.FC<RecommendationsWorkflowProps> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    description: true,
    actors: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    mainFlow: true,
    alternateFlows: true,
    exceptionFlows: true,
    specialRequirements: true,
    businessRules: true,
    dataRequirements: true,
    frequency: true,
    notes: true,
    nonFunctional: true,
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
            Recommendations Workflow in LOS
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
                The Loan Origination System (LOS) enables Bank Officers to
                process loan applications by capturing customer details,
                proposed loan amounts, asset details, and liabilities. After
                completing preliminary steps (e.g., customer ID creation, asset
                details, proposed loan limits, risk analysis), the Bank Officer
                initiates the recommendation process to modify the proposed
                loan. Recommendations include changes to the loan amount,
                interest rate, loan tenure, and repayment terms, with
                justifications for each modification. These are forwarded to the
                Sanctioning Authorities for final approval.
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
                    Secondary Actors
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>
                      Sanctioning Authorities (for approval of recommendations)
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Trigger */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                  Customer ID has been created and linked to the loan account.
                </li>
                <li>
                  All customer details are captured in the Loan Origination
                  System (LOS), including proposed asset details, liabilities,
                  proposed loan limit, co-applicant/guarantor/co-obligant
                  information, and the process note.
                </li>
                <li>
                  Risk analysis has been completed, and the proposed loan amount
                  and terms have been finalized.
                </li>
                <li>
                  The Bank Officer decides to initiate the recommendation
                  process to modify the proposed loan.
                </li>
              </ul>
            )}
          </section>

          {/* Preconditions & Postconditions */}
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
                  <ol
                    id="preconditions-section"
                    className="list-decimal pl-5 text-gray-600 text-base"
                  >
                    <li>
                      Customer ID has been created and linked to the loan
                      account in the Loan Origination System (LOS).
                    </li>
                    <li>
                      All required customer details have been entered into the
                      system, including proposed asset details, asset and
                      liabilities details, proposed loan limit,
                      co-applicant/guarantor/co-obligant information, appraisal
                      note, and process note.
                    </li>
                    <li>
                      The Risk Analysis has been completed, and the Proposed
                      Loan Amount has been assessed.
                    </li>
                    <li>
                      The Terms and Conditions of the loan have been finalized.
                    </li>
                    <li>
                      The Bank Officer is ready to initiate the recommendations
                      process for the loan.
                    </li>
                  </ol>
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
                    Postconditions
                  </span>
                  {expandedSections.postconditions ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.postconditions && (
                  <ol
                    id="postconditions-section"
                    className="list-decimal pl-5 text-gray-600 text-base"
                  >
                    <li>
                      Recommendations (including loan amount, rate of interest,
                      loan tenure, and repayment terms) have been added to the
                      loan proposal.
                    </li>
                    <li>
                      The Appraisal Note and Process Note have been forwarded to
                      the Sanctioning Authorities for approval.
                    </li>
                    <li>
                      The updated loan proposal, including the Bank Officer’s
                      recommendations, is saved in the system.
                    </li>
                  </ol>
                )}
              </div>
            </div>
          </section>

          {/* Main Flow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("mainFlow")}
              aria-expanded={expandedSections.mainFlow}
              aria-controls="mainFlow-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Main Flow
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
                  Bank Officer logs into the Loan Origination System (LOS) and
                  accesses the loan account for the specific customer.
                </li>
                <li>
                  The Bank Officer verifies that all customer details have been
                  captured in the system and the loan assessment is complete.
                </li>
                <li>
                  The Bank Officer initiates the process to add recommendations
                  to the loan proposal:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Loan Amount: The Bank Officer enters the recommended loan
                      amount.
                    </li>
                    <li>
                      Rate of Interest: The Bank Officer updates the recommended
                      interest rate.
                    </li>
                    <li>
                      Loan Tenure: The Bank Officer enters the proposed loan
                      tenure.
                    </li>
                    <li>
                      Proposed Repayment Terms: The Bank Officer adjusts the
                      repayment terms based on the customer’s profile and
                      requirements.
                    </li>
                  </ul>
                </li>
                <li>
                  The Bank Officer provides justifications for each of the
                  changes (e.g., why a certain loan amount or interest rate is
                  recommended).
                </li>
                <li>
                  The Bank Officer reviews and verifies the changes and
                  recommendations.
                </li>
                <li>
                  Once the recommendations are finalized, the Bank Officer saves
                  the record in the Loan Origination System (LOS).
                </li>
                <li>
                  The Appraisal Note and Process Note are forwarded to the
                  Sanctioning Authorities for approval.
                </li>
              </ol>
            )}
          </section>

          {/* Alternate Flows */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("alternateFlows")}
              aria-expanded={expandedSections.alternateFlows}
              aria-controls="alternateFlows-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Alternate Flows
              </span>
              {expandedSections.alternateFlows ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.alternateFlows && (
              <ul
                id="alternateFlows-section"
                className="list-disc pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Missing Information:</strong> If any necessary
                  customer data (e.g., proposed asset details, income data) is
                  missing, the Bank Officer is prompted to enter the missing
                  information before proceeding with the recommendation process.
                </li>
                <li>
                  <strong>Adjustment of Recommendations:</strong> If the Bank
                  Officer wants to adjust the recommended changes (e.g.,
                  modifying the loan amount or interest rate), the system allows
                  the officer to update the recommendations before finalizing
                  the process.
                </li>
                <li>
                  <strong>Request for Further Documentation:</strong> If
                  additional supporting documents or clarifications are needed
                  (e.g., asset valuation reports or legal documents), the system
                  notifies the Bank Officer to request these before proceeding.
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
                className="list-disc pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Invalid Data:</strong> If the entered recommendations
                  (e.g., loan amount or interest rate) do not adhere to
                  predefined bank guidelines (e.g., loan limits or interest rate
                  caps), the system generates an error and prompts the Bank
                  Officer to correct the data.
                </li>
                <li>
                  <strong>Failure to Forward Recommendations:</strong> If the
                  Bank Officer attempts to forward the Appraisal Note or Process
                  Note without properly saving the recommendations, the system
                  alerts the officer to save the recommendations first before
                  forwarding them to the Sanctioning Authorities.
                </li>
              </ul>
            )}
          </section>

          {/* Special Requirements */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("specialRequirements")}
              aria-expanded={expandedSections.specialRequirements}
              aria-controls="specialRequirements-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
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
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Automation
                  </h3>
                  <p className="text-gray-600 text-base">
                    The system should automatically check the proposed loan
                    amount, interest rate, and other terms against predefined
                    bank guidelines before allowing the Bank Officer to save and
                    forward the recommendations.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Data Integrity
                  </h3>
                  <p className="text-gray-600 text-base">
                    All changes and recommendations entered by the Bank Officer
                    must be validated and saved accurately to maintain data
                    consistency.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Reporting
                  </h3>
                  <p className="text-gray-600 text-base">
                    The system should provide an audit trail of all changes made
                    to the loan proposal, including the recommendations provided
                    by the Bank Officer.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Business Rules */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("businessRules")}
              aria-expanded={expandedSections.businessRules}
              aria-controls="businessRules-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
                Business Rules
              </span>
              {expandedSections.businessRules ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.businessRules && (
              <ol
                id="businessRules-section"
                className="list-decimal pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Loan Amount Guidelines:</strong> The loan amount
                  should not exceed the bank’s maximum limit for the loan
                  product selected.
                </li>
                <li>
                  <strong>Interest Rate Cap:</strong> The recommended rate of
                  interest must fall within the range allowed by the bank’s
                  policies.
                </li>
                <li>
                  <strong>Loan Tenure:</strong> The loan tenure must be within
                  the permissible duration based on the customer’s profile and
                  the loan type.
                </li>
              </ol>
            )}
          </section>

          {/* Data Requirements */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                    <li>Customer ID</li>
                    <li>Loan account number</li>
                    <li>Proposed asset details</li>
                    <li>Asset & liabilities details</li>
                    <li>Co-applicant/guarantor information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Loan Data
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Proposed loan amount</li>
                    <li>Rate of interest</li>
                    <li>Loan tenure</li>
                    <li>Proposed repayment terms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 text-base">
                    Reports
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 text-base">
                    <li>Appraisal Note</li>
                    <li>Process Note</li>
                    <li>Recommendations History</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Frequency of Use */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
              <p id="frequency-section" className="text-gray-600 text-base">
                This use case is executed whenever a loan proposal requires
                modifications and recommendations need to be added before
                forwarding it to the sanctioning authorities.
              </p>
            )}
          </section>

          {/* Notes and Issues */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
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
                  Integration with third-party systems (e.g., credit bureaus,
                  asset valuation systems) should be seamless to ensure timely
                  updates to the loan recommendations.
                </li>
                <li>
                  The system should be robust enough to prevent errors in
                  calculations when recommendations are entered (e.g., loan
                  amount exceeding limits, incorrect interest rates).
                </li>
                <li>
                  A comprehensive audit trail should be maintained for all
                  changes made during the recommendation process.
                </li>
              </ul>
            )}
          </section>

          {/* Non-Functional Requirements */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("nonFunctional")}
              aria-expanded={expandedSections.nonFunctional}
              aria-controls="nonFunctional-section"
            >
              <span className="flex items-center">
                <Lock size={20} className="mr-2 text-blue-600" />
                Non-Functional Requirements
              </span>
              {expandedSections.nonFunctional ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.nonFunctional && (
              <ol
                id="nonFunctional-section"
                className="list-decimal pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Performance:</strong> The system should allow the Bank
                  Officer to enter and save loan recommendation data with
                  minimal delay (less than 2 seconds per action).
                </li>
                <li>
                  <strong>Security:</strong> The system should implement proper
                  user authentication and authorization protocols to ensure only
                  authorized Bank Officers can modify loan proposals. Sensitive
                  data such as loan amount, rate of interest, and customer
                  details must be encrypted at rest and in transit.
                </li>
                <li>
                  <strong>Scalability:</strong> The system should be able to
                  handle increasing numbers of loan proposals without
                  significant degradation in performance.
                </li>
                <li>
                  <strong>Usability:</strong> The Loan Origination System (LOS)
                  should have an intuitive and user-friendly interface that
                  allows the Bank Officer to efficiently enter and update
                  recommendations, with clear instructions and validation checks
                  to guide the process.
                </li>
                <li>
                  <strong>Availability:</strong> The system should be available
                  99.9% of the time, with minimal downtime, and ensure that no
                  data is lost during the recommendation process.
                </li>
                <li>
                  <strong>Auditability:</strong> The system should maintain an
                  audit log of all actions taken by Bank Officers during the
                  recommendation process, including timestamps and user IDs.
                </li>
              </ol>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default RecommendationsWorkflow;
