import React from 'react';

// Main Component
const SettlementsWaiveOff: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Settlements: Waive Off
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            Waiver is an essential part of any financial system wherein the User can waive off a partial or full charge that has been levied on the customer.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User waives off the receivable amounts.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">Receivable amounts are to be eligible for waive-off.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Waive-off is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to Waive Off in Settlements.</li>
            <li className="mb-1">The screen displays the receivable amounts that need to be waived off.</li>
            <li className="mb-1">User enters the details in the following fields:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Agreement Number</li>
            <li className="mb-1">Branch</li>
            <li className="mb-1">Currency</li>
            <li className="mb-1">Waive Off Date</li>
            <li className="mb-1">Advice Details</li>
            <li className="mb-1">Advice Date</li>
            <li className="mb-1">Original Amount</li>
            <li className="mb-1">Current Advice Amount</li>
            <li className="mb-1">Already Waived Off Amount</li>
            <li className="mb-1">Already Adjusted Amount</li>
            <li className="mb-1">Amount to be Waived Off</li>
            <li className="mb-1">Remarks</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User saves the record and sends it for authorization.</li>
            <li className="mb-1">Waive-off is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application.</p>
            <p className="mb-2">2. User: Navigates to the Waive Off screen in Settlements.</p>
            <p className="mb-2">3. System: Displays receivable amounts eligible for waive-off.</p>
            <p className="mb-2">4. User: Enters details (e.g., Agreement Number, Amount to be Waived Off, Remarks).</p>
            <p className="mb-2">5. User: Saves the record and sends it for authorization.</p>
            <p className="mb-2">6. System: Waive-off is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettlementsWaiveOff;