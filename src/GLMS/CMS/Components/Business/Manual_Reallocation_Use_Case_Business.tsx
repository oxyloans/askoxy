import React, { useState } from "react";
import {
  Info,
  Users,
  CheckCircle,
  ChevronRight,
  List,
  ChevronDown,
  ChevronUp,
  Repeat,
} from "lucide-react";

const Manual_Reallocation_Use_Case_Business: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: true,
    actors: true,
    actions: true,
    preconditions: true,
    postconditions: true,
    workflow: true,
    flowchart: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-blue-600 pb-4 text-center sm:text-left">
            Manual Reallocation for Delinquent Customers
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("overview")}
              aria-expanded={expandedSections.overview}
              aria-controls="overview-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-blue-600" />
                Overview
              </span>
              {expandedSections.overview ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.overview && (
              <p
                id="overview-section"
                className="text-gray-600 leading-relaxed text-base"
              >
                Manual reallocation is used to reallocate cases to another
                Collector who can handle them more effectively than the current
                Collector. The Collections System facilitates this through the
                Manual Reallocation screen. Supervisors can only reallocate
                cases of users reporting to them.
              </p>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
              aria-expanded={expandedSections.actors}
              aria-controls="actors-section"
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-blue-600" />
                Actors
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
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>User (Supervisor)</li>
              </ul>
            )}
          </section>

          {/* Actions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("actions")}
              aria-expanded={expandedSections.actions}
              aria-controls="actions-section"
            >
              <span className="flex items-center">
                <ChevronRight size={20} className="mr-2 text-blue-600" />
                Actions
              </span>
              {expandedSections.actions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actions && (
              <ul
                id="actions-section"
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  User can reallocate cases to another Collector who can handle
                  them more effectively than the current Collector.
                </li>
              </ul>
            )}
          </section>

          {/* Preconditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
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
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  Delinquent cases are classified and mapped to communication
                  templates for auto-communication.
                </li>
                <li>Case allocation has been completed.</li>
              </ul>
            )}
          </section>

          {/* Post Conditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("postconditions")}
              aria-expanded={expandedSections.postconditions}
              aria-controls="postconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Post Conditions
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
                className="list-disc pl-5 text-gray-600 text-base"
              >
                <li>
                  Delinquent case is reassigned to another Collector who can
                  handle it more effectively than the existing Collector.
                </li>
              </ul>
            )}
          </section>

          {/* Workflow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("workflow")}
              aria-expanded={expandedSections.workflow}
              aria-controls="workflow-section"
            >
              <span className="flex items-center">
                <List size={20} className="mr-2 text-blue-600" />
                Workflow
              </span>
              {expandedSections.workflow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.workflow && (
              <div id="workflow-section" className="text-gray-600 text-base">
                <ul className="list-decimal pl-5 space-y-2">
                  <li>
                    If allotted cases are not closed properly, the Supervisor
                    may reallocate them to a new Collector who can handle them
                    effectively, limited to users reporting to the Supervisor.
                  </li>
                  <li>
                    The User updates the following details before reassigning to
                    a new Collector, if required:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc pl-5">
                        <li>Loan No./Account No</li>
                        <li>Customer Name</li>
                        <li>Customer ID</li>
                        <li>Card No.</li>
                      </ul>
                      <ul className="list-disc pl-5">
                        <li>Overdue Position</li>
                        <li>Financier</li>
                        <li>Financier Type (Line of Business)</li>
                        <li>Rule Unit Code</li>
                      </ul>
                      <ul className="list-disc pl-5">
                        <li>Unit Level</li>
                        <li>Product Type</li>
                        <li>Product</li>
                        <li>Queue</li>
                        <li>Branch</li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    The system displays delinquent cases based on the defined
                    queue.
                  </li>
                  <li>
                    The User selects delinquent cases, provides the percentage
                    of allocation, specifies priority, and assigns them to a new
                    Collector who handles more efficiently and reports to the
                    Supervisor.
                  </li>
                  <li>
                    The User saves the reallocation details in the system for
                    future reference.
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* Flowchart */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("flowchart")}
              aria-expanded={expandedSections.flowchart}
              aria-controls="flowchart-section"
            >
              <span className="flex items-center">
                <Repeat size={20} className="mr-2 text-blue-600" />
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
Delinquent cases classified and mapped to communication templates
Initial case allocation completed
  |
  v
User defines delinquent cases based on allocation rules
  |
  v
System displays delinquent cases by defined queue
  |
  v
Cases not closed properly?
  |
  v
User updates case details if required:
- Loan No./Account No
- Customer Name
- Customer ID
- Card No.
- Overdue Position
- Financier
- Financier Type
- Rule Unit Code
- Unit Level
- Product Type
- Product
- Queue
- Branch
  |
  v
User selects cases for reallocation
  |
  v
User sets allocation percentage and priority
  |
  v
User reassigns cases to new Collector who:
- Handles more effectively
- Reports to Supervisor
  |
  v
User saves reallocation details in system
  |
  v
Delinquent cases reassigned to new Collector
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

export default Manual_Reallocation_Use_Case_Business;
