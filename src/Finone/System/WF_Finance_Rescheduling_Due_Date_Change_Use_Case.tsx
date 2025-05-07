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

interface WF_Finance_Rescheduling_Due_Date_Change_Use_CaseProps {}

const WF_Finance_Rescheduling_Due_Date_Change_Use_Case: React.FC<WF_Finance_Rescheduling_Due_Date_Change_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Finance Rescheduling - Due Date Change
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case addresses the process of changing the due date of
            finance installment payments. It enables users to reschedule future
            repayment dates upon customer request, resulting in a new repayment
            schedule. This is part of the Finance Rescheduling functionality
            which also supports other transactions like Bulk Prepayment, Profit
            Rate Modification, and Tenure Modification.
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
            <li>Customer submits a Due Date Change request at the bank.</li>
            <li>User verifies the request and checks applicable rules.</li>
            <li>
              If valid, User initiates Due Date Change and retrieves Finance
              Account details.
            </li>
            <li>
              System displays:
              <ul className="list-disc pl-5 mt-2">
                <li>Finance No</li>
                <li>Agreement ID</li>
                <li>Loan Amount</li>
                <li>Original Tenure</li>
                <li>Original Due Date</li>
                <li>Outstanding Amount</li>
                <li>Reschedule Effective Date</li>
                <li>Repayment Effective Date</li>
                <li>Balance Tenure</li>
                <li>Frequency</li>
                <li>Rate of Interest</li>
              </ul>
            </li>
            <li>
              User modifies the Due Date and submits for schedule generation.
            </li>
            <li>
              Checker retrieves and verifies the New Repayment Schedule using
              Agreement ID.
            </li>
            <li>
              If accurate, Checker authorizes; otherwise, requests correction.
              <ul className="list-disc pl-5 mt-2">
                <li>
                  System action: Processes authorization or correction request.
                </li>
              </ul>
            </li>
            <li>
              Upon authorization, system generates the new schedule and notifies
              the customer.
              <ul className="list-disc pl-5 mt-2">
                <li>
                  System action: Generates new repayment schedule and sends
                  notification.
                </li>
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
              Customer must have an existing Finance Account with a valid
              request for Due Date Change.
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
            <li>Updated due date is applied.</li>
            <li>A new repayment schedule is generated and communicated.</li>
          </ul>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Customer Visit → Request Validation → Due Date Modification →
            Schedule Generation → Authorization → Notification
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
              If the Checker finds discrepancies, the request is returned to
              User for correction.
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
            <li>Invalid Agreement ID.</li>
            <li>System errors during schedule generation.</li>
            <li>Rule violation.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Customer submits request → User verifies → Modify Due Date →
            Generate Schedule → Checker validates → Approve or return for
            correction → Notify Customer → End
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
              Option to automate due date change based on recurring customer
              preferences.
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
            <li>Repayment Engine</li>
            <li>Finance DB</li>
            <li>Schedule Generator</li>
            <li>Authorization Workflow</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <TestTube size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Valid request successfully generates new schedule.</li>
            <li>Discrepancy results in rejected authorization.</li>
            <li>Invalid Agreement ID prompts error.</li>
            <li>Schedule reflects updated due dates accurately.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Ensure synchronization between schedule generator and core finance
              systems.
            </li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Finance Platform Services Team
            <br />
            Contact: Neha Kapoor
            <br />
            JIRA: FMS-DUE-444
            <br />
            Git Repo: git.company.com/FMS/due-date-change
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Finance_Rescheduling_Due_Date_Change_Use_Case;