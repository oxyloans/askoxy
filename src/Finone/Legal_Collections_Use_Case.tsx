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

interface Legal_Collections_Use_CaseProps {}

const Legal_Collections_Use_Case: React.FC<
  Legal_Collections_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Legal Collections Workflow
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Use Case Name */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Use Case Name
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Legal Collections Workflow
          </p>
        </section>

        {/* Actor(s) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actor(s)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>User (Legal Collections team member, Supervisor, Lawyer)</li>
          </ul>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case defines the process followed in the Legal Collections
            module to initiate and manage legal cases against delinquent
            customers. It involves steps from document submission, lawyer
            assignment, legal notice issuance, case filing, to court proceeding
            updates in the Collections Management application.
          </p>
        </section>

        {/* Trigger */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Trigger
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A customer account is identified as delinquent and qualifies for
            legal action as per the lending institution’s policy.
          </p>
        </section>

        {/* Preconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Preconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>The customer must be marked as delinquent.</li>
            <li>
              Relevant documentation for initiating legal action must be
              available.
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
              Legal case is filed and tracked in the Collections Management
              system.
            </li>
            <li>Court proceedings and verdicts are recorded.</li>
          </ul>
        </section>

        {/* Basic Flow */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Basic Flow
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              User sends delinquent customer documents to the legal collection
              team and marks the case for Legal Collection.
            </li>
            <li>Supervisor assigns the case to an appropriate lawyer.</li>
            <li>
              User, with the help of the lawyer, sends a legal notice to the
              customer.
            </li>
            <li>
              Organization files a legal case and submits documentation to the
              court.
            </li>
            <li>
              User records details of court proceedings and updates system with
              verdict.
            </li>
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
              Case Withdrawal: If the case is resolved mutually, the user
              withdraws the case through the Case Withdrawal interface.
            </li>
            <li>
              Legal Waiver: If a legal waiver is approved, the case does not
              proceed to legal collections.
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
            <li>Case not allocated due to missing documents.</li>
            <li>
              Legal notice not delivered due to incorrect contact information.
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
              Only delinquent customers are eligible for legal proceedings.
            </li>
            <li>
              Legal Waiver marked cases must not be forwarded to the legal team.
            </li>
            <li>
              Letters must be generated with complete case and customer details.
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
              Legal module is integrated with the Collections Management
              application.
            </li>
            <li>
              Supervisor and User roles are clearly defined in the system.
            </li>
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
              Timely approvals are required to initiate legal proceedings.
            </li>
            <li>
              Follow-up and documentation are essential for successful case
              tracking.
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

export default Legal_Collections_Use_Case;
