import React from 'react';

// Main Component
const FloatingReviewProcess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Floating Review Process
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            The Floating Review Process is used to update the profit rate for all finances booked under the floating profit rate type. The system computes the new profit rate applicable for each finance agreement booked under the floating profit rate type, as per the spread and the modified anchor rate, and thus computes the updated repayment schedule applicable to it.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User reviews the floating rate process.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">Floating Rates and types shall be applied to all the financial instruments.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">Floating Rate Review is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to the Floating Review Process screen.</li>
            <li className="mb-1">User recalculates the floating profit rate depending on the change in Prime Lending Rate (PLR).</li>
            <li className="mb-1">User applies the prime rate types to all finances from the Floating Review Process page, including:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Prime Rate Type for EMI & Pre-EMI schedules</li>
            <li className="mb-1">EIBOR</li>
            <li className="mb-1">LIBOR</li>
            <li className="mb-1">Date</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User updates the Floating Rate Reference (FRR) on a daily basis and checks whether the system generates a new schedule for EMI if any changes are made in the profit rate.</li>
            <li className="mb-1">User saves the transaction once the floating review process is done or cancels to reset the details.</li>
            <li className="mb-1">Floating Review Process is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application.</p>
            <p className="mb-2">2. User: Navigates to the Floating Review Process screen.</p>
            <p className="mb-2">3. User: Recalculates the floating profit rate based on changes in the Prime Lending Rate (PLR).</p>
            <p className="mb-2">4. User: Applies prime rate types (e.g., EMI/Pre-EMI, EIBOR, LIBOR) to all finances.</p>
            <p className="mb-2">5. User: Updates the Floating Rate Reference (FRR) daily and verifies new EMI schedules if the profit rate changes.</p>
            <p className="mb-2">6. User: Saves the transaction or cancels to reset.</p>
            <p className="mb-2">7. System: Floating Rate Review is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FloatingReviewProcess;