import React from 'react';

const WF_for_Sanction_Letter_Generation_Customer_Response_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Flow for Sanction Letter Generation & Customer Response</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Once the Loan Proposal is generated & forwarded to the Sanctioning authorities & approved/rejected by the sanctioning authorities, the Bank Officer generates the Sanction/Rejection letter to communicate the Loan status to the customer & obtains the response from the Customer & updates the same in LOS.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <ul className="list-disc ml-6">
          <li>Customer</li>
          <li>Bank Officer</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <ul className="list-disc ml-6">
          <li>Customer: Receives the Loan offer & Acknowledges the Offer in case of acceptance.</li>
          <li>Bank Officer: Generates the Sanction/Rejection letter to communicate the Loan status to the customer & Obtains the response from the customer, updates the same in LOS.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Loan Proposal has already been Approved/Rejected by the Sanctioning Authorities.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Loan Offer Accepted by the customer & the Bank Officer initiates the process for Opening Loan Account in CBS.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Loan Proposal is generated & forwarded to the Sanctioning authorities & the sanctioning authority approves/rejects the Loan Proposal.
          </li>
          <li>
            Based on the decision of Sanctioning Authority, the Bank Officer generates the Sanction/Rejection letter to communicate the Loan status to the customer which consists of the following details:
            <ul className="list-disc ml-6 mt-2">
              <li>Name of the customer</li>
              <li>Name of Co-applicant</li>
              <li>Address of the Applicant/Co-applicant</li>
              <li>Type of Loan</li>
              <li>Loan Status</li>
              <li>Loan Amount</li>
              <li>Rate of Interest</li>
              <li>Loan Tenure</li>
              <li>EMI</li>
              <li>Repayment Schedule</li>
              <li>Holiday Period (if any)</li>
              <li>Guarantor details</li>
              <li>Terms & Conditions</li>
              <li>Time clause for availment of Loan</li>
              <li>Remarks</li>
            </ul>
          </li>
          <li>
            Once the Loan Sanction/Rejection letter is generated, the Bank Officer forwards the same to the customer to communicate the Loan status & to obtain the acceptance.
          </li>
          <li>
            The Customer receives the Sanction/Rejection letter & gives his Acceptance by acknowledging the Offer & returns the same to the Bank Officer.
          </li>
          <li>
            In case of Loan Offer rejection by the Customer, intimates the same to the Bank Officer.
          </li>
          <li>
            Based upon the response from the customer, the Bank Officer updates the customer's response in the LOS.
          </li>
          <li>
            Once the customer's acceptance is received by the Bank Officer, initiates the process for Opening of Loan Account in CBS by capturing the Loan details from the LOS.
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
Loan Proposal generated and forwarded to Sanctioning Authorities
  |
  v
Sanctioning Authority approves/rejects Loan Proposal
  |
  v
Bank Officer generates Sanction/Rejection letter with:
- Customer Name
- Co-applicant Name
- Applicant/Co-applicant Address
- Type of Loan
- Loan Status
- Loan Amount
- Rate of Interest
- Loan Tenure
- EMI
- Repayment Schedule
- Holiday Period
- Guarantor Details
- Terms & Conditions
- Time Clause for Loan Availment
- Remarks
  |
  v
Forward letter to Customer
  |
  v
Customer receives letter
  |
  v
Customer responds
  |-----------------|
  v                 v
Accepts Offer     Rejects Offer
  |                 |
  v                 v
Acknowledge       Intimate
Offer             Rejection
  |                 |
  v                 v
Bank Officer updates response in LOS
  |
  v
Offer Accepted?
  | Yes
  v
Initiate Opening of Loan Account in CBS
  |
  v
End
  | No
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WF_for_Sanction_Letter_Generation_Customer_Response_Business;