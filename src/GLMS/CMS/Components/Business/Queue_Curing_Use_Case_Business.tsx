import React from 'react';

const Queue_Curing_Use_Case_Business: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Theory of Queue Curing for Delinquent Case Classification</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Overview</h3>
        <p className="text-gray-600">
          The queue curing process is a critical functionality within the Collections System, initiated after the Beginning of Day (BOD) process and queue classification. It involves specifying curing actions—communication methods like letters, SMS, emails, telecalling, or stat cards—for follow-up on cases within each queue. This ensures that follow-up actions align with the queue’s collection strategy, enhancing case management efficiency.
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
          <li><strong>Actions:</strong> User specifies curing actions for follow-up on queue-associated cases.</li>
          <li><strong>Post-conditions:</strong> Curing actions are defined, enabling follow-up via specified communication methods.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Workflow</h3>
        <ol className="list-decimal pl-5 text-gray-600">
          <li>User defines the queue by mapping a classification rule to a product and financier.</li>
          <li>User sets the priority for the defined queues.</li>
          <li>User specifies curing actions by providing:
            <ul className="list-disc pl-5 mt-1">
              <li>Strategy</li>
              <li>Financier</li>
              <li>Financier Type (Line of Business)</li>
              <li>Queue Code</li>
              <li>Making Date</li>
              <li>Curing Action (Letter generation, SMS sending, Stat card, Tele calling, Email)</li>
            </ul>
          </li>
          <li>Curing action is applied for follow-up on queue-associated cases.</li>
          <li>User saves the curing action details in the system for future reference.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Purpose</h3>
        <p className="text-gray-600">
          The queue curing process ensures that follow-up actions use appropriate communication methods, tailored to the queue’s strategy. It enables efficient customer outreach, reduces manual effort, and improves case resolution rates, supporting effective case management and collections efficiency.
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
Specify Curing Actions
   | (Strategy, Financier, Type, Code, Date, Action)
   v
Apply Curing Action for Follow-Up
   |
   v
Save Curing Action Details
   |
   v
End: Curing Actions Defined
          `}
        </pre>
      </section>
    </div>
  );
};

export default Queue_Curing_Use_Case_Business;