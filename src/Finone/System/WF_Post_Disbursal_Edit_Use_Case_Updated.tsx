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

interface WF_Post_Disbursal_Edit_Use_Case_UpdatedProps {}

const WF_Post_Disbursal_Edit_Use_Case_Updated: React.FC<
  WF_Post_Disbursal_Edit_Use_Case_UpdatedProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Post Disbursal Edit
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The 'Post Disbursal Edit' use case allows a user to update
            non-financial information in a finance account. This includes adding
            new guarantor and co-applicant details (existing ones cannot be
            edited), address and contact information, work details, remarks,
            finance details, and instrument details. The primary goal is to
            ensure that the finance account reflects up-to-date non-financial
            data.
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
              User initiates the process to modify non-financial data of a
              finance account.
            </li>
            <li>User inputs Agreement ID to fetch the account.</li>
            <li>
              System displays the finance account information.
              <ul className="list-disc pl-5 mt-2">
                <li>System action: Retrieves and displays account details.</li>
              </ul>
            </li>
            <li>
              User selects relevant tabs to add or update permissible fields
              like:
              <ul className="list-disc pl-5 mt-2">
                <li>Guarantor Details (addition only)</li>
                <li>Co-applicant Details (addition only)</li>
                <li>Address & Contact Information</li>
                <li>Work Details</li>
                <li>Instrument Details</li>
              </ul>
            </li>
            <li>
              User modifies or adds the necessary fields and saves the changes.
            </li>
            <li>
              System validates and confirms the successful update of
              information.
              <ul className="list-disc pl-5 mt-2">
                <li>System action: Validates and saves changes.</li>
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
              A valid existing or new Finance Account must exist in the system.
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
              Non-financial information of the finance account is successfully
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
            Initiate Edit → Input Agreement ID → Retrieve & Display Account →
            Modify/Add Info → Save → Confirmation
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
              If an incorrect Agreement ID is entered, account details will not
              be retrieved.
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
              Attempting to modify existing guarantor/co-applicant results in
              system error.
            </li>
            <li>Save operation fails due to validation or system issues.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Initiate Edit → Retrieve Account by Agreement ID → Display
            Account Details → Modify/Add Info → Save Record → Confirmation → End
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
              Consider enhancement to allow edits of existing
              guarantor/co-applicant details in future releases.
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
            <li>Finance Management System</li>
            <li>Customer Information System</li>
            <li>Document and Instrument Module</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <TestTube size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Successfully add a new guarantor.</li>
            <li>Modify work details.</li>
            <li>Add co-applicant with full details.</li>
            <li>Attempt to edit existing guarantor (expect failure).</li>
            <li>Save address and contact updates.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>All updates should be audited.</li>
            <li>Ensure transaction logging and validation before commit.</li>
            <li>
              System must have active linkage with customer modules for new
              entries.
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
            Squad: Post Disbursal Systems Team
            <br />
            Contact: Tanvi Agarwal
            <br />
            JIRA: PD-FMS-022
            <br />
            Git Repo: git.company.com/FMS/post-disbursal
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Post_Disbursal_Edit_Use_Case_Updated;
