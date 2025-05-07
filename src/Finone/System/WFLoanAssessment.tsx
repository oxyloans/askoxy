import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface WFLoanAssessmentProps {}

const WFLoanAssessment: React.FC<WFLoanAssessmentProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Loan Assessment Process
      </h1>

      {/* Description */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          The Loan Origination System (LOS) is a web-based solution developed to streamline the loan application process. It ensures a uniform appraisal of loan proposals by adhering to the bank's guidelines. The system eliminates delays caused by manual exchanges between branches and zonal offices by facilitating electronic workflows. In this system, once a loan application is received, the user (Bank Officer) enters the required details into the system. The system automatically retrieves relevant data like Rate of Interest, Margin, Product Guidelines, and ensures that the loan is in compliance with the applicable discretionary powers for sanctioning. The user can then generate various reports such as the Credit Score Sheet, Process Note, Sanction Letter, and Assessment Worksheet. Once the Customer ID is created and linked to the loan account, and all the relevant data (Proposed Asset Details, Asset & Liabilities, Loan Limit, etc.) are captured, the Bank Officer initiates the loan assessment process to determine the maximum loan amount that can be extended.
        </p>
      </section>

      {/* Actors */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Users size={18} className="mr-2 text-blue-600" />
          Actors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Primary Actor</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Bank Officer</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Secondary Actors</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Credit Bureau (for Credit Score)</li>
              <li>Legal Team (for Legal Documentation)</li>
              <li>Valuation Experts (for Asset Valuation)</li>
              <li>Internal Systems (for financial data validation)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trigger */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <ChevronRight size={18} className="mr-2 text-blue-600" />
          Trigger
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>The Customer ID is created and linked to the loan account.</li>
          <li>Customer data is fully entered in the Loan Origination System (LOS).</li>
          <li>The Appraisal Note and Process Note are generated and risk analysis is completed.</li>
          <li>Bank Officer initiates the loan assessment process.</li>
        </ul>
      </section>

      {/* Preconditions */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <CheckCircle size={18} className="mr-2 text-green-600" />
          Preconditions
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Customer ID is created and associated with the loan account.</li>
          <li>All necessary details about the loan, including:
            <ul className="list-disc pl-5">
              <li>Proposed Asset Details</li>
              <li>Asset & Liabilities Details</li>
              <li>Loan Limit</li>
              <li>Co-applicant/Guarantor/Co-obligant Information</li>
              <li>Appraisal Note</li>
              <li>Process Note</li>
              <li>Risk Analysis</li>
            </ul>
            have been entered into the system.
          </li>
          <li>The loan application is ready for Loan Assessment to determine the maximum loan that can be sanctioned.</li>
        </ul>
      </section>

      {/* Postconditions */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <CheckCircle size={18} className="mr-2 text-green-600" />
          Postconditions
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>The Loan Assessment Process is completed.</li>
          <li>The Bank Officer verifies the Maximum Loan Amount that can be extended.</li>
          <li>The Bank Officer proceeds to specify the Terms & Conditions for the loan.</li>
          <li>The Assessment Report is finalized and available for review.</li>
          <li>The system generates reports, including the Sanction Letter and Assessment Worksheet.</li>
        </ul>
      </section>

      {/* Main Flow (Basic Flow) */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <FileText size={18} className="mr-2 text-blue-600" />
          Main Flow (Basic Flow)
        </h2>
        <ol className="list-decimal pl-5 text-gray-700 text-sm">
          <li>Bank Officer logs into the Loan Origination System (LOS).</li>
          <li>The Bank Officer opens the loan account for the respective customer.</li>
          <li>The system retrieves and displays the customer details, including:
            <ul className="list-disc pl-5">
              <li>Proposed asset details</li>
              <li>Asset & liabilities details</li>
              <li>Loan limit</li>
              <li>Co-applicant/guarantor/co-obligant details</li>
            </ul>
          </li>
          <li>The Bank Officer verifies that all necessary data has been entered correctly and completely.</li>
          <li>The system automatically computes the Maximum Loan Amount based on the following parameters:
            <ul className="list-disc pl-5">
              <li>Loan Amount requested by the customer</li>
              <li>Present income of the customer</li>
              <li>Present value of the security (collateral)</li>
              <li>Rate of Interest</li>
              <li>Loan Tenure</li>
              <li>Future period of service</li>
              <li>Repayment capacity of the customer</li>
            </ul>
          </li>
          <li>The Bank Officer reviews the computed loan details and adjusts the Loan Assessment Amount if necessary, based on the following criteria:
            <ul className="list-disc pl-5">
              <li>Margin Requirement</li>
              <li>Maximum and Minimum Loan Cap</li>
            </ul>
          </li>
          <li>The Bank Officer finalizes the Loan Assessment.</li>
          <li>The Assessment Sheet is generated and stored in the system for record-keeping and reporting purposes.</li>
          <li>The Bank Officer proceeds with the specification of the Terms & Conditions for the loan, to be communicated to the customer.</li>
        </ol>
      </section>

      {/* Alternate Flow */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <ChevronRight size={18} className="mr-2 text-blue-600" />
          Alternate Flow
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li><strong>Insufficient Information:</strong> If any essential data (e.g., asset details, liabilities, or income) is missing or incomplete, the system prompts the Bank Officer to complete the data before proceeding with the assessment.</li>
          <li><strong>Adjustment of Loan Amount:</strong> If the Bank Officer wants to manually adjust the loan amount (e.g., reducing the loan amount based on margin requirements), the system allows manual input, and the officer can add remarks for the change.</li>
          <li><strong>Request for Additional Documents:</strong> If additional documents or reports (e.g., asset valuation, legal clearance) are required, the system notifies the Bank Officer, and the loan assessment is paused until the required documents are provided.</li>
        </ul>
      </section>

      {/* Exception Flow */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <AlertCircle size={18} className="mr-2 text-red-600" />
          Exception Flow
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li><strong>Data Validation Failure:</strong> If the loan data (e.g., requested loan amount, collateral value, or repayment capacity) does not meet the bank's predefined criteria, the system generates an error, and the Bank Officer must correct the data before proceeding.</li>
          <li><strong>Missing Report:</strong> If any reports required for the loan assessment (e.g., credit report, valuation report) are not available, the system pauses the assessment process until the missing data is received.</li>
        </ul>
      </section>

      {/* Special Requirements */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Special Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Automation</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>The system should automatically calculate the maximum loan amount based on the parameters provided (such as margin requirements and repayment capacity).</li>
              <li>The Assessment Report should be auto-generated with pre-defined templates.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Data Integrity</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>All entered customer data must pass integrity checks to ensure completeness and accuracy before proceeding to the loan assessment.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Report Generation</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>The system should allow the Bank Officer to generate key reports, including the Credit Score Sheet, Process Note, Sanction Letter, and Assessment Worksheet.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Audit Trail</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>All changes to the loan assessment should be logged for auditing purposes, with detailed timestamps and the identity of the user who made changes.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Business Rules */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Business Rules
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li><strong>Margin Requirements:</strong> The loan amount cannot exceed the margin limit set for the specific loan product.</li>
          <li><strong>Loan Limit Caps:</strong> The loan amount must adhere to the minimum and maximum cap limits defined by the bank for different products.</li>
          <li><strong>Discretionary Powers:</strong> The Bank Officer can exercise discretionary powers when approving loans but must follow bank guidelines to ensure fairness and consistency in the appraisal process.</li>
        </ul>
      </section>

      {/* Data Requirements */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Data Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Customer Data</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Customer ID, loan account number, proposed asset details, income details, liabilities, co-applicant/guarantor details, etc.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Financial Data</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Income data, asset value, proposed loan limit, security/collateral details, repayment capacity.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Reports</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Credit Score Sheet</li>
              <li>Process Note</li>
              <li>Sanction Letter</li>
              <li>Assessment Worksheet</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Frequency of Use */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Frequency of Use
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          This use case is executed every time a loan application is assessed for maximum loan amount, which occurs frequently based on the bank's loan application volume.
        </p>
      </section>

      {/* Notes and Issues */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Notes and Issues
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Integration with external agencies (e.g., Credit Bureau, Asset Valuation Team) should be seamless to avoid delays in the assessment process.</li>
          <li>The system must have robust data validation features to ensure that no incomplete or incorrect data is submitted for assessment.</li>
        </ul>
      </section>

      {/* Extension Points */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Extension Points
        </h2>
        <ul className="list-decimal pl-5 text-gray-700 text-sm">
          <li><strong>Document Uploads and Verification:</strong> During the loan assessment, the system can be extended to integrate with document verification tools (e.g., e-signature platforms, OCR for automatic document reading).</li>
          <li><strong>Customer Communication Integration:</strong> The system can extend to automatically notify the customer via email or SMS once the loan assessment is completed, providing them with either the sanction details or additional information if required.</li>
          <li><strong>Automated Workflow Adjustments:</strong> Future extensions of the system could automate certain manual processes, such as adjusting loan amounts based on changing bank policies or automatic re-evaluation when a specific parameter (e.g., rate of interest) changes.</li>
          <li><strong>Integration with Third-party Risk Management Tools:</strong> Integration with third-party services that help assess the credit risk or further analyze a customer's financial standing can be incorporated for more comprehensive assessments.</li>
        </ul>
      </section>
    </main>
  );
};

export default WFLoanAssessment;