import React from 'react';

const Define_Queue_Use_Case_Business: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Theory of Queue Definition for Delinquent Case Classification</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Overview</h3>
        <p className="text-gray-600">
          The queue definition process is a core functionality of the Collections System, triggered after the Beginning of Day (BOD) process. It focuses on classifying delinquent customers into queues based on delinquency categories, trends, or demographic and financial parameters. Known as queuing, this categorization helps collectors understand the nature of each case and select appropriate collection strategies.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Key Components</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li><strong>Actors:</strong> User (system operator or collections staff).</li>
          <li><strong>Pre-conditions:</strong>
            <ul className="list-circle pl-5">
              <li>BOD process completed.</li>
              <li>Details of delinquent and non-delinquent customers available in the database.</li>
            </ul>
          </li>
          <li><strong>Actions:</strong> User defines the queue and maps it to a classification rule.</li>
          <li><strong>Post-conditions:</strong> Classification rule is mapped to the queue, enabling case allocation.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Workflow</h3>
        <ol className="list-decimal pl-5 text-gray-600">
          <li>User defines rules for case allocation and prepares delinquent cases.</li>
          <li>User specifies queue details, including:
            <ul className="list-disc pl-5 mt-1">
              <li>Strategy</li>
              <li>Financier</li>
              <li>Financier Type (Line of Business)</li>
              <li>Queue Code</li>
              <li>Rule Code</li>
              <li>Severity</li>
              <li>Execution Sequence</li>
              <li>Maker ID</li>
              <li>Making Date</li>
            </ul>
          </li>
          <li>User maps the queue to a classification rule, associating it with a product and financier.</li>
          <li>User provides a description for the queue.</li>
          <li>User saves the queue details in the system for future reference.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Purpose</h3>
        <p className="text-gray-600">
          The queue definition process ensures that delinquent cases are systematically categorized, allowing collectors to prioritize and manage cases effectively. By mapping queues to classification rules, the system clarifies case characteristics and supports tailored collection strategies, enhancing operational efficiency.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Flowchart</h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre">
          {`
Start: BOD Process Completed
   |
   v
User Defines Allocation Rules
   |
   v
Prepare Delinquent Cases
   |
   v
Define Queue Details
   | (Strategy, Financier, Type, Codes, Severity, Sequence, Maker ID, Date)
   v
Map Queue to Classification Rule
   | (With Product and Financier)
   v
Provide Queue Description
   |
   v
Save Details in System
   |
   v
End: Queue Defined
          `}
        </pre>
      </section>
    </div>
  );
};

export default Define_Queue_Use_Case_Business;