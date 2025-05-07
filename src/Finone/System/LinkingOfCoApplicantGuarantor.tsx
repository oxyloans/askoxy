import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface LinkingOfCoApplicantGuarantorProps {}

const LinkingOfCoApplicantGuarantor: React.FC<LinkingOfCoApplicantGuarantorProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-serif">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-indigo-600 pb-4">
        Linking Co-Applicant / Co-Obligant / Guarantor in LOS
      </h1>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed">
          This use case describes the process by which a Bank Officer links one or more Co-Applicants, Co-Obligants, or Guarantors to a primary loan application using the Loan Origination System (LOS). It covers the creation (if new) and linking (if existing) of customer IDs for these related parties and associates them with the main loan application to proceed for appraisal.
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
              <li>Bank Officer</li>
              <li>Applicant</li>
              <li>Co-applicant / Co-obligant / Guarantor</li>
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
              <li>QA Engineers</li>
              <li>DevOps / CloudOps</li>
              <li>Database Admins</li>
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
                <th className="p-4 font-medium">Step</th>
                <th className="p-4 font-medium">User Action</th>
                <th className="p-4 font-medium">System Response</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">1</td>
                <td className="p-4">Customer submits loan application and documents</td>
                <td className="p-4">N/A</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">2</td>
                <td className="p-4">Bank Officer verifies documents</td>
                <td className="p-4">Highlights any missing or invalid data</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">3</td>
                <td className="p-4">Bank Officer initiates Customer ID creation (if needed)</td>
                <td className="p-4">LOS captures and saves customer details</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">4</td>
                <td className="p-4">Bank Officer enters details for Co-applicant / Co-obligant / Guarantor</td>
                <td className="p-4">System validates and creates new Cust ID (if not fetched from CBS)</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">5</td>
                <td className="p-4">Bank Officer links Co-applicant / Co-obligant / Guarantor to the loan</td>
                <td className="p-4">LOS stores relationship and eligibility flags</td>
              </tr>
              <tr>
                <td className="p-4">6</td>
                <td className="p-4">Bank Officer saves linkage</td>
                <td className="p-4">System updates the loan application with associated parties</td>
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
              <li>Primary Customer ID created and linked to loan product</li>
              <li>Loan application form and mandatory documents submitted</li>
              <li>Basic KYC and verification completed</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-green-600" />
              Post Condition
            </h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Co-applicant / Co-obligant / Guarantor details linked to the loan application</li>
              <li>Cust IDs created (if new)</li>
              <li>Loan application updated with eligibility-related income data</li>
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
          <span className="font-medium">Ideal Path:</span> Login → Validate Application → Create/Fetch Cust ID → Link to Loan → Save → Proceed to Loan Details
        </p>
      </section>

      {/* Alternative Flows */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ChevronRight size={20} className="mr-2 text-indigo-600" />
          Alternative Flows
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Assisted Mode: Bank Officer helps applicant in-person</li>
          <li>CBS Lookup: Fetches existing customer details using Cust ID</li>
          <li>Mobile / Web App (Future enhancement): Applicant submits associated party details directly</li>
        </ul>
      </section>

      {/* Exception Flows */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle size={20} className="mr-2 text-red-600" />
          Exception Flows
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Document mismatch or missing information</li>
          <li>Cust ID creation failure due to invalid fields</li>
          <li>CBS unresponsive or slow</li>
          <li>Duplicate Cust ID error</li>
          <li>Incorrect relationship mapping</li>
        </ul>
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
            Bank officer logs in
            Verify Documents
            Create/Fetch Cust ID for Associated Party
            Capture Personal/Income/Asset Details
            Link to Loan Application
            Save Record
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
          <li>Integration with Aadhaar/UID for instant verification</li>
          <li>Auto-fetch data using PAN/CKYC API</li>
          <li>ML model to validate document completeness</li>
          <li>Partner CRM integration for automated status updates</li>
        </ul>
      </section>

      {/* System Components Involved */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2 text-indigo-600" />
          System Components Involved
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>UI Screens: Customer Info, Income, Employment, Linking</li>
          <li>APIs: Cust ID Creation API, CBS Lookup API, Linking API</li>
          <li>DB Tables: customers, loan_applications, applicant_relationships, income_details</li>
          <li>External Services: CBS System, Document Verification API</li>
          <li>Message Queues (optional): For async data sync with CBS</li>
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
            <h3 className="font-medium text-gray-800 mb-2">Functional</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Create Cust ID</li>
              <li>Link Cust ID</li>
              <li>Save Form</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Edge Cases</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Duplicate PAN</li>
              <li>Long names</li>
              <li>Empty mandatory fields</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Negative</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Missing documents</li>
              <li>Invalid DOB format</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Integration</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>CBS fetch</li>
              <li>Cust ID validation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Performance</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Cust ID creation under load</li>
              <li>CBS fetch timeout handling</li>
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
          <li>Microservices-based deployment</li>
          <li>Config flags for CBS integration toggle</li>
          <li>Ensure data encryption in transit</li>
          <li>API throttling for Cust ID creation during peak hours</li>
          <li>Rollout: UAT → Staging → Production</li>
        </ul>
      </section>

      {/* Dev Team Ownership */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users size={20} className="mr-2 text-indigo-600" />
          Dev Team Ownership
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Squad: LOS-Customer-Management</li>
          <li>POC: Ramesh Nair (ramesh.nair@bank.com)</li>
          <li>JIRA: LOS-324</li>
          <li>Git Repo: git.bank.com/los/customer-module</li>
        </ul>
      </section>
    </main>
  );
};

export default LinkingOfCoApplicantGuarantor;