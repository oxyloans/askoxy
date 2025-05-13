import React from 'react';

interface DocumentMasterData {
  overview: string;
  actors: string;
  actions: string;
  preconditions: string[];
  postconditions: string[];
  workflow: {
    steps: string[];
    documentDetails: { name: string; value: string }[];
  };
}

const DocumentMasterDisplay: React.FC = () => {
  const data: DocumentMasterData = {
    overview: 'System provides provision of maintaining a master set-up of documents that can be tracked across various contract stages such as at contract discounting, post contract purchase, rescheduling etc. A master list of documents is maintained in the system through the document master. User can select the relevant documents from this list and master maintains a separate document checklist based on finance type, customer constitution, customer segment, product or plan. At each stage user may include a master document directly at the transactional stage if it is not part of the master checklist. At each stage the documents can be marked as pending, waived, completed or incomplete.',
    actors: 'User',
    actions: 'User updates the Document Master with the list of Documents as waived/pending/complete/incomplete.',
    preconditions: ['Existing Finance Account'],
    postconditions: ['Document status updated in Document Master'],
    workflow: {
      steps: [
        'The User initiates the process for updation of the document master with the document status pertaining to the Finance Account.',
        'The User retrieves the Document Master pertaining to the Finance Account with the Agreement ID.',
        'The User updates the Document Master with the Finance Account documents & saves the record.',
        'The Document Master also helps in the tracking of deferral.',
      ],
      documentDetails: [
        { name: 'Document Stage', value: 'TBD' },
        { name: 'Document For', value: 'TBD' },
        { name: 'Customer Name', value: 'TBD' },
        { name: 'Finance Type', value: 'TBD' },
        { name: 'Guarantor/ Co-Applicant', value: 'TBD' },
        { name: 'Maker ID', value: 'TBD' },
        { name: 'Checker ID', value: 'TBD' },
        { name: 'Description', value: 'TBD' },
        { name: 'Document', value: 'TBD' },
        { name: 'Mandatory', value: 'TBD' },
        { name: 'Status', value: 'TBD' },
        { name: 'Date', value: 'TBD' },
        { name: 'Tracker No', value: 'TBD' },
        { name: 'Reason', value: 'TBD' },
        { name: 'Target Date', value: 'TBD' },
        { name: 'Validity Date', value: 'TBD' },
        { name: 'Remarks', value: 'TBD' },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Work Flow – Document Master</h1>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700 text-sm sm:text-base">{data.overview}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Actors</h2>
          <p className="text-gray-700 text-sm sm:text-base">{data.actors}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Actions</h2>
          <p className="text-gray-700 text-sm sm:text-base">{data.actions}</p>
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

          <h3 className="text-lg sm:text-xl font-medium mt-4 mb-2">Document Master Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.workflow.documentDetails.map((detail, index) => (
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

export default DocumentMasterDisplay;