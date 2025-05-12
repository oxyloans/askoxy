import React from 'react';

const WFRecommendationsBusiness: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Flow for Recommendations</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed, Proposed Loan Amount assessed & Terms & conditions are finalized, the Bank Officer initiates the process for adding recommendations to the Proposed Loan.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <p>Bank Officer</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <p>Bank Officer initiates the process for adding the recommendations to the Proposed Loan.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>
            Customer ID created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed, Proposed Loan Amount assessed & Terms & conditions are finalized.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Adding of recommendation completed & the Appraisal/Process note forwarded to the Sanctioning authorities for approval.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed, Proposed Loan Amount assessed & Terms & conditions are finalized, the Bank Officer initiates the process for adding recommendations to the Proposed Loan.
          </li>
          <li>
            The Bank Officer updates his recommendations pertaining to the proposed loan in recommendation process such as:
            <ul className="list-disc ml-6 mt-2">
              <li>Loan Amount</li>
              <li>Rate of Interest</li>
              <li>Loan Tenure</li>
              <li>Proposed repayment</li>
            </ul>
          </li>
          <li>
            The Bank Officer also provides a proper justification for the recommended changes in the Loan Proposal.
          </li>
          <li>
            The Changes proposed & recommended will be entered & captured in LOS.
          </li>
          <li>
            Once the recommendations are updated, the Bank Officer saves the record & forwards the Appraisal note/Process note to the approving/Sanctioning authorities.
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
- Terms & conditions finalized
  |
  v
Bank Officer initiates Recommendation process
  |
  v
Update recommendations for:
- Loan Amount
- Rate of Interest
- Loan Tenure
- Proposed Repayment
  |
  v
Provide justification for recommended changes
  |
  v
Capture changes in LOS
  |
  v
Save record
  |
  v
Forward Appraisal/Process note to Sanctioning Authorities
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WFRecommendationsBusiness;