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

interface WF_Settlements_Manual_Advice_Use_CaseProps {}

const WF_Settlements_Manual_Advice_Use_Case: React.FC<WF_Settlements_Manual_Advice_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        WF_ Settlements - Manual Advice
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Manual Advice processing in the Financial Management System (FMS)
            allows users to initiate non-automated financial dues such as
            commission payments or one-time adjustments. These transactions are
            executed manually by entering the required payment advice details
            into the system.
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
              <li>Bank Staff entering the manual advice</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Financial Management System (FMS)</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Stakeholders</h3>
            <ul className="list-disc pl-5">
              <li>Settlements & Payments Team</li>
              <li>Audit</li>
              <li>QA</li>
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
            <li>Navigates to the Manual Advice section under Settlements.</li>
            <li>Selects the business party and agreement ID.</li>
            <li>
              Enters the following details:
              <ul className="list-disc pl-5 mt-2">
                <li>Advice ID</li>
                <li>Advice Date</li>
                <li>Agreement Number</li>
                <li>Advice Amount</li>
                <li>Advice Type</li>
                <li>Currency</li>
                <li>Charge Type</li>
                <li>Maker ID</li>
                <li>Entry Date</li>
                <li>Remarks</li>
              </ul>
            </li>
            <li>
              System processes and creates the financial due as per internal
              logic.
            </li>
            <li>The due amount is scheduled for payment to the customer.</li>
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
              All payment details must be verified and available with the user.
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
            <li>
              Manual advice is successfully created and due is processed for
              payment.
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
            Login → Navigate to Manual Advice → Enter Required Fields → Save →
            System Creates Due → Logout
          </p>
        </section>
        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Manual override of charge type or advice type.</li>
            <li>Update or correction of erroneous advice entries.</li>
          </ul>
        </section>
        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Missing mandatory fields.</li>
            <li>Invalid agreement ID or unmatched business party.</li>
          </ul>
        </section>
        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Login → Manual Advice Entry → Validate & Save → Due Created
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
            <li>Pre-validation of agreement and party mappings.</li>
            <li>Dashboard for pending/manual advices.</li>
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
              <li>Manual Advice Form in Settlements Module</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">APIs</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Advice Posting</li>
              <li>Due Creation</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">DB Tables</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Advice Ledger</li>
              <li>Agreement Info</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Services</h3>
            <ul className="list-disc pl-5">
              <li>Manual Payment Handler</li>
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
            <li>Valid manual advice creation.</li>
            <li>Invalid data input (e.g. future date, wrong agreement).</li>
            <li>Payment creation validation.</li>
            <li>Duplicate advice ID handling.</li>
          </ul>
        </section>
        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Enabled only for authorized users.</li>
            <li>Advice creation logs stored for audit.</li>
            <li>Integrated with existing payment scheduling logic.</li>
          </ul>
        </section>
        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Settlements Management Team
            <br />
            Contact: Lead Dev - manual_advise@bankdomain.com
            <br />
            JIRA: WF-MANUAL-ADV-01
            <br />
            Git Repo: /settlements/manual-advise
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Settlements_Manual_Advice_Use_Case;