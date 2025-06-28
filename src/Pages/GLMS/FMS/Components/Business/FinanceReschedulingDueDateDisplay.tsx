import React from 'react';

interface FinanceReschedulingDueDateData {
  overview: string;
  actors: string[];
  actions: { role: string; description: string }[];
  preconditions: string[];
  postconditions: string[];
  workflow: {
    steps: string[];
    financeDetails: { name: string; value: string }[];
  };
}

const FinanceReschedulingDueDateDisplay: React.FC = () => {
  const data: FinanceReschedulingDueDateData = {
    overview: 'The Finance Rescheduling functionality allows the user to modify the Financial Details of the Finance. On the basis of the modification performed the system computes the new repayment schedule. The following transactions can be performed by the rescheduling functionality: Bulk Prepayment, Modification of Profit Rate, Modification of tenure, Modification of Due Date Change. During the lifetime of the finance deal a customer may come to bank & request for Change of Due date of the finance Installment to change the Due date of the Installment which will be paid in the future.',
    actors: ['Customer', 'User', 'Checker'],
    actions: [
      { role: 'Customer', description: 'Visits the Bank & submits the request for Due Date Change of the Finance Installment.' },
      { role: 'User', description: 'Initiates the process for Generation of New Repayment Schedule due to Due Date Change.' },
      { role: 'Checker', description: 'Verifies the New Repayment schedule & authorizes the same if found correct.' },
    ],
    preconditions: ['Existing Finance Account', 'Due Date Change to the Finance Account'],
    postconditions: ['Due date Change marked to the Finance Account', 'New Repayment schedule generated'],
    workflow: {
      steps: [
        'The Customer walks into the Bank & submits the request for Due Date change of the Finance Account.',
        'The User verifies the request & rule pertaining to the Due Date Change.',
        'Once the User satisfied with the Due Date Change request initiates the process for Due Date Change.',
        'Once the Due Date of the Finance account changed the user initiates the process for generation of New Repayment schedule.',
        'The User retrieves the Finance Account details with the Agreement ID for generation of New Repayment Schedule.',
        'The User modifies the Due Date of the Installment & submits the record for generation of New Repayment Schedule.',
        'The Checker retrieves the New Repayment Schedule with the Agreement ID & verifies the same & Authorizes if found correct.',
        'Once the record is authorized New Repayment schedule generated & customer is notified accordingly.',
      ],
      financeDetails: [
        { name: 'Finance No', value: 'TBD' },
        { name: 'Agreement ID', value: 'TBD' },
        { name: 'Loan Amount', value: 'TBD' },
        { name: 'Loan Original Tenure', value: 'TBD' },
        { name: 'Original Due Date', value: 'TBD' },
        { name: 'Outstanding Amount', value: 'TBD' },
        { name: 'Reschedule Effective Date', value: 'TBD' },
        { name: 'Repayment Effective Date', value: 'TBD' },
        { name: 'Bulk Refund Amount', value: 'TBD' },
        { name: 'Balance Tenure', value: 'TBD' },
        { name: 'Frequency', value: 'TBD' },
        { name: 'Rate of Interest', value: 'TBD' },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Work Flow – Finance Rescheduling: Due Date Change</h1>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700 text-sm sm:text-base">{data.overview}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Actors</h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
            {data.actors.map((actor, index) => (
              <li key={index}>{actor}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Actions</h2>
          <div className="space-y-2">
            {data.actions.map((action, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-base sm:text-lg font-semibold">{action.role}</h4>
                <p className="text-gray-700 text-sm sm:text-base">{action.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Preconditions</h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
            {data.preconditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Postconditions</h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
            {data.postconditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Workflow</h2>
          <h3 className="text-lg sm:text-xl font-medium mb-2">Steps</h3>
          <ol className="list-decimal pl-5 text-gray-700 text-sm sm:text-base">
            {data.workflow.steps.map((step, index) => (
              <li key={index} className="mb-2">{step}</li>
            ))}
          </ol>

          <h3 className="text-lg sm:text-xl font-medium mt-4 mb-2">Finance Account Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.workflow.financeDetails.map((detail, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-base sm:text-lg font-semibold">{detail.name}</h4>
                <p className="text-gray-700 text-sm sm:text-base">{detail.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FinanceReschedulingDueDateDisplay;