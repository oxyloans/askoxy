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

interface Define_Queue_Use_CaseProps {}

const Define_Queue_Use_Case: React.FC<Define_Queue_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Classification of Delinquent Cases - Define Queue
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The "Define Queue" functionality is part of the classification
            process within the Collections System. Once the Beginning of Day
            (BOD) process is completed, users can define queues and map them to
            classification rules for delinquent customers. This categorization
            is essential for effective collection strategies, as it allows
            collectors to prioritize and handle cases based on severity,
            financial status, and business rules.
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
                <li>Collections Officer</li>
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
            <li>User logs into the Collections System post-BOD.</li>
            <li>Navigates to the Queue Definition section.</li>
            <li>
              Inputs the following details:
              <ul className="list-disc pl-5 mt-2">
                <li>Strategy</li>
                <li>Financier</li>
                <li>Financier Type (Line of Business)</li>
                <li>Queue Code</li>
                <li>Rule Code</li>
                <li>Severity</li>
                <li>Execution Sequence</li>
                <li>Maker ID</li>
                <li>Making Date</li>
              </ul>
            </li>
            <li>System validates the inputs.</li>
            <li>
              User maps the defined queue to a classification rule based on
              product and financier.
            </li>
            <li>Provides a description for the queue.</li>
            <li>Saves the details.</li>
            <li>System confirms successful queue creation and mapping.</li>
          </ol>
        </section>

        {/* Precondition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Precondition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Completion of the BOD process.</li>
            <li>
              Availability of delinquent and non-delinquent customer data in the
              database.
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
            <li>Queue and classification rule mapping stored in the system.</li>
            <li>Cases are ready for allocation based on defined rules.</li>
          </ul>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Login → Access Queue Definition → Input Parameters → Map to Rule →
            Save → Queue Confirmation
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Queue update or redefinition if rules change.</li>
            <li>
              Parallel definition of multiple queues for various products.
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
            <li>Invalid input format or missing mandatory fields.</li>
            <li>Attempt to map to a non-existent rule.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Login → Define Queue → Enter Details → Map Rule → Provide
            Description → Save → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Feature to bulk import queue definitions.</li>
            <li>Dynamic rule validation against delinquency trends.</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>UI: Queue Definition Form</li>
            <li>DB Tables: Queue Setup, Rule Mapping, Product Info</li>
            <li>APIs: Rule Validator, Queue Saver</li>
            <li>Services: Classification Engine, Audit Logger</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Successful creation of a queue and mapping.</li>
            <li>Missing mandatory field validation.</li>
            <li>Duplicate queue code handling.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure real-time syncing of rules for accurate mapping.</li>
            <li>Secure access controls for queue configuration.</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <GitBranch size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Squad: Collections Configuration Team</li>
            <li>Contact: Lead Dev - queue_support@bankdomain.com</li>
            <li>JIRA: COLL-QUEUE-DEFINE-01</li>
            <li>Git Repo: /collections/queue-definition</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Define_Queue_Use_Case;
