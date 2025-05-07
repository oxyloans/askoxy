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

interface WF_Closure_View_Account_Status_Use_CaseProps {}

const WF_Closure_View_Account_Status_Use_Case: React.FC<WF_Closure_View_Account_Status_Use_CaseProps> = () => {
  return (
     <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        WF_Closure_View_Account_Status
      </h1>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Description */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <Info size={18} className="mr-2 text-blue-600" />
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This use case defines the process of verifying the account status in preparation for closure of a Finance Account, either at maturity or due to early termination (foreclosure).
            </p>
          </section>

          {/* Actors */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <Users size={18} className="mr-2 text-blue-600" />
              Actors
            </h2>
            <div className="text-gray-700">
              <h3 className="font-medium text-gray-800 mb-2">Primary Actor</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>User</li>
              </ul>
              <h3 className="font-medium text-gray-800 mb-2">System Actors</h3>
              <ul className="list-disc pl-5">
                <li>Finance Account Status Service</li>
                <li>UI Viewer</li>
                <li>Customer Ledger</li>
              </ul>
            </div>
          </section>

          {/* User Actions & System Responses */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <List size={18} className="mr-2 text-blue-600" />
              User Actions & System Responses
            </h2>
            <ol className="list-decimal pl-5 text-gray-700">
              <li>
                User selects 'View Account Status' in the system.
                <ul className="list-disc pl-5 mt-2">
                  <li>System prompts for Agreement ID.</li>
                </ul>
              </li>
              <li>
                User enters Agreement ID.
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    System retrieves and displays Finance Account details:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Agreement ID</li>
                      <li>Customer Name</li>
                      <li>Amount Finance</li>
                      <li>Tenure</li>
                      <li>Profit Rate</li>
                      <li>Agreement No</li>
                      <li>EMI</li>
                    </ul>
                  </li>
                  <li>
                    Dues:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Balance Principal</li>
                      <li>Due Installments</li>
                      <li>Outstanding Payments</li>
                      <li>Prepayment Penalty</li>
                      <li>Profit on Termination</li>
                      <li>Total Due</li>
                    </ul>
                  </li>
                  <li>
                    Refunds:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Excess Amount</li>
                      <li>Advance Installments</li>
                      <li>Excess Principal</li>
                      <li>Excess Profit</li>
                      <li>Total Refund</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                User views status.
                <ul className="list-disc pl-5 mt-2">
                  <li>If dues exist: User requests customer repayment.</li>
                  <li>If refund exists: User initiates refund process.</li>
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
              <li>A valid and active Finance Account must exist.</li>
            </ul>
          </section>

          {/* Post Condition */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <CheckCircle size={18} className="mr-2 text-green-600" />
              Post Condition
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Finance Account status reviewed.</li>
              <li>Next steps toward closure (payment or refund) initiated.</li>
            </ul>
          </section>

          {/* Straight Through Process (STP) */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <ArrowRight size={18} className="mr-2 text-blue-600" />
              Straight Through Process (STP)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Login → Enter Agreement ID → View Status → Decide Next Action → Logout
            </p>
          </section>

          {/* Alternative Flows */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <ArrowRight size={18} className="mr-2 text-blue-600" />
              Alternative Flows
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Assisted customer service or bulk status retrieval via batch job.</li>
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
              <li>Data retrieval error.</li>
              <li>System unresponsive.</li>
            </ul>
          </section>

          {/* User Activity Diagram (Flowchart) */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <List size={18} className="mr-2 text-blue-600" />
              User Activity Diagram (Flowchart)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              User → Enter Agreement ID → View Status → Payment/Refund action → End
            </p>
          </section>

          {/* Parking Lot */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <Info size={18} className="mr-2 text-blue-600" />
              Parking Lot
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Auto-recommend refund/payment based on rules.</li>
              <li>Integrate email notification to customer.</li>
            </ul>
          </section>

          {/* System Components Involved */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <Settings size={18} className="mr-2 text-blue-600" />
              System Components Involved
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>UI for status view</li>
              <li>Finance Account DB</li>
              <li>Agreement Details Service</li>
              <li>Refund/Repayment Module</li>
            </ul>
          </section>

          {/* Test Scenarios */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <TestTube size={18} className="mr-2 text-blue-600" />
              Test Scenarios
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Valid Agreement ID returns all details.</li>
              <li>Dues detected and flagged correctly.</li>
              <li>Refund detected and system initiates next step.</li>
              <li>Invalid ID returns error.</li>
            </ul>
          </section>

          {/* Infra & Deployment Notes */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <Server size={18} className="mr-2 text-blue-600" />
              Infra & Deployment Notes
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>System should be able to handle multiple concurrent requests.</li>
              <li>Ensure high availability for account detail service.</li>
            </ul>
          </section>

          {/* Dev Team Ownership */}
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
              <User size={18} className="mr-2 text-blue-600" />
              Dev Team Ownership
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Squad: Closure Workflows Team<br />
              Contact: Jane Smith<br />
              JIRA: FMS-Closure-567<br />
              Git Repo: git.company.com/FMS/view-status
            </p>
          </section>
        </div>
      </main>
  
  );
};

export default WF_Closure_View_Account_Status_Use_Case;