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

interface Define_Allocation_Use_CaseProps {}

const Define_Allocation_Use_Case: React.FC<
  Define_Allocation_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Allocation of Delinquent Cases - Define Allocation
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Use Case Name */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Use Case Name
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Define Allocation for Delinquent Cases
          </p>
        </section>

        {/* Actor(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actor(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>User (Collection Admin / Supervisor)</li>
          </ul>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes how a user defines or modifies allocation
            rules in the Collections System. It involves assigning delinquent
            cases to collectors based on defined rules and parameters.
          </p>
        </section>

        {/* Trigger */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Trigger
          </h2>
          <p className="text-gray-700 leading-relaxed">
            User initiates the allocation configuration process.
          </p>
        </section>

        {/* Preconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Preconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Delinquent cases are classified.</li>
            <li>
              Mapped to communication templates for automated communication.
            </li>
            <li>System allows modification of existing allocation rules.</li>
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
              Delinquent cases are successfully assigned to Collectors as per
              the defined rules.
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
            <li>User logs into the Collections System.</li>
            <li>User defines or modifies allocation rules for a strategy.</li>
            <li>
              User segregates cases based on due amount, default date, and
              default percentage.
            </li>
            <li>
              User provides rule parameters:
              <ul className="list-disc pl-5 mt-2">
                <li>Strategy, Financier, Financier Type</li>
                <li>Queue Code, Rule Code, Rule Unit Level & Code</li>
                <li>Unit Level & Code, % Allocation, Execution Sequence</li>
                <li>Maker ID, Making Date</li>
              </ul>
            </li>
            <li>User assigns delinquent cases to Collectors.</li>
            <li>User saves allocation settings for future reference.</li>
          </ol>
        </section>

        {/* Alternate Flow(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternate Flow(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              User may update percentage allocation and execution sequence based
              on priority changes.
            </li>
          </ul>
        </section>

        {/* Exception Flow(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flow(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Invalid rule definitions or missing required fields result in
              validation errors.
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
              Allocation rules must only be created or modified by users with
              appropriate access.
            </li>
            <li>
              Allocation rules can only apply to strategies assigned to the
              user’s unit or child units.
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
            <li>
              Proper data is available for allocation (queues, rules, units,
              etc.).
            </li>
            <li>System validates rule definitions before saving.</li>
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
              This module improves control and automation of delinquent case
              handling through structured allocation logic.
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

export default Define_Allocation_Use_Case;
