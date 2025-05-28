import React, { useState } from "react";
import {
  Info,
  Users,
  CheckCircle,
  ChevronRight,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Define_Allocation_Use_Case_Business: React.FC = () => {
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
            Define Allocation for Delinquent Customers
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
                Allocation is a process where the system assigns the cases of a
                particular queue to a unit defined in the system. The
                Collections System allows the user to define new allocation
                rules and modify existing allocations for the selected strategy.
                The user can view or modify only those allocation rules which
                are either defined by them or by their child units.
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
                <li>User</li>
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
                  User segregates the delinquent cases based on criteria such as
                  due amount, default date, and default percentage, modifies the
                  details if needed, and assigns to a Collector.
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
                  Delinquent cases are classified and mapped to the
                  communication templates for auto communication.
                </li>
                <li>
                  System should allow modifications to existing allocations.
                </li>
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
                <li>Delinquent case is assigned to a Collector.</li>
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
                    User defines the rules in allocation and prepares the
                    delinquent case.
                  </li>
                  <li>
                    User maps the delinquent case to the Collector by providing
                    the following details:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc pl-5">
                        <li>Strategy</li>
                        <li>Financier</li>
                        <li>Financier Type</li>
                        <li>Queue Code</li>
                      </ul>
                      <ul className="list-disc pl-5">
                        <li>Rule Code</li>
                        <li>Rule Unit Level</li>
                        <li>Rule Unit Code</li>
                        <li>Unit Level</li>
                      </ul>
                      <ul className="list-disc pl-5">
                        <li>Unit Code</li>
                        <li>% Age Allocation</li>
                        <li>Execution Sequence</li>
                        <li>Maker ID</li>
                        <li>Making Date</li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    User provides the percentage of allocation and specifies the
                    priority.
                  </li>
                  <li>
                    User saves the details in the system for future reference.
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
Delinquent cases classified and mapped to communication templates
System allows modifications to existing allocations
  |
  v
User defines allocation rules based on:
- Due Amount
- Default Date
- Default Percentage
  |
  v
User maps delinquent case to Collector with details:
- Strategy
- Financier
- Financier Type
- Queue Code
- Rule Code
- Rule Unit Level
- Rule Unit Code
- Unit Level
- Unit Code
- % Age Allocation
- Execution Sequence
- Maker ID
- Making Date
  |
  v
User sets allocation percentage and priority
  |
  v
User saves details in the system
  |
  v
Delinquent case assigned to Collector
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

export default Define_Allocation_Use_Case_Business;
