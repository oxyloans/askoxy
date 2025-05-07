import React from 'react';

const WF_for_Evauating_the_Networth_of_the_Parties_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workflow for Evaluating the Net Worth of the Parties</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          The Bank Officer evaluates the Assets and Liabilities of the parties to arrive at their net worth.
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
          <li>The Bank Officer evaluates the Assets and Liabilities of the parties for arriving at the net worth.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Customer IDs have already been created for all the parties and linked to the proposed Loan.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Loan Limit checked & captured in LOS.</li>
          <li>The Bank Officer can proceed further for the Appraisal of the proposed loan.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Proposed Asset details are captured in the LOS, the Bank Officer checks the primary eligibility of the customer in LOS.
          </li>
          <li>
            The Bank Officer creates the Customer IDs for the Co-applicant / Co-obligant / Guarantor and links the same to the proposed loan of the customer.
          </li>
          <li>
            The Bank Officer initiates the process for evaluating the Assets & Liabilities of the Customer / Co-applicant / Co-obligant / Guarantor for arriving at the Net Worth of all the parties.
          </li>
          <li>
            The Bank Officer enters the following details regarding the Assets & Liabilities of the parties in LOS:
            <ul className="list-circle ml-6">
              <li>Assets Details (A):
                <ul className="list-square ml-6">
                  <li>Savings in Bank</li>
                  <li>Immovable Properties/Assets with Current Value</li>
                  <li>Deposits in Banks</li>
                  <li>Investments in Shares/Mutual Funds/Others</li>
                  <li>LIC Policies with Sum Assured, Date of Maturity & Surrender Value</li>
                </ul>
              </li>
              <li>Liabilities Details (B):
                <ul className="list-square ml-6">
                  <li>Borrowings from Banks/Others with Present Outstanding Balance</li>
                  <li>Liabilities with Employer with Present Outstanding Balance</li>
                  <li>Liabilities with Others with Present Outstanding Balance</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            The Bank Officer evaluates the above assets and liabilities of the Applicant / Co-applicant / Co-obligant / Guarantor and captures the same in LOS and arrives at the net worth of the parties (A-B).
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
Customer IDs created and linked to Proposed Loan
Proposed Asset details captured in LOS
  |
  v
Bank Officer checks primary customer eligibility in LOS
  |
  v
Bank Officer creates and links Customer IDs for:
- Co-applicant
- Co-obligant
- Guarantor
  |
  v
Bank Officer initiates evaluation of Assets & Liabilities
  |
  v
Bank Officer enters Assets & Liabilities details in LOS:
- Assets (A):
  - Savings in Bank
  - Immovable Properties/Assets (Current Value)
  - Deposits in Banks
  - Investments (Shares/Mutual Funds/Others)
  - LIC Policies (Sum Assured, Maturity, Surrender Value)
- Liabilities (B):
  - Borrowings (Banks/Others, Outstanding Balance)
  - Liabilities with Employer (Outstanding Balance)
  - Liabilities with Others (Outstanding Balance)
  |
  v
Bank Officer evaluates and captures in LOS:
- Net Worth = Assets (A) - Liabilities (B)
  |
  v
Proceed to Appraisal of Proposed Loan
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WF_for_Evauating_the_Networth_of_the_Parties_Business;