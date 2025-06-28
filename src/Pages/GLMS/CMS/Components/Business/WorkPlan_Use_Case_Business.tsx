import React, { useState } from "react";
import {
  Info,
  Users,
  CheckCircle,
  List,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";

const WorkPlan_Use_Case_Business: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: true,
    keyComponents: true,
    workflow: true,
    purpose: true,
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
            Work Plan for Delinquent Case Prioritization and Allocation
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
                The work plan process is a key component of the Collections
                System, designed to prioritize and allocate delinquent cases to
                collectors for follow-up. Initiated after case allocation, it
                allows the supervisor to define case priorities based on
                criteria like the amount overdue. The system displays relevant
                case details, enabling informed prioritization and assignment,
                ensuring collectors focus on high-priority cases.
              </p>
            )}
          </section>

          {/* Key Components */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("keyComponents")}
              aria-expanded={expandedSections.keyComponents}
              aria-controls="key-components-section"
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-blue-600" />
                Key Components
              </span>
              {expandedSections.keyComponents ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.keyComponents && (
              <ul
                id="key-components-section"
                className="list-disc pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  <strong>Actors:</strong> Supervisor.
                </li>
                <li>
                  <strong>Pre-conditions:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Delinquent cases saved in the database.</li>
                    <li>
                      Supervisor has permission to prioritize and allocate cases
                      to collectors.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Actions:</strong> Supervisor prioritizes cases based
                  on amount overdue and assigns them to collectors.
                </li>
                <li>
                  <strong>Post-conditions:</strong> Delinquent cases are
                  allocated to collectors for follow-up.
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
              <ol
                id="workflow-section"
                className="list-decimal pl-5 text-gray-600 text-base space-y-2"
              >
                <li>
                  Supervisor initiates the work plan process after case
                  allocation.
                </li>
                <li>
                  Supervisor generates the work plan, and the system displays
                  case details:
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
                <li>
                  Supervisor reviews details, prioritizes cases based on amount
                  overdue, and allocates them to collectors.
                </li>
              </ol>
            )}
          </section>

          {/* Purpose */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("purpose")}
              aria-expanded={expandedSections.purpose}
              aria-controls="purpose-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-blue-600" />
                Purpose
              </span>
              {expandedSections.purpose ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.purpose && (
              <p
                id="purpose-section"
                className="text-gray-600 leading-relaxed text-base"
              >
                The work plan process ensures systematic prioritization and
                allocation of delinquent cases, optimizing follow-up efforts. By
                focusing on high-priority cases, it enhances resource
                allocation, improves collection outcomes, and supports
                data-driven decision-making in the Collections System.
              </p>
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
                <ClipboardList size={20} className="mr-2 text-blue-600" />
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
Start: Case Allocation Completed
   |
   v
Supervisor Initiates Work Plan
   |
   v
Generate Work Plan
   | (System Displays Case Details)
   v
Prioritize and Allocate Cases
   | (Based on Amount Overdue)
   v
End: Cases Allocated to Collectors
                `}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WorkPlan_Use_Case_Business;
