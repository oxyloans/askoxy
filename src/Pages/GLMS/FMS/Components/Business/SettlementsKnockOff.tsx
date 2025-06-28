import React from 'react';

// Main Component
const SettlementsKnockOff: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Settlements: Knock Off
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            There might be situations where receivables are pending from a business partner, and payments are also pending to the same business partner. In such cases, a knock-off of receivables is required against the pending payment. The user can set the knock-off amount payable against the amount receivable from the customer.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User processes knock-off for pending amounts.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">Receipts and payments details have to be considered into account.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Knock-off is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to Knock Off in Settlements.</li>
            <li className="mb-1">User checks the pending amounts of both receivables and payables from the Knock Off screen.</li>
            <li className="mb-1">User sets the knock-off amount payable against the amount receivable from the customer.</li>
            <li className="mb-1">User checks for the following validations:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Sum of receivable Advices must equal the sum of Payable Advices to knock off the transaction.</li>
              <li className="mb-1">Allocated Amount cannot be greater than the amount to be allocated.</li>
              <li className="mb-1">Knock-off date cannot be greater than the current business date.</li>
              <li className="mb-1">Only those advices of a finance will be shown whose advice date is less than or equal to the knock-off date entered.</li>
              <li className="mb-1">Receivable and Payable advices pertaining to one business partner type can be knocked off at one time.</li>
            </ul>
            <li className="mb-1">After the above validations, the User initiates the knock-off feature and gets the same authorized.</li>
            <li className="mb-1">The User checks previous knock-offs done manually and may select the record for which reversal is required.</li>
            <li className="mb-1">The User also authorizes the knock-off reversal.</li>
            <li className="mb-1">Knock-off is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Notes:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Knock-off reversal is not allowed for auto knock-off cases.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application and navigates to Knock Off in Settlements.</p>
            <p className="mb-2">2. User: Checks pending amounts of receivables and payables on the Knock Off screen.</p>
            <p className="mb-2">3. User: Sets the knock-off amount payable against the amount receivable.</p>
            <p className="mb-2">4. User: Validates the knock-off (e.g., equal sums, valid dates, same business partner type).</p>
            <p className="mb-2">5. User: Initiates the knock-off and gets it authorized.</p>
            <p className="mb-2">6. User: Optionally checks previous manual knock-offs and authorizes reversals if needed.</p>
            <p className="mb-2">7. System: Knock-off is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettlementsKnockOff;