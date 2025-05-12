import React from "react";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Server,
  GitBranch,
  Code,
} from "lucide-react";

interface WF_for_Capturing_Proposed_Asset_DetailsProps {}

const WF_for_Capturing_Proposed_Asset_Details: React.FC<
  WF_for_Capturing_Proposed_Asset_DetailsProps
> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Capturing Proposed Asset Details in LOS
      </h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case describes how a Bank Officer captures Proposed Asset
            details in the Loan Origination System (LOS) based on the
            applicant’s loan application form. These asset details are essential
            for further appraisal, loan assessment, and sanction processes.
          </p>
        </section>

        {/* Actors */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Users size={18} className="mr-2 text-blue-600" />
            Actors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800">Primary Actor</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Bank Officer</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">System Actors</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Loan Origination System (LOS)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Actions & System Responses */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            User Actions & System Responses
          </h2>
          <ol className="list-decimal pl-5 text-gray-700">
            <li>
              <strong>User Action:</strong> Bank Officer initiates asset entry
              after linking Customer ID to Loan Product.
              <br />
              <strong>System Response:</strong> LOS opens the Proposed Asset
              Details form.
            </li>
            <li>
              <strong>User Action:</strong> Officer reviews loan application for
              asset-related data.
              <br />
              <strong>System Response:</strong> N/A (Manual review step).
            </li>
            <li>
              <strong>User Action:</strong> Officer enters loan type and asset
              type.
              <br />
              <strong>System Response:</strong> LOS validates allowed loan and
              asset types.
            </li>
            <li>
              <strong>User Action:</strong> Officer inputs purpose of loan and
              asset cost.
              <br />
              <strong>System Response:</strong> System captures and stores
              entries.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters total purchase price,
              incidental cost, and other cost (if any).
              <br />
              <strong>System Response:</strong> System calculates total cost if
              configured.
            </li>
            <li>
              <strong>User Action:</strong> Officer provides market value and
              loan outstanding (for refinance).
              <br />
              <strong>System Response:</strong> System stores financial
              attributes.
            </li>
            <li>
              <strong>User Action:</strong> For home loans: Officer fills in
              address, land area, built-up area, stage of construction.
              <br />
              <strong>System Response:</strong> Conditional fields displayed by
              LOS based on loan type.
            </li>
            <li>
              <strong>User Action:</strong> Officer completes and saves the
              record.
              <br />
              <strong>System Response:</strong> LOS validates completeness and
              saves asset details.
            </li>
            <li>
              <strong>User Action:</strong> Officer proceeds to check proposed
              loan limit.
              <br />
              <strong>System Response:</strong> System redirects to proposed
              limit assessment section.
            </li>
          </ol>
        </section>

        {/* Precondition & Post Condition */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Precondition
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Customer ID has been created</li>
                <li>Customer ID is linked to a Loan Product</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Post Condition
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Proposed Asset details are successfully saved in LOS</li>
                <li>Officer can proceed to assess the proposed loan limit</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Straight Through Process (STP) */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <FileText size={18} className="mr-2 text-blue-600" />
            Straight Through Process (STP)
          </h2>
          <p className="text-gray-700">
            Link Customer ID → Enter Asset Details → Save → Proceed to Loan
            Assessment
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>Refinance case:</strong> System requires "Loan
              Outstanding" field.
            </li>
            <li>
              <strong>Non-home loan:</strong> Home loan-specific fields are
              hidden or disabled.
            </li>
            <li>
              <strong>Missing required fields:</strong> System prompts error
              messages before saving.
            </li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>Asset details incomplete:</strong> Validation error shown;
              user cannot proceed.
            </li>
            <li>
              <strong>Incorrect cost/market value entry:</strong> Error message
              with field highlight.
            </li>
            <li>
              <strong>Attempt to save without loan type:</strong> Mandatory
              field error prompt.
            </li>
          </ul>
        </section>

        {/* User Activity Diagram */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Flowchart)
          </h2>
          <p className="text-gray-700">
            Start → [Link Customer ID to Loan Product] → [Initiate Asset Details
            Entry] → [Enter General Asset Info] → [Enter Cost and Market Info] →
            [Enter Home Loan Info (if applicable)] → [Save] → [Proceed to
            Proposed Limit Check] → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot (Future Enhancements)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Auto-fetch property valuation via integration with external
              systems
            </li>
            <li>GIS integration for property location validation</li>
            <li>Document upload for property proofs</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>LOS Front-End (Web Form UI for Asset Details)</li>
            <li>Asset Master (Back-End Storage & Validation Engine)</li>
            <li>
              Product Rules Engine (For conditional fields and validation)
            </li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              All fields filled correctly: Asset details saved successfully
            </li>
            <li>Missing mandatory field: Error shown; form not submitted</li>
            <li>
              Refinance selected: Loan Outstanding field is visible and required
            </li>
            <li>Home loan selected: Address, area, stage fields are shown</li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure responsive form layout for all modules</li>
            <li>Mandatory field logic must be aligned with product type</li>
            <li>Field-level audit trail enabled for compliance</li>
          </ul>
        </section>

        {/* Dev Team Ownership */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <GitBranch size={18} className="mr-2 text-blue-600" />
            Dev Team Ownership
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>Squad:</strong> LOS Asset Management
            </li>
            <li>
              <strong>Product Owner:</strong> Mani - Dev (lead)
            </li>
            <li>
              <strong>Git Repo:</strong> /los-core/asset-capture
            </li>
            <li>
              <strong>Jira Reference:</strong> LOS-2153
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default WF_for_Capturing_Proposed_Asset_Details;
