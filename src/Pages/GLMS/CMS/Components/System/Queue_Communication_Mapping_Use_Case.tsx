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

interface Queue_Communication_Mapping_Use_CaseProps {}

const Queue_Communication_Mapping_Use_Case: React.FC<
  Queue_Communication_Mapping_Use_CaseProps
> = () => {
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
            Queue Communication Mapping
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
                Queue Communication Mapping
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
                This use case outlines the process of mapping classified
                delinquent customer Queues with communication templates. This
                enables the automatic generation and dispatch of communication
                to customers based on the curing action defined for their
                assigned Queue.
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
                Completion of the Beginning of Day (BOD) process and initiation
                of case classification.
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
                <li>
                  Classification rules and curing actions should be defined.
                </li>
                <li>
                  Delinquent and non-delinquent customer data must be available
                  in the system.
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
                  System communicates with customers automatically as per the
                  mapped curing actions and templates for assigned Queues.
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
                  User defines the Queue by mapping classification rule with
                  product and financier.
                </li>
                <li>
                  User sets priority for the Queues using the Prioritize Queue
                  option.
                </li>
                <li>User specifies curing actions for each Queue.</li>
                <li>
                  User maps each Queue with the corresponding communication
                  template manually.
                </li>
                <li>
                  System automatically triggers communication to customers based
                  on the curing action.
                </li>
                <li>
                  User saves the Queue-communication template mapping in the
                  system.
                </li>
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
                  Communication not triggered due to missing or incorrect
                  template mapping.
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
                <li>
                  Every Queue must have at least one curing action defined.
                </li>
                <li>
                  Each curing action should be linked to an appropriate
                  communication template.
                </li>
                <li>
                  Automatic communications are dependent on the correct mapping
                  of templates.
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
                  Communication templates are predefined and available in the
                  system.
                </li>
                <li>
                  Classification and curing actions are correctly set up before
                  mapping.
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
                  Proper mapping ensures timely and accurate communication to
                  customers, improving collection efficiency.
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
Map Queue to Template
   |
   v
Trigger Communication
   |
   v
Save Mapping
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

export default Queue_Communication_Mapping_Use_Case;
