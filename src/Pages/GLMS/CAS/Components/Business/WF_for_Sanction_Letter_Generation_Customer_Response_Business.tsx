import React, { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Send,
  Check,
} from "lucide-react";

interface WF_for_Sanction_Letter_Generation_Customer_Response_BusinessProps {}

const WF_for_Sanction_Letter_Generation_Customer_Response_Business: React.FC<
  WF_for_Sanction_Letter_Generation_Customer_Response_BusinessProps
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
            Work Flow for Sanction Letter Generation & Customer Response
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
                  Once the Loan Proposal is generated, forwarded to the
                  Sanctioning Authorities, and approved or rejected, the Bank
                  Officer generates a Sanction/Rejection letter to communicate
                  the loan status to the customer, obtains their response, and
                  updates it in the LOS.
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
                <li>Customer</li>
                <li>Bank Officer</li>
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
              {expandedSections.actions ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>
            {expandedSections.actions && (
              <ul
                id="actions-section"
                className="list-disc ml-6 text-gray-600 text-base"
              >
                <li>
                  <strong>Customer:</strong> Receives the Loan offer and
                  acknowledges the offer in case of acceptance.
                </li>
                <li>
                  <strong>Bank Officer:</strong> Generates the
                  Sanction/Rejection letter to communicate the loan status to
                  the customer, obtains the response, and updates it in LOS.
                </li>
              </ul>
            )}
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
                  Loan Proposal has been approved or rejected by the Sanctioning
                  Authorities.
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
                  Loan Offer accepted by the customer, and the Bank Officer
                  initiates the process for opening a Loan Account in CBS.
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
                    Once the Loan Proposal is generated, forwarded to the
                    Sanctioning Authorities, and approved or rejected.
                  </li>
                  <li>
                    Based on the Sanctioning Authority’s decision, the Bank
                    Officer generates the Sanction/Rejection letter containing:
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <ul className="list-disc ml-6">
                        <li>Name of the customer</li>
                        <li>Name of Co-applicant</li>
                        <li>Address of Applicant/Co-applicant</li>
                        <li>Type of Loan</li>
                        <li>Loan Status</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Loan Amount</li>
                        <li>Rate of Interest</li>
                        <li>Loan Tenure</li>
                        <li>EMI</li>
                        <li>Repayment Schedule</li>
                      </ul>
                      <ul className="list-disc ml-6">
                        <li>Holiday Period (if any)</li>
                        <li>Guarantor details</li>
                        <li>Terms & Conditions</li>
                        <li>Time clause for availment of Loan</li>
                        <li>Remarks</li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    The Bank Officer forwards the Sanction/Rejection letter to
                    the customer to communicate the loan status and obtain
                    acceptance.
                  </li>
                  <li>
                    The Customer receives the letter and acknowledges acceptance
                    or communicates rejection to the Bank Officer.
                  </li>
                  <li>
                    The Bank Officer updates the customer’s response in the LOS.
                  </li>
                  <li>
                    If the customer accepts the offer, the Bank Officer
                    initiates the process for opening a Loan Account in CBS
                    using the loan details from LOS.
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
Loan Proposal generated and forwarded to Sanctioning Authorities
  |
  v
Sanctioning Authority approves/rejects Loan Proposal
  |
  v
Bank Officer generates Sanction/Rejection letter with:
- Customer Name
- Co-applicant Name
- Applicant/Co-applicant Address
- Type of Loan
- Loan Status
- Loan Amount
- Rate of Interest
- Loan Tenure
- EMI
- Repayment Schedule
- Holiday Period
- Guarantor Details
- Terms & Conditions
- Time Clause for Loan Availment
- Remarks
  |
  v
Forward letter to Customer
  |
  v
Customer receives letter
  |
  v
Customer responds
  |-----------------|
  v                 v
Accepts Offer     Rejects Offer
  |                 |
  v                 v
Acknowledge       Intimate
Offer             Rejection
  |                 |
  v                 v
Bank Officer updates response in LOS
  |
  v
Offer Accepted?
  | Yes
  v
Initiate Opening of Loan Account in CBS
  |
  v
End
  | No
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

export default WF_for_Sanction_Letter_Generation_Customer_Response_Business;
