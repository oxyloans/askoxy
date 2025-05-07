import React from 'react';

const WF_for_Capturing_Proposed_Asset_Details_Business: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workflow for Capturing Proposed Asset Details</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          The Bank Officer captures the Proposed Asset details in LOS.
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
          <li>The Bank Officer captures the Proposed Asset details in the LOS for further assessment & process.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ul className="list-disc ml-6">
          <li>Customer ID has already been created.</li>
          <li>Customer ID linked to the Loan Product.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ul className="list-disc ml-6">
          <li>Proposed Asset details captured in LOS.</li>
          <li>The Bank Officer can check the proposed limit.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>
            Once the Customer ID is linked to the Loan Product, the Bank Officer initiates the capturing of Proposed Asset details in LOS.
          </li>
          <li>
            The Bank Officer checks the application form for the Purpose of the loan & Proposed Asset details.
          </li>
          <li>
            The Bank Officer captures the Proposed Asset details in LOS such as:
            <ul className="list-circle ml-6">
              <li>Loan Type</li>
              <li>Type of Asset</li>
              <li>Purpose of Loan</li>
              <li>Asset Cost</li>
              <li>Total Purchase Price of the Asset</li>
              <li>Incidental Cost (if any)</li>
              <li>Other Cost (if any)</li>
              <li>Market Value of the Property</li>
              <li>Loan Outstanding (for refinance)</li>
              <li>Address of the Property (for home loan)</li>
              <li>Area of Land (for home loan)</li>
              <li>Built-up Area (for home loan)</li>
              <li>Stage of Construction (for home loan)</li>
            </ul>
          </li>
          <li>
            Once the above details are captured, the Bank Officer saves the record & proceeds further for checking the proposed limit/loan.
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
Customer ID created
  |
  v
Customer ID linked to Loan Product
  |
  v
Bank Officer initiates capturing of Proposed Asset details in LOS
  |
  v
Bank Officer checks application form for:
- Purpose of Loan
- Proposed Asset details
  |
  v
Bank Officer captures Proposed Asset details in LOS:
- Loan Type
- Type of Asset
- Purpose of Loan
- Asset Cost
- Total Purchase Price
- Incidental Cost (if any)
- Other Cost (if any)
- Market Value of Property
- Loan Outstanding (for refinance)
- Address of Property (for home loan)
- Area of Land (for home loan)
- Built-up Area (for home loan)
- Stage of Construction (for home loan)
  |
  v
Bank Officer saves record in LOS
  |
  v
Proceed to check proposed loan limit
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default WF_for_Capturing_Proposed_Asset_Details_Business;