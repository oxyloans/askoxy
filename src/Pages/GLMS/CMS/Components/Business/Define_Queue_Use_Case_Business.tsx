import React, { useState } from "react";
import {
  Info,
  Users,
  CheckCircle,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Define_Queue_Use_Case_Business: React.FC = () => {
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
            Queue Definition for Delinquent Case Classification
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
                The queue definition process is a core functionality of the Collections System, triggered after the Beginning of Day (BOD) process. It focuses on classifying delinquent customers into queues based on delinquency categories, trends, or demographic and financial parameters. Known as queuing, this categorization helps collectors understand the nature of each case and select appropriate collection strategies.
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
                  </ul>
                </li>
                <li>
                  <strong>Actions:</strong> User defines the queue and maps it to a classification rule.
                </li>
                <li>
                  <strong>Post-conditions:</strong> Classification rule is mapped to the queue, enabling case allocation.
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
                <li>User defines rules for case allocation and prepares delinquent cases.</li>
                <li>
                  User specifies queue details, including:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Strategy</li>
                      <li>Financier</li>
                      <li>Financier Type (Line of Business)</li>
                      <li>Queue Code</li>
                      <li>Rule Code</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Severity</li>
                      <li>Execution Sequence</li>
                      <li>Maker ID</li>
                      <li>Making Date</li>
                    </ul>
                  </div>
                </li>
                <li>User maps the queue to a classification rule, associating it with a product and financier.</li>
                <li>User provides a description for the queue.</li>
                <li>User saves the queue details in the system for future reference.</li>
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
                The queue definition process ensures that delinquent cases are systematically categorized, allowing collectors to prioritize and manage cases effectively. By mapping queues to classification rules, the system clarifies case characteristics and supports tailored collection strategies, enhancing operational efficiency.
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
              <pre id="flowchart-section" className="bg-gray-100 p-4 rounded-lg text-base text-gray-700 font-mono overflow-x-auto border border-gray-200">
                {`
Start: BOD Process Completed
   |
   v
User Defines Allocation Rules
   |
   v
Prepare Delinquent Cases
   |
   v
Define Queue Details
   | (Strategy, Financier, Type, Codes, Severity, Sequence, Maker ID, Date)
   v
Map Queue to Classification Rule
   | (With Product and Financier)
   v
Provide Queue Description
   |
   v
Save Details in System
   |
   v
End: Queue Defined
                `}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Define_Queue_Use_Case_Business;