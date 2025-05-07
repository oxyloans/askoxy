import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface WFLoanOrganizationSystemAppraisalProps {}

const WFLoanOrganizationSystemAppraisal: React.FC<WFLoanOrganizationSystemAppraisalProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Loan Organization System Appraisal
      </h1>

      {/* Description */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          This use case captures the loan appraisal process where the Bank Officer assesses the customer's loan eligibility based on financial, personal, employment, and verification data. The outcome is the generation of a Loan Appraisal Note / Process Note, which is used for risk analysis and further loan processing.
        </p>
      </section>

      {/* Actors */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Users size={18} className="mr-2 text-blue-600" />
          Actors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Customer-facing</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Bank Officer</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">System Roles</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Loan Origination System (LOS)</li>
              <li>External Services (Legal, Engineering, Employment Verification, Credit Bureaus)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Software Stakeholders</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>API Developers</li>
              <li>QA Team</li>
              <li>CloudOps</li>
              <li>Infra</li>
            </ul>
          </div>
        </div>
      </section>

      {/* User Actions & System Responses */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <FileText size={18} className="mr-2 text-blue-600" />
          User Actions & System Responses
        </h2>
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-left text-gray-700 text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-3 font-medium">User Action</th>
                <th className="p-3 font-medium">System Response</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Logs into LOS</td>
                <td className="p-3">Authenticates and displays dashboard</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Selects linked Customer ID and Loan Account</td>
                <td className="p-3">Fetches and displays customer and loan details</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Initiates Appraisal Process</td>
                <td className="p-3">Loads appraisal input screen</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Requests Legal Scrutiny Report (LSR)</td>
                <td className="p-3">Triggers request to external legal API / document upload</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Requests Security Valuation Report</td>
                <td className="p-3">Interfaces with engineering agency or document upload</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Requests Income and Employment Verification</td>
                <td className="p-3">Sends verification requests via internal/external API</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Fetches Credit Reports</td>
                <td className="p-3">Integrates with Credit Bureau APIs to retrieve reports</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Inputs and reviews appraisal data</td>
                <td className="p-3">Validates and saves input</td>
              </tr>
              <tr>
                <td className="p-3">Saves appraisal note</td>
                <td className="p-3">System generates Loan Appraisal / Process Note</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Precondition & Post Condition */}
      <section className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle size={18} className="mr-2 text-green-600" />
              Precondition
            </h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Customer ID is created and linked to a loan account</li>
              <li>Customer details captured: assets, liabilities, co-applicants, proposed loan limit, etc.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle size={18} className="mr-2 text-green-600" />
              Post Condition
            </h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Appraisal note / process note is generated</li>
              <li>Data available for Risk Analysis module</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Straight Through Process (STP) */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <ChevronRight size={18} className="mr-2 text-blue-600" />
          Straight Through Process (STP)
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          <span className="font-medium">Ideal Path:</span> Login → Select Customer → Request Reports → Input Appraisal → Generate Appraisal Note → Logout
        </p>
      </section>

      {/* Alternative Flows */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <ChevronRight size={18} className="mr-2 text-blue-600" />
          Alternative Flows
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Reports uploaded manually instead of fetched via API</li>
          <li>Verification steps bypassed in pre-approved cases</li>
          <li>Assisted input by branch support team</li>
        </ul>
      </section>

      {/* Exception Flows */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <AlertCircle size={18} className="mr-2 text-red-600" />
          Exception Flows
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Missing report (e.g., Credit Bureau unresponsive)</li>
          <li>Invalid/mismatched verification data</li>
          <li>Incomplete customer information in LOS</li>
          <li>LOS server downtime or session timeout</li>
        </ul>
      </section>

      {/* User Activity Diagram */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <FileText size={18} className="mr-2 text-blue-600" />
          User Activity Diagram
        </h2>
        <div className="bg-blue-50 p-4 rounded text-sm text-gray-800 font-mono border border-blue-200">
          <pre>
            Start
            Login to LOS
            Select Customer ID + Loan
            Initiate Appraisal Process
            Request Legal/Security/Verification Reports
            Input Appraisal Details
            Generate Appraisal Note
            End
          </pre>
        </div>
      </section>

      {/* Parking Lot */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Parking Lot
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Integration with AI for auto-risk rating</li>
          <li>ML-based suggestion engine for appraisal remarks</li>
          <li>Partner dashboard for report status tracking</li>
          <li>API for instant employment/income verification</li>
        </ul>
      </section>

      {/* System Components Involved */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          System Components Involved
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>UI: Appraisal Input Form, Customer Detail Screen</li>
          <li>APIs: Legal Report, Engineer Valuation, Employment Verification, Credit Bureau</li>
          <li>DB: Loan, Customer, Asset, Liabilities, Co-Applicant</li>
          <li>External Systems: CIBIL/Experian, Internal Verification Systems</li>
          <li>Message Queues: Report status notifications</li>
        </ul>
      </section>

      {/* Test Scenarios */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <FileText size={18} className="mr-2 text-blue-600" />
          Test Scenarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Functional</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Successful appraisal note creation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Edge Cases</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Missing one or more reports</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Negative</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Mismatched verification data</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Integration</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>API with Credit Bureau</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Performance</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
              <li>Load test with concurrent appraisal sessions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Infra & Deployment Notes */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          Infra & Deployment Notes
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Secure APIs for external reports</li>
          <li>Cloud DB with encrypted storage</li>
          <li>Feature toggle for manual vs API-based verification</li>
          <li>Role-based access controls</li>
        </ul>
      </section>

      {/* Dev Team Ownership */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Users size={18} className="mr-2 text-blue-600" />
          Dev Team Ownership
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Squad: Lending LOS Appraisal Team</li>
          <li>Contact: Lead Dev - Rajesh Kumar</li>
          <li>Jira Reference: LOS-APP-UC102</li>
          <li>Repo: gitlab.com/bank-loan/los/appraisal-module</li>
        </ul>
      </section>
    </main>
  );
};

export default WFLoanOrganizationSystemAppraisal;