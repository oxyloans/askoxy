import React from 'react';

const Manual_Allocation_Use_Case_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manual Allocation for Delinquent Customers</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          The Manual Allocation option is used to allocate classified cases that have not been allocated to any units in the system. The User can search for cases using search parameters and perform bulk or selective manual allocation of cases displayed in the search results. The User selects the Unit Level and Unit Code to which cases will be allocated. Only the Unit Level and Unit Code under the logged-in User are displayed in the List of Values (LoV). The User can allocate cases in Bulk or Selective mode for the selected unit.
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
            User segregates delinquent cases based on criteria such as Amount Overdue and Bucket, modifies the details if required, and assigns to a Collector.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>The allocations have already been defined.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Delinquent cases are assigned to a Collector.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>User defines the rules in allocation and maps the queue with the allocation rule.</li>
          <li>
            User allots the delinquent case to the Collector by providing details such as:
            <ul className="list-circle ml-6">
              <li>Loan No./Account No</li>
              <li>Customer Name</li>
              <li>Customer ID</li>
              <li>Card No.</li>
              <li>Days Past Due (No. of installments due)</li>
              <li>Financier (Vendor)</li>
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
            User selects the Unit Level and Unit Code for bulk or selective manual allocation of cases not previously allotted to any Collector.
          </li>
          <li>
            User selects delinquent cases from the list and allocates them to the Collector based on the percentage of allocation and priority.
          </li>
          <li>User saves the manually made allocation in the system for future reference.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flowchart</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
{`
Start
  |
  v
Allocation rules defined
  |
  v
User defines rules and maps queue to allocation rule
  |
  v
User searches for unallocated delinquent cases using:
- Amount Overdue
- Bucket
  |
  v
User selects Unit Level and Unit Code from LoV
  |
  v
User performs allocation:
- Bulk: Allocate all cases in search results
- Selective: Check boxes for specific finance accounts
  |
  v
User assigns cases to Collector with details:
- Loan No./Account No
- Customer Name
- Customer ID
- Card No.
- Days Past Due
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
User sets allocation percentage and priority
  |
  v
User saves allocation details in system
  |
  v
Delinquent cases assigned to Collector
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default Manual_Allocation_Use_Case_Business;