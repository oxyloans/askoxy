import React from "react";
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
} from "lucide-react";

interface Work_Plan_Use_CaseProps {}

const Work_Plan_Use_Case: React.FC<Work_Plan_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Work Plan
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Use Case Name */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Use Case Name
          </h2>
          <p className="text-gray-700 leading-relaxed">Work Plan</p>
        </section>

        {/* Actor(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actor(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Supervisor</li>
          </ul>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case defines the process of prioritizing and assigning
            delinquent cases to collectors. Supervisors generate the work plan
            which outlines the follow-up activities to be performed by
            collectors. The plan includes detailed information about each case
            to assist in the follow-up process.
          </p>
        </section>

        {/* Trigger */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Trigger
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Completion of delinquent case allocation to collectors.
          </p>
        </section>

        {/* Preconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Preconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Delinquent cases are saved in the system database.</li>
            <li>
              The system allows the supervisor to prioritize and assign cases.
            </li>
          </ul>
        </section>

        {/* Postconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Postconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Work plan is generated and cases are allocated to collectors for
              follow-up.
            </li>
          </ul>
        </section>

        {/* Basic Flow */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Basic Flow
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>Supervisor accesses the system to generate the work plan.</li>
            <li>
              The system displays a list of delinquent cases with relevant
              details including:
              <ul className="list-disc pl-5 mt-2">
                <li>Loan Account</li>
                <li>Customer Name</li>
                <li>Financialer Type</li>
                <li>Product</li>
                <li>Amount Overdue</li>
                <li>Principal Outstanding</li>
                <li>Late Fee</li>
                <li>Installment Overdue</li>
                <li>Remarks</li>
              </ul>
            </li>
            <li>Supervisor reviews the case details.</li>
            <li>
              Supervisor defines the priority of cases based on amount overdue
              and other parameters.
            </li>
            <li>Supervisor assigns prioritized cases to collectors.</li>
            <li>
              Collector performs follow-up actions using the provided work plan.
            </li>
          </ol>
        </section>

        {/* Alternate Flow(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternate Flow(s)
          </h2>
          <p className="text-gray-700 leading-relaxed">None</p>
        </section>

        {/* Exception Flow(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flow(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Missing or incomplete case details may prevent generation of the
              work plan.
            </li>
          </ul>
        </section>

        {/* Business Rules */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Lock size={18} className="mr-2 text-blue-600" />
            Business Rules
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Priority should be defined based on amount overdue and case
              criticality.
            </li>
            <li>
              Each collector must receive a balanced number of cases based on
              their capacity.
            </li>
          </ul>
        </section>

        {/* Assumptions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Assumptions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Supervisor has system access and authority to assign cases.</li>
            <li>Collector follows the work plan for timely follow-ups.</li>
          </ul>
        </section>

        {/* Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              The work plan is crucial for efficient collection and tracking of
              delinquent accounts.
            </li>
          </ul>
        </section>

        {/* Author */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Author
          </h2>
          <p className="text-gray-700 leading-relaxed">System Analyst</p>
        </section>

        {/* Date */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Calendar size={18} className="mr-2 text-blue-600" />
            Date
          </h2>
          <p className="text-gray-700 leading-relaxed">2025-05-03</p>
        </section>
      </div>
    </main>
  );
};

export default Work_Plan_Use_Case;
