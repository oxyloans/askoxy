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

interface Work_Plan_Use_CaseProps {}

const Work_Plan_Use_Case: React.FC<Work_Plan_Use_CaseProps> = () => {
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
            Work Plan
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
                Work Plan
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
                <li>Supervisor</li>
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
                This use case defines the process of prioritizing and assigning
                delinquent cases to collectors. Supervisors generate the Work
                Plan which outlines the follow-up activities to be performed by
                collectors. The plan includes detailed information about each
                case to assist in the follow-up process.
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
                Completion of delinquent case allocation to collectors.
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
                <li>Delinquent cases are saved in the system database.</li>
                <li>
                  The system allows the Supervisor to prioritize and assign
                  cases.
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
                  Work Plan is generated and cases are allocated to collectors
                  for follow-up.
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
                  Supervisor accesses the system to generate the Work Plan.
                </li>
                <li>
                  The system displays a list of delinquent cases with relevant
                  details including:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Loan Account</li>
                      <li>Customer Name</li>
                      <li>Financier Type</li>
                      <li>Product</li>
                      <li>Amount Overdue</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Principal Outstanding</li>
                      <li>Late Fee</li>
                      <li>Installment Overdue</li>
                      <li>Remarks</li>
                    </ul>
                  </div>
                </li>
                <li>Supervisor reviews the case details.</li>
                <li>
                  Supervisor defines the priority of cases based on amount
                  overdue and other parameters.
                </li>
                <li>Supervisor assigns prioritized cases to collectors.</li>
                <li>
                  Collector performs follow-up actions using the provided Work
                  Plan.
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
                  Missing or incomplete case details may prevent generation of
                  the Work Plan.
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
                  Priority should be defined based on amount overdue and case
                  criticality.
                </li>
                <li>
                  Each collector must receive a balanced number of cases based
                  on their capacity.
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
                  Supervisor has system access and authority to assign cases.
                </li>
                <li>Collector follows the Work Plan for timely follow-ups.</li>
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
                  The Work Plan is crucial for efficient collection and tracking
                  of delinquent accounts.
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
Access System
   |
   v
Display Case Details
   |
   v
Review Case Details
   |
   v
Define Case Priorities
   |
   v
Assign Cases to Collectors
   |
   v
Perform Follow-up Actions
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

export default Work_Plan_Use_Case;
