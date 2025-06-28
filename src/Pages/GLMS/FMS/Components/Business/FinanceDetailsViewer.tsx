import React from 'react';

// Main Component
const FinanceDetailsViewer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Finance Details Viewer
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            After the finance is disbursed, details of the finance can be viewed from the Finance Viewer screen for further processing in the Financial Management System (FMS). FMS has a Finance Query screen, which can be used to search an application. One or more of the parameters provided in the query screen can be used to search a finance deal.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">Bank Officer</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">Bank Officer searches the finance details of a customer by using the Finance ID.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">The same finance details disbursed through customer acquisition search shall be viewed from the Finance Viewer screen.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">System shows the finance details in view mode.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Bank Officer opens the Financial Management System application.</li>
            <li className="mb-1">Bank Officer navigates to the Finance Query Screen and initiates the process for searching to view the finance details of the customer.</li>
            <li className="mb-1">Bank Officer views the following finance details fetched from the Loan Origination System:</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Date</li>
            <li className="mb-1">Branch Name</li>
            <li className="mb-1">Customer Name</li>
            <li className="mb-1">Co-Applicant Details</li>
            <li className="mb-1">Guarantor Details</li>
            <li className="mb-1">Requested Amount</li>
            <li className="mb-1">Sanctioned Amount</li>
            <li className="mb-1">Disbursal Date</li>
            <li className="mb-1">Disbursal Type</li>
            <li className="mb-1">Period</li>
            <li className="mb-1">Employer Details</li>
            <li className="mb-1">Employee Details</li>
            <li className="mb-1">Tenure</li>
            <li className="mb-1">Installments Details</li>
            <li className="mb-1">Installment Plan</li>
            <li className="mb-1">Frequency</li>
            <li className="mb-1">No. of Installments</li>
            <li className="mb-1">Installment Mode</li>
            <li className="mb-1">Advance Installment</li>
            <li className="mb-1">Due Date</li>
            <li className="mb-1">First Installment Date</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Bank Officer sees the complete finance details of the selected Finance ID and other finance-related details in view mode screen only.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. Bank Officer: Opens the Financial Management System application.</p>
            <p className="mb-2">2. Bank Officer: Navigates to the Finance Query Screen.</p>
            <p className="mb-2">3. Bank Officer: Initiates a search using the Finance ID to view customer finance details.</p>
            <p className="mb-2">4. System: Displays finance details (e.g., Customer Name, Sanctioned Amount, Tenure) fetched from the Loan Origination System in view mode.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FinanceDetailsViewer;