import React from 'react';

const LinkingOfCustomerIdToLoanBusiness: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">LOS Workflow for Linking of Customer ID to the Loan Product</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Once the Customer ID is created, the Bank Officer links the Customer ID to the respective Loan Product before actually appraising the loan proposal.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <p>User (Bank Officer)</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <ul className="list-disc ml-6">
          <li>The user links the Customer ID to the Loan product.</li>
          <li>
            The user enters all the information regarding the personal details of the customer, Employment details, Income details, Loan Details, Repayment period, Security details, Credit Information Report, etc. and generates the Loan proposal and forwards the same to the sanctioning authority for sanction/approval.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ol className="list-decimal ml-6">
          <li>Customer ID has already been created.</li>
          <li>All the concerned documents pertaining to the proposed loan account are submitted by the customer.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ol className="list-decimal ml-6">
          <li>The Customer ID is linked to a particular Loan account.</li>
          <li>Updation of particulars of the proposed Asset pertaining to the proposed loan.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is created or fetched from the CBS for the existing Customer of the bank, the bank officer initiates the process to link the Customer ID to a particular loan product.
          </li>
          <li>The bank officer checks the application for the purpose of the loan requested by the customer.</li>
          <li>On the basis of the above, the bank officer selects the loan product to be linked to the Customer ID in LOS.</li>
          <li>After selecting the Loan Product, the Bank Officer enters the following details in LOS:</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Loan Product Details</h3>
        <ul className="list-disc ml-6">
          <li>Loan Amount Requested</li>
          <li>Project Cost</li>
          <li>Interest Type</li>
          <li>Interest Rate</li>
          <li>Initial Holiday Period required</li>
          <li>Loan Period</li>
          <li>Periodicity of Installments</li>
          <li>% of margin required</li>
          <li>Margin offered by the customer</li>
          <li>Purpose of Loan</li>
        </ul>

        <p>
          The bank officer also gives a brief description pertaining to the loan requested by the customer taking into account the Income & Expenditure, Repayment Capacity, and other parameters already mentioned above.
        </p>
        <p>
          The Bank officer saves the record and linking of the Customer ID with the Loan Product is completed.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flowchart</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
{`
Start
  |
  v
Customer ID created or fetched from CBS
  |
  v
Bank Officer initiates linking process
  |
  v
Check loan application for purpose
  |
  v
Select Loan Product in LOS
  |
  v
Enter Loan Product Details:
- Loan Amount Requested
- Project Cost
- Interest Type
- Interest Rate
- Initial Holiday Period
- Loan Period
- Periodicity of Installments
- % of margin required
- Margin offered
- Purpose of Loan
  |
  v
Provide brief description:
- Income & Expenditure
- Repayment Capacity
- Other parameters
  |
  v
Save record
  |
  v
Customer ID linked to Loan Product
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default LinkingOfCustomerIdToLoanBusiness;