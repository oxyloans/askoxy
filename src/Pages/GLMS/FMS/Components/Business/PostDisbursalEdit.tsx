import React from "react";

// Main Component
const PostDisbursalEdit: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Post Disbursal Edit
        </h1>
        <section className="mb-4">
          <p className="mb-2">
            The Post Disbursal Edit screen enables the user to update
            non-financial information such as guarantor, co-applicant details,
            finance details, prepay rates, address details, contact details,
            work details, remarks, and instrument details for a finance. Users
            can add new guarantor/co-applicant details but cannot update the
            guarantor and co-applicant details of existing customers.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">
              User modifies the Non Financial Information pertaining to the
              Finance Account.
            </li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">Existing/New Finance Account.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">
            Non Financial information pertaining to the Finance Account
            modified.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              The User initiates the process for modification of Non Financial
              information of the Finance Account.
            </li>
            <li className="mb-1">
              User enters the Agreement ID to retrieve the Finance Account for
              modification of Non Financial information.
            </li>
            <li className="mb-1">
              The Account details get displayed. The User selects the specific
              tab and modifies the details.
            </li>
          </ul>
          <h3 className="text-base font-bold mb-1">Guarantor Details:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">First Name</li>
            <li className="mb-1">Middle Name</li>
            <li className="mb-1">Last Name</li>
            <li className="mb-1">Father Name</li>
            <li className="mb-1">Date of Birth</li>
            <li className="mb-1">Gender</li>
            <li className="mb-1">Pan No</li>
            <li className="mb-1">Passport Details</li>
            <li className="mb-1">Marital Status</li>
            <li className="mb-1">No of Dependents</li>
            <li className="mb-1">Age of Dependents</li>
            <li className="mb-1">Nationality</li>
            <li className="mb-1">Residential Status</li>
            <li className="mb-1">Religion</li>
            <li className="mb-1">Educational Qualification</li>
            <li className="mb-1">Earning Member in the Family (If any)</li>
            <li className="mb-1">Length of Relationship with the Bank</li>
            <li className="mb-1">Whether Existing Borrower</li>
            <li className="mb-1">Staff</li>
            <li className="mb-1">Account No</li>
            <li className="mb-1">Deposits with the Bank</li>
            <li className="mb-1">Current Address</li>
            <li className="mb-1">Current Residence Ownership</li>
            <li className="mb-1">Living Duration in Current Residence</li>
            <li className="mb-1">Permanent Address</li>
            <li className="mb-1">Mobile No</li>
            <li className="mb-1">Landline No</li>
            <li className="mb-1">E-mail ID</li>
            <li className="mb-1">Occupation</li>
            <li className="mb-1">Name of the Company</li>
            <li className="mb-1">Address of the Company</li>
            <li className="mb-1">Designation</li>
            <li className="mb-1">Department</li>
            <li className="mb-1">Employee No</li>
            <li className="mb-1">Office Phone No</li>
            <li className="mb-1">Ext</li>
            <li className="mb-1">Fax</li>
            <li className="mb-1">No of Years in the Present Company</li>
            <li className="mb-1">Previous Employment History, etc.</li>
            <li className="mb-1">Total Length of Service</li>
            <li className="mb-1">Monthly Income</li>
            <li className="mb-1">Other Income</li>
            <li className="mb-1">Monthly Expenses</li>
            <li className="mb-1">Savings</li>
            <li className="mb-1">EMI Payment</li>
            <li className="mb-1">Stability of Income, etc.</li>
          </ul>
          <h3 className="text-base font-bold mb-1">Co-Applicant Details:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">First Name</li>
            <li className="mb-1">Middle Name</li>
            <li className="mb-1">Last Name</li>
            <li className="mb-1">Father Name</li>
            <li className="mb-1">Date of Birth</li>
            <li className="mb-1">Gender</li>
            <li className="mb-1">Pan No</li>
            <li className="mb-1">Passport Details</li>
            <li className="mb-1">Marital Status</li>
            <li className="mb-1">No of Dependents</li>
            <li className="mb-1">Age of Dependents</li>
            <li className="mb-1">Nationality</li>
            <li className="mb-1">Residential Status</li>
            <li className="mb-1">Religion</li>
            <li className="mb-1">Educational Qualification</li>
            <li className="mb-1">Earning Member in the Family (If any)</li>
            <li className="mb-1">Length of Relationship with the Bank</li>
            <li className="mb-1">Whether Existing Borrower</li>
            <li className="mb-1">Staff</li>
            <li className="mb-1">Account No</li>
            <li className="mb-1">Deposits with the Bank</li>
            <li className="mb-1">Current Address</li>
            <li className="mb-1">Current Residence Ownership</li>
            <li className="mb-1">Living Duration in Current Residence</li>
            <li className="mb-1">Permanent Address</li>
            <li className="mb-1">Mobile No</li>
            <li className="mb-1">Landline No</li>
            <li className="mb-1">E-mail ID</li>
            <li className="mb-1">Occupation</li>
            <li className="mb-1">Name of the Company</li>
            <li className="mb-1">Address of the Company</li>
            <li className="mb-1">Designation</li>
            <li className="mb-1">Department</li>
            <li className="mb-1">Employee No</li>
            <li className="mb-1">Office Phone No</li>
            <li className="mb-1">Ext</li>
            <li className="mb-1">Fax</li>
            <li className="mb-1">No of Years in the Present Company</li>
            <li className="mb-1">Previous Employment History, etc.</li>
            <li className="mb-1">Total Length of Service</li>
            <li className="mb-1">Monthly Income</li>
            <li className="mb-1">Other Income</li>
            <li className="mb-1">Monthly Expenses</li>
            <li className="mb-1">Savings</li>
            <li className="mb-1">EMI Payment</li>
            <li className="mb-1">Stability of Income, etc.</li>
          </ul>
          <h3 className="text-base font-bold mb-1">Address Details:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Current Address</li>
            <li className="mb-1">Current Residence Ownership</li>
            <li className="mb-1">Living Duration in Current Residence</li>
            <li className="mb-1">Permanent Address</li>
            <li className="mb-1">Mobile No</li>
            <li className="mb-1">Landline No</li>
            <li className="mb-1">E-mail ID</li>
          </ul>
          <h3 className="text-base font-bold mb-1">Work Details:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Occupation</li>
            <li className="mb-1">Name of the Company</li>
            <li className="mb-1">Address of the Company</li>
            <li className="mb-1">Designation</li>
            <li className="mb-1">Department</li>
            <li className="mb-1">Employee No</li>
            <li className="mb-1">Office Phone No</li>
            <li className="mb-1">Ext</li>
            <li className="mb-1">Fax</li>
          </ul>
          <h3 className="text-base font-bold mb-1">Instrument Details:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Cheque No</li>
            <li className="mb-1">Amount</li>
            <li className="mb-1">Bank Name</li>
            <li className="mb-1">Bank Branch</li>
            <li className="mb-1">Micr Code</li>
          </ul>
          <p className="mb-2">
            User modifies the required details and saves the record for
            modification of the details.
          </p>
          <p className="mb-2 font-bold">
            Note: User can add new guarantor/co-applicant details, but cannot
            update the guarantor and co-applicant details of existing customers.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. User: Initiates the process for modification of Non Financial
              Information of the Account.
            </p>
            <p className="mb-2">
              2. User: Retrieves the Account details with the Agreement ID.
            </p>
            <p className="mb-2">3. System: Displays Account Details.</p>
            <p className="mb-2">
              4. User: Modifies the Account details such as Address, Work
              Details, Finance Details, Instrument Details, and can add
              guarantor/co-applicant details.
            </p>
            <p className="mb-2">5. User: Saves the record for modification.</p>
            <p className="mb-2">6. System: Account Modified.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDisbursalEdit;
