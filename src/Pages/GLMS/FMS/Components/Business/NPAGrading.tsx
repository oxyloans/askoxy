import React from 'react';

// Main Component
const NPAGrading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – NPA Grading
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            The Bank assigns a grade to each finance based on the repayment pattern of the client. This information helps financing institutions ascertain the creditworthiness of the borrower and the likelihood of repayment within the specified time period. It also aids in identifying potential delinquent clients. The grading is subject to management decisions, and criteria may vary by product.
          </p>
          <p className="mb-2">
            A non-performing asset (NPA) refers to funds invested in finances not producing desired returns. An asset is considered non-performing when receivables are overdue for more than the number of days specified in the NPA criteria. The lender risks losing both the profit and the principal amount. Movement across NPA stages depends on the Days Past Due (DPD), calculated as the difference between the current date and the due date.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User defines grading before provisioning to non-performing assets.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">Only selected accounts are to be marked/graded for NPA.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">NPA stage is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to the Finance Grading screen.</li>
            <li className="mb-1">User defines the NPA stage for a finance account, such as Standard, Sub-standard, Doubtful, or Loss.</li>
            <li className="mb-1">User defines the NPA movements for finance accounts to derive the NPA stage:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Forward movement: Moved from a lower NPA stage to a higher NPA stage.</li>
              <li className="mb-1">Backward movement: Moved from a higher NPA stage to a lower NPA stage.</li>
            </ul>
            <li className="mb-1">User operates the NPA stage in two ways:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Automatic NPA marking</li>
              <li className="mb-1">Manual NPA marking</li>
            </ul>
            <li className="mb-1">User grades manually to the finance accounts by entering details in the following fields:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Agreement ID</li>
            <li className="mb-1">New NPA Stage</li>
            <li className="mb-1">Remarks</li>
            <li className="mb-1">NPA Change Date</li>
            <li className="mb-1">Current NPA Stage</li>
            <li className="mb-1">Final NPA Stage</li>
            <li className="mb-1">NPA Reason</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User saves the transaction after grading the NPA marking manually.</li>
            <li className="mb-1">NPA grading is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application and navigates to the Finance Grading screen.</p>
            <p className="mb-2">2. User: Defines the NPA stage for a finance account (e.g., Regular, Sub-standard, Bad, Write-off).</p>
            <p className="mb-2">3. User: Defines the NPA movements to derive the NPA stage (Forward or Backward movement).</p>
            <p className="mb-2">4. User: Operates the NPA stage automatically or manually.</p>
            <p className="mb-2">5. User: Processes the finance grading by entering details (e.g., Agreement ID, New NPA Stage, Remarks).</p>
            <p className="mb-2">6. User: Submits the record.</p>
            <p className="mb-2 pl-4">- If any discrepancy, User corrects the details.</p>
            <p className="mb-2">7. System: NPA stage is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NPAGrading;