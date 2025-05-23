import React from "react";

// Main Component
const PDCPrinting: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg font-sans text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Work Flow – PDC Printing
        </h1>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Overview:</h2>
          <p className="mb-2">
            Once the finance application is approved by the underwriter, the
            customer is required to provide certain documents at the PDOC stage
            and specify the mode of repayment for the finance. The customer can
            choose cash, PDC, ATM, or remittance as the mode of repayment. When
            the mode of repayment is PDC, the customer provides blank PDCs for
            the entire tenure. Once the blank PDCs are received from the
            customer, the system shall print the PDCs for the finance
            application with the Payee Name, due date as the cheque date, and
            the installment amount on all the cheques as per the repayment
            schedule.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Actor:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">User</li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Actions:</h2>
          <ul className="list-disc pl-5">
            <li className="mb-1">
              User receives the PDC cheques from the customer and initiates the
              PDC printing process in the System.
            </li>
          </ul>
          <h2 className="text-lg font-bold mb-2">Pre Conditions:</h2>
          <p className="mb-2">
            Submission of PDC cheques and Mode of repayment should be PDC.
          </p>
          <h2 className="text-lg font-bold mb-2">Post Conditions:</h2>
          <p className="mb-2">
            The cheques will be printed with the installment amount, Payee Name,
            and the due date of the installment.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Work Flow:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              User receives the PDC cheques from the customer for use in finance
              repayment.
            </li>
            <li className="mb-1">
              The User enters PDC as the mode of payment and saves the repayment
              information in the System.
            </li>
            <li className="mb-1">
              The User enters the PDCs list on the PDC collections section on
              the screen. The System displays the PDC Print screen for the User
              to print the cheques.
            </li>
            <li className="mb-1">
              The User selects the Application ID/Agreement ID and submits to
              search the application/finance details. The System displays the
              screen for cheque printing.
            </li>
            <li className="mb-1">
              The User checks the details of all the due installments for cheque
              printing.
            </li>
            <li className="mb-1">
              The User enters the blank cheques received from the customer in
              the printer to print the cheques.
            </li>
            <li className="mb-1">
              Once the cheques are placed in the printer and submitted, the
              cheques will be printed with the Payee Name, Due Date, and the
              installment amount for the number of installments selected for
              printing.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Notes:</h2>
          <ul className="list-disc pl-5 mb-2">
            <li className="mb-1">
              The User can print a cheque of a particular installment more than
              once by inserting another PDC received from the customer in case a
              particular PDC is not printed correctly.
            </li>
            <li className="mb-1">
              If there is a change in any of the financial parameters of the
              finance which will change the installment amount, the User can
              print the cheques for the new installment amount when the customer
              provides a new PDC.
            </li>
            <li className="mb-1">
              The System will show only those installments for printing for
              which the due date is greater than the current system date.
            </li>
            <li className="mb-1">
              If the customer wishes to change the PDC or a new PDC needs to be
              printed in case of deferral of installments, the repayment
              schedule of the finance from the System will be available on the
              PDC Printing screen for the User to print the cheques.
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Flowchart Summary:</h2>
          <div className="border border-gray-700 p-4">
            <p className="mb-2">
              1. User: Receives the PDC cheques from the customer for finance
              repayment.
            </p>
            <p className="mb-2">
              2. User: Enters PDC as the mode of payment and saves the repayment
              information in the System.
            </p>
            <p className="mb-2">
              3. User: Enters the PDCs list on the PDC collections section.
              System displays the PDC Print screen.
            </p>
            <p className="mb-2">
              4. User: Selects the Application ID/Agreement ID and submits to
              search the application/finance details. System displays the cheque
              printing screen.
            </p>
            <p className="mb-2">
              5. User: Checks the details of all due installments for cheque
              printing.
            </p>
            <p className="mb-2">
              6. User: Places the blank cheques in the printer.
            </p>
            <p className="mb-2">
              7. User: Submits to print the cheques with Payee Name, Due Date,
              and installment amount.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PDCPrinting;
