import React from 'react';

// Main Component
const NPAProvisioning: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – NPA Provisioning
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            Provisioning is a process in which a bank maintains a buffer for each finance if a client becomes delinquent. The provisioning of Finance amount and Profit amount can be done as per the regulatory definition and as per the internal definition.
          </p>
          <p className="mb-2">
            A bank carries out provisioning for both the secured and unsecured portions of finance. The portion of the finance amount backed by security is the secured portion, while the portion not backed by any security is the unsecured portion. The percentage of the finance amount to provision for secured and unsecured portions is defined using the Provisioning Master.
          </p>
          <p className="mb-2">
            Provisioning for the bank’s internal use is referred to as Internal Provisioning, and provisioning according to regulatory guidelines is referred to as Regulator Provisioning. The End of Day (EOD) processes handle the NPA Provisioning process. The provisioning processes can be run monthly, quarterly, or yearly.
          </p>
          <p className="mb-2">
            For each NPA stage, the Provisioning Master allows defining different provision percentages for secured and unsecured portions of the finances. The system automatically posts the provisioned amount to the General Ledger (GL) as per the NPA stage of the finance.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User defines provisioning to non-performing assets.</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Condition:</h2>
          <p className="mb-2">Only selected accounts are to be provisioned for NPA.</p>
          <h2 className="text-lg font-bold mb-2">Post Condition:</h2>
          <p className="mb-2">NPA provisioning is done successfully.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">User opens the Financial Management System application.</li>
            <li className="mb-1">User navigates to the Provisioning screen.</li>
            <li className="mb-1">User performs NPA provisioning in two ways:</li>
            <ul className="list-disc pl-5 mb-2">
              <li className="mb-1">Auto Provisioning NPA process with the following fields:</li>
              <ul className="list-disc pl-5 mb-2">
                <li className="mb-1">Provision ID</li>
                <li className="mb-1">Effective From</li>
                <li className="mb-1">NPA Criteria</li>
                <li className="mb-1">NPA Stage</li>
                <li className="mb-1">Constitution</li>
                <li className="mb-1">Secured Portion</li>
                <li className="mb-1">Unsecured Portion</li>
                <li className="mb-1">Authorized</li>
                <li className="mb-1">Unauthorized</li>
                <li className="mb-1">Both</li>
              </ul>
              <li className="mb-1">Manual Provisioning process with the following fields:</li>
              <ul className="list-disc pl-5 mb-2">
                <li className="mb-1">Date</li>
                <li className="mb-1">User ID</li>
                <li className="mb-1">Batch ID</li>
                <li className="mb-1">Product</li>
                <li className="mb-1">Previous Provisioned Amount</li>
                <li className="mb-1">Previous Additional Provision Amount</li>
                <li className="mb-1">Customer Name</li>
                <li className="mb-1">Secured Portion</li>
                <li className="mb-1">Unsecured Portion</li>
              </ul>
            </ul>
            <li className="mb-1">User saves the record after completion of NPA provisioning or cancels the details to reset.</li>
            <li className="mb-1">NPA provisioning is done successfully.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">1. User: Opens the Financial Management System application and navigates to the NPA Provisioning screen.</p>
            <p className="mb-2">2. User: Defines the NPA provisioning using Auto Provisioning or Manual Provisioning methods.</p>
            <p className="mb-2">3. User: Provisions for both secured and unsecured portions of all finance accounts.</p>
            <p className="mb-2">4. User: Submits the record.</p>
            <p className="mb-2 pl-4">- If any discrepancy, User corrects the details.</p>
            <p className="mb-2">5. System: NPA provisioning is completed successfully.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NPAProvisioning;