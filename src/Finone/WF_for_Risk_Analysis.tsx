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

interface WF_for_Risk_AnalysisProps {}

const WF_for_Risk_Analysis: React.FC<WF_for_Risk_AnalysisProps> = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 bg-white font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2">
        Risk Analysis in LOS
      </h1>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Risk Analysis in the Loan Origination System (LOS) evaluates a
            customer’s creditworthiness by assessing financial, employment,
            personal, and security information. The purpose is to assign a risk
            rating score to determine loan eligibility and facilitate uniform
            loan appraisal processes.
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
              <h3 className="font-medium text-gray-800">Primary Actors</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Bank Officer (Customer-facing)</li>
                <li>Loan Origination System (LOS) (System role)</li>
                <li>Risk Engine Module (System role)</li>
                <li>
                  External Verification Agencies (Legal, Technical, Financial,
                  Employment checks)
                </li>
                <li>
                  Core Banking System (for data integration and validation)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">
                Software Stakeholders
              </h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>API Developers</li>
                <li>QA Team</li>
                <li>CloudOps</li>
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
              <strong>User Action:</strong> Bank Officer selects a loan
              application with linked Customer ID.
              <br />
              <strong>System Response:</strong> LOS fetches all customer and
              loan details.
            </li>
            <li>
              <strong>User Action:</strong> Officer requests
              Legal/Technical/Employment/Financial verification.
              <br />
              <strong>System Response:</strong> System routes requests to
              respective departments or integrated APIs.
            </li>
            <li>
              <strong>User Action:</strong> Officer enters/updates data from
              received reports.
              <br />
              <strong>System Response:</strong> LOS stores and confirms all
              relevant verification inputs.
            </li>
            <li>
              <strong>User Action:</strong> Officer initiates risk analysis.
              <br />
              <strong>System Response:</strong> Risk Engine calculates risk
              rating based on parameters and weightages.
            </li>
            <li>
              <strong>User Action:</strong> Officer reviews calculated risk
              score.
              <br />
              <strong>System Response:</strong> System displays recommended risk
              category and allows manual comments.
            </li>
            <li>
              <strong>User Action:</strong> Officer submits final risk analysis.
              <br />
              <strong>System Response:</strong> LOS updates the loan record with
              finalized risk score.
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
                <li>Customer ID created and linked to loan account</li>
                <li>
                  Complete capture of asset, liabilities, proposed loan limits,
                  and details of co-applicants/guarantors
                </li>
                <li>Appraisal or Process Note generated</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
                <CheckCircle size={18} className="mr-2 text-green-600" />
                Post Condition
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Risk rating score computed and categorized</li>
                <li>Risk data stored in LOS</li>
                <li>Loan progresses to Assessment stage</li>
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
            Login → Select Loan App → Submit for Verifications → Auto Score →
            Submit Risk → Proceed to Loan Assessment
          </p>
        </section>

        {/* Alternative Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <ChevronRight size={18} className="mr-2 text-blue-600" />
            Alternative Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Assisted Mode via branch login</li>
            <li>API-driven automation by backend risk rules engine</li>
            <li>Self-service dashboards for status tracking</li>
          </ul>
        </section>

        {/* Exception Flows */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <AlertCircle size={18} className="mr-2 text-red-600" />
            Exception Flows
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Missing reports from Legal/Technical/Financial agency</li>
            <li>Invalid or incomplete customer data</li>
            <li>Risk engine timeout or API failure</li>
            <li>Manual override required due to risk score anomalies</li>
          </ul>
        </section>

        {/* User Activity Diagram */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <List size={18} className="mr-2 text-blue-600" />
            User Activity Diagram (Simplified Flow)
          </h2>
          <p className="text-gray-700">
            Start → [Select Loan Application] → [Fetch Customer Details] →
            [Trigger Verifications] → [Receive Reports] → [Run Risk Engine] →
            [View & Submit Risk] → End
          </p>
        </section>

        {/* Parking Lot */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Info size={18} className="mr-2 text-blue-600" />
            Parking Lot
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Integration with Credit Bureau APIs for auto pull of credit
              history
            </li>
            <li>ML-based predictive scoring engine</li>
            <li>Risk score visualization graphs</li>
          </ul>
        </section>

        {/* System Components Involved */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-300 pb-2">
            <Server size={18} className="mr-2 text-blue-600" />
            System Components Involved
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              <strong>UI Screens:</strong> Risk Analysis, Loan Summary, Report
              Uploads
            </li>
            <li>
              <strong>APIs:</strong> Verification APIs, Risk Engine API
            </li>
            <li>
              <strong>DB Tables:</strong> Customer, Loan Account, Risk Score
            </li>
            <li>
              <strong>Message Queues:</strong> Report Triggers
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
              <strong>Functional:</strong> Risk score calculation, data fetch
            </li>
            <li>
              <strong>Edge:</strong> Missing/incorrect report values
            </li>
            <li>
              <strong>Negative:</strong> Fail with missing customer ID
            </li>
            <li>
              <strong>Integration:</strong> APIs for report fetching
            </li>
            <li>
              <strong>Performance:</strong> Handle concurrent requests for 1000+
              officers
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
            <li>Cloud-based deployment of LOS modules</li>
            <li>Feature flags for Risk Scoring toggle</li>
            <li>Daily batch run for score re-evaluation</li>
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
              <strong>Squad:</strong> LOS Risk Analysis Team
            </li>
            <li>
              <strong>Contact:</strong> Rahul Sharma (PM), Archana Desai (Lead
              Dev)
            </li>
            <li>
              <strong>Jira:</strong> RSK-1083
            </li>
            <li>
              <strong>Repo:</strong> gitlab.com/bankLOS/risk-analysis
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default WF_for_Risk_Analysis;