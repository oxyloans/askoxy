import React, { useState } from "react";
import {
  Info,
  Users,
  CheckCircle,
  ChevronRight,
  List,
  ChevronDown,
  ChevronUp,
  Phone,
} from "lucide-react";

const Contact_Recording_Business: React.FC = () => {
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
            Contact Recording for Delinquent Case Follow-Up
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
                The contact recording process is a critical feature of the Collections System, designed to document interactions between users (typically tele-callers or collectors) and delinquent customers. This process is initiated after the supervisor prioritizes and allocates cases through the work list process. The Contact Recording menu option enables users to log details of follow-up actions and contacts, ensuring a structured and transparent approach to managing delinquent cases.
              </p>
            )}
          </section>

          {/* Key Components */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("keyComponents")}
              aria-expanded={expandedSections.keyComponents}
              aria-controls="keyComponents-section"
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
              <ul id="keyComponents-section" className="list-disc pl-5 text-gray-600 text-base space-y-2">
                <li>
                  <strong>Actors:</strong> User (tele-caller or collector).
                </li>
                <li>
                  <strong>Pre-conditions:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Delinquent cases are saved in the database.</li>
                    <li>Supervisor has prioritized and allocated cases to the collector.</li>
                    <li>System allows recording of follow-up action details.</li>
                  </ul>
                </li>
                <li>
                  <strong>Actions:</strong> User contacts the delinquent customer and records the interaction in the system.
                </li>
                <li>
                  <strong>Post-conditions:</strong> Action details are saved in the system, enabling further processing.
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
                <li>Supervisor prioritizes cases based on the Amount Overdue Method and allocates them to the collector.</li>
                <li>User initiates the follow-up process for allocated cases.</li>
                <li>
                  User opens the customer details page, viewing:
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Customer communication details</li>
                      <li>Co-applicant/Guarantor details</li>
                      <li>Collateral details</li>
                      <li>Payments details</li>
                      <li>Repayment schedule details</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Loan statement details</li>
                      <li>Foreclosure details</li>
                      <li>Follow-up details</li>
                      <li>Allocation history report</li>
                      <li>Legal case details</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Expense details</li>
                      <li>Disbursal details</li>
                      <li>Deposit details</li>
                      <li>Finance details</li>
                      <li>Allocation details</li>
                      <li>Overdue details</li>
                      <li>Account summary details</li>
                    </ul>
                  </div>
                </li>
                <li>
                  User contacts the customer using curing actions:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Letter generation</li>
                      <li>SMS sending</li>
                      <li>Stat Card</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Tele Calling</li>
                      <li>Email</li>
                    </ul>
                  </div>
                </li>
                <li>
                  User records follow-up details in the system, including:
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <ul className="list-disc pl-5">
                      <li>Action date</li>
                      <li>Action start time</li>
                      <li>Action type</li>
                      <li>Contact mode</li>
                      <li>Person contacted</li>
                    </ul>
                    <ul className="list-disc pl-5">
                      <li>Place contacted</li>
                      <li>Next action date and time</li>
                      <li>Reminder mode</li>
                      <li>Contacted by</li>
                      <li>Remarks</li>
                    </ul>
                  </div>
                </li>
                <li>User saves the details and proceeds with further processes.</li>
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
                <ChevronDown size="20" className="text-gray-600" />
              )}
            </button>
            {expandedSections.purpose && (
              <p id="purpose-section" className="text-gray-600 leading-relaxed text-base">
                The contact recording process ensures that all interactions with delinquent customers are thoroughly documented, enabling efficient case tracking, follow-up management, and strategic decision-making. By maintaining detailed records of actions taken, the system supports supervisors and collectors in prioritizing cases, monitoring progress, and optimizing collection efforts.
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
                <Phone size={20} className="mr-2 text-blue-600" />
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
Start: Cases Allocated
   |
   v
Supervisor Prioritizes Cases
   | (Amount Overdue Method)
   v
User Initiates Follow-Up
   |
   v
Open Customer Details Page
   | (View Communication, Loan, Legal, etc.)
   v
Contact Customer
   | (Letter, SMS, Call, Email, Stat Card)
   v
Record Follow-Up Details
   | (Action Date, Type, Contact Mode, Remarks, etc.)
   v
Save Details in System
   |
   v
Proceed with Further Process
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

export default Contact_Recording_Business;