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

interface Prioritize_Queue_Use_CaseProps {}

const Prioritize_Queue_Use_Case: React.FC<
  Prioritize_Queue_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Prioritizing a Queue
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Use Case Name */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Use Case Name
          </h2>
          <p className="text-gray-700 leading-relaxed">Prioritizing a Queue</p>
        </section>

        {/* Actor(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actor(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>User (Collections team member)</li>
          </ul>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process of prioritizing queues in the
            Collections System. Queues are created based on classification rules
            for delinquent accounts, and prioritization ensures that if a case
            qualifies for multiple queues, it is assigned to the one with the
            highest priority.
          </p>
        </section>

        {/* Trigger */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Trigger
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Completion of the Beginning of Day (BOD) process and availability of
            delinquent customer details.
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
            <li>Classification rules must be mapped to queues.</li>
          </ul>
        </section>

        {/* Postconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Postconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Queues are prioritized and stored in the system.</li>
            <li>Cases are routed to queues based on defined priorities.</li>
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
              User defines queues by mapping classification rules to products
              and financiers.
            </li>
            <li>User sets the priority for each defined queue.</li>
            <li>
              User provides the following details for each queue:
              <ul className="list-disc pl-5 mt-2">
                <li>Strategy</li>
                <li>Financier</li>
                <li>Financier Type (Line of Business)</li>
                <li>Queue Code</li>
                <li>Making Date</li>
              </ul>
            </li>
            <li>User provides execution sequence to establish priority.</li>
            <li>User saves the queue prioritization data in the system.</li>
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
            <li>Queue creation fails due to missing classification mapping.</li>
            <li>Invalid data inputs for queue configuration.</li>
          </ul>
        </section>

        {/* Business Rules */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Lock size={18} className="mr-2 text-blue-600" />
            Business Rules
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Cases must be assigned to the highest priority queue if they
              qualify for multiple queues.
            </li>
            <li>
              Each queue must be associated with a valid strategy and financier.
            </li>
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
              Classification rules and product-financier mappings are available
              in the system.
            </li>
            <li>
              System supports execution sequence for prioritization logic.
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
              This process helps streamline collection efforts by ensuring
              strategic alignment of case assignment.
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

export default Prioritize_Queue_Use_Case;
