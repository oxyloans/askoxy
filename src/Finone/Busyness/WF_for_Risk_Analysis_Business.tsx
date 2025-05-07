import React from 'react';

const WF_for_Risk_Analysis_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Flow for Risk Analysis</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          The first step in limiting credit risk involves screening customers to ensure that they have the willingness and ability to repay the amount. For this purpose, customer's character history with banks has to be scrutinized under risk analysis.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <p>Bank Officer</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <p>
          Bank Officer initiates the risk rating process of the customer by considering the customer’s Financial Details, Employment details, Personal Details, Security details, etc.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>
            Customer ID created and linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Risk Analysis is completed & the Bank Officer proceeds further for Assessment of the Loan.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is created & linked to the loan Account & all the Customer details captured in the LOS such as Proposed Asset details, Asset & Liabilities Details, Proposed Loan Limit arrived, particulars of the Co-applicant/Guarantor/Co-Obligant & Appraisal note/Process note generated, the Bank Officer initiates the Risk rating process.
          </li>
          <li>
            The Bank Officer obtains & verifies the various reports like Legal Scrutiny Report, Technical Report, Financial Verification Report, Employment/Personal Verification Report, etc., from various departments/agencies of the Bank.
          </li>
          <li>
            The Bank Officer verifies the Loan Application form for the Customer’s Financial Details, Employment Details, Personal Details, Security Details, etc.
          </li>
          <li>
            The Bank Officer evaluates the Customer’s risk rating by considering the following parameters:
            <ul className="list-disc ml-6 mt-2">
              <li>Personal Data:
                <ul className="list-disc ml-6">
                  <li>Age</li>
                  <li>Education</li>
                  <li>Occupation</li>
                  <li>No of dependents</li>
                  <li>Length of Service in present Job/Current Business</li>
                  <li>Existing Relationship with the Bank</li>
                  <li>Other Business support</li>
                  <li>Period of Stay in current Address</li>
                  <li>Type of ownership of the residence</li>
                  <li>Whether owning Two Wheeler/Four Wheeler</li>
                </ul>
              </li>
              <li>Income/Net Worth:
                <ul className="list-disc ml-6">
                  <li>Present Annual Income</li>
                  <li>Income Proof</li>
                  <li>Present Monthly deductions & deduction of proposed loan</li>
                  <li>Net worth</li>
                  <li>Undertaking letter for EMI deduction/Salary Credit</li>
                  <li>Income of spouse</li>
                </ul>
              </li>
              <li>Loan Details:
                <ul className="list-disc ml-6">
                  <li>Repayment Period</li>
                  <li>Security coverage</li>
                  <li>Enforceability of the security</li>
                  <li>Guarantor’s Net worth</li>
                  <li>Type of Loan</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            The Bank Officer gives the weightages for the above parameters to evaluate the Risk Rating score of the customer.
          </li>
          <li>
            Based on the Risk Rating score, the Customer will be categorized into different risk ratings & the same is captured into the LOS.
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
  |
  v
Bank Officer initiates Risk Rating process
  |
  v
Obtain and verify reports:
- Legal Scrutiny Report
- Technical Report
- Financial Verification Report
- Employment/Personal Verification Report
  |
  v
Verify Loan Application for:
- Financial Details
- Employment Details
- Personal Details
- Security Details
  |
  v
Evaluate Risk Rating based on:
- Personal Data:
  - Age
  - Education
  - Occupation
  - No of dependents
  - Length of Service
  - Bank Relationship
  - Business support
  - Period of Stay
  - Residence ownership
  - Vehicle ownership
- Income/Net Worth:
  - Annual Income
  - Income Proof
  - Monthly deductions
  - Net worth
  - EMI undertaking
  - Spouse’s income
- Loan Details:
  - Repayment Period
  - Security coverage
  - Security enforceability
  - Guarantor’s Net worth
  - Type of Loan
  |
  v
Assign weightages to parameters
Calculate Risk Rating score
  |
  v
Categorize customer into risk rating
Capture in LOS
  |
  v
Risk Analysis completed
  |
  v
Proceed to Loan Assessment
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WF_for_Risk_Analysis_Business;