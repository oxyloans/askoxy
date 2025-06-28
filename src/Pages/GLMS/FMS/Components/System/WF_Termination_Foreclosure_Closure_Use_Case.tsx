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

interface WF_Termination_Foreclosure_Closure_Use_CaseProps {}

const WF_Termination_Foreclosure_Closure_Use_Case: React.FC<
  WF_Termination_Foreclosure_Closure_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        WF_Termination / Foreclosure / Closure
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Termination refers to the closure of a finance account at the end of
            the agreed tenure, following full repayment of principal and profit.
            Foreclosure or early termination occurs when the customer repays the
            total finance amount before the scheduled end date. Foreclosures
            usually incur additional fees. This use case captures the steps and
            system interactions required to process both standard terminations
            and foreclosures in the Financial Management System (FMS).
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
              <li>Bank Staff handling account closures</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Financial Management System (FMS)</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Stakeholders</h3>
            <ul className="list-disc pl-5">
              <li>Finance Team</li>
              <li>Collections</li>
              <li>Customer Service</li>
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
            <li>Navigates to the Finance Termination screen.</li>
            <li>
              Enters identification data using one or more of:
              <ul className="list-disc pl-5 mt-2">
                <li>Application ID</li>
                <li>Customer ID</li>
                <li>Branch ID</li>
              </ul>
            </li>
            <li>
              System retrieves agreement details:
              <ul className="list-disc pl-5 mt-2">
                <li>Agreement ID</li>
                <li>Agreement Date</li>
                <li>Customer Name</li>
                <li>Amount Financed</li>
                <li>Frequency</li>
                <li>Tenure</li>
                <li>Agreement No.</li>
              </ul>
            </li>
            <li>
              User reviews dues and refund details:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Dues:
                  <ul className="list-circle pl-5 mt-1">
                    <li>Principal</li>
                    <li>Residual Value</li>
                    <li>Past Due Installments</li>
                    <li>Outstanding Payments</li>
                    <li>Total Dues</li>
                  </ul>
                </li>
                <li>
                  Refunds:
                  <ul className="list-circle pl-5 mt-1">
                    <li>Excess Amount</li>
                    <li>Excess Refunds</li>
                    <li>Rebate</li>
                    <li>Advance Installments</li>
                    <li>Total Refunds</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>User updates necessary account details.</li>
            <li>For foreclosure, user applies applicable fees.</li>
            <li>
              System processes payment, zeros out balance, and closes the
              account.
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
              Only eligible finance accounts are selected for termination or
              foreclosure.
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
              Finance account is closed successfully, with updated dues and
              refunds reflected.
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
            Login → Navigate to Termination Screen → Enter Account Info → Review
            Details → Apply Fees (if any) → Process Closure → Logout
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Manual override of fee for specific foreclosures.</li>
            <li>Closure of account post refund adjustments.</li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Attempt to close account with unresolved dues.</li>
            <li>Incomplete customer identification data.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Login → Enter ID → Review Details → Apply Fees/Adjustments →
            Process Closure → End
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
              Enhancement for automated eligibility check for foreclosure.
            </li>
            <li>
              Notification integration for closure confirmation to customers.
            </li>
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
              <li>Finance Termination Interface</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">APIs</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Account Status Validation</li>
              <li>Fee Calculation Engine</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">DB Tables</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Agreement Ledger</li>
              <li>Dues & Refund Ledger</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Services</h3>
            <ul className="list-disc pl-5">
              <li>Payment Gateway</li>
              <li>Account Closure Processor</li>
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
            <li>Normal termination at end of term.</li>
            <li>Early termination with foreclosure fees.</li>
            <li>Invalid closure attempts with open dues.</li>
            <li>Verification of dues and refund balance prior to closure.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Real-time sync with payments and account ledger.</li>
            <li>Secure audit logging for termination actions.</li>
            <li>Role-based access for termination processing.</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Closure & Lifecycle Events Team
            <br />
            Contact: Lead Dev - termination_support@bankdomain.com
            <br />
            JIRA: WF-TERM-FORECLOSE-01
            <br />
            Git Repo: /finance/termination-module
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Termination_Foreclosure_Closure_Use_Case;
