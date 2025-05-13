import React from 'react';

interface FinanceReschedulingData {
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

const FinanceReschedulingDisplay: React.FC = () => {
  const data: FinanceReschedulingData = {
    overview: 'The Finance Rescheduling functionality allows the user to modify the Financial Details of the Finance. On the basis of the modification performed the system computes the new repayment schedule. The following transactions can be performed by the rescheduling functionality: Bulk Prepayment, Modification of the Due Date of the finance, Modification of tenure. During the lifetime of the finance deal a customer may come to bank for making a Part/ Bulk Repayment towards the finance deal to reduce the profit to be paid in the future. In case a customer makes a bulk prepayment it will have an impact on the tenure or on installment amount. The bulk prepayment will be allocated towards accrued but not due profit first and then towards outstanding principal.',
    actors: ['Customer', 'User', 'Checker'],
    actions: [
      { role: 'Customer', description: 'Visits the bank Branch & makes a prepayment to the Finance Account.' },
      { role: 'User', description: 'Initiates the process for generation of New Repayment schedule due to Bulk Prepayment.' },
      { role: 'Checker', description: 'Verifies the New Repayment Schedule details & authorizes the same if found correct.' },
    ],
    preconditions: ['Existing Finance Account', 'Bulk Repayment to the Finance Account'],
    postconditions: ['Bulk Prepayment marked to the Finance Account', 'New Repayment schedule generated'],
    workflow: {
      steps: [
        'The Customer walks into the Bank & Submits the request for Bulk Payment along with the Cash/Cheque to the Finance Account.',
        'User verifies the Finance Account details & Initiates the process for making Bulk Prepayment.',
        'Once the Bulk prepayment is made, the User initiates the process for generation of New Repayment schedule due to Bulk Prepayment.',
        'The User retrieves the Finance Account details with the Agreement ID for generation of New Repayment Schedule.',
        'The User enters the Bulk Refund Amount & submits the record for generation of New Repayment Schedule.',
        'The Checker retrieves the New Repayment Schedule with the Agreement ID & verifies the same & Authorizes if found correct.',
        'Once the record is authorized New Repayment schedule generated & customer is notified accordingly.',
      ],
      financeDetails: [
        { name: 'Finance No', value: 'TBD' },
        { name: 'Agreement ID', value: 'TBD' },
        { name: 'Loan Type', value: 'TBD' },
        { name: 'Balance Outstanding', value: 'TBD' },
        { name: 'Original Tenure', value: 'TBD' },
        { name: 'Due Date', value: 'TBD' },
        { name: 'Bulk Refund Amount', value: 'TBD' },
        { name: 'Reschedule Effective Date', value: 'TBD' },
        { name: 'Repayment Effective Date', value: 'TBD' },
        { name: 'Balance Tenure', value: 'TBD' },
        { name: 'Frequency', value: 'TBD' },
        { name: 'Profit Rate', value: 'TBD' },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Work Flow – Finance Rescheduling: Bulk Prepayment</h1>

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

export default FinanceReschedulingDisplay;