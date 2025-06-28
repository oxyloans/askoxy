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

interface WF_Settlements_Cheque_Processing_Use_CaseProps {}

const WF_Settlements_Cheque_Processing_Use_Case: React.FC<WF_Settlements_Cheque_Processing_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        WF_Settlements - Cheque (Receipt/Payment) Processing
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Cheque (Receipt/Payment) Processing in the Settlements module of the
            Financial Management System (FMS) handles the recording, tracking,
            and updating of cheque instruments used for financial transactions.
            The process includes handling deposits, realizations, bounces,
            cancellations, and placing or lifting holds. It applies to both
            receipt and payment cheques and ensures accurate recording and
            reconciliation of all instrument-based transactions.
          </p>
        </section>
        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <div className="text-gray-700">
            <h3 className="font-medium text-gray-800 mb-2">Business User</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Bank Staff responsible for cheque processing</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Financial Management System (FMS)</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Stakeholders</h3>
            <ul className="list-disc pl-5">
              <li>Settlements Team</li>
              <li>Core Banking System</li>
              <li>QA</li>
              <li>Audit</li>
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
            <li>User logs into the FMS application.</li>
            <li>
              Navigates to Receipt/Payment Processing in the Settlements module.
            </li>
            <li>
              Enters cheque details including:
              <ul className="list-disc pl-5 mt-2">
                <li>Payment Mode</li>
                <li>Agreement Number</li>
                <li>In Favor Of</li>
                <li>Cheque Number</li>
                <li>Date</li>
                <li>Amount</li>
                <li>Currency</li>
                <li>Cheque Type</li>
                <li>Branch Details</li>
              </ul>
            </li>
            <li>Saves the entry.</li>
            <li>
              System records and updates cheque processing status accordingly.
            </li>
            <li>
              Optional actions: place on hold, cancel payment, or
              realize/bounce.
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
            <li>User must collect and verify all cheque details.</li>
          </ul>
        </section>
        {/* Post Condition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Post Condition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Receipt/Payment cheque transactions are successfully processed and
              updated.
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
            Login → Navigate to Cheque Processing → Enter Cheque Details → Save
            Entry → Logout
          </p>
        </section>
        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Cheque Hold Placement or Removal</li>
            <li>Cheque Bounce Handling (Cleared/Uncleared)</li>
            <li>Cancellation of Payment Receipt</li>
          </ul>
        </section>
        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Invalid cheque number or date.</li>
            <li>Missing mandatory fields during entry.</li>
            <li>Bounce not handled in time.</li>
          </ul>
        </section>
        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Login → Cheque Entry → Save or Hold → Process Outcome → End
          </p>
        </section>
        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Auto-reconciliation of cheque statuses with clearing house.</li>
            <li>Integration with mobile cheque capture.</li>
          </ul>
        </section>
        /* System Components Involved */
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Settings size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <div className="text-gray-700">
            <h3 className="font-medium text-gray-800 mb-2">UI</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Cheque Processing Screen in FMS</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">APIs</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Payment Gateway</li>
              <li>Cheque Clearing Status</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">DB Tables</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Cheque Ledger</li>
              <li>Receipt/Payment History</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Services</h3>
            <ul className="list-disc pl-5">
              <li>Status Update Engine</li>
              <li>Notification System</li>
            </ul>
          </div>
        </section>
        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <TestTube size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Valid receipt and payment entry.</li>
            <li>Hold and release scenarios.</li>
            <li>Bounce recording and reversal.</li>
            <li>Cancellation and re-processing of cheques.</li>
          </ul>
        </section>
        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>High availability needed for real-time entry.</li>
            <li>End-of-Day triggers for bounce status checks.</li>
            <li>Requires secured access with audit trails.</li>
          </ul>
        </section>
        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Payments & Settlements Team
            <br />
            Contact: Lead Dev - cheque_processing@bankdomain.com
            <br />
            JIRA: WF-CHEQUE-SETTLE-01
            <br />
            Git Repo: /settlements/cheque-processing
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Settlements_Cheque_Processing_Use_Case;