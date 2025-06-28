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

interface WF_Installment_Prepayment_Use_CaseProps {}

const WF_Installment_Prepayment_Use_Case: React.FC<
  WF_Installment_Prepayment_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        WF_Installment_Prepayment
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The Installment Prepayment feature allows the Financial Management
            System (FMS) to process advance payments from customers toward their
            future installments. This functionality enables efficient loan
            management by reducing loan tenure and re-allocating installments
            when prepayment is made.
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
              <li>Bank Officer</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Financial Management System (FMS)</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Stakeholders</h3>
            <ul className="list-disc pl-5">
              <li>Finance Department</li>
              <li>Loan Operations</li>
              <li>Customer</li>
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
              Customer provides a prepayment amount toward future installments.
            </li>
            <li>
              User logs into the FMS and navigates to the Installment Prepayment
              screen.
            </li>
            <li>
              Enters the following payment details:
              <ul className="list-disc pl-5 mt-2">
                <li>Prepayment ID</li>
                <li>Customer Name</li>
                <li>Agreement ID</li>
                <li>Prepayment Amount</li>
                <li>Account No.</li>
                <li>Agreement Number</li>
                <li>Installment Amount</li>
                <li>Principal Amount</li>
                <li>Balance Installment Amount</li>
              </ul>
            </li>
            <li>
              System calculates number of installments the prepayment covers.
            </li>
            <li>
              System updates the installment schedule:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Allocates the received amount to the last installment(s).
                </li>
                <li>Reduces the loan tenure accordingly.</li>
              </ul>
            </li>
            <li>User saves or resets the record.</li>
            <li>System confirms successful prepayment entry.</li>
          </ol>
        </section>

        {/* Precondition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Precondition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Customer has provided a valid prepayment amount.</li>
            <li>Active loan agreement exists in the system.</li>
          </ul>
        </section>

        {/* Post Condition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Post Condition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Prepayment is applied.</li>
            <li>Loan tenure is adjusted.</li>
          </ul>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Receive Prepayment → Login to FMS → Navigate to Prepayment Screen →
            Enter Details → Save Entry → Tenure Updated → Logout
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
              Manual allocation of prepayment in case of specific business
              rules.
            </li>
            <li>
              Partial prepayment across multiple agreements (future
              enhancement).
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
            <li>Invalid account or agreement details.</li>
            <li>Prepayment less than minimum installment amount.</li>
            <li>System downtime during submission.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Receive Prepayment → Enter Prepayment Info → System
            Calculates Installments → Save Entry → Update Schedule → End
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
              Option to re-apply prepayments against principal vs. tenure.
            </li>
            <li>Automated SMS/email alerts for prepayment acknowledgment.</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Settings size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <div className="text-gray-700">
            <h3 className="font-medium text-gray-800 mb-2">UI</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Installment Prepayment Screen</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">DB Tables</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Installment Ledger</li>
              <li>Customer Agreement Table</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">APIs</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Prepayment Processor</li>
              <li>Schedule Updater</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Services</h3>
            <ul className="list-disc pl-5">
              <li>Installment Recalculation Engine</li>
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
            <li>Prepayment of 1, 2, 3 installments.</li>
            <li>Verification of tenure update.</li>
            <li>Rejection scenarios for invalid data.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure prepayment logic adheres to regulatory norms.</li>
            <li>
              Schedule recalculations should trigger batch processes as needed.
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
            Squad: Loan Management Systems Team
            <br />
            Contact: Lead Dev - prepayment_fms@bankdomain.com
            <br />
            JIRA: WF-INST-PREPAY-01
            <br />
            Git Repo: /fms/installment/prepayment
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Installment_Prepayment_Use_Case;
