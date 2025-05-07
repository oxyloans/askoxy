import React from "react";
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
} from "lucide-react";

interface WF_for_Check_LimitProps {}

const WF_for_Check_Limit: React.FC<WF_for_Check_LimitProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Check Limit in LOS
      </h1>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process by which a Bank Officer checks
            the customer’s eligibility and proposed loan limit using the Loan
            Calculator in the Loan Origination System (LOS). The process is
            based on information such as income, expenditure, asset cost, loan
            amount, and tenure. After calculating eligibility, the proposed loan
            limit is recorded in the system.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800">Primary Actor</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Bank Officer</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Supporting Systems</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Loan Origination System (LOS)</li>
                <li>Loan Calculator Engine</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Actions & System Responses */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            User Actions & System Responses
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              <strong>User Action:</strong> Officer opens the Loan Calculator
              screen after asset details are captured.
              <br />
              <strong>System Response:</strong> LOS presents calculator input
              form.
            </li>
            <li>
              <strong>User Action:</strong> Officer refers to the loan
              application for financial and personal details.
              <br />
              <strong>System Response:</strong> N/A (manual lookup).
            </li>
            <li>
              <strong>User Action:</strong> Officer enters Loan Type and Purpose
              of Loan.
              <br />
              <strong>System Response:</strong> LOS validates loan type rules.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters DOB and Occupation.
              <br />
              <strong>System Response:</strong> LOS checks age eligibility.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters Cost of Asset and
              Requested Loan Amount.
              <br />
              <strong>System Response:</strong> LOS prepares to calculate LTV
              and eligibility.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters Loan Tenure and
              Retirement Age.
              <br />
              <strong>System Response:</strong> LOS validates tenure against
              retirement.
            </li>
            <li>
              <strong>User Action:</strong> Officer inputs Company Details and
              Work Experience.
              <br />
              <strong>System Response:</strong> LOS stores employment data.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters Monthly Income, Other
              Income, and Existing EMIs.
              <br />
              <strong>System Response:</strong> LOS uses data for income-expense
              ratio calculation.
            </li>
            <li>
              <strong>User Action:</strong> Officer inputs Co-Applicant Details
              (if any).
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
              <strong>User Action:</strong> Officer captures the approved limit
              in the LOS.
              <br />
              <strong>System Response:</strong> Data is saved and workflow
              proceeds to next stage.
            </li>
          </ol>
        </section>

        {/* Preconditions & Post Conditions */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Preconditions
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Customer ID exists and is linked to a Loan Product</li>
                <li>Proposed Asset details are already captured</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Post Conditions
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>
                  Customer eligibility and proposed loan limit are calculated
                </li>
                <li>Proposed Loan Limit is saved in LOS</li>
                <li>System is ready for capturing Assets & Liabilities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Normal Flow */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Normal Flow
          </h2>
          <p className="text-gray-700">
            Start → Proposed Asset Details Captured → Open Loan Calculator →
            Enter Required Details (Loan, Income, Asset, EMI, etc.) → Submit
            Calculator Form → System Calculates Eligibility → Display and
            Capture Proposed Loan Limit → Proceed to Next Step → End
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>Co-Applicant present:</strong> System includes
              co-applicant income and liabilities.
            </li>
            <li>
              <strong>Retirement Age &lt; Loan Tenure:</strong> System throws
              validation error.
            </li>
            <li>
              <strong>High EMI burden:</strong> System reduces eligible loan
              limit or flags exception.
            </li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>Missing income or EMI details:</strong> Prompt to fill
              required fields.
            </li>
            <li>
              <strong>Invalid DOB or Retirement Age:</strong> Error shown and
              prevents submission.
            </li>
            <li>
              <strong>Loan amount exceeds asset value:</strong> System flags LTV
              breach warning.
            </li>
          </ul>
        </section>

        {/* Data Inputs Required */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Data Inputs Required
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Loan Type</li>
            <li>Date of Birth</li>
            <li>Purpose of Loan</li>
            <li>Cost of Asset</li>
            <li>Requested Loan Amount</li>
            <li>Loan Tenure</li>
            <li>Occupation</li>
            <li>Company Details</li>
            <li>Work Experience</li>
            <li>Age of Retirement</li>
            <li>Monthly Income</li>
            <li>Other Income</li>
            <li>Total EMI (existing liabilities)</li>
            <li>Co-applicant Info (optional)</li>
          </ul>
        </section>

        {/* Outputs / System Actions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Outputs / System Actions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Eligibility Check Result</li>
            <li>Proposed Loan Limit</li>
            <li>Message on Loan Eligibility Success/Failure</li>
            <li>Storage of result in LOS</li>
            <li>Ready for next workflow stage: Assets & Liabilities Capture</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>LOS UI (Loan Calculator Form)</li>
            <li>Eligibility & Loan Limit Engine</li>
            <li>
              Business Rule Service (validates age, income, EMI thresholds)
            </li>
            <li>Data Store (for saving results)</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Valid income, DOB, and EMI data: Proposed Loan Limit calculated
            </li>
            <li>Invalid DOB or retirement age: Error preventing calculation</li>
            <li>
              Co-applicant included: Loan limit adjusted based on combined
              eligibility
            </li>
            <li>
              Loan tenure remaining working years: System blocks with warning
            </li>
          </ul>
        </section>

        {/* Next Step in Workflow */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Next Step in Workflow
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Capture Assets & Liabilities of the customer</li>
            <li>Proceed to Appraisal and Sanction Stages</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default WF_for_Check_Limit;