import React from 'react';

const WF_for_Terms_Conditions_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Flow for Terms & Conditions</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed & Proposed Loan Amount assessed, the Bank Officer initiates the process for adding Terms & Conditions for the Proposed Loan.
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
          <li>Bank Officer: Initiates the process for adding the Terms & Conditions for the proposed Loan.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>
            Customer ID created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed & Proposed Loan Amount assessed.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Process for finalization of Terms & Conditions is completed & the Bank Officer proceeds further for recommendation.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed & Proposed Loan Amount assessed, the Bank Officer initiates the process for adding Terms & Conditions for the Proposed Loan.
          </li>
          <li>
            LOS displays the Terms & Conditions which are specific & generic to the product.
          </li>
          <li>
            The Bank Officer views the generic Terms & Conditions & can modify/delete the Terms & Conditions in LOS.
          </li>
          <li>
            The Bank Officer can add the required additional terms & conditions to the Appraisal note/Process note in LOS, if any.
          </li>
          <li>
            Once the Terms & Conditions are finalized, the Bank Officer saves the record & proceeds further for recommendation.
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
Customer ID created and linked to loan account
All customer details captured in LOS:
- Proposed Asset details
- Asset & Liabilities details
- Proposed Loan Limit
- Co-applicant/Guarantor/Co-Obligant details
- Appraisal note/Process note generated
- Risk Analysis completed
- Proposed Loan Amount assessed
  |
  v
Bank Officer initiates Terms & Conditions process
  |
  v
LOS displays generic and product-specific Terms & Conditions
  |
  v
Bank Officer reviews Terms & Conditions
  |
  v
Modify or delete Terms & Conditions?
  | Yes
  v
Bank Officer modifies/deletes Terms & Conditions in LOS
  |
  v
Add additional Terms & Conditions?
  | Yes
  v
Bank Officer adds additional Terms & Conditions to Appraisal Note/Process Note
  |
  v
Finalize Terms & Conditions
  |
  v
Bank Officer saves record in LOS
  |
  v
Proceed to recommendation
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WF_for_Terms_Conditions_Business;