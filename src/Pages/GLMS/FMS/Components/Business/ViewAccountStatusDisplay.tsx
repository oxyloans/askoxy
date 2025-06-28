import React from "react";

interface ViewAccountStatusData {
  overview: string;
  actors: string;
  actions: string;
  preconditions: string[];
  postconditions: string[];
  workflow: {
    steps: string[];
    accountDetails: { name: string; value: string }[];
    dues: { name: string; value: string }[];
    refunds: { name: string; value: string }[];
  };
}

const ViewAccountStatusDisplay: React.FC = () => {
  const data: ViewAccountStatusData = {
    overview:
      "Termination refers to the closure of a finance account at the end of the stipulated period after the repayment of principal and profit amount in full. The Early Termination (Foreclosure) means that an account is being terminated before completion of its tenure. As the Finance Account can be closed only after the repayment of principal and profit amount in full. The user will verify the status of the Finance Account.",
    actors: "User",
    actions: "User verifies the Status of the Finance Account.",
    preconditions: ["Existing Finance Account"],
    postconditions: [
      "Finance Account status viewed",
      "Initiates the further process for closure of Finance Account",
    ],
    workflow: {
      steps: [
        "The User selects the Account status option in the system.",
        "User enters the agreement ID to retrieve the Finance Account status.",
        "The User views the status of the Finance Account, if any due from the customer, requests for repayment to proceed further for Closure process.",
        "If any Refund to the Customer, The User initiates the process for Refund to customer.",
      ],
      accountDetails: [
        { name: "Agreement ID", value: "TBD" },
        { name: "Customer Name", value: "TBD" },
        { name: "Amount Financed", value: "TBD" },
        { name: "Tenure", value: "TBD" },
        { name: "Profit Rate", value: "TBD" },
        { name: "Agreement No", value: "TBD" },
        { name: "EMI", value: "TBD" },
      ],
      dues: [
        { name: "Balance Principal", value: "TBD" },
        { name: "Due Installments", value: "TBD" },
        { name: "Outstanding Payments", value: "TBD" },
        { name: "Prepayment Penalty", value: "TBD" },
        { name: "Profit on termination", value: "TBD" },
        { name: "Total Due", value: "TBD" },
      ],
      refunds: [
        { name: "Excess Amount", value: "TBD" },
        { name: "Advance Installments", value: "TBD" },
        { name: "Excess Principal", value: "TBD" },
        { name: "Excess Profit", value: "TBD" },
        { name: "Total Refund", value: "TBD" },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Work Flow Closure – View Account Status
        </h1>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700 text-sm sm:text-base">{data.overview}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Actors</h2>
          <p className="text-gray-700 text-sm sm:text-base">{data.actors}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Actions</h2>
          <p className="text-gray-700 text-sm sm:text-base">{data.actions}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Preconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
            {data.preconditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Postconditions
          </h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
            {data.postconditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Workflow</h2>
          <h3 className="text-lg sm:text-xl font-medium mb-2">Steps</h3>
          <ol className="list-decimal pl-5 text-gray-700 text-sm sm:text-base">
            {data.workflow.steps.map((step, index) => (
              <li key={index} className="mb-2">
                {step}
              </li>
            ))}
          </ol>

          <h3 className="text-lg sm:text-xl font-medium mt-4 mb-2">
            Finance Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.workflow.accountDetails.map((detail, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-base sm:text-lg font-semibold">
                  {detail.name}
                </h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-lg sm:text-xl font-medium mt-4 mb-2">Dues</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.workflow.dues.map((due, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4">
                <h4 className="text-base sm:text-lg font-semibold">
                  {due.name}
                </h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  {due.value}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-lg sm:text-xl font-medium mt-4 mb-2">Refunds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.workflow.refunds.map((refund, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h4 className="text-base sm:text-lg font-semibold">
                  {refund.name}
                </h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  {refund.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewAccountStatusDisplay;
