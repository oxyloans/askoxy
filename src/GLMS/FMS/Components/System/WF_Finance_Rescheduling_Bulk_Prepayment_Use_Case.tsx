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

interface WF_Finance_Rescheduling_Bulk_Prepayment_Use_CaseProps {}

const WF_Finance_Rescheduling_Bulk_Prepayment_Use_Case: React.FC<
  WF_Finance_Rescheduling_Bulk_Prepayment_Use_CaseProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        WF_Finance Rescheduling - Bulk Prepayment
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process involved when a customer makes a
            bulk prepayment toward their finance deal. Bulk prepayment can
            impact either the tenure or the installment amount, and requires the
            generation of a new repayment schedule. The system will reallocate
            payments starting with accrued but not due profit, followed by
            outstanding principal.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Customer</li>
            <li>User</li>
            <li>Checker</li>
          </ul>
        </section>

        {/* User Actions & System Responses */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Actions & System Responses
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              Customer visits the bank and submits bulk prepayment
              (cash/cheque).
            </li>
            <li>User verifies the Finance Account details.</li>
            <li>User initiates the bulk prepayment process.</li>
            <li>
              System accepts bulk payment and prepares for rescheduling.
              <ul className="list-disc pl-5 mt-2">
                <li>
                  System action: Accepts payment and initiates rescheduling.
                </li>
              </ul>
            </li>
            <li>
              User retrieves account details (Agreement ID, Loan Type,
              Outstanding, Due Date, etc.).
            </li>
            <li>
              User enters bulk refund amount and submits for rescheduling.
            </li>
            <li>Checker retrieves and verifies the new repayment schedule.</li>
            <li>
              If approved, system generates and notifies customer.
              <ul className="list-disc pl-5 mt-2">
                <li>
                  System action: Generates new repayment schedule and sends
                  notification.
                </li>
              </ul>
            </li>
            <li>
              If discrepancies are found, the request is modified and
              resubmitted.
              <ul className="list-disc pl-5 mt-2">
                <li>
                  System action: Allows modification and resubmission of the
                  request.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        {/* Precondition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Precondition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              An existing Finance Account and a bulk repayment request must be
              present.
            </li>
          </ul>
        </section>

        {/* Post Condition */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Post Condition
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Bulk prepayment is recorded.</li>
            <li>A new repayment schedule is generated and approved.</li>
          </ul>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Customer Visit → Initiate Bulk Payment → Generate Repayment Schedule
            → Checker Authorization → Notify Customer
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ArrowRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Discrepancy handling by modifying the request and resubmitting.
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
            <li>Invalid Agreement ID.</li>
            <li>Discrepancies in repayment calculation.</li>
            <li>Unauthorized access.</li>
          </ul>
        </section>

        {/* User Activity Diagram (Flowchart) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            As described in the document with paths for discrepancy and
            authorization.
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Potential integration with payment gateways.</li>
            <li>Automated customer notifications.</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Settings size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Finance Account Database</li>
            <li>Repayment Engine</li>
            <li>UI for Prepayment Entry</li>
            <li>Notification System</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <TestTube size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Valid bulk prepayment triggers correct schedule recalculation.
            </li>
            <li>Discrepancy results in modification prompt.</li>
            <li>Checker approval generates notification.</li>
            <li>Invalid Agreement ID halts the process.</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Requires secure transaction logging.</li>
            <li>Real-time data update capabilities.</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <User size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Squad: Finance Operations Automation Team
            <br />
            Contact: Sunil Reddy
            <br />
            JIRA: FMS-BULK-991
            <br />
            Git Repo: git.company.com/FMS/bulk-prepayment
          </p>
        </section>
      </div>
    </main>
  );
};

export default WF_Finance_Rescheduling_Bulk_Prepayment_Use_Case;
