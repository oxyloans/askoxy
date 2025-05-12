import React from 'react';

const WFLoanAssessmentBusiness: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Flow for Loan Assessment</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated & Risk Analysis completed, the Bank Officer initiates the process for Loan Assessment to arrive at the Maximum Loan that can be extended.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <p>Bank Officer</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <p>Bank Officer initiates the Loan Assessment process to arrive at the Maximum Loan Amount.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>
            Customer ID created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated & Risk Analysis completed.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Assessment process of Proposed Loan is completed & the Bank Officer proceeds further with Terms & Conditions to be specified.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated & Risk Analysis completed, the Bank Officer initiates the process for Loan Assessment to arrive at the Maximum Loan that can be extended.
          </li>
          <li>
            The Bank Officer ensures that the above said processes are completed & required information is captured in LOS, calculates to arrive at the Maximum loan amount that can be extended to the customer on the basis of the project cost, after deducting margin & other maximum & minimum cap limits of the product.
          </li>
          <li>
            The Assessment sheet should contain the following fields:
            <ul className="list-disc ml-6 mt-2">
              <li>Loan Amount requested by the customer</li>
              <li>Present Income of the customer</li>
              <li>Present value of the security</li>
              <li>Rate of Interest</li>
              <li>Loan Tenure</li>
              <li>Future period of service</li>
              <li>Repayment capacity of the customer</li>
              <li>Assessed Loan Amount</li>
            </ul>
          </li>
          <li>
            Once the above details are arrived in LOS, the Bank Officer verifies the same & adds his remarks for the change in assessment amount, if any.
          </li>
          <li>
            Once the Assessment process of Proposed Loan is completed, the Bank Officer proceeds further with Terms & Conditions to be specified.
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
  |
  v
Bank Officer initiates Loan Assessment process
  |
  v
Ensure all processes completed and calculate
Maximum Loan Amount based on:
- Project cost
- Margin
- Product max/min cap limits
  |
  v
Populate Assessment Sheet with:
- Loan Amount Requested
- Present Income
- Present Value of Security
- Rate of Interest
- Loan Tenure
- Future Period of Service
- Repayment Capacity
- Assessed Loan Amount
  |
  v
Bank Officer verifies details and adds remarks
for any changes in assessment amount
  |
  v
Any discrepancies?
  | Yes
  v
Resolve discrepancies
  |
  v
No
  |
  v
Loan Assessment completed
  |
  v
Proceed to Terms & Conditions
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WFLoanAssessmentBusiness;