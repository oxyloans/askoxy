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

interface WF_for_Evauating_the_Networth_of_the_PartiesProps {}

const WF_for_Evauating_the_Networth_of_the_Parties: React.FC<
  WF_for_Evauating_the_Networth_of_the_PartiesProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Evaluating the Networth of the Parties in LOS
      </h1>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process by which a Bank Officer
            evaluates the net worth of the applicant, co-applicant(s),
            co-obligant(s), and guarantor(s) in the Loan Origination System
            (LOS). The system evaluates the assets and liabilities of the
            parties involved to calculate their net worth, which is then used
            for loan assessment.
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
              <strong>User Action:</strong> Officer verifies Customer ID and
              links Co-applicant, Co-obligant, and Guarantor to the proposed
              loan.
              <br />
              <strong>System Response:</strong> LOS links IDs and displays
              relevant details.
            </li>
            <li>
              <strong>User Action:</strong> Officer initiates the process for
              evaluating net worth.
              <br />
              <strong>System Response:</strong> LOS presents forms for Assets &
              Liabilities data.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters the Asset details for
              the applicant, co-applicant, co-obligant, and guarantor.
              <br />
              <strong>System Response:</strong> System stores data in LOS.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters the Liability details
              for the applicant, co-applicant, co-obligant, and guarantor.
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
              <strong>User Action:</strong> System displays the calculated net
              worth of all parties.
              <br />
              <strong>System Response:</strong> LOS displays net worth summary.
            </li>
            <li>
              <strong>User Action:</strong> Officer captures the net worth
              details into the LOS.
              <br />
              <strong>System Response:</strong> System stores the calculated net
              worth for further appraisal.
            </li>
            <li>
              <strong>User Action:</strong> Proceed to the next workflow step
              (Appraisal of the loan).
              <br />
              <strong>System Response:</strong> LOS prepares for the next
              workflow.
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
                <li>
                  Customer ID and Co-applicant/Co-obligant/Guarantor IDs exist
                  and are linked to the proposed loan
                </li>
                <li>Proposed Asset details are already captured in the LOS</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Post Conditions
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>
                  The net worth of the applicant, co-applicant, co-obligant, and
                  guarantor is calculated and saved
                </li>
                <li>The system is ready for further loan appraisal</li>
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
            Start → Verify Customer and Linked IDs
            (Co-applicant/Co-obligant/Guarantor) → Enter Assets Details
            (Savings, Properties, Deposits, Investments, LIC Policies) → Enter
            Liabilities Details (Borrowings, Liabilities with Employer/others) →
            Submit the form to calculate Net Worth → System calculates and
            displays Net Worth (Assets - Liabilities) → Bank officer captures
            and saves the Net Worth details in LOS → Proceed to next workflow
            step: Appraisal of Loan → End
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
              <strong>Missing Asset or Liability data:</strong> System prompts
              user to fill all required fields.
            </li>
            <li>
              <strong>Assets and Liabilities not balanced:</strong> System flags
              an alert for incomplete data.
            </li>
            <li>
              <strong>Multiple guarantors:</strong> Net worth calculated for
              each and displayed separately.
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
              <strong>Invalid or missing Customer ID:</strong> System throws an
              error message.
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
        </section>

        {/* Data Inputs Required */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Data Inputs Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800">Assets Details</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Savings in Bank</li>
                <li>Immovable Properties/Assets with current value</li>
                <li>Deposits in Banks</li>
                <li>Investments in shares/Mutual Funds/others</li>
                <li>
                  LIC Policies with Sum Assured, Date of Maturity & Surrender
                  Value
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Liabilities Details</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>
                  Borrowings from the Banks/others with the present outstanding
                  balance
                </li>
                <li>
                  Liabilities with the employer with the present outstanding
                  balance
                </li>
                <li>
                  Liabilities with others with the present outstanding balance
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Outputs / System Actions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Outputs / System Actions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Calculated Net Worth for Applicant, Co-applicant, Co-obligant, and
              Guarantor (Assets - Liabilities)
            </li>
            <li>Display of Net Worth summary for all parties</li>
            <li>Captured Net Worth data stored in LOS</li>
            <li>Message to proceed to loan appraisal workflow</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>LOS UI (Net Worth Input Forms)</li>
            <li>Asset & Liability Calculation Engine</li>
            <li>Business Rule Service (validates asset/liability values)</li>
            <li>Data Store (for storing Net Worth data)</li>
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
              Complete Assets and Liabilities entered: Net Worth calculated and
              saved successfully
            </li>
            <li>
              Missing assets or liabilities data: Error preventing submission
              and prompting for missing fields
            </li>
            <li>
              Multiple guarantors with data: System calculates individual net
              worth for each party
            </li>
            <li>
              Inconsistent data in assets/liabilities: System flags discrepancy
              for further verification
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
            <li>
              Proceed with Appraisal of the proposed loan, using the calculated
              net worth as one of the evaluation parameters
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default WF_for_Evauating_the_Networth_of_the_Parties;
