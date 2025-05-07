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
  User,
  Calendar,
} from "lucide-react";

interface Queue_Curing_Use_CaseProps {}

const Queue_Curing_Use_Case: React.FC<Queue_Curing_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Queue Curing
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Use Case Name */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Use Case Name
          </h2>
          <p className="text-gray-700 leading-relaxed">Queue Curing</p>
        </section>

        {/* Actor(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actor(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>User (Collections System user)</li>
          </ul>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process of specifying curing actions for
            delinquent customer cases that have been classified into specific
            queues based on parameters like delinquency category, trends, or
            demographic/financial attributes. These curing actions define the
            follow-up actions used by the system or manually by collectors.
          </p>
        </section>

        {/* Trigger */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Trigger
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Completion of the BOD process and queue definition based on
            classification rules.
          </p>
        </section>

        {/* Preconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Preconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>BOD process must be completed.</li>
            <li>Mapping of classification rules to queues must be done.</li>
            <li>
              Customer data (delinquent and non-delinquent) must be available in
              the database.
            </li>
          </ul>
        </section>

        {/* Postconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Postconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Curing actions are successfully associated with specific queues
              and saved in the system for follow-up processing.
            </li>
          </ul>
        </section>

        {/* Basic Flow */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Basic Flow
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              User defines the queue by mapping classification rules with
              product and financier.
            </li>
            <li>
              User sets the priority of the defined queues using the Prioritize
              Queue feature.
            </li>
            <li>
              User specifies the curing action for each queue using details
              like:
              <ul className="list-disc pl-5 mt-2">
                <li>Strategy</li>
                <li>Financier</li>
                <li>Financier Type (Line of Business)</li>
                <li>Queue Code</li>
                <li>Making Date</li>
              </ul>
            </li>
            <li>
              User selects curing methods such as:
              <ul className="list-disc pl-5 mt-2">
                <li>Letter generation</li>
                <li>SMS sending</li>
                <li>Stat card</li>
                <li>Tele calling</li>
                <li>Email</li>
              </ul>
            </li>
            <li>
              System uses the specified curing actions for follow-up on
              delinquent cases.
            </li>
            <li>User saves the curing action details in the system.</li>
          </ol>
        </section>

        {/* Alternate Flow(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternate Flow(s)
          </h2>
          <p className="text-gray-700 leading-relaxed">None</p>
        </section>

        {/* Exception Flow(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flow(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Incomplete or missing queue-classification mappings can prevent
              curing setup.
            </li>
          </ul>
        </section>

        {/* Business Rules */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Lock size={18} className="mr-2 text-blue-600" />
            Business Rules
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Each queue must have a defined curing strategy.</li>
            <li>Multiple communication methods can be selected for a queue.</li>
          </ul>
        </section>

        {/* Assumptions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Assumptions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Classification rules and communication methods are preconfigured
              and available in the system.
            </li>
          </ul>
        </section>

        {/* Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Properly defined curing actions ensure timely and effective
              customer follow-up.
            </li>
          </ul>
        </section>

        {/* Author */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Author
          </h2>
          <p className="text-gray-700 leading-relaxed">System Analyst</p>
        </section>

        {/* Date */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Calendar size={18} className="mr-2 text-blue-600" />
            Date
          </h2>
          <p className="text-gray-700 leading-relaxed">2025-05-03</p>
        </section>
      </div>
    </main>
  );
};

export default Queue_Curing_Use_Case;
