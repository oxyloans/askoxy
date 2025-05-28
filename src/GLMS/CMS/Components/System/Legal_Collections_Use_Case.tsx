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

interface Legal_Collections_Use_CaseProps {}

const Legal_Collections_Use_Case: React.FC<
  Legal_Collections_Use_CaseProps
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
            Legal Collections Workflow
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
                Legal Collections Workflow
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
                <li>
                  Legal Collections Team Member, Collections Admin/Supervisor,
                  Lawyer
                </li>
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
                This use case defines the process followed in the Legal
                Collections module to initiate and manage legal cases against
                delinquent customers. It involves steps from document
                submission, lawyer assignment, legal notice issuance, case
                filing, to court proceeding updates in the Collections
                Management application.
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
                A customer account is identified as delinquent and qualifies for
                legal action as per the lending institution’s policy.
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
                <li>The customer must be marked as delinquent.</li>
                <li>
                  Relevant documentation for initiating legal action must be
                  available.
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
                  Legal case is filed and tracked in the Collections Management
                  system.
                </li>
                <li>Court proceedings and verdicts are recorded.</li>
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
                  User sends delinquent customer documents to the Legal
                  Collections team and marks the case for Legal Collections.
                </li>
                <li>
                  Collections Admin/Supervisor assigns the case to an
                  appropriate lawyer.
                </li>
                <li>
                  User, with the help of the lawyer, sends a legal notice to the
                  customer.
                </li>
                <li>
                  Organization files a legal case and submits documentation to
                  the court.
                </li>
                <li>
                  User records details of court proceedings and updates system
                  with verdict.
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
              <ul
                id="alternate-flows-section"
                className="list-disc pl-5 text-gray-700 text-base"
              >
                <li>
                  Case Withdrawal: If the case is resolved mutually, the user
                  withdraws the case through the Case Withdrawal interface.
                </li>
                <li>
                  Legal Waiver: If a legal waiver is approved, the case does not
                  proceed to Legal Collections.
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
                <li>Case not allocated due to missing documents.</li>
                <li>
                  Legal notice not delivered due to incorrect contact
                  information.
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
                  Only delinquent customers are eligible for legal proceedings.
                </li>
                <li>
                  Legal Waiver marked cases must not be forwarded to the Legal
                  Collections team.
                </li>
                <li>
                  Legal notices must be generated with complete case and
                  customer details.
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
                  Legal module is integrated with the Collections Management
                  application.
                </li>
                <li>
                  Collections Admin/Supervisor and User roles are clearly
                  defined in the system.
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
                  Timely approvals are required to initiate legal proceedings.
                </li>
                <li>
                  Follow-up and documentation are essential for successful case
                  tracking.
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
Mark Case for Legal Collections
   |
   v
Assign Case to Lawyer
   |
   v
Send Legal Notice
   |
   v
File Legal Case
   |
   v
Record Court Proceedings
   |
   v
Update Verdict
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

export default Legal_Collections_Use_Case;
