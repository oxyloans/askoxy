import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Server,
  Code,
  GitBranch,
} from "lucide-react";

interface Beginning_of_Day_Use_CaseProps {}

const Beginning_of_Day_Use_Case: React.FC<
  Beginning_of_Day_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Beginning of Day (BOD) Process
      </h1>{" "}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The Beginning of Day (BOD) Process is a daily operation within the
            Collections Management System designed to retrieve and update
            delinquent and non-delinquent account data from the backend
            database. This data is sourced from the Collections Management
            Application and is essential for the classification and follow-up of
            delinquent accounts. The BOD process is initiated manually by the
            user.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-800">Business User</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Collections System Operator</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">System Roles</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Collections Management System</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Stakeholders</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Collections Department</li>
                <li>Risk Team</li>
                <li>Operations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Actions & System Responses */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            User Actions & System Responses
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>User logs into the Collections Management Application.</li>
            <li>Navigates to the BOD Process screen.</li>
            <li>
              Selects the Line of Business (e.g., Credit Card, Overdraft,
              Finance).
            </li>
            <li>Submits request to initiate BOD process.</li>
            <li>
              System retrieves and displays details for each delinquent and
              non-delinquent customer, including:
              <ul className="list-disc pl-5 mt-2">
                <li>Total Loan Amount</li>
                <li>Outstanding Loan Amount</li>
                <li>Customer/Co-applicant/Guarantor Information</li>
                <li>Due Date and Due Amount</li>
                <li>Customer Contact Details</li>
              </ul>
            </li>
            <li>
              User reviews retrieved data and proceeds to delinquency
              classification.
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
              Database must contain updated information on delinquent and
              non-delinquent accounts.
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
              System displays delinquent case details, and user transitions to
              the classification process.
            </li>
          </ul>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Login → Navigate to BOD Screen → Select Line of Business → Submit →
            View Delinquency Data → Proceed to Classification
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Data retrieval failure due to connectivity or database issues.
            </li>
            <li>User initiates BOD for an unsupported Line of Business.</li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Missing data for selected Line of Business.</li>
            <li>System timeout or failure during fetch.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Login → Open BOD Screen → Select Line of Business → Submit →
            View Customer Details → Proceed to Classification → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Automate BOD process via scheduled batch job.</li>
            <li>Dashboard to visualize BOD execution status and exceptions.</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>UI: BOD Processing Screen</li>
            <li>DB Tables: Customer Info, Loan Details, Delinquency Records</li>
            <li>APIs: Data Fetch API, Classification Trigger</li>
            <li>Services: BOD Scheduler, Audit Logger</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Run BOD for each Line of Business successfully.</li>
            <li>Simulate missing data and verify error handling.</li>
            <li>Confirm UI displays all expected customer details.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure BOD fetch job has DB read permissions.</li>
            <li>System load optimization to handle early-day traffic.</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <GitBranch size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Squad: Collections Process Team</li>
            <li>Contact: Lead Dev - bod_support@bankdomain.com</li>
            <li>JIRA: COLL-BOD-INIT-01</li>
            <li>Git Repo: /collections/bod-process</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Beginning_of_Day_Use_Case;
