import React from 'react';

// Main Component
const SettlementsPayments: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Settlements: Payments
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            The Payment module is used for making payments to business partners against dues such as excess amount due or termination amount payable, if any. The User can capture payment details for various business partners (selected through Business Partner type from a list), such as dealers, builders, or customers, against various advices generated. Payment advices are generated during the business transaction/process, including Disbursal Payments, Insurance Premium Payments, and Excess Money Payments.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User captures the payment details to the various business partners.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">User makes payments to the customer by various modes like cash, cheques, and fund transfer.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Payments are made to the customers.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to the Settlement Payment screen for Settlements.</li>
            <li className="mb-1">The User specifies the finance against which the payment needs to be created.</li>
            <li className="mb-1">Once the finance is specified, the User specifies the mode of payment along with the following details:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Cheque ID</li>
            <li className="mb-1">Currency</li>
            <li className="mb-1">Date</li>
            <li className="mb-1">Customer Name</li>
            <li className="mb-1">Amount</li>
            <li className="mb-1">Cheque No.</li>
            <li className="mb-1">In Favor Of</li>
            <li className="mb-1">Payable At</li>
            <li className="mb-1">Account No.</li>
            <li className="mb-1">Reason</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">The system facilitates the generation of all payable dues automatically or manually.</li>
            <li className="mb-1">At the time of payments, the User adjusts the payments manually.</li>
            <li className="mb-1">User generates various advices based on:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Disbursal Payments</li>
              <li className="mb-1">Insurance Premium Payment</li>
              <li className="mb-1">Excess Money Payment</li>
            </ul>
            <li className="mb-1">User sends the process payment details for authorization before paying the amount to the customer.</li>
            <li className="mb-1">Payments are made to the customers successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application.</p>
            <p className="mb-2">2. User: Navigates to the Settlement Payment screen for Settlements.</p>
            <p className="mb-2">3. User: Specifies the finance for the payment.</p>
            <p className="mb-2">4. User: Specifies the mode of payment and enters details (e.g., Cheque ID, Customer Name, Amount).</p>
            <p className="mb-2">5. System: Generates payable dues automatically or manually, with manual adjustments by the User.</p>
            <p className="mb-2">6. User: Generates advices for Disbursal Payments, Insurance Premium Payments, or Excess Money Payments.</p>
            <p className="mb-2">7. User: Sends payment details for authorization.</p>
            <p className="mb-2">8. System: Payments are made to the customers successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettlementsPayments;