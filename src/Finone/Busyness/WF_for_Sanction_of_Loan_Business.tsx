import React from 'react';

const WF_for_Sanction_of_Loan_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Flow for Sanction of Loan</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed, Proposed Loan Amount assessed, Terms & conditions are finalized and recommendations are updated & forwarded to the sanctioning authorities. The Sanctioning Authorities reviews the Appraisal Note/Process note for approval of Loan.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <ul className="list-disc ml-6">
          <li>Bank Officer</li>
          <li>Sanctioning Authority</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <ul className="list-disc ml-6">
          <li>Bank Officer: Coordinates with the Customer/Agency/Department for the clearance of discrepancies & updates the same in LOS & forwards to the Sanctioning Authority for approval.</li>
          <li>Sanctioning Authority: Reviews the Appraisal Note/Process note for approval of Loan.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>
            Customer ID created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed, Proposed Loan Amount assessed, Terms & conditions are finalized and recommendations are updated & forwarded to the sanctioning authorities.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>The Sanctioning Authority updated the Sanction/rejection of Proposed Loan in LOS. The Bank Officer communicates the same to the customer.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, Risk Analysis completed, Proposed Loan Amount assessed, Terms & conditions are finalized and recommendations are updated & forwarded to the sanctioning authorities for approval of Loan.
          </li>
          <li>
            The Sanctioning Authority reviews the Appraisal Note/Process note for approval of Loan.
          </li>
          <li>
            If any discrepancy in the recommended proposal, the Sanctioning Authority comments on the discrepancies & insists for additional information/Reports.
          </li>
          <li>
            The Sanctioning Authority retransmits the proposal back to the Bank Officer for the clearance of the discrepancy.
          </li>
          <li>
            The Bank Officer views the comments given by the sanctioning authority & calls for additional information/report required from the customer/Agency/Department.
          </li>
          <li>
            Once the additional information/report is obtained by the Bank Officer, the same is updated in the Appraisal note/Process note in LOS & forwards the same to Sanctioning Authority for approval.
          </li>
          <li>
            The Sanctioning Authority reviews the modified Appraisal/Process note & if convinced with the additional information/report given, approves/sanctions the loan with additional condition (if any).
          </li>
          <li>
            If the Sanctioning Authority is not convinced with the Appraisal/Process note, rejects the Loan Proposal.
          </li>
          <li>
            Once the decision is made on the Loan Proposal, the same will be updated in LOS & forwarded to the concerned Bank Officer for further Process.
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
- Recommendations updated
  |
  v
Forward recommendations to Sanctioning Authority
  |
  v
Sanctioning Authority reviews Appraisal Note/Process Note
  |
  v
Discrepancies found?
  | Yes
  v
Sanctioning Authority comments and requests additional information/reports
  |
  v
Retransmit proposal to Bank Officer
  |
  v
Bank Officer obtains additional information/reports
  |
  v
Update Appraisal Note/Process Note in LOS
  |
  v
Forward updated note to Sanctioning Authority
  |
  v
Sanctioning Authority reviews updated note
  |
  v
Convinced with updates?
  | Yes            | No
  v               v
Approve Loan     Reject Loan
(with conditions Proposal
if any)
  |
  v
Update decision in LOS
  |
  v
Forward to Bank Officer for further processing
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WF_for_Sanction_of_Loan_Business;