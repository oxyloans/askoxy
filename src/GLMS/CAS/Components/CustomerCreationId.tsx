import React from "react";

const sectionStyle = "bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6";
const titleStyle = "text-2xl md:text-3xl font-semibold text-blue-600 mb-4";
const subtitleStyle = "text-sm font-semibold text-gray-700 mb-2";
const textStyle = "text-sm text-gray-800 mb-4";
const listStyle = "list-disc ml-6 text-sm text-gray-800";
const tableHeaderStyle = "bg-gray-100 text-left text-sm text-gray-600";
const tableCellStyle = "px-4 py-2 border-b text-gray-800";

const CustomerCreationId: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-xl">
      <h5 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Customer ID Creation – System Development Breakdown
      </h5>

      {/* SYSTEM USE CASE */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>A. System Use Case (SUC)</h2>
        <p className={subtitleStyle}>Actors:</p>
        <ul className={listStyle}>
          <li>Customer (initiates application)</li>
          <li>Bank Officer (enters data)</li>
          <li>System (LOS & CBS)</li>
        </ul>

        <p className={subtitleStyle}>Precondition:</p>
        <p className={textStyle}>
          Application + supporting documents submitted
        </p>

        <p className={subtitleStyle}>Postcondition:</p>
        <p className={textStyle}>
          Unique Customer ID created in LOS (linked to CBS if needed)
        </p>

        <p className={subtitleStyle}>Flows:</p>
        <ul className={listStyle}>
          <li>
            Straight Flow: New customer → Details entered → Customer ID created
          </li>
          <li>
            Alternative Flow: Existing customer → Fetch from CBS → Pre-fill
            fields
          </li>
          <li>
            Exception Flow: Missing/invalid documents → Reject → Request
            re-submission
          </li>
        </ul>
      </div>

      {/* HIGH-LEVEL DESIGN */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>B. High-Level Design (HLD)</h2>
        <p className={subtitleStyle}>Architecture:</p>
        <ul className={listStyle}>
          <li>Microservice Architecture</li>
          <li>Frontend: React</li>
          <li>Backend: Java + Spring Boot</li>
          <li>DB: PostgreSQL</li>
          <li>API Gateway + Auth (JWT)</li>
          <li>Optional CBS Integration</li>
        </ul>

        <p className={subtitleStyle}>Modules:</p>
        <ul className={listStyle}>
          <li>Customer Onboarding UI</li>
          <li>Customer API Service</li>
          <li>Document Validation Module</li>
          <li>CBS Sync Module</li>
          <li>Notification Module (SMS/email)</li>
        </ul>
      </div>

      {/* LOW-LEVEL DESIGN */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>C. Low-Level Design (LLD)</h2>
        <p className={subtitleStyle}>ER Diagram:</p>
        <p className={textStyle}>
          Customer, Address, Employment, Income, Application
        </p>

        <p className={subtitleStyle}>Sequence:</p>
        <ul className={listStyle}>
          <li>
            Submit docs → Validate → Create record → Generate ID → Sync with CBS
          </li>
        </ul>

        <p className={subtitleStyle}>API Spec:</p>
        <ul className={listStyle}>
          <li>POST /customer/create</li>
          <li>GET /customer/fetch/{"{id}"}</li>
          <li>POST /customer/validateDocuments</li>
        </ul>
      </div>

      {/* FRONT-END */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>D. Front-End (React)</h2>
        <p className={subtitleStyle}>Pages:</p>
        <ul className={listStyle}>
          <li>Customer Form (multi-tab)</li>
          <li>Document Upload</li>
          <li>Success / Error Notification</li>
        </ul>
        <p className={subtitleStyle}>Features:</p>
        <ul className={listStyle}>
          <li>Field Validations</li>
          <li>Auto-Save</li>
          <li>Role-based Access (Bank Officer)</li>
        </ul>
      </div>

      {/* API */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>E. API (Spring Boot – Java)</h2>
        <p className={subtitleStyle}>Endpoints:</p>
        <ul className={listStyle}>
          <li>POST /api/customer</li>
          <li>GET /api/customer/{"{id}"}</li>
          <li>POST /api/customer/validate</li>
        </ul>
        <p className={subtitleStyle}>Modules:</p>
        <ul className={listStyle}>
          <li>CustomerController</li>
          <li>CustomerService</li>
          <li>CustomerRepository</li>
          <li>DTOs & Validators</li>
        </ul>
      </div>

      {/* DATABASE DESIGN */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>F. Database Design (PostgreSQL)</h2>
        <p className={subtitleStyle}>Tables:</p>
        <ul className={listStyle}>
          <li>customers</li>
          <li>addresses</li>
          <li>employment</li>
          <li>income_details</li>
          <li>application_log</li>
        </ul>
        <p className={subtitleStyle}>Index:</p>
        <p className={textStyle}>PAN, Mobile, Email (for duplication check)</p>
      </div>

      {/* TEST SCENARIOS */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>G. Test Scenarios</h2>
        <table className="w-full border text-sm text-left text-gray-800">
          <thead className={tableHeaderStyle}>
            <tr>
              <th className="px-4 py-2">Scenario</th>
              <th className="px-4 py-2">Test Type</th>
              <th className="px-4 py-2">Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tableCellStyle}>New customer creation</td>
              <td className={tableCellStyle}>Functional</td>
              <td className={tableCellStyle}>High</td>
            </tr>
            <tr>
              <td className={tableCellStyle}>Existing customer fetch</td>
              <td className={tableCellStyle}>Functional</td>
              <td className={tableCellStyle}>High</td>
            </tr>
            <tr>
              <td className={tableCellStyle}>Missing document rejection</td>
              <td className={tableCellStyle}>Negative</td>
              <td className={tableCellStyle}>Medium</td>
            </tr>
            <tr>
              <td className={tableCellStyle}>UI validations</td>
              <td className={tableCellStyle}>UI</td>
              <td className={tableCellStyle}>High</td>
            </tr>
            <tr>
              <td className={tableCellStyle}>Concurrent submissions</td>
              <td className={tableCellStyle}>Load</td>
              <td className={tableCellStyle}>Medium</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TEST CASES */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>H. Test Cases</h2>
        <ul className={listStyle}>
          <li>Submit valid customer data → Expect: Customer ID generated</li>
          <li>Submit with missing PAN → Expect: Error</li>
          <li>Fetch customer with ID → Expect: Full profile</li>
          <li>Submit duplicate PAN → Expect: Validation error</li>
        </ul>
      </div>

      {/* TEST DATA */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>I. Test Data</h2>
        <ul className={listStyle}>
          <li>Name: Rakesh Rao</li>
          <li>DOB: 1990-01-01</li>
          <li>PAN: ABCDE1234F</li>
          <li>Mobile: 9999988888</li>
          <li>Income: ₹60,000</li>
          <li>Company: TCS</li>
        </ul>
      </div>

      {/* GO-LIVE CHECKLIST */}
      <div className={sectionStyle}>
        <h2 className={titleStyle}>J. Go-Live Checklist ✅</h2>
        <ul className={listStyle}>
          <li>✅ Code reviewed and merged</li>
          <li>✅ Test cases executed</li>
          <li>✅ CBS Integration tested</li>
          <li>✅ Security audited</li>
          <li>✅ Training for Bank Officers done</li>
          <li>✅ Support escalation in place</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerCreationId;
