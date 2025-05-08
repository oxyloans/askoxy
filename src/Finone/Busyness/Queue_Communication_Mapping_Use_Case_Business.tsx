import React from 'react';

 
const  Queue_Communication_Mapping_Use_Case_Business : React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Theory of Queue Communication Mapping for Delinquent Case Classification</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Overview</h3>
        <p className="text-gray-600">
          The queue communication mapping process is a key functionality within the Collections System, initiated after the Beginning of Day (BOD) process and queue classification. It involves mapping queues to communication templates to enable automated customer communications based on specified curing actions. This process ensures that follow-up actions align with the collection strategy for each queue, enhancing communication efficiency.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Key Components</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li><strong>Actors:</strong> User (system operator or collections staff).</li>
          <li><strong>Pre-conditions:</strong>
            <ul className="list-circle pl-5">
              Initiate BOD process completed.
              <li>Details of delinquent and non-delinquent customers available in the database.</li>
              <li>Classification rules and curing actions mapped to queues.</li>
            </ul>
          </li>
          <li><strong>Actions:</strong> User maps queues to communication templates for automated communication.</li>
          <li><strong>Post-conditions:</strong> System communicates with customers based on the specified curing actions, and mapping details are saved.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Workflow</h3>
        <ol className="list-decimal pl-5 text-gray-600">
          <li>User defines the queue by mapping a classification rule to a product and financier.</li>
          <li>User sets the priority for the defined queues.</li>
          <li>User specifies curing actions for mapping to the communication template.</li>
          <li>User manually maps the queue to a communication template.</li>
          <li>System automatically communicates with customers based on the selected curing action.</li>
          <li>User saves the mapping details in the system for future reference.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Purpose</h3>
        <p className="text-gray-600">
          The queue communication mapping process automates customer communications, ensuring consistent and timely follow-up actions aligned with queue-specific collection strategies. It reduces manual effort, improves case management, and enhances recovery outcomes by streamlining outreach efforts.
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
   |
   v
Map Queue to Communication Template
   |
   v
System Sends Automated Communication
   | (Based on Curing Action)
   v
Save Mapping Details
   |
   v
End: Communication Mapping Completed
          `}
        </pre>
      </section>
    </div>
  );
};

export default Queue_Communication_Mapping_Use_Case_Business;
;