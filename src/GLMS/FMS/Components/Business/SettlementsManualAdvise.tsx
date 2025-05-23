import React from 'react';

// Main Component
const SettlementsManualAdvise: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Settlements: Manual Advise
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            An advice is essential for the materialization of a financial transaction. Such advices are generated during the business transaction/process. The Manual Advise will be used for making manual dues, such as commission payment handling.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User processes manual advises for Payments.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">User collects the payment details.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Manual advice is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to Manual Advise in Settlements.</li>
            <li className="mb-1">The User selects the business party to whom the payment needs to be made along with the Agreement ID and enters the details such as:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Advice ID</li>
            <li className="mb-1">Advice Date</li>
            <li className="mb-1">Agreement No.</li>
            <li className="mb-1">Advice Amount</li>
            <li className="mb-1">Advice Type</li>
            <li className="mb-1">Currency</li>
            <li className="mb-1">Charge Type</li>
            <li className="mb-1">Maker ID</li>
            <li className="mb-1">Date</li>
            <li className="mb-1">Remarks</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">The due will be created as per the process defined, and the payment shall be made to the customer.</li>
            <li className="mb-1">Manual advice is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application.</p>
            <p className="mb-2">2. User: Navigates to Manual Advise in Settlements.</p>
            <p className="mb-2">3. User: Selects the business party and Agreement ID, and enters details (e.g., Advice ID, Advice Amount, Currency).</p>
            <p className="mb-2">4. System: Creates the due as per the defined process, and payment is made to the customer.</p>
            <p className="mb-2">5. System: Manual advice is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettlementsManualAdvise;