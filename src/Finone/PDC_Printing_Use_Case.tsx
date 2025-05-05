import React from "react";
import {
  FileText,
  Users,
  List,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Settings,
  TestTube,
  Server,
  User,
} from "lucide-react";

interface PDC_Printing_Use_CaseProps {}

const PDC_Printing_Use_Case: React.FC<PDC_Printing_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        PDC Printing
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process of printing Post Dated Cheques
            (PDCs) once a finance application has been approved and the customer
            has opted to repay via PDCs. The process includes collecting blank
            cheques, saving repayment details, and printing cheques with
            appropriate installment information based on the repayment schedule.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <div className="text-gray-700">
            <h3 className="font-medium text-gray-800 mb-2">Customer-facing</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Finance Officer</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">System roles</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Loan Origination System (LOS)</li>
              <li>PDC Printing Module</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">
              Software stakeholders
            </h3>
            <ul className="list-disc pl-5">
              <li>API Developer</li>
              <li>QA Engineer</li>
              <li>Infra Team</li>
            </ul>
          </div>
        </section>

        {/* User Actions & System Responses */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Actions & System Responses
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>User receives blank PDCs from the customer.</li>
            <li>User sets 'PDC' as the repayment mode in the system.</li>
            <li>System enables PDC collections section for input.</li>
            <li>User enters Application ID to fetch loan details.</li>
            <li>System displays due installments and allows selection.</li>
            <li>User inserts cheques into the printer.</li>
            <li>
              System prints each cheque with Payee Name, Due Date, and
              Installment Amount.
            </li>
          </ol>
        </section>

        {/* Precondition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Precondition
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Customer must have submitted the PDC cheques and selected 'PDC' as
            the mode of repayment.
          </p>
        </section>

        {/* Post Condition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Post Condition
          </h2>
          <p className="text-gray-700 leading-relaxed">
            PDCs are printed with the correct details and ready for installment
            processing.
          </p>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Login → Enter Application ID → Insert Cheques → Print → Logout
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Reprinting a cheque in case of misprint</li>
            <li>
              Printing revised cheques in case of updated financial parameters
            </li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Printer jam or error</li>
            <li>Incorrect Application ID entered</li>
            <li>Missing or invalid cheque paper</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Start → Receive PDCs → Enter Repayment Info → Enter Application ID →
            Load Installments → Insert Cheques → Print Cheques → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Integration with digital cheque systems</li>
            <li>Auto-verification of printed data using OCR</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Settings size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <div className="text-gray-700">
            <h3 className="font-medium text-gray-800 mb-2">UI</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>PDC Collections Screen</li>
              <li>Print Interface</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">APIs</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Application Lookup</li>
              <li>Installment Fetch</li>
            </ul>
            <h3 className="font-medium text-gray-800 mb-2">DB Tables</h3>
            <ul className="list-disc pl-5">
              <li>RepaymentSchedule</li>
              <li>ChequePrintLog</li>
            </ul>
          </div>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <TestTube size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Successful cheque printing</li>
            <li>Invalid application ID input</li>
            <li>Printer error simulation</li>
            <li>Installment schedule update and reprint</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Requires secure printer connectivity</li>
            <li>Printer drivers must be pre-installed</li>
            <li>Rollout in phased manner by region</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Lending Ops Automation
            <br />
            Contact: lending-tech-lead@company.com
            <br />
            Jira: PDC-PRINT-101
            <br />
            Repo: gitlab.com/company/lending/pdc-printing
          </p>
        </section>
      </div>
    </main>
  );
};

export default PDC_Printing_Use_Case;
