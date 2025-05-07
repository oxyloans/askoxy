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

interface WF_NPA_Grading_Use_CaseProps {}

const WF_NPA_Grading_Use_Case: React.FC<WF_NPA_Grading_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        WF_NPA_Grading
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The NPA Grading module in the Financial Management System (FMS)
            enables users to assign risk grades to finance accounts based on
            repayment behavior. This grading supports risk assessment, credit
            monitoring, and financial reporting by identifying delinquent
            clients and classifying loans by risk category. Grading decisions
            are management-driven and may vary by product.
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
              <li>Risk Officer / Credit Admin</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Financial Management System (FMS)</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Stakeholders</h3>
            <ul className="list-disc pl-5">
              <li>Risk Management</li>
              <li>Credit Committee</li>
              <li>Finance Department</li>
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
            <li>User logs into FMS and accesses the Finance Grading screen.</li>
            <li>
              Selects a finance account and defines its NPA stage (e.g.,
              Standard, Sub-standard, Doubtful, Loss).
            </li>
            <li>
              Specifies movement direction:
              <ul className="list-disc pl-5 mt-2">
                <li>Forward Movement (to higher risk stage)</li>
                <li>Backward Movement (to lower risk stage)</li>
              </ul>
            </li>
            <li>
              If grading manually, user inputs:
              <ul className="list-disc pl-5 mt-2">
                <li>Agreement ID</li>
                <li>New NPA Stage</li>
                <li>Remarks</li>
                <li>NPA Change Date</li>
                <li>Current NPA Stage</li>
                <li>Final NPA Stage</li>
                <li>NPA Reason</li>
              </ul>
            </li>
            <li>Saves the grading record.</li>
            <li>System updates NPA status accordingly.</li>
          </ol>
        </section>
        {/* Precondition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Precondition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Finance account must be flagged for NPA evaluation.</li>
            <li>User has grading privileges.</li>
          </ul>
        </section>
        {/* Post Condition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Post Condition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>NPA grading is updated in the system.</li>
          </ul>
        </section>
        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Login → Navigate to Grading Screen → Define NPA Stage → Save Grading
            → Logout
          </p>
        </section>
        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Automatic grading based on DPD (Days Past Due) thresholds.</li>
            <li>Batch processing for bulk account grading.</li>
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
            <li>Unauthorized grading attempt.</li>
            <li>Missing or inconsistent NPA parameters.</li>
          </ul>
        </section>
        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Login → Select Finance → Input Grading Details → Save Entry
            → NPA Grading Complete → End
          </p>
        </section>
        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Integration with credit risk scoring systems.</li>
            <li>Dashboard for NPA trend visualization.</li>
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
              <li>NPA Grading Screen</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">DB Tables</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Finance Accounts</li>
              <li>NPA History Log</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">APIs</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>DPD Calculator</li>
              <li>Grading Engine</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">Services</h3>
            <ul className="list-disc pl-5">
              <li>Workflow Tracker</li>
              <li>Audit Logger</li>
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
            <li>Manual grading for valid accounts.</li>
            <li>Regrading from Sub-standard to Standard.</li>
            <li>Auto-grading from DPD over 90 to Doubtful.</li>
            <li>Save failure on missing NPA reason.</li>
          </ul>
        </section>
        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure audit trails for manual grading.</li>
            <li>DPD calculation to align with holiday calendar logic.</li>
          </ul>
        </section>
        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Credit Risk & Provisioning Team
            <br />
            Contact: Lead Dev - npa_fms@bankdomain.com
            <br />
            JIRA: WF-NPA-GRADING-01
            <br />
            Git Repo: /fms/npa/grading
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_NPA_Grading_Use_Case;