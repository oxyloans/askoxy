import React from "react";

// Main Component
const RepaymentDeferralBatchWise: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Repayment Deferral: Batch (Portfolio) Wise Deferral
        </h1>
        <section className="mb-4">
          <p className="mb-2">
            Deferral is an option in which a customer defers their future EMI
            for a certain period of time, and the bank charges some fees to do
            the same. Such scenarios happen mostly around festivals. The
            deferral process can be for individual finances, batch-wise, or
            globally for the entire portfolio.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Deferral Types:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">Finance Wise Deferral</li>
            <li className="mb-1">Batch Wise Deferral</li>
            <li className="mb-1">Constitution Based Deferral</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Batch Wise Deferral</h2>
          <p className="mb-2">
            Batch Wise Deferral is a process wherein deferral of Installment is
            done for the entire portfolio. Batch Wise deferral is usually
            provided to the customer during festive seasons and is applied to
            the entire portfolio. No deferral rule matrix is looked upon in case
            of global deferrals. Deferment fees will be charged in case of
            global deferrals. For global deferrals, a file will be provided that
            will have the list of finances for which deferral is to be done.
            This file will get uploaded into the system and the deferral process
            will be executed.
          </p>
          <h3 className="text-base font-bold mb-1">Actors:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User</li>
            <li className="mb-1">Checker</li>
          </ul>
          <h3 className="text-base font-bold mb-1">Actions:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              User: Initiates the Repayment deferral for the Batch (Portfolio).
            </li>
            <li className="mb-1">
              Checker: Verifies the Deferral record details and authorizes the
              same if found correct.
            </li>
          </ul>
          <h3 className="text-base font-bold mb-1">Pre Condition:</h3>
          <p className="mb-2">
            Existing Finance Account & Need for Repayment Deferral.
          </p>
          <h3 className="text-base font-bold mb-1">Post Condition:</h3>
          <p className="mb-2">
            Repayment Deferral marked to the Batch (Portfolio).
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              The User creates a file containing the Deferral details pertaining
              to the portfolio such as:
            </li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Agreement ID</li>
            <li className="mb-1">Customer Name</li>
            <li className="mb-1">Finance Amount</li>
            <li className="mb-1">No of Deferrals</li>
            <li className="mb-1">Deferral Effective Date</li>
            <li className="mb-1">Next Payment Date</li>
            <li className="mb-1">Deferral Charge Amount</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              Once the file is prepared, the User uploads the file into the
              system for Deferral marking.
            </li>
            <li className="mb-1">
              The User selects the file and upload date and submits for upload.
            </li>
            <li className="mb-1">
              Once the file is uploaded, the Checker verifies the file and
              authorizes the same if found correct.
            </li>
            <li className="mb-1">
              Once the file is authorized, the Customers pertaining to the
              portfolio will be notified on the deferral.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. User: Creates the Upload file for Deferral.
            </p>
            <p className="mb-2">
              2. User: Initiates the process for Batch Wise deferral marking.
            </p>
            <p className="mb-2">
              3. User: Selects the file in Deferral Option.
            </p>
            <p className="mb-2">4. User: Submits the record.</p>
            <p className="mb-2">
              5. Checker: Retrieves the deferral file and verifies the Deferral
              details.
            </p>
            <p className="mb-2 pl-4">
              - If discrepancy, User modifies the deferral details and resubmits
              for authorization.
            </p>
            <p className="mb-2">6. Checker: Authorizes if correct.</p>
            <p className="mb-2">
              7. System: Deferral marked successfully, and Customers are
              notified on the deferral.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RepaymentDeferralBatchWise;
