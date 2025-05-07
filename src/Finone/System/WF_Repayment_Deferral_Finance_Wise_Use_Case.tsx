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

interface WF_Repayment_Deferral_Finance_Wise_Use_CaseProps {}

const WF_Repayment_Deferral_Finance_Wise_Use_Case: React.FC<
  WF_Repayment_Deferral_Finance_Wise_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Repayment Deferral Finance Wise
      </h1>{" "}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Finance Wise Repayment Deferral allows a customer to defer their EMI
            payments for a particular finance account, typically requested
            around special periods like festivals. This deferral process is
            initiated individually for specific finances based on customer
            requests. It includes steps for rule validation, schedule
            regeneration, and approval by a checker.
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
              Customer submits a deferral request, specifying number of
              deferrals.
            </li>
            <li>
              User verifies the request and checks the applicable deferral
              rules.
            </li>
            <li>
              If rules are met, user retrieves the finance account by Agreement
              ID.
            </li>
            <li>
              System displays deferral details screen including Agreement ID,
              Customer ID, EMI amount, etc.
              <ul className="list-disc pl-5 mt-2">
                <li>System action: Displays deferral details screen.</li>
              </ul>
            </li>
            <li>
              User enters:
              <ul className="list-disc pl-5 mt-2">
                <li>Deferral Effective Date</li>
                <li>Number of Deferrals</li>
                <li>Deferral Charges</li>
                <li>Next Repayment Date</li>
              </ul>
            </li>
            <li>
              User generates new repayment schedule and submits for checker
              authorization.
            </li>
            <li>Checker verifies and authorizes.</li>
            <li>
              System notifies customer of updated repayment schedule.
              <ul className="list-disc pl-5 mt-2">
                <li>System action: Sends notification to customer.</li>
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
              Customer has a valid finance account and submits a formal deferral
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
            <li>
              New repayment schedule is applied to the finance account and
              shared with the customer.
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
            Customer Request → Verify Rules → Enter Deferral Details → Generate
            & Submit Schedule → Checker Authorization → Notify Customer
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
              If finance account fails eligibility check, system will prevent
              submission.
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
              Checker finds discrepancy → Returns to user for modification.
            </li>
            <li>
              User updates and resubmits the deferral record for authorization.
            </li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Customer Request → Rule Verification → Eligibility Met? →
            Retrieve Account → Enter Deferral Details → Submit → Checker Review
            → Authorized? → Notify Customer → End
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
              Add pre-validation check for finance eligibility before screen
              launch.
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
            <li>Repayment Schedule Engine</li>
            <li>Finance Account Management Module</li>
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
            <li>
              Submit a valid deferral request and validate updated schedule.
            </li>
            <li>Submit with missing parameters and expect system errors.</li>
            <li>
              Checker returns with discrepancy and verify resubmission flow.
            </li>
            <li>Confirm customer receives deferral notification.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Maintain backup of original repayment schedule.</li>
            <li>Audit logging required for each deferral action.</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Repayment Processing Team
            <br />
            Contact: Sneha Reddy
            <br />
            JIRA: DEF-FIN-002
            <br />
            Git Repo: git.company.com/finance-deferral
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Repayment_Deferral_Finance_Wise_Use_Case;
