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

interface WF_Finance_Rescheduling_Profit_Rate_Change_Use_CaseProps {}

const WF_Finance_Rescheduling_Profit_Rate_Change_Use_Case: React.FC<WF_Finance_Rescheduling_Profit_Rate_Change_Use_CaseProps> = () => {
    return (
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
          Finance Rescheduling - Profit Rate Change
        </h1>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Description */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <Info size={18} className="mr-2 text-blue-600" />
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This use case explains the process to modify the profit (interest)
              rate on an existing finance account. Such a modification typically
              results in a recalculation of the repayment schedule and may
              impact either the installment amount or tenure. The process
              involves request submission, verification, and schedule
              regeneration followed by approval.
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
                Customer visits the bank and submits a request to change the
                interest rate on the Finance Account.
              </li>
              <li>User verifies the request and applicable rules.</li>
              <li>
                If valid, User updates the interest rate and retrieves Finance
                Account details (Agreement ID).
              </li>
              <li>
                System displays:
                <ul className="list-disc pl-5 mt-2">
                  <li>Finance No</li>
                  <li>Agreement ID</li>
                  <li>Original Loan Amount</li>
                  <li>Original Rate of Interest</li>
                  <li>Original Tenure</li>
                  <li>Due Date</li>
                  <li>Reschedule Effective Date</li>
                  <li>Repayment Effective Date</li>
                  <li>Bulk Refund Amount</li>
                  <li>Balance Tenure</li>
                  <li>Frequency</li>
                  <li>Modified Interest Rate</li>
                </ul>
              </li>
              <li>
                User modifies the interest rate and submits it for New Repayment
                Schedule generation.
              </li>
              <li>
                Checker retrieves and verifies the New Repayment Schedule using
                Agreement ID.
              </li>
              <li>
                If found correct, Checker authorizes the schedule.
                <ul className="list-disc pl-5 mt-2">
                  <li>System action: Processes authorization.</li>
                </ul>
              </li>
              <li>
                Once authorized, the new repayment schedule is generated and the
                customer is notified.
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    System action: Generates new repayment schedule and sends
                    notification.
                  </li>
                </ul>
              </li>
              <li>
                If discrepancies are found, User modifies and resubmits the
                request.
                <ul className="list-disc pl-5 mt-2">
                  <li>System action: Allows modification and resubmission.</li>
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
                An active Finance Account and a valid interest rate change
                request.
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
              <li>Interest rate updated.</li>
              <li>A new repayment schedule is generated and shared.</li>
            </ul>
          </section>

          {/* Straight Through Process (STP) */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <ArrowRight size={18} className="mr-2 text-blue-600" />
              Straight Through Process (STP)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Customer Visit → Request Verification → Modify Rate → Generate
              Schedule → Checker Authorization → Notify Customer
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
                Discrepant requests are corrected by the User and resubmitted.
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
              <li>Invalid finance account.</li>
              <li>Interest rate policy violation.</li>
              <li>System calculation failure.</li>
            </ul>
          </section>

          {/* User Activity Diagram (Flowchart) */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <List size={18} className="mr-2 text-blue-600" />
              User Activity Diagram (Flowchart)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Start → Customer submits request → User verifies → Modify Rate →
              Generate Schedule → Checker validates → Approve or return → Notify
              Customer → End
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
                Potential for automated rate adjustments based on benchmarks or
                risk ratings.
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
              <li>Finance Core Engine</li>
              <li>Repayment Schedule Generator</li>
              <li>User Interface</li>
              <li>Notification Service</li>
            </ul>
          </section>

          {/* Test Scenarios */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <TestTube size={18} className="mr-2 text-blue-600" />
              Test Scenarios
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Valid rate change leads to correct schedule generation.</li>
              <li>Discrepancy leads to resubmission loop.</li>
              <li>Unauthorized rate causes rejection.</li>
              <li>Notification is sent post-schedule generation.</li>
            </ul>
          </section>

          {/* Infra & Deployment Notes */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <Server size={18} className="mr-2 text-blue-600" />
              Infra & Deployment Notes
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Must support audit trail for rate changes.</li>
              <li>Rollback capability in case of failure.</li>
            </ul>
          </section>

          {/* Dev Team Ownership */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <User size={18} className="mr-2 text-blue-600" />
              Dev Team Ownership
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Squad: Finance Rescheduling Product Team
              <br />
              Contact: Rajeev Nair
              <br />
              JIRA: FMS-INT-772
              <br />
              Git Repo: git.company.com/FMS/interest-rate-change
            </p>
          </section>
        </div>
      </main>
    );
};

export default WF_Finance_Rescheduling_Profit_Rate_Change_Use_Case;