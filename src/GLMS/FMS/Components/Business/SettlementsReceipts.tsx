import React from 'react';

// Main Component
const SettlementsReceipts: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Settlements: Receipts
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            The details of all funds received by the financial institution through cheque, cash, draft, or transfer are recorded in the Receipt module of the Settlements. Receipt Advices, i.e., receivables, are generated during the business transaction/process. Receivables can be generated due to:
          </p>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Billing process: Installment receivables are generated.</li>
            <li className="mb-1">Late Payment process: Overdue fees receivable from the customer are calculated and created.</li>
            <li className="mb-1">Any other receivable advices, ad-hoc in nature, through manual advice.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User captures the receipt details for various business partners.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">User generates the receipt advices through the system.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Receipt Advices are initiated for the customers.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to the Receipts screen from Settlements.</li>
            <li className="mb-1">User enters the details in the following fields to generate the ‘Receipt Advices’ during the business transaction/process:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Cheque ID</li>
            <li className="mb-1">Date</li>
            <li className="mb-1">Currency</li>
            <li className="mb-1">Customer Name</li>
            <li className="mb-1">Account No.</li>
            <li className="mb-1">In Favor Of</li>
            <li className="mb-1">Payable At</li>
            <li className="mb-1">Drawn On</li>
            <li className="mb-1">Reason</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User records all the details of the funds received by the financial institution through the following methods:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Cheque</li>
              <li className="mb-1">Cash</li>
              <li className="mb-1">Draft</li>
              <li className="mb-1">Transfer</li>
              <li className="mb-1">Point of Sale</li>
            </ul>
            <li className="mb-1">Once the details are entered, the payment is saved on the receipt screen, and the payment is processed through the Cheque Processing module with the following stages:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Receipt</li>
              <li className="mb-1">Deposit (Maker & Checker)</li>
              <li className="mb-1">Realization (Maker & Checker)</li>
            </ul>
            <li className="mb-1">User will also process the payment on the receipt screen with cash in two stages:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Receipt</li>
              <li className="mb-1">Receipt Deposit</li>
            </ul>
            <li className="mb-1">The User saves the payment information, and a payment voucher is required to be generated.</li>
            <li className="mb-1">The voucher will be printed once the record is saved on the receipt of payment.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application.</p>
            <p className="mb-2">2. User: Navigates to the Receipts screen from Settlements.</p>
            <p className="mb-2">3. User: Enters details (e.g., Cheque ID, Customer Name, Currency) to generate Receipt Advices.</p>
            <p className="mb-2">4. User: Records funds received via Cheque, Cash, Draft, Transfer, or Point of Sale.</p>
            <p className="mb-2">5. System: Processes payments through the Cheque Processing module (Receipt, Deposit, Realization) or cash stages (Receipt, Receipt Deposit).</p>
            <p className="mb-2">6. User: Saves payment information and generates a payment voucher.</p>
            <p className="mb-2">7. System: Prints the voucher upon saving the receipt record.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettlementsReceipts;