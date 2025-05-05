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

interface WF_Repayment_Deferral_Portfolio_Wise_Use_CaseProps {}

const WF_Repayment_Deferral_Portfolio_Wise_Use_Case: React.FC<
  WF_Repayment_Deferral_Portfolio_Wise_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Repayment Deferral Portfolio Wise
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Portfolio Wise Repayment Deferral (also called Batch Wise Deferral)
            allows the bank to defer EMIs across the entire customer portfolio,
            typically during festive periods. It bypasses individual rule checks
            and applies globally via a batch upload. Customers are charged a
            deferral fee.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
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
              User prepares a file with portfolio deferral details:
              <ul className="list-disc pl-5 mt-2">
                <li>Agreement ID</li>
                <li>Customer Name</li>
                <li>Finance Amount</li>
                <li>No. of Deferrals</li>
                <li>Effective Date</li>
                <li>etc.</li>
              </ul>
            </li>
            <li>
              User uploads the file into the system and submits it.
              <ul className="list-disc pl-5 mt-2">
                <li>System action: Accepts the file upload.</li>
              </ul>
            </li>
            <li>Checker reviews and verifies the file details.</li>
            <li>If found correct, Checker authorizes the deferral.</li>
            <li>
              System marks the deferrals and notifies all customers listed in
              the batch.
              <ul className="list-disc pl-5 mt-2">
                <li>
                  System action: Applies deferrals and sends notifications.
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
              Valid finance accounts exist; batch deferral needed (e.g., festive
              season offer).
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
              Deferral applied to all portfolio accounts listed in the uploaded
              file.
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
            Create File → Upload File → Checker Authorization → Mark Deferrals →
            Notify Customers
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
              If discrepancies are found by the checker, the file is returned
              for user modification.
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
            <li>File format invalid → System rejects upload.</li>
            <li>
              Missing fields → Error prompts user to correct and resubmit.
            </li>
            <li>Authorization fails → No deferrals marked.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Create Upload File → Upload & Submit → Checker Verifies →
            Authorize? → Deferral Marked & Notified → End (If discrepancy →
            Modify File → Resubmit)
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
              Enhance file validation to check format and required fields before
              allowing upload.
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
            <li>Batch Upload Engine</li>
            <li>Deferral Processing Module</li>
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
            <li>Upload valid file and verify successful deferral marking.</li>
            <li>
              Upload file with missing/incorrect data and expect system
              rejections.
            </li>
            <li>
              Ensure customer notifications are triggered post authorization.
            </li>
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
              Secure handling of upload files; system must log all upload
              attempts and authorization actions.
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
            Squad: Deferral Automation Team
            <br />
            Contact: Ravi Mehta
            <br />
            JIRA: DEF-BATCH-003
            <br />
            Git Repo: git.company.com/batch-deferral
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Repayment_Deferral_Portfolio_Wise_Use_Case;
