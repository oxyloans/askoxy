import React from 'react';

const Prioritize_Queue_Use_Case_Business: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Theory of Queue Prioritization for Delinquent Case Classification</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Overview</h3>
        <p className="text-gray-600">
          The queue prioritization process is an essential feature of the Collections System, initiated after the Beginning of Day (BOD) process and queue classification. It allows users to set the priority of defined queues, ensuring that cases qualifying for multiple queues are assigned to the highest-priority queue. This process helps collectors focus on critical cases and align collection strategies with organizational priorities.
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
              <li>Classification rules mapped to queues.</li>
            </ul>
          </li>
          <li><strong>Actions:</strong> User prioritizes the defined queues by setting their execution sequence.</li>
          <li><strong>Post-conditions:</strong> Queues are prioritized, ensuring cases are assigned to the highest-priority queue.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Workflow</h3>
        <ol className="list-decimal pl-5 text-gray-600">
          <li>User defines the queue by mapping a classification rule to a product and financier.</li>
          <li>User sets the priority for the various defined queues.</li>
          <li>User specifies prioritize queue details, including:
            <ul className="list-disc pl-5 mt-1">
              <li>Strategy</li>
              <li>Financier</li>
              <li>Financier Type (Line of Business)</li>
              <li>Queue Code</li>
              <li>Making Date</li>
            </ul>
          </li>
          <li>User defines the execution sequence to set the priority order of the queues.</li>
          <li>User saves the prioritization details in the system for future reference.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Purpose</h3>
        <p className="text-gray-600">
          The queue prioritization process ensures that cases are assigned to the most appropriate queue based on priority, optimizing resource allocation and improving recovery outcomes. It supports collectors in focusing on high-priority cases and aligns collection strategies with organizational priorities, enhancing efficiency.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Flowchart</h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre">
          {`
Start: BOD Process Completed
   |
   v
Map Classification Rule to Queue
   | (With Product and Financier)
   v
Set Priority for Queues
   |
   v
Specify Prioritize Queue Details
   | (Strategy, Financier, Type, Code, Date)
   v
Define Execution Sequence
   |
   v
Save Prioritization Details
   |
   v
End: Queues Prioritized
          `}
        </pre>
      </section>
    </div>
  );
};

export default Prioritize_Queue_Use_Case_Business;