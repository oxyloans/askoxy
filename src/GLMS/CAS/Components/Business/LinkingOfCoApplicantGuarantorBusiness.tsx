import React from 'react';

const LinkingOfCoApplicantGuarantorBusiness: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">LOS Workflow for Linking of Co-Applicant/Co-Obligant/Guarantor</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          Once the Customer ID is created and linked to the respective loan product, the Bank Officer links the Co-applicant/Co-obligant/Guarantors to the proposed loan of the customer before actually appraising the loan proposal.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actors</h2>
        <p>User (Bank Officer)</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <p>The user links Co-applicant/Co-obligant/Guarantors to the proposed loan of the customer.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <ol className="list-decimal ml-6">
          <li>Customer ID and Linking of Customer ID to Loan Product has already been done.</li>
          <li>All the concerned documents pertaining to the proposed loan account are submitted by the customer.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <ol className="list-decimal ml-6">
          <li>Updation of particulars regarding the Co-applicant/Co-obligant/Guarantor for the proposed loan.</li>
          <li>Creation of the Customer IDs for Co-applicant/Co-obligant/Guarantor is created.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>Customer submits the filled-in Loan application form along with the required documents.</li>
          <li>Bank officer verifies the documents submitted by the customer with the checklist & if any discrepancy requests the customer for providing the details in the application/submission of the valid documents if any.</li>
          <li>Once the Bank Officer is convinced with the application form & the documents, issues an acknowledgement to the customer & initiates the Customer Creation Process.</li>
          <li>The Bank Officer captures the customer details such as Personal Details, Communication Details, and Employment, Income details and links in LOS for Customer ID Creation.</li>
          <li>Once the details of the customer are captured, the bank officer links the Customer ID to the proposed Loan product and also the proposed asset details.</li>
          <li>The bank officer creates the Customer IDs for Co-applicant(s)/Co-obligant(s)/Guarantor(s) for the proposed loan of the customer with the following details:</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Personal Details</h3>
        <ul className="list-disc ml-6">
          <li>First Name</li>
          <li>Middle Name</li>
          <li>Last Name</li>
          <li>Father Name</li>
          <li>Date of Birth</li>
          <li>Gender</li>
          <li>Pan No</li>
          <li>Passport Details</li>
          <li>Marital Status</li>
          <li>No of Dependents</li>
          <li>Age of dependents</li>
          <li>Nationality</li>
          <li>Residential Status</li>
          <li>Religion</li>
          <li>Educational Qualification</li>
          <li>Earning Member in the Family (If any)</li>
          <li>Length of Relationship with the Bank</li>
          <li>Whether Existing Borrower</li>
          <li>Staff</li>
          <li>Account no</li>
          <li>Deposits with the Bank</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Communication Details</h3>
        <ul className="list-disc ml-6">
          <li>Current Address</li>
          <li>Current residence ownership</li>
          <li>Living duration in current residence</li>
          <li>Permanent Address</li>
          <li>Mobile no</li>
          <li>Landline no</li>
          <li>Email ID</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Employment Details</h3>
        <ul className="list-disc ml-6">
          <li>Occupation</li>
          <li>Name of the Company</li>
          <li>Address of the Company</li>
          <li>Designation</li>
          <li>Department</li>
          <li>Employee No</li>
          <li>Office Phone no</li>
          <li>Ext</li>
          <li>Fax</li>
          <li>No of Years in the present Company</li>
          <li>Previous employment history, etc.</li>
          <li>Total length of service</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Income & Expenses Details</h3>
        <ul className="list-disc ml-6">
          <li>Monthly Income</li>
          <li>Other Income</li>
          <li>Monthly Expenses</li>
          <li>Savings</li>
          <li>EMI Payment</li>
          <li>Stability of Income, etc.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Assets & Liabilities</h3>
        <p>
          The bank officer also captures the Assets and Liabilities position of the Co-Applicant/Co-obligant/Guarantor for arriving at the Net worth of the concerned parties.
        </p>

        <p>
          Once the above details are captured, the Bank Officer saves the record for Customer IDs creation of the Co-applicant/Co-obligant/Guarantor.
        </p>
        <p>
          Once the Customer IDs are created for the Co-applicant/Co-obligant/Guarantor, the Bank Officer initiates the process for linking the Co-applicant/Co-obligant/Guarantor details with the Applicant Loan Application.
        </p>
        <p>
          The Bank Officer selects/enters the following details to link the Co-applicant/Co-obligant/Guarantor details with the Applicant Loan Application:
        </p>
        <ul className="list-disc ml-6">
          <li>Select Applicant Type (Co-applicant/Co-obligant/Guarantor)</li>
          <li>Customer ID</li>
          <li>Name of the Person</li>
          <li>Relationship with the applicant</li>
          <li>Include income for eligibility</li>
          <li>Remarks</li>
        </ul>
        <p>
          Once the above details are selected/captured, the Bank Officer saves the record & Co-applicant/Co-obligant/Guarantor details get added to the applicant Loan application.
        </p>
        <p>
          Bank Officer proceeds further for capturing the Loan details requested by the customer in LOS.
        </p>
        <p>
          <strong>Note:</strong> If the Co-applicant/Co-obligant/Guarantor are existing customers of the Bank, the Bank Officer can fetch the details from the existing Customer IDs of the parties from the CBS.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flowchart</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
{`
Start
  |
  v
Customer submits loan application + documents
  |
  v
Bank Officer verifies documents
  |                           Yes
  v----------------------------> Any discrepancies?
  |                                   |
  | No                                v
  v                             Request customer for details/documents
Issue acknowledgement                |
  |                                   v
  v                             Documents corrected
Initiate Customer Creation           |
  |                                   |
  v                                   |
Capture Customer Details:
- Personal (Name, DOB, PAN, etc.)
- Communication (Address, Phone, Email)
- Employment (Company, Designation, etc.)
- Income & Expenses (Income, Savings, etc.)
  |
  v
Link Customer ID to Loan Product + Asset Details
  |
  v
Create Customer IDs for Co-applicant/Co-obligant/Guarantor
  |
  v
Capture Co-applicant Details:
- Personal (Name, DOB, PAN, etc.)
- Communication (Address, Phone, Email)
- Employment (Company, Designation, etc.)
- Income & Expenses (Income, Savings, etc.)
- Assets & Liabilities (Net Worth)
  |
  v
Save Co-applicant Customer IDs
  |
  v
Link Co-applicant to Loan Application:
- Select Type (Co-applicant/Co-obligant/Guarantor)
- Customer ID
- Name
- Relationship
- Include Income
- Remarks
  |
  v
Save Linking Details
  |
  v
Proceed with Loan Details Capture
  |
  v
End
`}
        </pre>
      </section>
    </div>
  );
};

export default LinkingOfCoApplicantGuarantorBusiness;