import React from 'react';

const CustomerIdCreation: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">LOS Workflow for Customer ID Creation</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          Loan Origination System is a centralized web-based solution designed and developed for processing Loan Applications. It has different modules such as Retail, Corporate, etc. The main advantages of the Loan Origination system are Appraisal of Loan Proposals by adopting uniform guidelines across the Bank and Facility for electronic workflow, thereby avoiding delays attributable to exchange of correspondence between Branch and Zonal Offices.
        </p>
        <p>
          User has to just key in information available in loan application. System picks up Rate of Interest, Margin, product guidelines for a specific product selected by the user, checks the discretionary powers while sanctioning. User can generate reports like Credit Score Sheet, Process note, Sanction letter, Communication of Sanction to borrower, worksheet for assessment, etc. from the system.
        </p>
        <p>
          In LOS every Customer is given an identification number called Customer ID which is unique throughout the bank. Existence of a Customer ID is a prerequisite for any relationship with the Bank. Customer information is captured and maintained in Customer Master.
        </p>
        <p>
          In 'Customer Master Maintenance' creation the Bank Officer needs to capture various customer details such as Personal Details, Communication Details, and Employment Details & Income & Expenses Details Tabs.
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
        <p>
          <strong>Customer:</strong> Enquires with the Bank Officer for the Loan details & submits the filled-in Application form along with the required documents.
        </p>
        <p>
          <strong>Bank Officer:</strong> Captures the Customer details into LOS to Create Customer.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preconditions</h2>
        <p>Receipt of filled-in Loan Application & required documents from the Customer.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Post Conditions</h2>
        <p>Customer ID created & Bank Officer can capture the loan details as requested by the customer in the LOS.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Workflow</h2>
        <ul className="list-disc ml-6">
          <li>Customer walks into the Bank Branch/interacts with the Bank officer & enquires about the process for obtaining the loan from the Bank.</li>
          <li>Bank Officer enquires the purpose of the Loan, Financial details of the customer & briefs the customer about the loan product features & the required documents.</li>
          <li>Customer submits the filled-in Loan application form along with the required documents.</li>
          <li>Bank officer verifies the documents submitted by the customer with the checklist & if any discrepancy requests the customer for providing the details in the application/submission of the valid documents if any.</li>
          <li>Once the Bank Officer is convinced with the application form & the documents, issues an acknowledgement to the customer & initiates the Customer Creation Process.</li>
          <li>The Bank Officer captures the customer details such as Personal Details, Communication Details, and Employment & Income details in LOS for Customer ID Creation.</li>
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

        <p>
          Once the above details are captured, the Bank Officer saves the record for Customer ID creation.
        </p>
        <p>
          Customer ID created & Bank Officer can capture the Loan details requested by the customer in LOS to proceed further.
        </p>
        <p>
          <strong>Note:</strong> If the customer is an existing customer of the Bank, the Bank Officer can fetch the customer details from the existing Customer ID details from the CBS.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flowchart</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
{`
Start
  |
  v
Customer enquires about loan
  |
  v
Bank Officer explains loan products & required documents
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
Save Customer Details
  |
  v
Customer ID Created
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

export default CustomerIdCreation;