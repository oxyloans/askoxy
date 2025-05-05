import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Server,
  GitBranch,
  Code,
} from "lucide-react";

interface WF_for_Sanction_of_LoanProps {}

const WF_for_Sanction_of_Loan: React.FC<WF_for_Sanction_of_LoanProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Sanction of Loan in LOS
      </h1>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process of loan proposal sanctioning,
            which includes capturing customer details, generating appraisal
            notes, validating the proposal through the Sanctioning Authority,
            and handling clarifications and decisions (approval/rejection). The
            final decision is recorded in the Loan Origination System (LOS), and
            the Bank Officer proceeds with post-sanction activities.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800">Primary Actors</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>
                  Bank Officer - Prepares the proposal and coordinates for
                  discrepancy resolution
                </li>
                <li>
                  Sanctioning Authority - Reviews and decides on loan proposal
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">System Actors</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>LOS (Loan Origination System)</li>
                <li>Notification Service</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Actions & System Responses */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            User Actions & System Responses
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              <strong>User Action:</strong> Bank Officer enters customer
              details.
              <br />
              <strong>System Response:</strong> System stores customer profile
              and links to loan proposal.
            </li>
            <li>
              <strong>User Action:</strong> Bank Officer prepares loan proposal.
              <br />
              <strong>System Response:</strong> LOS calculates eligibility and
              proposed loan.
            </li>
            <li>
              <strong>User Action:</strong> Officer prepares Appraisal
              Note/Process Note.
              <br />
              <strong>System Response:</strong> System generates draft appraisal
              documents.
            </li>
            <li>
              <strong>User Action:</strong> Risk analysis and T&C are finalized
              and proposal is submitted.
              <br />
              <strong>System Response:</strong> Proposal forwarded to
              Sanctioning Authority via workflow.
            </li>
            <li>
              <strong>User Action:</strong> Sanctioning Authority reviews
              proposal.
              <br />
              <strong>System Response:</strong> System provides view of all
              notes, risks, and conditions.
            </li>
            <li>
              <strong>User Action:</strong> If complete, Authority
              approves/rejects loan.
              <br />
              <strong>System Response:</strong> Decision updated in LOS.
            </li>
            <li>
              <strong>User Action:</strong> If discrepancy found, Authority
              comments and sends back.
              <br />
              <strong>System Response:</strong> System notifies Bank Officer
              with remarks.
            </li>
            <li>
              <strong>User Action:</strong> Bank Officer collects additional
              info/reports.
              <br />
              <strong>System Response:</strong> Updated documents uploaded in
              LOS.
            </li>
            <li>
              <strong>User Action:</strong> Revised proposal resubmitted.
              <br />
              <strong>System Response:</strong> System notifies Sanctioning
              Authority.
            </li>
            <li>
              <strong>User Action:</strong> Final review by Authority.
              <br />
              <strong>System Response:</strong> Approves with/without conditions
              or rejects.
            </li>
            <li>
              <strong>User Action:</strong> Officer is notified and proceeds
              with next steps.
              <br />
              <strong>System Response:</strong> Decision recorded in LOS.
            </li>
          </ol>
        </section>

        {/* Precondition & Post Condition */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Precondition
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Customer ID and loan account created</li>
                <li>
                  All mandatory customer, loan, and risk data entered in LOS
                </li>
                <li>Appraisal and process notes completed</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Post Condition
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Sanctioning Authority’s decision recorded in LOS</li>
                <li>Bank Officer is notified of approval or rejection</li>
                <li>Sanction letter preparation process may begin</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700">
            Customer details → Appraisal Note → Approval → Decision updated
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Proposal returned with discrepancies → Officer updates →
              Resubmission
            </li>
            <li>Conditional approval requiring additional covenants</li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Incomplete customer documentation</li>
            <li>System errors in LOS during workflow submission</li>
            <li>Delay in receiving response from customer or departments</li>
          </ul>
        </section>

        {/* User Activity Diagram */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700">
            Start → [Customer Details Entered in LOS] → [Loan Proposal Prepared]
            → [Proposal Sent to Sanctioning Authority] → [Authority Reviews
            Proposal] → [If Discrepancy → Comments Sent to Officer → Officer
            Updates Info → Resubmits Proposal] → [Final Approval/Rejection] →
            [Decision Updated in LOS] → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot (Future Enhancements)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Auto-notification to customer on sanction status</li>
            <li>Dashboard for Sanctioning Authority on pending proposals</li>
            <li>SLA tracking between Officer and Authority</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>LOS UI for Bank Officer and Sanctioning Authority</li>
            <li>LOS Workflow Engine</li>
            <li>Document Upload & Versioning</li>
            <li>Notification Service (Email/Alerts)</li>
            <li>LOS Database</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Proposal successfully sanctioned</li>
            <li>Proposal rejected with comments</li>
            <li>Proposal returned for clarification and re-approved</li>
            <li>Proposal not submitted due to missing mandatory fields</li>
            <li>Failure in system notification delivery</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Proposal attachments (Appraisal note, Risk Reports) must be
              accessible
            </li>
            <li>
              Notification queues must be monitored for delayed message delivery
            </li>
            <li>
              Role-based access: Bank Officer cannot override Authority’s
              decision
            </li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <GitBranch size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>Squad:</strong> LOS Workflow Engine
            </li>
            <li>
              <strong>Contact:</strong> Process Automation Lead
            </li>
            <li>
              <strong>Git Repo:</strong> /los-core/loan-sanction-module
            </li>
            <li>
              <strong>Jira Ref:</strong> LOS-2105
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default WF_for_Sanction_of_Loan;
