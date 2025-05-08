import React from 'react';

const Legal_Collections_Use_Case_Business: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Theory of Legal Collections Workflow</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Overview</h3>
        <p className="text-gray-600">
          The legal collections workflow is a specialized module within the Collections System designed to manage cases filed for legal action to recover overdue amounts from delinquent customers. This process follows predefined stages based on the lending institution’s policies, ensuring a structured approach to initiating and tracking legal proceedings. The Legal Collections Module allows users to document court proceedings, update verdicts, and manage case withdrawals.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Key Components</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li><strong>Actors:</strong> User (collections staff or legal team representative).</li>
          <li><strong>Pre-conditions:</strong>
            <ul className="list-circle pl-5">
              <li>Customer is classified as delinquent.</li>
            </ul>
          </li>
          <li><strong>Actions:</strong> User initiates a legal case, sends legal notices, files cases, presents evidence, and records court proceedings.</li>
          <li><strong>Post-conditions:</strong> Court proceedings and verdicts are recorded and updated in the Collections Management Application.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Workflow</h3>
        <ol className="list-decimal pl-5 text-gray-600">
          <li>User sends delinquent customer documents to the legal collection process team and marks the case for legal collection in the Collections Management Application.</li>
          <li>Supervisor allocates the case to an appropriate lawyer based on the delinquent customer’s details.</li>
          <li>User sends a legal notice to the delinquent customer with the lawyer’s assistance.</li>
          <li>User (organization) files a legal case against the delinquent customer.</li>
          <li>User submits documents and evidence against the customer to the court.</li>
          <li>User records details of court proceedings and updates verdicts in the Collections Management Application.</li>
        </ol>
        <p className="text-gray-600 mt-2">
          <strong>Notes:</strong>
          <ul className="list-disc pl-5">
            <li>Cases can be withdrawn via the Case Withdrawal interface upon mutual agreement.</li>
            <li>A ‘Legal Waiver’ category prevents cases from moving to legal collections.</li>
            <li>Timely approvals are required, and a letter with customer, contract, collateral, and follow-up details may be generated.</li>
          </ul>
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Purpose</h3>
        <p className="text-gray-600">
          The legal collections workflow ensures systematic management of legal actions against delinquent customers, supporting transparency, compliance, and effective recovery of overdue amounts. It provides flexibility for case withdrawals and waivers, enhancing operational efficiency and decision-making.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Flowchart</h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre">
          {`
Start: Delinquent Customer Identified
   |
   v
Send Documents to Legal Team
   | (Mark for Legal Collection)
   v
Supervisor Allocates Case to Lawyer
   |
   v
Send Legal Notice to Customer
   |
   v
File Case Against Customer
   |
   v
Present Documents and Evidence to Court
   |
   v
Record Court Proceedings and Verdicts
   |
   v
End: Details Updated in System
          `}
        </pre>
      </section>
    </div>
  );
};

export default Legal_Collections_Use_Case_Business;