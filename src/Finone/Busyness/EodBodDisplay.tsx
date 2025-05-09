import React from "react";

interface EodBodData {
  overview: string;
  actors: string;
  actions: string;
  preconditions: string[];
  postconditions: string[];
  workflow: {
    eodProcesses: { name: string; description: string }[];
    bodProcess: string;
  };
  businessRules: string[];
}

const EodBodDisplay: React.FC = () => {
  const data: EodBodData = {
    overview:
      "“EOD” is a Process that is executed at periodic intervals, for specified dates or periods, using data that has been entered in various transactions. In a financial organization there are some tasks such as profit calculation, accrual balance calculation and accrual posting such task is executed at the end of days in batch. “BOD (Beginning of Day)” is to be executed to start the day‘s activities.",
    actors: "User",
    actions:
      "User runs the EOD for profit calculation, accrual balance calculation and accrual posting such task is executed at the end of days in batch and BOD for start the day‘s activities.",
    preconditions: [
      "Date should not be changed in the system automatically when date is changed in general",
    ],
    postconditions: [],
    workflow: {
      eodProcesses: [
        {
          name: "Profit Accruals",
          description:
            "Profit Accruals is a process by virtue of which the profit is calculated and kept in a bucket until its application / maturity.",
        },
        {
          name: "Late Payment Profit Calculation (LPP Process)",
          description:
            "“Late payment profit” calculation is overdue profit computation.",
        },
        {
          name: "Autos knock off",
          description:
            "It is a process where system itself checks for the outstanding payable and receivable advices and knocks them off based on the auto allocation logic defined for the product.",
        },
        {
          name: "DPD Process",
          description:
            "DPD (Days Past Due) is a process that calculates the number of outstanding days from which the client is not paying the installment.",
        },
        {
          name: "NPA Process",
          description:
            "An asset becomes Non–Performing when it ceases to generate income for the bank, depends upon the criteria defined.",
        },
        {
          name: "Date Change Process",
          description:
            "This process moves the system to the next business date. For example, if the current business date is 19-Dec-2008, after this process is executed, the business date will be changed to 20-Dec-2008.",
        },
      ],
      bodProcess:
        "User executes the BOD mainly for the process, conversion of PEMI to EMI (The EMI repayment schedule will be auto generated after the Subsequent & Final disbursement details were auto-authorized in FMS).",
    },
    businessRules: [
      "Accrual process will be executed on daily basis at EOD and accounting for the accrual will be passed in the system.",
      "DPD calculation process will be executed on daily basis",
      "NPA Classification process will be executed on daily basis",
      "Billing process will be done on daily basis and accounting will be triggered for the installment.",
      "Provisioning process will be executed at month end and the process will be triggered.",
      "Automatic Knock off process will be executed on daily basis (Payable and Receivable adjustment)",
      "Date change process will be executed daily at EOD",
      "LPP calculation will not be executed as no LPP is levied on the overdue customer account",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          EOD/BOD in FMS
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Workflow</h2>
          <h3 className="text-lg sm:text-xl font-medium mb-2">EOD Processes</h3>
          <div className="space-y-4">
            {data.workflow.eodProcesses.map((process, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-base sm:text-lg font-semibold">
                  {process.name}
                </h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
          <h3 className="text-lg sm:text-xl font-medium mt-4 mb-2">
            BOD Process
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            {data.workflow.bodProcess}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Business Rules
          </h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base">
            {data.businessRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default EodBodDisplay;
