import React from "react";
import {
  FileText,
  Users,
  List,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Settings,
  TestTube,
  Server,
  User,
} from "lucide-react";

interface WF_Finance_Rescheduling_Tenure_Change_Use_CaseProps {}

const WF_Finance_Rescheduling_Tenure_Change_Use_Case: React.FC<
  WF_Finance_Rescheduling_Tenure_Change_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Finance Rescheduling - Tenure Change
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case covers the process of changing the tenure of a finance
            account at the customer's request. Adjusting the tenure affects the
            installment amounts, and a new repayment schedule must be generated.
            The request is handled by a User and verified by a Checker before
            final authorization.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Customer</li>
            <li>User</li>
            <li>Checker</li>
          </ul>
        </section>

        {/* User Actions & System Responses */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Actions & System Responses
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              Customer visits the bank and submits a request to modify the
              tenure of an existing Finance Account.
            </li>
            <li>
              User verifies the request and applicable rules for tenure change.
            </li>
            <li>
              Upon validation, the User retrieves the Finance Account details
              using Agreement ID and initiates the process.
            </li>
            <li>
              System displays the following:
              <ul className="list-disc pl-5 mt-2">
                <li>Finance No</li>
                <li>Agreement ID</li>
                <li>Loan Amount</li>
                <li>Original Tenure</li>
                <li>EMI Amount</li>
                <li>Due Date</li>
                <li>Reschedule Effective Date</li>
                <li>Repayment Effective Date</li>
                <li>Bulk Refund Amount</li>
                <li>Balance Tenure</li>
                <li>Frequency</li>
                <li>Rate of Interest</li>
              </ul>
            </li>
            <li>
              User modifies the Balance Tenure and submits the request for
              generation of the New Repayment Schedule.
            </li>
            <li>
              Checker retrieves the new schedule using Agreement ID, verifies
              it, and authorizes it if correct.
              <ul className="list-disc pl-5 mt-2">
                <li>System action: Processes authorization.</li>
              </ul>
            </li>
            <li>
              If authorized, the new repayment schedule is generated and the
              customer is notified.
              <ul className="list-disc pl-5 mt-2">
                <li>
                  System action: Generates new repayment schedule and sends
                  notification.
                </li>
              </ul>
            </li>
            <li>
              If any discrepancy is found, the request is returned to User for
              correction and resubmission.
              <ul className="list-disc pl-5 mt-2">
                <li>System action: Allows correction and resubmission.</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* Precondition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Precondition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              A valid finance account must exist and the customer must request a
              tenure change.
            </li>
          </ul>
        </section>

        {/* Post Condition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Post Condition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Tenure is modified.</li>
            <li>
              The new repayment schedule is generated and shared with the
              customer.
            </li>
          </ul>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Customer Request → Verification → Tenure Modification → Schedule
            Generation → Authorization → Notification
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              If Checker finds discrepancies, the schedule is returned to User
              for correction.
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
            <li>Invalid account details.</li>
            <li>Rule violation.</li>
            <li>System failure during schedule generation.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Submit Request → Verify Request → Modify Tenure → Generate
            Schedule → Checker Verifies → Authorize or Return → Notify Customer
            → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Introduce self-service option for tenure changes via digital
              channels.
            </li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Settings size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Finance Core System</li>
            <li>Schedule Generator</li>
            <li>Authorization Module</li>
            <li>Notification System</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <TestTube size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Tenure updated correctly with new EMI calculated.</li>
            <li>Invalid request results in error.</li>
            <li>Discrepant schedule is rejected.</li>
            <li>Notification is sent upon approval.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure versioning of repayment schedules.</li>
            <li>Rollback options.</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Finance Adjustments Squad
            <br />
            Contact: Sneha Das
            <br />
            JIRA: FMS-TEN-913
            <br />
            Git Repo: git.company.com/FMS/tenure-change
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Finance_Rescheduling_Tenure_Change_Use_Case;
