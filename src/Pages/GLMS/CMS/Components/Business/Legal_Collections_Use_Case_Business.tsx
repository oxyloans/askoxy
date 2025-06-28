import React, { useState } from "react";
import {
  Info,
  Users,
  CheckCircle,
  List,
  ChevronDown,
  ChevronUp,
  Scale,
} from "lucide-react";

const Legal_Collections_Use_Case_Business: React.FC = () => {
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
            Legal Collections Workflow
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
                The legal collections workflow is a specialized module within
                the Collections System designed to manage cases filed for legal
                action to recover overdue amounts from delinquent customers.
                This process follows predefined stages based on the lending
                institution’s policies, ensuring a structured approach to
                initiating and tracking legal proceedings. The Legal Collections
                Module allows users to document court proceedings, update
                verdicts, and manage case withdrawals.
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
                  <strong>Actors:</strong> User (collections staff or legal team
                  representative).
                </li>
                <li>
                  <strong>Pre-conditions:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Customer is classified as delinquent.</li>
                  </ul>
                </li>
                <li>
                  <strong>Actions:</strong> User initiates a legal case, sends
                  legal notices, files cases, presents evidence, and records
                  court proceedings.
                </li>
                <li>
                  <strong>Post-conditions:</strong> Court proceedings and
                  verdicts are recorded and updated in the Collections
                  Management Application.
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
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    User sends delinquent customer documents to the legal
                    collection process team and marks the case for legal
                    collection in the Collections Management Application.
                  </li>
                  <li>
                    Supervisor allocates the case to an appropriate lawyer based
                    on the delinquent customer’s details.
                  </li>
                  <li>
                    User sends a legal notice to the delinquent customer with
                    the lawyer’s assistance.
                  </li>
                  <li>
                    User (organization) files a legal case against the
                    delinquent customer.
                  </li>
                  <li>
                    User submits documents and evidence against the customer to
                    the court.
                  </li>
                  <li>
                    User records details of court proceedings and updates
                    verdicts in the Collections Management Application.
                  </li>
                </ol>
                <div className="mt-4">
                  <strong className="font-medium">Notes:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>
                      Cases can be withdrawn via the Case Withdrawal interface
                      upon mutual agreement.
                    </li>
                    <li>
                      A ‘Legal Waiver’ category prevents cases from moving to
                      legal collections.
                    </li>
                    <li>
                      Timely approvals are required, and a letter with customer,
                      contract, collateral, and follow-up details may be
                      generated.
                    </li>
                  </ul>
                </div>
              </div>
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
                The legal collections workflow ensures systematic management of
                legal actions against delinquent customers, supporting
                transparency, compliance, and effective recovery of overdue
                amounts. It provides flexibility for case withdrawals and
                waivers, enhancing operational efficiency and decision-making.
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
                <Scale size={20} className="mr-2 text-blue-600" />
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
Start: Delinquent Customer Identified
   |
   v
Send Documents to Legal Team
   | (Mark for Legal Collection)
   v
Supervisor Allocates Case to Lawyer
   |
   v
Send Legal Notice to Customer
   |
   v
File Case Against Customer
   |
   v
Present Documents and Evidence to Court
   |
   v
Record Court Proceedings and Verdicts
   |
   v
End: Details Updated in System
                `}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Legal_Collections_Use_Case_Business;
