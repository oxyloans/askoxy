import React from 'react';

const Contact_Recording_Business: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Theory of Contact Recording for Delinquent Case Follow-Up</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Overview</h3>
        <p className="text-gray-600">
          The contact recording process is a critical feature of the Collections System, designed to document interactions between users (typically tele-callers or collectors) and delinquent customers. This process is initiated after the supervisor prioritizes and allocates cases through the work list process. The Contact Recording menu option enables users to log details of follow-up actions and contacts, ensuring a structured and transparent approach to managing delinquent cases.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Key Components</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li><strong>Actors:</strong> User (tele-caller or collector).</li>
          <li><strong>Pre-conditions:</strong>
            <ul className="list-circle pl-5">
              <li>Delinquent cases are saved in the database.</li>
              <li>Supervisor has prioritized and allocated cases to the collector.</li>
              <li>System allows recording of follow-up action details.</li>
            </ul>
          </li>
          <li><strong>Actions:</strong> User contacts the delinquent customer and records the interaction in the system.</li>
          <li><strong>Post-conditions:</strong> Action details are saved in the system, enabling further processing.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Workflow</h3>
        <ol className="list-decimal pl-5 text-gray-600">
          <li>Supervisor prioritizes cases based on the Amount Overdue Method and allocates them to the collector.</li>
          <li>User initiates the follow-up process for allocated cases.</li>
          <li>User opens the customer details page, viewing:
            <ul className="list-disc pl-5 mt-1">
              <li>Customer communication details</li>
              <li>Co-applicant/Guarantor details</li>
              <li>Collateral details</li>
              <li>Payments details</li>
              <li>Repayment schedule details</li>
              <li>Loan statement details</li>
              <li>Foreclosure details</li>
              <li>Follow-up details</li>
              <li>Allocation history report</li>
              <li>Legal case details</li>
              <li>Expense details</li>
              <li>Disbursal details</li>
              <li>Deposit details</li>
              <li>Finance details</li>
              <li>Allocation details</li>
              <li>Overdue details</li>
              <li>Account summary details</li>
            </ul>
          </li>
          <li>User contacts the customer using curing actions:
            <ul className="list-disc pl-5 mt-1">
              <li>Letter generation</li>
              <li>SMS sending</li>
              <li>Stat Card</li>
              <li>Tele Calling</li>
              <li>Email</li>
            </ul>
          </li>
          <li>User records follow-up details in the system, including:
            <ul className="list-disc pl-5 mt-1">
              <li>Action date</li>
              <li>Action start time</li>
              <li>Action type</li>
              <li>Contact mode</li>
              <li>Person contacted</li>
              <li>Place contacted</li>
              <li>Next action date and time</li>
              <li>Reminder mode</li>
              <li>Contacted by</li>
              <li>Remarks</li>
            </ul>
          </li>
          <li>User saves the details and proceeds with further processes.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Purpose</h3>
        <p className="text-gray-600">
          The contact recording process ensures that all interactions with delinquent customers are thoroughly documented, enabling efficient case tracking, follow-up management, and strategic decision-making. By maintaining detailed records of actions taken, the system supports supervisors and collectors in prioritizing cases, monitoring progress, and optimizing collection efforts.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Flowchart</h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre">
          {`
Start: Cases Allocated
   |
   v
Supervisor Prioritizes Cases
   | (Amount Overdue Method)
   v
User Initiates Follow-Up
   |
   v
Open Customer Details Page
   | (View Communication, Loan, Legal, etc.)
   v
Contact Customer
   | (Letter, SMS, Call, Email, Stat Card)
   v
Record Follow-Up Details
   | (Action Date, Type, Contact Mode, Remarks, etc.)
   v
Save Details in System
   |
   v
Proceed with Further Process
   |
   v
End
          `}
        </pre>
      </section>
    </div>
  );
};

export default Contact_Recording_Business;