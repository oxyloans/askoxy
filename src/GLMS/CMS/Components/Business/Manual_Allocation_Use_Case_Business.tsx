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

const Manual_Allocation_Use_Case_Business: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
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
            Manual Allocation for Delinquent Customers
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white p-6 rounded-xl shadow">
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
                The Manual Allocation option is used to allocate classified cases that have not been assigned to any units in the system. The User can search for cases using search parameters and perform bulk or selective manual allocation of cases displayed in the results. The User selects the Unit Level and Unit Code to which cases will be allocated. Only the Unit Level and Unit Code under the logged-in user are displayed in the List of Values (LoV). The User can allocate cases in Bulk or Selective mode for the selected unit.
              </p>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow">
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
              <ul id="actors-section" className="list-disc pl-5 text-gray-600 text-base">
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
              <ul id="actions-section" className="list-disc pl FK actions-section">
                <li>
                  User segregates delinquent cases based on criteria such as Amount Overdue and Bucket, modifies the details if required, and assigns to a Collector.
                </li>
              </ul>
            )}
          </section>

          {/* Preconditions */}
          <section className="bg-white p-6 rounded-xl shadow">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("preconditions")}
              aria-expanded={expandedSections.preconditions}
              aria-controls="preconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-blue-600" />
                Preconditions
              </span>
              {expandedSections.preconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.preconditions && (
              <ul id="preconditions-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>The allocations have already been defined.</li>
              </ul>
            )}
          </section>

          {/* Post Conditions */}
          <section className="bg-white p-6 rounded-xl shadow">
            <button
              className="w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200"
              onClick={() => toggleSection("postconditions")}
              aria-expanded={expandedSections.postconditions}
              aria-controls="postconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-blue-600" />
                Post Conditions
              </span>
              {expandedSections.postconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.postconditions && (
              <ul id="postconditions-section" className="list-disc pl-5 text-gray-600 text-base">
                <li>Delinquent cases are assigned to a Collector.</li>
              </ul>
            )}
          </section>

          {/* Workflow */}
          <section className="bg-white p-6 rounded-xl shadow">
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
                  <li>User defines the rules in allocation and maps the queue with the allocation rule.</li>
                  <li>
                    User allots the delinquent case to the Collector by providing details such as:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc pl-5">
                        <li>Loan No./Account No</li>
                        <li>Customer Name</li>
                        <li>Customer ID</li>
                        <li>Card No.</li>
                      </ul>
                      <ul className="list-disc pl-5">
                        <li>Days Past Due (No. of installments due)</li>
                        <li>Financier (Vendor)</li>
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
                    User selects the Unit Level and Unit Code for bulk or selective manual allocation of cases not previously allotted to any Collector.
                  </li>
                  <li>
                    User selects delinquent cases from the list and allocates them to the Collector based on the percentage of allocation and priority.
                  </li>
                  <li>User saves the manually made allocation in the system for future reference.</li>
                </ul>
              </div>
            )}
          </section>

          {/* Flowchart */}
          <section className="bg-white p-6 rounded-xl shadow">
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
Start
  |
  v
Allocation rules defined
  |
  v
User defines rules and maps queue to allocation rule
  |
  v
User searches for unallocated delinquent cases using:
- Amount Overdue
- Bucket
  |
  v
User selects Unit Level and Unit Code from LoV
  |
  v
User performs allocation:
- Bulk: Allocate all cases in search results
- Selective: Check boxes for specific finance accounts
  |
  v
User assigns cases to Collector with details:
- Loan No./Account No
- Customer Name
- Customer ID
- Card No.
- Days Past Due
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
User sets allocation percentage and priority
  |
  v
User saves allocation details in system
  |
  v
Delinquent cases assigned to Collector
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

export default Manual_Allocation_Use_Case_Business;