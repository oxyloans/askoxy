import React from 'react';

const Allocation_of_Delinquent_Cases_Allocation_Hold_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Allocation Hold for Delinquent Cases</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Allocation hold is used to defer allocation of a case to another user in the next allocation process, by marking the case.
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
          <li>User may hold the allocation of the cases.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Delinquent cases are classified and mapped to the communication templates for auto communication.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Delinquent case is not allotted and kept on hold.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            The user extracts the list of delinquent cases by providing the details such as:
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
          <li>
            Once the list of delinquent cases is extracted, the user can allocate/re-allocate/hold the delinquent cases.
          </li>
          <li>
            User may keep on hold the delinquent cases to prevent them from getting reallocated to another user despite satisfying all conditions (Allocation hold is used to defer allocation of a case to another user in the next allocation process, by marking the case).
          </li>
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
  |
  v
User defines delinquent cases based on rules
  |
  v
User extracts list of delinquent cases using:
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
User marks specific delinquent cases for allocation hold
  |
  v
Delinquent cases kept on hold, preventing reallocation
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default Allocation_of_Delinquent_Cases_Allocation_Hold_Business;