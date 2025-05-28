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

interface Define_Allocation_Use_CaseProps {}

const Define_Allocation_Use_Case: React.FC<
  Define_Allocation_Use_CaseProps
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
            Allocation of Delinquent Cases - Define Allocation
          </h1>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-8">
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
                Define Allocation for Delinquent Cases
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
                <li>Collections Admin/Supervisor (User)</li>
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
                This use case describes how a user defines or modifies
                allocation rules in the Collections System. It involves
                assigning delinquent cases to collectors based on defined rules
                and parameters.
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
                User initiates the allocation configuration process.
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
                <li>Delinquent cases are classified.</li>
                <li>
                  Cases mapped to communication templates for
                  auto-communication.
                </li>
                <li>
                  System allows modification of existing allocation rules.
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
                  Delinquent cases are successfully assigned to collectors as
                  per the defined rules.
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
                <li>User logs into the Collections System.</li>
                <li>
                  User defines or modifies allocation rules for a strategy.
                </li>
                <li>
                  User segregates cases based on due amount, default date, and
                  default percentage.
                </li>
                <li>
                  User provides rule parameters:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Strategy, Financier, Financier Type</li>
                      <li>Queue Code, Rule Code, Rule Unit Level & Code</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>
                        Unit Level & Code, % Allocation, Execution Sequence
                      </li>
                      <li>Maker ID, Making Date</li>
                    </ul>
                  </div>
                </li>
                <li>User assigns delinquent cases to collectors.</li>
                <li>User saves allocation settings for future reference.</li>
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
              <ul
                id="alternate-flows-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  User may update percentage allocation and execution sequence
                  based on priority changes.
                </li>
              </ul>
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
                  Invalid rule definitions or missing required fields result in
                  validation errors.
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
                  Allocation rules must only be created or modified by users
                  with appropriate access.
                </li>
                <li>
                  Allocation rules can only apply to strategies assigned to the
                  user’s unit or child units.
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
                  Proper data is available for allocation (queues, rules, units,
                  etc.).
                </li>
                <li>System validates rule definitions before saving.</li>
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
                  This module improves control and automation of delinquent case
                  handling through structured allocation logic.
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
Login to Collections System
   |
   v
Define/Modify Allocation Rules
   |
   v
Segregate Cases
   | (Based on Due Amount, Default Date, Percentage)
   v
Provide Rule Parameters
   |
   v
Assign Cases to Collectors
   |
   v
Save Allocation Settings
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

export default Define_Allocation_Use_Case;
