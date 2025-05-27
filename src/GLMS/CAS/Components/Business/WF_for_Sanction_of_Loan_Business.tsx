import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

interface WF_for_Sanction_of_Loan_BusinessProps {}

const WF_for_Sanction_of_Loan_Business: React.FC<
  WF_for_Sanction_of_Loan_BusinessProps
> = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: true,
    actors: true,
    actions: true,
    preconditions: true,
    postconditions: true,
    workflow: true,
    flowchart: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center sm:text-left">
            Work Flow for Sanction of Loan
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("overview")}
              aria-expanded={expandedSections.overview}
              aria-controls="overview-section"
            >
              <span className="flex items-center">
                <Info size={20} className="mr-2 text-indigo-600" />
                Overview
              </span>
              {expandedSections.overview ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.overview && (
              <div
                id="overview-section"
                className="text-gray-600 leading-relaxed space-y-4 text-base"
              >
                <p>
                  The Loan Origination System (LOS) is a centralized web-based
                  solution designed for processing loan applications
                  efficiently. It includes modules such as Retail and Corporate,
                  ensuring uniform guidelines across the bank and streamlining
                  electronic workflows to minimize delays.
                </p>
                <p>
                  Users input loan application details, and the system
                  automatically retrieves relevant data like interest rates,
                  margins, and product guidelines. It also generates reports
                  such as Credit Score Sheets, Process Notes, Sanction Letters,
                  and more.
                </p>
                <p>
                  Once the Customer ID is created, linked to the loan account,
                  and all customer details are captured in the LOS (e.g.,
                  Proposed Asset details, Assets & Liabilities, Proposed Loan
                  Limit, Co-applicant/Guarantor details, Appraisal/Process
                  Note), Risk Analysis is completed, Loan Amount assessed, Terms
                  & Conditions finalized, and recommendations are forwarded to
                  the Sanctioning Authorities for loan approval.
                </p>
              </div>
            )}
          </section>

          {/* Actors */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("actors")}
              aria-expanded={expandedSections.actors}
              aria-controls="actors-section"
            >
              <span className="flex items-center">
                <Users size={20} className="mr-2 text-indigo-600" />
                Actors
              </span>
              {expandedSections.actors ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actors && (
              <ul
                id="actors-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>Bank Officer</li>
                <li>Sanctioning Authority</li>
              </ul>
            )}
          </section>

          {/* Actions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("actions")}
              aria-expanded={expandedSections.actions}
              aria-controls="actions-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                Actions
              </span>
              {expandedSections.actions && (
                <ul
                  id="actions-section"
                  className="list-disc ml-6 text-gray-600 text-base"
                >
                  <li>
                    <strong>Bank Officer:</strong> Coordinates with the
                    Customer/Agency/Department to clear discrepancies, updates
                    the LOS, and forwards the proposal to the Sanctioning
                    Authority for approval.
                  </li>
                  <li>
                    <strong>Sanctioning Authority:</strong> Reviews the
                    Appraisal Note/Process Note for loan approval.
                  </li>
                </ul>
              )}
            </button>
          </section>

          {/* Preconditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("preconditions")}
              aria-expanded={expandedSections.preconditions}
              aria-controls="preconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Preconditions
              </span>
              {expandedSections.preconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.preconditions && (
              <ul
                id="preconditions-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>
                  Customer ID created and linked to the loan account, with all
                  customer details captured in the LOS, including Proposed Asset
                  details, Assets & Liabilities, Proposed Loan Limit,
                  Co-applicant/Guarantor details, Appraisal/Process Note
                  generated, Risk Analysis completed, Loan Amount assessed,
                  Terms & Conditions finalized, and recommendations forwarded to
                  the Sanctioning Authorities.
                </li>
              </ul>
            )}
          </section>

          {/* Post Conditions */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("postconditions")}
              aria-expanded={expandedSections.postconditions}
              aria-controls="postconditions-section"
            >
              <span className="flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-600" />
                Post Conditions
              </span>
              {expandedSections.postconditions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.postconditions && (
              <ul
                id="postconditions-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>
                  The Sanctioning Authority updates the sanction/rejection of
                  the Proposed Loan in LOS, and the Bank Officer communicates
                  the decision to the customer.
                </li>
              </ul>
            )}
          </section>

          {/* Workflow */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("workflow")}
              aria-expanded={expandedSections.workflow}
              aria-controls="workflow-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                Workflow
              </span>
              {expandedSections.workflow ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.workflow && (
              <div
                id="workflow-section"
                className="space-y-4 text-gray-600 text-base"
              >
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Once the Customer ID is created, linked to the loan account,
                    and all customer details are captured in the LOS, including:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc ml-6">
                        <li>Proposed Asset details</li>
                        <li>Assets & Liabilities details</li>
                        <li>Proposed Loan Limit</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Co-applicant/Guarantor details</li>
                        <li>Appraisal/Process Note generated</li>
                        <li>Risk Analysis completed</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Loan Amount assessed</li>
                        <li>Terms & Conditions finalized</li>
                        <li>Recommendations updated</li>
                      </ul>
                    </div>
                    The proposal is forwarded to the Sanctioning Authority for
                    approval.
                  </li>
                  <li>
                    The Sanctioning Authority reviews the Appraisal Note/Process
                    Note for loan approval.
                  </li>
                  <li>
                    If discrepancies are found, the Sanctioning Authority
                    comments and requests additional information/reports.
                  </li>
                  <li>
                    The proposal is retransmitted to the Bank Officer for
                    discrepancy clearance.
                  </li>
                  <li>
                    The Bank Officer reviews comments, obtains additional
                    information/reports from the customer/agency/department,
                    updates the Appraisal/Process Note in LOS, and forwards it
                    to the Sanctioning Authority.
                  </li>
                  <li>
                    The Sanctioning Authority reviews the updated note and, if
                    satisfied, approves the loan with conditions (if any);
                    otherwise, rejects the proposal.
                  </li>
                  <li>
                    The decision is updated in LOS and forwarded to the Bank
                    Officer for further processing.
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* Flowchart */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <button
              className="w-full flex items-center justify-between text-2xl font-semibold text-gray-900 mb-4 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => toggleSection("flowchart")}
              aria-expanded={expandedSections.flowchart}
              aria-controls="flowchart-section"
            >
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                Flowchart
              </span>
              {expandedSections.flowchart ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.flowchart && (
              <pre
                id="flowchart-section"
                className="bg-gray-100 p-4 rounded-lg text-base text-gray-700 font-mono overflow-x-auto border border-gray-200"
              >
                {`
Start
  |
  v
Customer ID created and linked to loan account
All customer details captured in LOS:
- Proposed Asset details
- Asset & Liabilities details
- Proposed Loan Limit
- Co-applicant/Guarantor/Co-Obligant details
- Appraisal note/Process note generated
- Risk Analysis completed
- Proposed Loan Amount assessed
- Terms & conditions finalized
- Recommendations updated
  |
  v
Forward recommendations to Sanctioning Authority
  |
  v
Sanctioning Authority reviews Appraisal Note/Process Note
  |
  v
Discrepancies found?
  | Yes
  v
Sanctioning Authority comments and requests additional information/reports
  |
  v
Retransmit proposal to Bank Officer
  |
  v
Bank Officer obtains additional information/reports
  |
  v
Update Appraisal Note/Process Note in LOS
  |
  v
Forward updated note to Sanctioning Authority
  |
  v
Sanctioning Authority reviews updated note
  |
  v
Convinced with updates?
  | Yes            | No
  v               v
Approve Loan     Reject Loan
(with conditions Proposal
if any)
  |
  v
Update decision in LOS
  |
  v
Forward to Bank Officer for further processing
  |
  v
End
`}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default WF_for_Sanction_of_Loan_Business;
