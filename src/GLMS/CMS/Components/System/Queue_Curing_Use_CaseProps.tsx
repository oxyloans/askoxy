import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Queue_Curing_Use_CaseProps {}

const Queue_Curing_Use_Case: React.FC<Queue_Curing_Use_CaseProps> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    useCaseName: true,
    actors: true,
    description: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    basicFlow: true,
    alternateFlows: true,
    exceptionFlows: true,
    businessRules: true,
    assumptions: true,
    notes: true,
    author: true,
    date: true,
    flowchart: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-blue-600 pb-4 text-center sm:text-left">
            Queue Curing
          </h1>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-6">
          {/* Use Case Name */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("useCaseName")}
              aria-expanded={expandedSections.useCaseName}
              aria-controls="use-case-name-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                Use Case Name
              </span>
              {expandedSections.useCaseName ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.useCaseName && (
              <p
                id="use-case-name-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                Queue Curing
              </p>
            )}
          </section>

          {/* Actor(s) */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
              aria-expanded={expandedSections.actors}
              aria-controls="actors-section"
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-blue-600" />
                Actor(s)
              </span>
              {expandedSections.actors ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actors && (
              <ul
                id="actors-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Collections Team Member (User)</li>
              </ul>
            )}
          </section>

          {/* Description */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("description")}
              aria-expanded={expandedSections.description}
              aria-controls="description-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Description
              </span>
              {expandedSections.description ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.description && (
              <p
                id="description-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                This use case describes the process of specifying curing actions
                for delinquent customer cases that have been classified into
                specific Queues based on parameters like delinquency category,
                trends, or demographic/financial attributes. These curing
                actions define the follow-up actions used by the system or
                manually by collectors.
              </p>
            )}
          </section>

          {/* Trigger */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("trigger")}
              aria-expanded={expandedSections.trigger}
              aria-controls="trigger-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Trigger
              </span>
              {expandedSections.trigger ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.trigger && (
              <p
                id="trigger-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                Completion of the Beginning of Day (BOD) process and Queue
                definition based on classification rules.
              </p>
            )}
          </section>

          {/* Preconditions */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("preconditions")}
              aria-expanded={expandedSections.preconditions}
              aria-controls="preconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Preconditions
              </span>
              {expandedSections.preconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.preconditions && (
              <ul
                id="preconditions-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>BOD process must be completed.</li>
                <li>Mapping of classification rules to Queues must be done.</li>
                <li>
                  Customer data (delinquent and non-delinquent) must be
                  available in the database.
                </li>
              </ul>
            )}
          </section>

          {/* Postconditions */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("postconditions")}
              aria-expanded={expandedSections.postconditions}
              aria-controls="postconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Postconditions
              </span>
              {expandedSections.postconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.postconditions && (
              <ul
                id="postconditions-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  Curing actions are successfully associated with specific
                  Queues and saved in the system for follow-up processing.
                </li>
              </ul>
            )}
          </section>

          {/* Basic Flow */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("basicFlow")}
              aria-expanded={expandedSections.basicFlow}
              aria-controls="basic-flow-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
                Basic Flow
              </span>
              {expandedSections.basicFlow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.basicFlow && (
              <ol
                id="basic-flow-section"
                className="list-decimal pl-5 text-gray-700 text-base space-y-2"
              >
                <li>
                  User defines the Queue by mapping classification rules with
                  product and financier.
                </li>
                <li>
                  User sets the priority of the defined Queues using the
                  Prioritize Queue feature.
                </li>
                <li>
                  User specifies the curing action for each Queue using details
                  like:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Strategy</li>
                      <li>Financier</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Financier Type (Line of Business)</li>
                      <li>Queue Code</li>
                      <li>Marking Date</li>
                    </ul>
                  </div>
                </li>
                <li>
                  User selects curing methods such as:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Letter generation</li>
                      <li>SMS sending</li>
                      <li>Stat card</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Tele calling</li>
                      <li>Email</li>
                    </ul>
                  </div>
                </li>
                <li>
                  System uses the specified curing actions for follow-up on
                  delinquent cases.
                </li>
                <li>User saves the curing action details in the system.</li>
              </ol>
            )}
          </section>

          {/* Alternate Flow(s) */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("alternateFlows")}
              aria-expanded={expandedSections.alternateFlows}
              aria-controls="alternate-flows-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Alternate Flow(s)
              </span>
              {expandedSections.alternateFlows ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.alternateFlows && (
              <p
                id="alternate-flows-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                None
              </p>
            )}
          </section>

          {/* Exception Flow(s) */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("exceptionFlows")}
              aria-expanded={expandedSections.exceptionFlows}
              aria-controls="exception-flows-section"
            >
              <span className="flex items-center">
                <AlertCircle size={20} className="mr-2 text-red-600" />
                Exception Flow(s)
              </span>
              {expandedSections.exceptionFlows ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.exceptionFlows && (
              <ul
                id="exception-flows-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  Incomplete or missing Queue-classification mappings can
                  prevent curing setup.
                </li>
              </ul>
            )}
          </section>

          {/* Business Rules */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("businessRules")}
              aria-expanded={expandedSections.businessRules}
              aria-controls="business-rules-section"
            >
              <span className="flex items-center">
                <Lock size={20} className="mr-2 text-blue-600" />
                Business Rules
              </span>
              {expandedSections.businessRules ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.businessRules && (
              <ul
                id="business-rules-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>Each Queue must have a defined curing strategy.</li>
                <li>
                  Multiple communication methods can be selected for a Queue.
                </li>
              </ul>
            )}
          </section>

          {/* Assumptions */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("assumptions")}
              aria-expanded={expandedSections.assumptions}
              aria-controls="assumptions-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Assumptions
              </span>
              {expandedSections.assumptions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.assumptions && (
              <ul
                id="assumptions-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  Classification rules and communication methods are
                  preconfigured and available in the system.
                </li>
              </ul>
            )}
          </section>

          {/* Notes */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("notes")}
              aria-expanded={expandedSections.notes}
              aria-controls="notes-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Notes
              </span>
              {expandedSections.notes ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.notes && (
              <ul
                id="notes-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  Properly defined curing actions ensure timely and effective
                  customer follow-up.
                </li>
              </ul>
            )}
          </section>

          {/* Author */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("author")}
              aria-expanded={expandedSections.author}
              aria-controls="author-section"
            >
              <span className="flex items-center">
                <User size={20} className="mr-2 text-blue-600" />
                Author
              </span>
              {expandedSections.author ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.author && (
              <p
                id="author-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                System Analyst
              </p>
            )}
          </section>

          {/* Date */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("date")}
              aria-expanded={expandedSections.date}
              aria-controls="date-section"
            >
              <span className="flex items-center">
                <Calendar size={20} className="mr-2 text-blue-600" />
                Date
              </span>
              {expandedSections.date ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.date && (
              <p
                id="date-section"
                className="text-gray-700 leading-relaxed text-base"
              >
                2025-05-03
              </p>
            )}
          </section>

          {/* Flowchart */}
          <section>
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("flowchart")}
              aria-expanded={expandedSections.flowchart}
              aria-controls="flowchart-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
                Flowchart
              </span>
              {expandedSections.flowchart ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.flowchart && (
              <pre
                id="flowchart-section"
                className="bg-gray-100 p-4 rounded-lg text-base text-gray-700 font-mono overflow-x-auto border border-gray-200"
              >
                {`
Start
   |
   v
Define Queue
   |
   v
Set Queue Priorities
   |
   v
Specify Curing Actions
   |
   v
Select Curing Methods
   |
   v
Apply Curing Actions
   |
   v
Save Curing Details
   |
   v
End
                `}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Queue_Curing_Use_Case;
