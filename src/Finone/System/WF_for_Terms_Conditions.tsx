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

interface WF_for_Terms_ConditionsProps {}

const WF_for_Terms_Conditions: React.FC<WF_for_Terms_ConditionsProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Terms & Conditions in LOS
      </h1>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This use case outlines the process where the Bank Officer initiates,
            customizes, and finalizes the Terms & Conditions (T&C) for a
            proposed loan after completing customer and loan data entry. The
            Loan Origination System (LOS) assists by presenting default T&C
            based on product type and allows for addition, deletion, and
            modification before proceeding to recommendations.
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
                <li>Bank Officer - Reviews, customizes, and finalizes T&C</li>
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
              <strong>User Action:</strong> Bank Officer initiates the T&C entry
              for the proposed loan.
              <br />
              <strong>System Response:</strong> LOS displays a list of default
              (generic/product-specific) T&C.
            </li>
            <li>
              <strong>User Action:</strong> Officer reviews the listed T&C.
              <br />
              <strong>System Response:</strong> LOS provides interface to
              edit/delete existing T&C.
            </li>
            <li>
              <strong>User Action:</strong> Officer modifies or deletes default
              T&C if needed.
              <br />
              <strong>System Response:</strong> Changes are reflected
              immediately in the T&C section.
            </li>
            <li>
              <strong>User Action:</strong> Officer adds any
              additional/loan-specific T&C.
              <br />
              <strong>System Response:</strong> System updates Appraisal
              Note/Process Note accordingly.
            </li>
            <li>
              <strong>User Action:</strong> Officer finalizes and saves the
              complete T&C.
              <br />
              <strong>System Response:</strong> LOS validates and stores the
              finalized T&C.
            </li>
            <li>
              <strong>User Action:</strong> Officer proceeds to the next stage
              (recommendation submission).
              <br />
              <strong>System Response:</strong> System allows continuation in
              the workflow.
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
                <li>Customer ID and Loan Account are created and linked</li>
                <li>
                  All required customer and financial data have been entered in
                  LOS
                </li>
                <li>Appraisal/Process note is generated</li>
                <li>Risk Analysis and Loan Assessment completed</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Post Condition
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Finalized Terms & Conditions are saved in LOS</li>
                <li>Appraisal/Process Note is updated with T&C</li>
                <li>Workflow proceeds to recommendation stage</li>
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
            Default T&C → Review/Edit → Finalize → Proceed to Recommendation
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
              Bank Officer skips deletion/modification if all T&C are valid
            </li>
            <li>Only additional T&C are added without touching defaults</li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>System fails to load default T&C → Error message shown</li>
            <li>
              Bank Officer attempts to proceed without saving T&C → Validation
              error
            </li>
            <li>
              Invalid format or missing mandatory T&C → System blocks
              progression
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
            Start → [Initiate T&C Entry in LOS] → [System Displays Default T&C]
            → [Officer Reviews and Edits/Deletes T&C] → [Officer Adds Additional
            T&C if Required] → [Finalize and Save T&C] → [Proceed to
            Recommendation] → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot (Future Enhancements)
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Maintain version control of T&C history</li>
            <li>Enable digital acceptance of T&C by customer</li>
            <li>Auto-suggestion of T&C based on customer risk profile</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>LOS Web Interface for T&C Management</li>
            <li>T&C Rules Engine (for product-specific clauses)</li>
            <li>Workflow Engine</li>
            <li>Appraisal Note Generator</li>
          </ul>
        </section>

        {/* Test Scenarios */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Code size={18} className="mr-2 text-blue-600" />
            Test Scenarios
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>[ ] Bank Officer modifies and saves T&C successfully</li>
            <li>[ ] Additional T&C added and visible in Appraisal Note</li>
            <li>
              [X] Bank Officer tries to proceed without saving - error shown
            </li>
            <li>
              [X] T&C module fails to load defaults - error logged and notified
            </li>
          </ul>
        </section>

        {/* Infra & Deployment Notes */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            Infra & Deployment Notes
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Ensure product-type mappings for T&C are current</li>
            <li>T&C editor must be role-based (Bank Officer only)</li>
            <li>Ensure audit trail of T&C edits for compliance</li>
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
              <strong>Squad:</strong> LOS Documentation & Workflow
            </li>
            <li>
              <strong>Contact:</strong> Product Owner - LOS Core
            </li>
            <li>
              <strong>Git Repo:</strong> /los-core/terms-conditions-module
            </li>
            <li>
              <strong>Jira Ref:</strong> LOS-2112
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default WF_for_Terms_Conditions;