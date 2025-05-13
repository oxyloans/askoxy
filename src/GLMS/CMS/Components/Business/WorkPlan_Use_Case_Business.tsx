import React from 'react';

const WorkPlan_Use_Case_Business: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Theory of Work Plan for Delinquent Case Prioritization and Allocation</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Overview</h3>
        <p className="text-gray-600">
          The work plan process is a key component of the Collections System, designed to prioritize and allocate delinquent cases to collectors for follow-up. Initiated after case allocation, it allows the supervisor to define case priorities based on criteria like the amount overdue. The system displays relevant case details, enabling informed prioritization and assignment, ensuring collectors focus on high-priority cases.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Key Components</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li><strong>Actors:</strong> Supervisor.</li>
          <li><strong>Pre-conditions:</strong>
            <ul className="list-circle pl-5">
              <li>Delinquent cases saved in the database.</li>
              <li>System allows supervisor to prioritize and allocate cases to collectors.</li>
            </ul>
          </li>
          <li><strong>Actions:</strong> Supervisor prioritizes cases based on amount overdue and assigns them to collectors.</li>
          <li><strong>Post-conditions:</strong> Delinquent cases are allocated to collectors for follow-up.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Workflow</h3>
        <ol className="list-decimal pl-5 text-gray-600">
          <li>Supervisor initiates the work plan process after case allocation.</li>
          <li>Supervisor generates the work plan, and the system displays case details:
            <ul className="list-disc pl-5 mt-1">
              <li>Loan account</li>
              <li>Customer name</li>
              <li>Financier type</li>
              <li>Product</li>
              <li>Amount overdue</li>
              <li>Principal outstanding</li>
              <li>Late fee</li>
              <li>Installment overdue</li>
              <li>Remarks</li>
            </ul>
          </li>
          <li>Supervisor reviews details, prioritizes cases based on amount overdue, and allocates them to collectors.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Purpose</h3>
        <p className="text-gray-600">
          The work plan process ensures systematic prioritization and allocation of delinquent cases, optimizing follow-up efforts. By focusing on high-priority cases, it enhances resource allocation, improves collection outcomes, and supports data-driven decision-making in the Collections System.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Flowchart</h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre">
          {`
Start: Case Allocation Completed
   |
   v
Supervisor Initiates Work Plan
   |
   v
Generate Work Plan
   | (System Displays Case Details)
   v
Prioritize and Allocate Cases
   | (Based on Amount Overdue)
   v
End: Cases Allocated to Collectors
          `}
        </pre>
      </section>
    </div>
  );
};

export default WorkPlan_Use_Case_Business;