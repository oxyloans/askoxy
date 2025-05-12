import React from 'react';

const Manual_Reallocation_Use_Case_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manual Reallocation for Delinquent Customers</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Manual reallocation is used to reallocate cases to another Collector who can handle them more effectively than the current Collector. The Collections System facilitates this through the Manual Reallocation screen. Supervisors can only reallocate cases of users reporting to them.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <ul className="list-disc ml-6">
          <li>User (Supervisor)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <ul className="list-disc ml-6">
          <li>
            User can reallocate cases to another Collector who can handle them more effectively than the current Collector.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Delinquent cases are classified and mapped to communication templates for auto-communication.</li>
          <li>Case allocation has been completed.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>
            Delinquent case is reassigned to another Collector who can handle it more effectively than the existing Collector.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            If allotted cases are not closed properly, the Supervisor may reallocate them to a new Collector who can handle them effectively, limited to users reporting to the Supervisor.
          </li>
          <li>
            The User updates the following details before reassigning to a new Collector, if required:
            <ul className="list-circle ml-6">
              <li>Loan No./Account No</li>
              <li>Customer Name</li>
              <li>Customer ID</li>
              <li>Card No.</li>
              <li>Overdue Position</li>
              <li>Financier</li>
              <li>Financier Type (Line of Business)</li>
              <li>Rule Unit Code</li>
              <li>Unit Level</li>
              <li>Product Type</li>
              <li>Product</li>
              <li>Queue</li>
              <li>Branch</li>
            </ul>
          </li>
          <li>The system displays delinquent cases based on the defined queue.</li>
          <li>
            The User selects delinquent cases, provides the percentage of allocation, specifies priority, and assigns them to a new Collector who handles more efficiently and reports to the Supervisor.
          </li>
          <li>The User saves the reallocation details in the system for future reference.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flowchart</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
{`
Start
  |
  v
Delinquent cases classified and mapped to communication templates
Initial case allocation completed
  |
  v
User defines delinquent cases based on allocation rules
  |
  v
System displays delinquent cases by defined queue
  |
  v
Cases not closed properly?
  |
  v
User updates case details if required:
- Loan No./Account No
- Customer Name
- Customer ID
- Card No.
- Overdue Position
- Financier
- Financier Type
- Rule Unit Code
- Unit Level
- Product Type
- Product
- Queue
- Branch
  |
  v
User selects cases for reallocation
  |
  v
User sets allocation percentage and priority
  |
  v
User reassigns cases to new Collector who:
- Handles more effectively
- Reports to Supervisor
  |
  v
User saves reallocation details in system
  |
  v
Delinquent cases reassigned to new Collector
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default Manual_Reallocation_Use_Case_Business;