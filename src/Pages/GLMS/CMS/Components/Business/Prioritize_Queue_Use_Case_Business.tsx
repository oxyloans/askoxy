import React, { useState } from "react";
import {
  Info,
  Users,
  CheckCircle,
  List,
  ChevronDown,
  ChevronUp,
  ArrowUpCircle,
} from "lucide-react";

const Prioritize_Queue_Use_Case_Business: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
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
            Queue Prioritization for Delinquent Case Classification
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
              <p id="overview-section" className="text-gray-600 leading-relaxed text-base">
                The queue prioritization process is an essential feature of the Collections System, initiated after the Beginning of Day (BOD) process and queue classification. It allows users to set the priority of defined queues, ensuring that cases qualifying for multiple queues are assigned to the highest-priority queue. This process helps collectors focus on critical cases and align collection strategies with organizational priorities.
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
              <ul id="key-components-section" className="list-disc pl-5 text-gray-600 text-base space-y-2">
                <li>
                  <strong>Actors:</strong> User (system operator or collections staff).
                </li>
                <li>
                  <strong>Pre-conditions:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>BOD process completed.</li>
                    <li>Details of delinquent and non-delinquent customers available in the database.</li>
                    <li>Classification rules mapped to queues.</li>
                  </ul>
                </li>
                <li>
                  <strong>Actions:</strong> User prioritizes the defined queues by setting their execution sequence.
                </li>
                <li>
                  <strong>Post-conditions:</strong> Queues are prioritized, ensuring cases are assigned to the highest-priority queue.
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
              <ol id="workflow-section" className="list-decimal pl-5 text-gray-600 text-base space-y-2">
                <li>User defines the queue by mapping a classification rule to a product and financier.</li>
                <li>User sets the priority for the various defined queues.</li>
                <li>
                  User specifies prioritize queue details, including:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Strategy</li>
                      <li>Financier</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Financier Type (Line of Business)</li>
                      <li>Queue Code</li>
                      <li>Making Date</li>
                    </ul>
                  </div>
                </li>
                <li>User defines the execution sequence to set the priority order of the queues.</li>
                <li>User saves the prioritization details in the system for future reference.</li>
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
              <p id="purpose-section" className="text-gray-600 leading-relaxed text-base">
                The queue prioritization process ensures that cases are assigned to the most appropriate queue based on priority, optimizing resource allocation and improving recovery outcomes. It supports collectors in focusing on high-priority cases and aligns collection strategies with organizational priorities, enhancing efficiency.
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
                <ArrowUpCircle size={20} className="mr-2 text-blue-600" />
                Flowchart
              </span>
              {expandedSections.flowchart ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.flowchart && (
              <pre id="flowchart-section" className="bg-gray-100 p-4 rounded-lg text-base text-gray-700 font-mono overflow-x-auto border border-gray-200">
                {`
Start: BOD Process Completed
   |
   v
Map Classification Rule to Queue
   | (With Product and Financier)
   v
Set Priority for Queues
   |
   v
Specify Prioritize Queue Details
   | (Strategy, Financier, Type, Code, Date)
   v
Define Execution Sequence
   |
   v
Save Prioritization Details
   |
   v
End: Queues Prioritized
                `}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Prioritize_Queue_Use_Case_Business;