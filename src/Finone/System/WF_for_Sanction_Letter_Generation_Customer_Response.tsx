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

interface WF_for_Sanction_Letter_Generation_Customer_ResponseProps {}

const WF_for_Sanction_Letter_Generation_Customer_Response: React.FC<WF_for_Sanction_Letter_Generation_Customer_ResponseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Sanction Letter Generation & Customer Response in LOS
      </h1>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case enables the Bank Officer to generate a Sanction or
            Rejection letter after the sanctioning authority’s decision and
            facilitates capturing the Customer’s response in the system. Based
            on acceptance, the process for opening the loan account is initiated
            in the Core Banking System (CBS).
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
              <h3 className="font-medium text-gray-800">Customer-facing</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Bank Officer</li>
                <li>Customer</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">
                System Roles & Stakeholders
              </h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Loan Origination System (LOS)</li>
                <li>Core Banking System (CBS)</li>
                <li>API Developer</li>
                <li>QA</li>
                <li>Infra</li>
                <li>Product Owner</li>
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
              <strong>User Action:</strong> Bank Officer logs into LOS.
              <br />
              <strong>System Response:</strong> System authenticates the Bank
              Officer and grants access to LOS.
            </li>
            <li>
              <strong>User Action:</strong> Loan Proposal is approved/rejected
              by authority.
              <br />
              <strong>System Response:</strong> LOS updates the loan proposal
              status to approved or rejected.
            </li>
            <li>
              <strong>User Action:</strong> Bank Officer initiates Sanction
              Letter generation.
              <br />
              <strong>System Response:</strong> LOS generates a Sanction or
              Rejection letter based on the proposal status.
            </li>
            <li>
              <strong>User Action:</strong> Bank Officer reviews and confirms
              letter contents.
              <br />
              <strong>System Response:</strong> LOS saves the confirmed letter
              content.
            </li>
            <li>
              <strong>User Action:</strong> Letter is shared with Customer
              (email/print).
              <br />
              <strong>System Response:</strong> LOS sends the letter via email
              or marks it for printing.
            </li>
            <li>
              <strong>User Action:</strong> Customer responds with Acceptance or
              Rejection.
              <br />
              <strong>System Response:</strong> LOS records the Customer’s
              response.
            </li>
            <li>
              <strong>User Action:</strong> If Accepted, Bank Officer triggers
              Loan Account creation in CBS.
              <br />
              <strong>System Response:</strong> LOS initiates loan account
              creation via CBS API.
            </li>
            <li>
              <strong>User Action:</strong> System confirms loan account
              created.
              <br />
              <strong>System Response:</strong> Status updated in LOS for
              tracking.
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
                <li>
                  Loan proposal already approved/rejected by sanctioning
                  authority
                </li>
                <li>
                  All mandatory fields and verification steps completed in LOS
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Post Condition
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Customer response (Accepted/Rejected) is recorded</li>
                <li>If accepted, loan account creation is triggered in CBS</li>
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
            Approval → Letter Generated → Shared with Customer → Response
            Captured → Loan Account Opened (CBS)
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Letter delivered via App/Email/Branch</li>
            <li>Customer responds online/offline</li>
            <li>Auto-scheduling for CBS integration on acceptance</li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Letter not delivered (email bounce/technical issue)</li>
            <li>Customer does not respond within timeline</li>
            <li>CBS API failure during account creation</li>
            <li>Manual override required for sanction changes</li>
          </ul>
        </section>

        {/* User Activity Diagram */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700">
            Start → [Loan Approved/Rejected] → [Generate Letter in LOS] → [Send
            to Customer] → [Capture Response] → [If Accepted → Create Loan A/C
            in CBS] → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Option for digital signature by Customer</li>
            <li>Auto-reminders if Customer hasn’t responded</li>
            <li>Integration with customer portal for self-service</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>LOS Frontend (UI)</li>
            <li>Sanction Letter Generator Module</li>
            <li>LOS DB</li>
            <li>CBS API (Loan Account Creation)</li>
            <li>Notification Service (SMS/Email)</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Sanction Letter Generated for approved proposal</li>
            <li>Letter Rejection flow</li>
            <li>Customer response recorded correctly</li>
            <li>Failure in CBS account creation</li>
            <li>Load test for bulk letter generation</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>LOS-CBS API latency</li>
            <li>Email server dependency</li>
            <li>Retry logic for failed CBS integration</li>
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
              <strong>Squad:</strong> LOS Core Processing
            </li>
            <li>
              <strong>Contact:</strong> LOS Module Lead
            </li>
            <li>
              <strong>Jira:</strong> LOS-1278
            </li>
            <li>
              <strong>Git Repo:</strong> /los-core/sanction-letter-service
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default WF_for_Sanction_Letter_Generation_Customer_Response;