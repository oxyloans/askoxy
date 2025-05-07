import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Lock,
  GitBranch,
  Server,
  Code,
} from "lucide-react";

interface Manual_Reallocation_Use_CaseProps {}

const Manual_Reallocation_Use_Case: React.FC<Manual_Reallocation_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Allocation of Delinquent Cases - Manual Reallocation
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Manual reallocation is a functionality within the Collections System
            that enables supervisors to reassign delinquent accounts to more
            suitable collectors. This process enhances the efficiency of
            collections by allocating cases to collectors who are better
            equipped to handle specific scenarios. The reallocation is done
            using the Manual Reallocation screen and is restricted to
            supervisors managing the corresponding users.
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
                <li>Supervisor</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">System Roles</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Collections System</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Stakeholders</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Collections Department</li>
                <li>Branch Operations</li>
                <li>Risk Management</li>
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
            <li>Supervisor logs into the Collections System.</li>
            <li>Navigates to the Manual Reallocation screen.</li>
            <li>System displays delinquent cases based on defined queues.</li>
            <li>
              Supervisor selects a delinquent case and updates necessary fields:
              <ul className="list-disc pl-5 mt-2">
                <li>Loan No./Account No.</li>
                <li>Customer Name</li>
                <li>Customer ID</li>
                <li>Card No.</li>
                <li>Overdue Position</li>
                <li>Financier</li>
                <li>Financier Type</li>
                <li>Rule Unit Code</li>
                <li>Unit Level</li>
                <li>Product Type</li>
                <li>Product</li>
                <li>Queue</li>
                <li>Branch</li>
              </ul>
            </li>
            <li>
              Supervisor assigns the case to a new collector who reports to
              them.
            </li>
            <li>
              System confirms reallocation and updates the case ownership.
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
            <li>Delinquent cases are classified and auto-communicated.</li>
            <li>Initial allocation must be completed.</li>
          </ul>
        </section>

        {/* Post Condition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Post Condition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Case is reallocated to a new collector.</li>
            <li>Updated in system for future collection follow-ups.</li>
          </ul>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Login → Access Manual Reallocation Screen → Select Case → Update
            Info → Assign New Collector → Save
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Bulk reallocation feature (future enhancement).</li>
            <li>Reassignment based on predefined performance metrics.</li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Attempted reassignment outside supervisor’s hierarchy.</li>
            <li>Missing mandatory case data.</li>
            <li>Queue mismatch or stale data error.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Login as Supervisor → Select Manual Reallocation → Choose
            Delinquent Case → Update & Reassign → Confirm Save → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Option to track collector performance post-reallocation.</li>
            <li>
              Integration with real-time dashboards for reassignment load
              balancing.
            </li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>UI: Manual Reallocation Screen</li>
            <li>DB Tables: Delinquent Cases, Collector Assignment Log</li>
            <li>APIs: Case Search, Collector Hierarchy Validator</li>
            <li>Services: Allocation Engine, Role-Based Access Control</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Supervisor reallocates a case successfully.</li>
            <li>System blocks unauthorized reassignment.</li>
            <li>Queue filtering works as expected.</li>
            <li>Reallocation audit is properly logged.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure real-time data refresh for delinquent queues.</li>
            <li>Access control must reflect reporting hierarchy accurately.</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <GitBranch size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Squad: Collections Workflow Team</li>
            <li>Contact: Lead Dev - delinquent_allocation@bankdomain.com</li>
            <li>JIRA: COLL-MANUAL-REALLOC-01</li>
            <li>Git Repo: /collections/manual-reallocation</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Manual_Reallocation_Use_Case;