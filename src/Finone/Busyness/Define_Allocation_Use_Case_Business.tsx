import React from 'react';

const Define_Allocation_Use_Case_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Define Allocation for Delinquent Customers</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Allocation is a process where the system assigns the cases of a particular queue to a unit defined in the system. The Collections System allows the user to define new allocation rules and modify existing allocations for the selected strategy. The user can view or modify only those allocation rules which are either defined by them or by their child units.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <ul className="list-disc ml-6">
          <li>User</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <ul className="list-disc ml-6">
          <li>
            User segregates the delinquent cases based on criteria such as due amount, default date, and default percentage, modifies the details if needed, and assigns to a Collector.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Delinquent cases are classified and mapped to the communication templates for auto communication.</li>
          <li>System should allow modifications to existing allocations.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Delinquent case is assigned to a Collector.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>User defines the rules in allocation and prepares the delinquent case.</li>
          <li>
            User maps the delinquent case to the Collector by providing the following details:
            <ul className="list-circle ml-6">
              <li>Strategy</li>
              <li>Financier</li>
              <li>Financier Type</li>
              <li>Queue Code</li>
              <li>Rule Code</li>
              <li>Rule Unit Level</li>
              <li>Rule Unit Code</li>
              <li>Unit Level</li>
              <li>Unit Code</li>
              <li>% Age Allocation</li>
              <li>Execution Sequence</li>
              <li>Maker ID</li>
              <li>Making Date</li>
            </ul>
          </li>
          <li>User provides the percentage of allocation and specifies the priority.</li>
          <li>User saves the details in the system for future reference.</li>
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
System allows modifications to existing allocations
  |
  v
User defines allocation rules based on:
- Due Amount
- Default Date
- Default Percentage
  |
  v
User maps delinquent case to Collector with details:
- Strategy
- Financier
- Financier Type
- Queue Code
- Rule Code
- Rule Unit Level
- Rule Unit Code
- Unit Level
- Unit Code
- % Age Allocation
- Execution Sequence
- Maker ID
- Making Date
  |
  v
User sets allocation percentage and priority
  |
  v
User saves details in the system
  |
  v
Delinquent case assigned to Collector
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default Define_Allocation_Use_Case_Business;