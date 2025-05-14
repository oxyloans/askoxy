import React from "react";

// Main Component
const RepaymentDeferralFinanceWise: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Repayment Deferral: Finance Wise Deferral
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
          <h2 className="text-lg font-bold mb-2">Finance Wise Deferral</h2>
          <p className="mb-2">
            Finance Wise deferral is a process where deferral will be provided
            to a specific finance as per the customer’s request.
          </p>
          <h3 className="text-base font-bold mb-1">Actors:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Customer</li>
            <li className="mb-1">User</li>
            <li className="mb-1">Checker</li>
          </ul>
          <h3 className="text-base font-bold mb-1">Actions:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              Customer: Submits the request for Repayment deferral to the user.
            </li>
            <li className="mb-1">
              User: Initiates the Repayment deferral as per the request from the
              Customer by considering the Deferral rules.
            </li>
            <li className="mb-1">
              Checker: Verifies the Deferral record details and authorizes the
              same if found correct.
            </li>
          </ul>
          <h3 className="text-base font-bold mb-1">Pre Condition:</h3>
          <p className="mb-2">
            Existing Finance Account & Repayment Deferral request received from
            the customer.
          </p>
          <h3 className="text-base font-bold mb-1">Post Condition:</h3>
          <p className="mb-2">
            Repayment Deferral marked to the Finance Account.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              The Customer submits the request for Repayment Deferral by quoting
              the number of deferrals.
            </li>
            <li className="mb-1">
              The User verifies the Deferral request submitted by the customer
              and also verifies the Deferral rules pertaining to the Finance
              Account.
            </li>
            <li className="mb-1">
              Once the deferral rules satisfy for allowing deferral to the
              Finance Account, the User initiates the process for updation of
              deferral details into the system.
            </li>
            <li className="mb-1">
              The User retrieves the Finance Account details with the Agreement
              ID for updation of deferral details.
            </li>
            <li className="mb-1">
              The system displays the deferral screen with the following fields:
            </li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Agreement ID</li>
            <li className="mb-1">Agreement No</li>
            <li className="mb-1">Customer ID</li>
            <li className="mb-1">Customer Name</li>
            <li className="mb-1">Repayment Mode</li>
            <li className="mb-1">Repayment Frequency</li>
            <li className="mb-1">Finance Amount</li>
            <li className="mb-1">EMI Amount</li>
            <li className="mb-1">Date of Disbursement</li>
            <li className="mb-1">Disbursed Amount</li>
            <li className="mb-1">EMI O/s Amount</li>
            <li className="mb-1">Due Date</li>
            <li className="mb-1">Rate of Interest</li>
          </ul>
          <h3 className="text-base font-bold mb-1">
            Repayment Deferral Parameters:
          </h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Deferral Effective Date</li>
            <li className="mb-1">No of Deferral Required</li>
            <li className="mb-1">Deferral Charge Amount</li>
            <li className="mb-1">Next Repayment Date</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              The User captures the above details, generates the New Repayment
              Schedule, and submits the schedule for authorization.
            </li>
            <li className="mb-1">
              The New Repayment Schedule will be authorized by the Checker.
            </li>
            <li className="mb-1">
              Once the New Repayment Schedule is authorized, the same is
              notified to the customer.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. Customer: Submits the request letter for deferral.
            </p>
            <p className="mb-2">
              2. User: Verifies the Deferral request and the Deferral rules.
            </p>
            <p className="mb-2 pl-4">
              - If discrepancy, Customer modifies the Deferral request and
              resubmits.
            </p>
            <p className="mb-2">
              3. User: Initiates the process for Deferral marking.
            </p>
            <p className="mb-2">
              4. User: Retrieves the Finance Account details with the Agreement
              ID.
            </p>
            <p className="mb-2">
              5. User: Captures the details for deferral marking.
            </p>
            <p className="mb-2">6. User: Submits the Record.</p>
            <p className="mb-2">
              7. Checker: Retrieves the deferral record and verifies the
              details.
            </p>
            <p className="mb-2 pl-4">
              - If discrepancy, User modifies the Deferral record.
            </p>
            <p className="mb-2">8. Checker: Authorizes the record.</p>
            <p className="mb-2">
              9. System: Deferral marked successfully, and customer notified on
              deferral.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RepaymentDeferralFinanceWise;
