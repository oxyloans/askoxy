import React from "react";

// Main Component
const MaintainAssetDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Maintains the Asset Details
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            At the time of entering finance details in the Loan Origination
            System, information about the asset for which the finance is sought
            is entered. This information includes details such as type,
            description, cost, age, and remaining life of the asset. After the
            asset is purchased, the bank needs to ensure that the details of the
            asset are updated in the system. Also, the bank needs to
            periodically inspect the condition of the asset and ensure that it
            is insured adequately.
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
              User: Updates the Asset details and insurance details in the
              System.
            </li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">
            System should support to capture the Asset details and insurance
            details.
          </p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">
            Updated Asset details and insurance details saved in database.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              After the asset is purchased by the customer, the User updates and
              maintains the following details of the asset in the system:
            </li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Supplier</li>
            <li className="mb-1">Delivery Order Date</li>
            <li className="mb-1">Asset Cost</li>
            <li className="mb-1">Origination State</li>
            <li className="mb-1">Installation State</li>
            <li className="mb-1">Registration Number, etc.</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              Once the User updates the asset details in the system, the User
              needs to physically identify the asset and ensure that it is
              maintained in a good condition and is adequately insured, and
              maintains the following inspection details of the asset in the
              System:
            </li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Asset ID</li>
            <li className="mb-1">Agreement No</li>
            <li className="mb-1">Inspection Date</li>
            <li className="mb-1">Remarks</li>
            <li className="mb-1">Defect Reason (If any)</li>
            <li className="mb-1">Inspection Done By</li>
            <li className="mb-1">Next Inspection Date</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              After inspection details are entered in the system, the User
              captures the following insurance details in the system:
            </li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Asset Description</li>
            <li className="mb-1">Nature of Insurance</li>
            <li className="mb-1">Policy No</li>
            <li className="mb-1">Coverage / Insured Amount</li>
            <li className="mb-1">Insured Date</li>
            <li className="mb-1">Expiry Date</li>
            <li className="mb-1">Premium</li>
            <li className="mb-1">Insurance Company</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              System saves the updated details in the database.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. User: Maintains the details of the updated asset in the system.
            </p>
            <p className="mb-2">
              2. User: Physically identifies the asset and ensures it is
              maintained in a good condition.
            </p>
            <p className="mb-2">
              3. User: Maintains the inspection details of the asset and
              insurance details in the System.
            </p>
            <p className="mb-2">4. User: Submits the records.</p>
            <p className="mb-2">
              5. System: Saves the updated details in the database.
            </p>
            <p className="mb-2 pl-4">
              - For any modification, the User updates the details.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MaintainAssetDetails;
