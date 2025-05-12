import React from 'react';

const WFLoanOrganizationSystemAppraisalBusiness: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Flow for Loan Appraisal</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Bank Officer evaluates the Loan Details, Income & Expenses of the Customer, Experience & Services of the Customer, Customer and Bank Terms and Conditions, and Verification details and gives the appraisal for the applied loan.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <p>Bank Officer</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <p>
          Bank Officer evaluates the Loan Details, Income & Expenses of the Customer, Experience & Services of the Customer, External Verification details, and provides the remarks for the appraisal.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>
            Customer ID created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived & particulars of the Co-applicant/Guarantor/Co-Obligant.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Loan appraisal note/Process note generated & the Bank Officer can proceed further with the Risk Analysis.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is created & linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived & particulars of the Co-applicant/Guarantor/Co-Obligant, the Bank Officer initiates the appraisal process.
          </li>
          <li>
            The Bank Officer requests & obtains the reports such as Legal Scrutiny Report (LSR) from the Bank's advocate, Security Valuation Report from the Engineers appointed by the Bank.
          </li>
          <li>
            The Bank Officer also obtains the Verification Report regarding customer's personal & employment details from the external/internal agencies appointed by the Bank, Income Verification Report from the Employer/IT department.
          </li>
          <li>
            The Bank Officer also obtains the Credit Information Report from the existing Bankers of the customer & also extracts the Credit Report from the Credit Information Bureau.
          </li>
          <li>
            Once the above information/reports are obtained from the various departments/agencies, the Bank Officer captures the report details into the Appraisal process in LOS.
          </li>
          <li>
            Once the details are captured, the Bank Officer saves the record for generation of Appraisal Note/Process Note.
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
  |
  v
Bank Officer initiates appraisal process
  |
  v
Request and obtain reports:
- Legal Scrutiny Report (LSR) from Bank's advocate
- Security Valuation Report from Bank's engineers
- Verification Report (personal & employment) from agencies
- Income Verification Report from Employer/IT department
- Credit Information Report from customer's bankers
- Credit Report from Credit Information Bureau
  |
  v
Capture report details in LOS appraisal process
  |
  v
Save record
  |
  v
Generate Appraisal Note/Process Note
  |
  v
Proceed to Risk Analysis
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WFLoanOrganizationSystemAppraisalBusiness;