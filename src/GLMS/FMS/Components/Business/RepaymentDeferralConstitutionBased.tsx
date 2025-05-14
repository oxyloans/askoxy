import React from "react";

// Main Component
const RepaymentDeferralConstitutionBased: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – Repayment Deferral: Constitution Based Deferral
        </h1>
        <section className="mb-4">
          <p className="mb-2">
            Deferral is an option in which a customer defers their future EMI
            for a certain period of time, and the bank charges some fees to do
            the same. Such scenarios happen mostly around festivals. The
            deferral process can be for individual finances, batch-wise, or
            globally for the entire portfolio.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Deferral Types:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">Finance Wise Deferral</li>
            <li className="mb-1">Batch Wise Deferral</li>
            <li className="mb-1">Constitution Based Deferral</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">
            Constitution Based Deferral
          </h2>
          <p className="mb-2">
            The Deferral screen has an option to select the constitution of the
            customer. The system allows users to set the deferral policy based
            on rules defined with respect to the customer segment. If the
            customer falls into the SME category, different rules can be defined
            applicable only to SME customers. The Deferral screen includes a
            List of Values (LoV) for selecting the constitution, and the
            finances displayed are based on the customer's constitution. If the
            constitution is selected as SME, the list of all finances under that
            constitution is displayed, and the user can select a single finance
            or all finances. In the Deferral Query screen, the user enters the
            deferral effective date and the number of deferrals. All selected
            finances will be deferred.
          </p>
          <h3 className="text-base font-bold mb-1">Actors:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User</li>
            <li className="mb-1">Checker</li>
          </ul>
          <h3 className="text-base font-bold mb-1">Actions:</h3>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              User: Initiates the Repayment deferral for Constitution Based
              process.
            </li>
            <li className="mb-1">
              Checker: Verifies the Deferral record details and authorizes the
              same if found correct.
            </li>
          </ul>
          <h3 className="text-base font-bold mb-1">Pre Condition:</h3>
          <p className="mb-2">
            Existing Finance Account & Need for Repayment Deferral.
          </p>
          <h3 className="text-base font-bold mb-1">Post Condition:</h3>
          <p className="mb-2">
            Repayment Deferral marked to the Finance Account through
            Constitution Based process.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              The User initiates the Deferral marking process through a
              constitution-based approach.
            </li>
            <li className="mb-1">
              The User selects the particular constitution to mark deferral in
              the Deferral option.
            </li>
            <li className="mb-1">
              System displays the list of Finance Accounts pertaining to the
              constitution.
            </li>
            <li className="mb-1">
              The User selects the Finance Account for which the deferral needs
              to be marked.
            </li>
            <li className="mb-1">
              Once the Finance Accounts are selected, the User enters the
              details in the following fields:
            </li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">Deferral Effective Date</li>
            <li className="mb-1">No of Deferrals</li>
          </ul>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              Once the above details are captured, the User submits the record
              for deferral marking.
            </li>
            <li className="mb-1">
              The Checker verifies the Deferral record details and authorizes
              the same if found correct.
            </li>
            <li className="mb-1">
              Once the record is authorized, the customers pertaining to the
              Finance Accounts are notified on the Deferral.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. User: Initiates the Deferral marking process with Constitution
              Based Approach.
            </p>
            <p className="mb-2">
              2. User: Selects the particular constitution in Deferral option.
            </p>
            <p className="mb-2">
              3. System: Displays the Finance Accounts pertaining to the
              Constitution.
            </p>
            <p className="mb-2">
              4. User: Selects the Finance Account for which the Deferral needs
              to be marked.
            </p>
            <p className="mb-2">
              5. User: Captures the Deferral details (Deferral Effective Date,
              No of Deferrals).
            </p>
            <p className="mb-2">6. User: Submits the record.</p>
            <p className="mb-2">
              7. Checker: Retrieves the Deferral record and verifies the
              Deferral details.
            </p>
            <p className="mb-2 pl-4">
              - If discrepancy, User modifies the Deferral details and resubmits
              for authorization.
            </p>
            <p className="mb-2">8. Checker: Authorizes if correct.</p>
            <p className="mb-2">
              9. System: Defers marked successfully, and customers are notified
              accordingly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RepaymentDeferralConstitutionBased;
