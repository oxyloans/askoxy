import React from 'react';

const Beginning_of_Day_Use_Case_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Beginning of Day Process</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          The Beginning of Day (BOD) process sources the Collections System with delinquent cases (customers unable to pay the contracted amount by the due date) from the Collections Management Application. It fetches details of both delinquent and non-delinquent accounts, ensuring the Collections System is updated daily with delinquent account data. The user must manually invoke this process through the Collections System.
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
          <li>User retrieves the details of delinquent and non-delinquent customers.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Details of delinquent and non-delinquent customers should be available in the database.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>System displays details of delinquent and non-delinquent customers, and the user views them.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>User opens the Collections Management Application and navigates to the BOD process.</li>
          <li>
            User enters the line of business (Credit Card, Overdraft, Finance) and initiates the BOD process.
          </li>
          <li>
            System displays the following details of delinquent customers:
            <ul className="list-circle ml-6">
              <li>Total loan amount</li>
              <li>Outstanding loan amount</li>
              <li>Customer/Co-applicant/Guarantor details</li>
              <li>Due date</li>
              <li>Due amount</li>
              <li>Customer contact details</li>
            </ul>
          </li>
          <li>
            User checks the delinquent customers' data and proceeds to classify delinquent cases.
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
Delinquent and non-delinquent customer data available in database
  |
  v
User opens Collections Management Application
  |
  v
User navigates to BOD process
  |
  v
User selects line of business:
- Credit Card
- Overdraft
- Finance
  |
  v
User initiates BOD process
  |
  v
System displays delinquent customer details:
- Total loan amount
- Outstanding loan amount
- Customer/Co-applicant/Guarantor details
- Due date
- Due amount
- Customer contact details
  |
  v
User reviews data
  |
  v
User proceeds to classify delinquent cases
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default Beginning_of_Day_Use_Case_Business;