import React from 'react';

// Main Component
const InstallmentPrepayment: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Installment Prepayment
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            The Installment Prepayment feature allows the user to receive a Prepayment Amount from the customer against Installments Outstanding. The user can enter payment given in advance by the customer for future installments.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actors:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
            <li className="mb-1">Customer</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User: Processes the prepayment of installments.</li>
            <li className="mb-1">Customer: Pays the prepayment installment as an advance.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">The prepayment amount received from the customer is to be processed.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Installment prepayment is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User receives the amount from the customer to process the payment in the system.</li>
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to the Installment Prepayment screen.</li>
            <li className="mb-1">User enters the payment details in the following fields:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Prepayment ID</li>
            <li className="mb-1">Customer Name</li>
            <li className="mb-1">Agreement ID</li>
            <li className="mb-1">Prepayment Amount</li>
            <li className="mb-1">Account No</li>
            <li className="mb-1">Agreement Number</li>
            <li className="mb-1">Installment Amount</li>
            <li className="mb-1">Principal Amount</li>
            <li className="mb-1">Balance Installment Amount</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">The amount received will be allocated towards the last installment, and the tenure will be reduced by the number of installments prepaid by the customer towards the last installments.</li>
            <li className="mb-1">User saves the record once the process is completed or resets the details.</li>
            <li className="mb-1">Installment prepayment is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Receives the prepayment amount from the customer.</p>
            <p className="mb-2">2. User: Opens the Financial Management System application.</p>
            <p className="mb-2">3. User: Navigates to the Installment Prepayment screen.</p>
            <p className="mb-2">4. User: Enters the payment details (Prepayment ID, Customer Name, Agreement ID, etc.).</p>
            <p className="mb-2">5. System: Allocates the prepayment amount towards the last installment, reducing the tenure.</p>
            <p className="mb-2">6. User: Saves the record or resets the details.</p>
            <p className="mb-2">7. System: Installment prepayment is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstallmentPrepayment;