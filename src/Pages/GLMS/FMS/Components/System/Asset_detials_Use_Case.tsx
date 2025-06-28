import React from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  List,
  AlertCircle,
} from "lucide-react";

interface Asset_detials_Use_CaseProps {}

const Asset_detials_Use_Case: React.FC<Asset_detials_Use_CaseProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Asset Details Use Case
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Use Case Name */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Use Case Name
          </h2>
          <p className="text-gray-700 leading-relaxed">WF_Asset Details</p>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes the process by which a user updates and
            maintains asset details, including insurance and inspection
            information, in the system post-purchase.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>User</li>
          </ul>
        </section>

        {/* Preconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Preconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              System must support entry and update of asset details, inspection
              details, and insurance information.
            </li>
          </ul>
        </section>

        {/* Postconditions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <CheckCircle size={18} className="mr-2 text-green-600" />
            Postconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Updated asset, inspection, and insurance details are saved in the
              database.
            </li>
          </ul>
        </section>

        {/* Main Flow */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Main Flow
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              User enters asset details in the system after purchase (e.g.,
              Supplier, Delivery Order Date, Asset Cost,
              Origination/Installation State, Registration Number).
            </li>
            <li>
              User physically identifies the asset and ensures its condition and
              insurance.
            </li>
            <li>
              User enters inspection details (e.g., Asset ID, Agreement No,
              Inspection Date, Remarks, Defect Reason).
            </li>
            <li>
              User enters insurance details (e.g., Asset Description, Nature of
              Insurance, Policy No, Coverage, Insured/Expiry Date, Premium,
              Insurance Company).
            </li>
            <li>System saves all updated details in the database.</li>
          </ol>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <p className="text-gray-700 leading-relaxed">None specified.</p>
        </section>

        {/* Exceptions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exceptions
          </h2>
          <p className="text-gray-700 leading-relaxed">None specified.</p>
        </section>

        {/* Assumptions */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Assumptions
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              User has access rights and proper training to enter and manage
              asset-related information.
            </li>
          </ul>
        </section>

        {/* Notes and Issues */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Notes and Issues
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Periodic inspections and insurance updates are essential to keep
              data current.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Asset_detials_Use_Case;