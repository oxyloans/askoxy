import React from "react";

// Main Component
const SettlementsChequeProcessing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Settlements: Cheque (Receipt/Payment) Processing
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            Receipt/Payments processing is used to process the instruments
            through which the receipt or payments have been made for further
            processing and updating the status of cheques. The receipts and
            payment cheques are processed in the cheque processing module of the
            Settlements. The receipts are executed for deposits, realization,
            bounces (cleared/unclear), and cancellations. The cheque can be put
            on hold if required for some reasons. The hold can be lifted as and
            when required. The payment made can also be cancelled through the
            Cheque processing screen.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">
              User processes the cheques for both Receipts & Payments.
            </li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">User collects the details of cheques.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">
            Receipt/Payment processing is done successfully.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              User opens the Financial Management System.
            </li>
            <li className="mb-1">
              User navigates to Receipt/Payment processing in Settlements.
            </li>
            <li className="mb-1">
              User enters the Payment/Receipt processing details in the
              following fields:
            </li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Payment Mode</li>
            <li className="mb-1">Agreement No.</li>
            <li className="mb-1">In Favor Of</li>
            <li className="mb-1">Cheque No.</li>
            <li className="mb-1">Date</li>
            <li className="mb-1">Amount</li>
            <li className="mb-1">Currency</li>
            <li className="mb-1">Cheque Type</li>
            <li className="mb-1">Branch Details</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              User saves the record once the details are captured.
            </li>
            <li className="mb-1">
              Receipt/Payment processing is completed successfully.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. User: Opens the Financial Management System.
            </p>
            <p className="mb-2">
              2. User: Navigates to Receipt/Payment processing in Settlements.
            </p>
            <p className="mb-2">
              3. User: Enters the Payment/Receipt processing details (e.g.,
              Payment Mode, Cheque No., Amount).
            </p>
            <p className="mb-2">4. User: Saves the record.</p>
            <p className="mb-2">
              5. System: Receipt/Payment processing is completed successfully.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettlementsChequeProcessing;
