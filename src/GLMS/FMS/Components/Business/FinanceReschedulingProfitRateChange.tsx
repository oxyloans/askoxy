import React from "react";

// Main Component
const FinanceReschedulingProfitRateChange: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Finance Rescheduling: Rate of Interest Change
        </h1>
        <section className="mb-4">
          <p className="mb-2">
            The Finance Rescheduling functionality allows the user to modify the
            Financial Details of the Finance. On the basis of the modification
            performed, the system computes the new repayment schedule.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Transactions Supported:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">Bulk Prepayment</li>
            <li className="mb-1">Modification of Profit Rate</li>
            <li className="mb-1">Modification of Tenure</li>
            <li className="mb-1">Modification of Due Date Change</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">
            Modification of Rate of Interest
          </h2>
          <p className="mb-2">
            During the lifetime of the finance deal, a customer may visit the
            bank and request an Interest Rate Change of the Finance Account.
            This change will impact the tenure or installment amount.
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
              Customer: Visits the Bank and submits the request for Interest
              Rate Change of the Finance Account.
            </li>
            <li className="mb-1">
              User: Initiates the process for Generation of New Repayment
              Schedule due to Interest Rate Change.
            </li>
            <li className="mb-1">
              Checker: Verifies the New Repayment schedule and authorizes the
              same if found correct.
            </li>
          </ul>
          <h3 className="text-base font-bold mb-1">Pre Condition:</h3>
          <p className="mb-2">
            Existing Finance Account & Interest Rate Change to the Finance
            Account.
          </p>
          <h3 className="text-base font-bold mb-1">Post Condition:</h3>
          <p className="mb-2">
            Interest Rate Change marked to the Finance Account & New Repayment
            schedule generated.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              The Customer walks into the Bank and submits the request for
              Interest Rate change of the Finance Account.
            </li>
            <li className="mb-1">
              The User verifies the request and rules pertaining to the Interest
              Rate Change.
            </li>
            <li className="mb-1">
              Once the User is satisfied, they initiate the process for Interest
              Rate Change.
            </li>
            <li className="mb-1">
              After the Interest Rate of the Finance account is changed, the
              User initiates the process for generation of New Repayment
              schedule.
            </li>
            <li className="mb-1">
              The User retrieves the Finance Account details with the Agreement
              ID for generation of New Repayment Schedule.
            </li>
          </ul>
          <h3 className="text-base font-bold mb-1">System Displays:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Finance No</li>
            <li className="mb-1">Agreement ID</li>
            <li className="mb-1">Original Loan Amount</li>
            <li className="mb-1">Original Rate of Interest</li>
            <li className="mb-1">Original Tenure</li>
            <li className="mb-1">Due Date</li>
            <li className="mb-1">Reschedule Effective Date</li>
            <li className="mb-1">Repayment Effective Date</li>
            <li className="mb-1">Bulk Refund Amount</li>
            <li className="mb-1">Balance Tenure</li>
            <li className="mb-1">Frequency</li>
            <li className="mb-1">Modified Interest Rate</li>
            <li className="mb-1">
              The User modifies the Interest Rate of the Finance Account and
              submits the record for generation of New Repayment Schedule.
            </li>
            <li className="mb-1">
              The Checker retrieves the New Repayment Schedule with the
              Agreement ID, verifies, and authorizes if found correct.
            </li>
            <li className="mb-1">
              Once authorized, the New Repayment schedule is generated, and the
              customer is notified.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. Customer: Visits Bank, submits Interest Rate Change request.
            </p>
            <p className="mb-2">2. User: Verifies request and rules.</p>
            <p className="mb-2 pl-4">
              - If discrepancy, Customer modifies and resubmits.
            </p>
            <p className="mb-2">
              3. User: Retrieves Finance Account details with Agreement ID.
            </p>
            <p className="mb-2">
              4. User: Modifies Interest Rate, submits for New Repayment
              Schedule.
            </p>
            <p className="mb-2">
              5. User: Initiates New Repayment Schedule generation.
            </p>
            <p className="mb-2">
              6. Checker: Retrieves and verifies New Repayment Schedule.
            </p>
            <p className="mb-2 pl-4">
              - If discrepancy, User modifies and resubmits.
            </p>
            <p className="mb-2">7. Checker: Authorizes if correct.</p>
            <p className="mb-2">
              8. System: Generates New Repayment Schedule, notifies customer.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FinanceReschedulingProfitRateChange;
