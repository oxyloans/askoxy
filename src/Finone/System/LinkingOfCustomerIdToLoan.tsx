import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface LinkingOfCustomerIdToLoanProps {}

const LinkingOfCustomerIdToLoan: React.FC<LinkingOfCustomerIdToLoanProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-serif">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-indigo-600 pb-4">
        Linking of Customer ID to the Loan Product
      </h1>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed">
          This use case enables the Bank Officer to link a Customer ID (already created or fetched from CBS) to a specific loan product in the Loan Origination System (LOS). This step is a prerequisite before the actual loan appraisal begins. It involves capturing key loan-related details like loan amount, tenure, margin, purpose, and repayment schedule - forming the foundation of the digital credit proposal workflow.
        </p>
      </section>

      {/* Actors */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users size={20} className="mr-2 text-indigo-600" />
          Actors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Customer-facing</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Bank Officer (User)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">System Roles</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Loan Origination System (LOS)</li>
              <li>Core Banking System (CBS)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Software Stakeholders</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>API Developers</li>
              <li>Database Administrators</li>
              <li>QA Testers</li>
              <li>Infra/CloudOps Team</li>
            </ul>
          </div>
        </div>
      </section>

      {/* User Actions & System Responses */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-indigo-600" />
          User Actions & System Responses
        </h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-gray-700">
            <thead>
              <tr className="bg-indigo-50">
                <th className="p-4 font-medium">User Action</th>
                <th className="p-4 font-medium">System Response</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">Login to LOS</td>
                <td className="p-4">Authenticates and loads user dashboard</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Search or create Customer ID</td>
                <td className="p-4">System fetches from from CBS or creates new</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Select loan application</td>
                <td className="p-4">Loads customer's application form</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Choose loan product</td>
                <td className="p-4">System fetches loan product configurations</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Enter loan details: Amount, Tenure, ROI, Margin, etc.</td>
                <td className="p-4">System validates and pre-fills guidelines</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Enter loan purpose & remarks</td>
                <td className="p-4">Captures text input</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Click "Save & Link"</td>
                <td className="p-4">System links Customer ID to selected Loan Product</td>
              </tr>
              <tr>
                <td className="p-4">Submit proposal</td>
                <td className="p-4">Proposal is routed to sanctioning authority</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Precondition & Post Condition */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-green-600" />
              Precondition
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Customer ID has been created or fetched from CBS</li>
              <li>All required KYC and loan documents are submitted</li>
              <li>User has access to LOS with appropriate role</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-green-600" />
              Post Condition
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Customer ID is successfully linked to a loan product</li>
              <li>A new loan proposal record is created in LOS</li>
              <li>Proposal moves to the appraisal or sanction stage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Straight Through Process (STP) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ChevronRight size={20} className="mr-2 text-indigo-600" />
          Straight Through Process (STP)
        </h2>
        <p className="text-gray-700 leading-relaxed">
          <span className="font-medium">Ideal Path:</span> Login → Fetch/Create Cust ID → Select Loan Product → Enter Loan Details → Save & Link → Submit
        </p>
      </section>

      {/* Alternative Flows */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ChevronRight size={20} className="mr-2 text-indigo-600" />
          Alternative Flows
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Assisted mode: Branch officer fills form on behalf of customer</li>
          <li>Self-service (future scope): Digital onboarding via app/website</li>
          <li>API Triggered: Loan product linkage via external partner API</li>
        </ul>
      </section>

      {/* Exception Flows */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle size={20} className="mr-2 text-red-600" />
          Exception Flows
        </h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-gray-700">
            <thead>
              <tr className="bg-indigo-50">
                <th className="p-4 font-medium">Issue</th>
                <th className="p-4 font-medium">System Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">Customer ID not found</td>
                <td className="p-4">Show alert, suggest CBS fetch</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Missing mandatory fields</td>
                <td className="p-4">Display validation errors</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Product not available</td>
                <td className="p-4">Disable linking, prompt to reselect</td>
              </tr>
              <tr>
                <td className="p-4">API/CBS timeout</td>
                <td className="p-4">Retry logic or fail gracefully</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* User Activity Diagram */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-indigo-600" />
          User Activity Diagram
        </h2>
        <div className="bg-indigo-50 p-6 rounded-lg text-sm text-gray-800 font-mono border border-indigo-200">
          <pre>
            Start
            Login to LOS
            Search/Create Customer ID
            Select Loan Product
            Enter Loan Details
            Validate & Save
            Link Customer ID to Loan Product
            Submit Proposal
            End
          </pre>
        </div>
      </section>

      {/* Parking Lot */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          Parking Lot
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Integrate Aadhaar/eKYC API for auto-Cust ID fetch</li>
          <li>Add ML-based recommendation for optimal loan product</li>
          <li>Enable WhatsApp/SMS alert post-linkage</li>
          <li>Pre-fill fields using data from CBS/CRM</li>
        </ul>
      </section>

      {/* System Components Involved */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-^^4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          System Components Involved
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>UI Screens: Loan Product Linking Form</li>
          <li>APIs: Fetch Customer ID, Fetch Loan Product Config, Submit Proposal</li>
          <li>DB Tables: Customer Master, Loan Application, Product Configurations</li>
          <li>External Services: CBS, Credit Bureau APIs (optional)</li>
          <li>Message Queues: Proposal Notification Queue (optional)</li>
        </ul>
      </section>

      {/* Test Scenarios */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-indigo-600" />
          Test Scenarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Functional Tests</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Link customer ID with valid loan product</li>
              <li>Save and verify all loan fields</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Edge Cases</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Interest rate beyond allowed margin</li>
              <li>Linking same Customer ID to multiple products</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Negative Tests</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Attempt with missing customer ID</li>
              <li>Attempt with inactive user session</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Integration Tests</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>LOS ↔ CBS</li>
              <li>LOS ↔ Product config engine</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Performance Tests</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Concurrent user load for peak hours</li>
              <li>API response under high volume</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Infra & Deployment Notes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          Infra & Deployment Notes
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Hosting: Cloud-native deployment (K8s or AppService)</li>
          <li>Environment: DEV, UAT, PROD</li>
          <li>Configs: Role-based access, loan product toggles</li>
          <li>Monitoring: LOS logs, API latency dashboard, audit trail</li>
        </ul>
      </section>

      {/* Dev Team Ownership */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users size={20} className="mr-2 text-indigo-600" />
          Dev Team Ownership
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Squad: LOS-Core Integration</li>
          <li>POC: Ramesh Nair (Product Owner)</li>
          <li>Jira Link: LOS-1234</li>
          <li>Repo: bitbucket.org/bank/los-core</li>
        </ul>
      </section>
    </main>
  );
};

export default LinkingOfCustomerIdToLoan;