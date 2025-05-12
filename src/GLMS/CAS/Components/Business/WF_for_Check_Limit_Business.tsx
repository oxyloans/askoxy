import React from 'react';

const WF_for_Check_Limit_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workflow for Checking the Eligibility of the Customer & Proposed Loan Limit</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          The Bank Officer checks the proposed loan limit by considering the customer Income, Expenditure, Asset cost & requested loan amount & tenure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <ul className="list-disc ml-6">
          <li>Bank Officer</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <ul className="list-disc ml-6">
          <li>The Bank Officer checks the proposed loan limit by considering the customer Income, Expenditure, Asset cost & requested loan amount & tenure.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Customer ID has already been created, linked to the Loan product & proposed asset details captured.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Loan Limit checked & captured in LOS.</li>
          <li>The Bank Officer can proceed further for capturing the Asset & Liabilities details of the customer.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Proposed Asset details are captured into the LOS, the Bank Officer initiates the process for checking the Loan limit & capturing the same in the LOS.
          </li>
          <li>
            The Bank Officer checks the application form for the Income, Expenditure, Asset details & Loan Amount & tenure.
          </li>
          <li>
            The Bank Officer enters the following customer details in the Loan calculator to check the primary eligibility of the customer & to arrive at the proposed loan limit:
            <ul className="list-circle ml-6">
              <li>Loan Type</li>
              <li>Date of Birth</li>
              <li>Purpose of Loan</li>
              <li>Asset Details</li>
              <li>Cost of Asset</li>
              <li>Loan Amount</li>
              <li>Loan Tenure</li>
              <li>Occupation</li>
              <li>Company Details</li>
              <li>Total Work Experience</li>
              <li>Age of Retirement</li>
              <li>Monthly Income</li>
              <li>Other Income</li>
              <li>Total EMI for the Existing Liabilities</li>
              <li>Co-Applicant Details</li>
            </ul>
          </li>
          <li>
            Once the above details are captured, the Bank Officer submits the record to arrive at the eligibility of the customer & the proposed Loan Limit.
          </li>
          <li>
            Once the Proposed Loan limit is obtained, the Bank Officer captures the same into the LOS.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flowchart</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
{`
Start
  |
  v
Customer ID created and linked to Loan Product
Proposed Asset details captured in LOS
  |
  v
Bank Officer initiates Loan Limit checking process in LOS
  |
  v
Bank Officer checks application form for:
- Income
- Expenditure
- Asset Details
- Loan Amount
- Tenure
  |
  v
Bank Officer enters customer details into Loan Calculator:
- Loan Type
- Date of Birth
- Purpose of Loan
- Asset Details
- Cost of Asset
- Loan Amount
- Loan Tenure
- Occupation
- Company Details
- Total Work Experience
- Age of Retirement
- Monthly Income
- Other Income
- Total EMI for Existing Liabilities
- Co-Applicant Details
  |
  v
Bank Officer submits record to determine:
- Customer Eligibility
- Proposed Loan Limit
  |
  v
Bank Officer captures Proposed Loan Limit in LOS
  |
  v
Proceed to capture Asset & Liabilities details
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WF_for_Check_Limit_Business;