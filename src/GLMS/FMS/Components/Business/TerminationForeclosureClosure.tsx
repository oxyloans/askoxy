import React from 'react';

// Main Component
const TerminationForeclosureClosure: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Termination / Foreclosure / Closure
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            The closure of a finance account is called termination. Termination refers to the closure of a finance account at the end of the stipulated period after the repayment of principal and profit amount in full. However, termination can also be done before the stipulated period, known as early termination or foreclosure of finance. Early termination occurs if the client repays the entire finance amount before the scheduled termination date. Usually, early termination is penalized with a fee, as specified in the finance.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User processes the termination or foreclosure of the finance accounts.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">Only selected accounts are to be terminated or foreclosed.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Termination or foreclosure is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to the Finance Termination screen page.</li>
            <li className="mb-1">User enters at least one ID from the following options:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">App ID</li>
              <li className="mb-1">Customer ID</li>
              <li className="mb-1">Branch ID</li>
            </ul>
            <li className="mb-1">User checks the details of the application status, including:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Agreement ID</li>
              <li className="mb-1">Agreement Date</li>
              <li className="mb-1">Amount Financed</li>
              <li className="mb-1">Frequency</li>
              <li className="mb-1">Customer Name</li>
              <li className="mb-1">Tenure</li>
              <li className="mb-1">Agreement No.</li>
            </ul>
            <li className="mb-1">User checks the following fields for ‘Dues’ and ‘Refunds’ before termination or foreclosure of the account:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Dues:</li>
              <ul className="list-disc pl-5 mb-2">
                <li className="mb-1">Principal Amount</li>
                <li className="mb-1">Residual Value</li>
                <li className="mb-1">Past Due Installments</li>
                <li className="mb-1">Outstanding Payments</li>
                <li className="mb-1">Total Dues</li>
              </ul>
              <li className="mb-1">Refunds:</li>
              <ul className="list-disc pl-5 mb-2">
                <li className="mb-1">Excess Amount</li>
                <li className="mb-1">Excess Refunds</li>
                <li className="mb-1">Advice</li>
                <li className="mb-1">Rebate</li>
                <li className="mb-1">Advance Installments</li>
                <li className="mb-1">Total Refunds</li>
              </ul>
            </ul>
            <li className="mb-1">After making modifications or updates to the accounts, the User processes the payment, and the outstanding balance becomes zero, closing the account.</li>
            <li className="mb-1">To foreclose the account, the User levies some fees to the customer.</li>
            <li className="mb-1">Termination or account foreclosure is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application.</p>
            <p className="mb-2">2. User: Navigates to the Finance Termination screen.</p>
            <p className="mb-2">3. User: Enters at least one ID (App ID, Customer ID, or Branch ID).</p>
            <p className="mb-2">4. User: Checks application status details (e.g., Agreement ID, Customer Name).</p>
            <p className="mb-2">5. User: Reviews Dues (e.g., Principal Amount, Total Dues) and Refunds (e.g., Excess Amount, Rebate).</p>
            <p className="mb-2">6. User: Processes payment to clear the outstanding balance and levies fees for foreclosure if applicable.</p>
            <p className="mb-2">7. System: Termination or foreclosure is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TerminationForeclosureClosure;