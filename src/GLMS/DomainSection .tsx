import React from "react";
import { ChevronRight, Users, CreditCard, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const domains = [
  {
    id: "cas",
    title: "Customer Acquisition System",
    link: "/cas",
    description:
      "Optimized workflows for onboarding and expanding your customer base efficiently.",
    icon: <Users size={32} className="text-blue-600" />,
    useCases: [
      {
        id: "cas-1",
        name: "Customer ID Creation",
        desc: "Seamless identity creation for new customers",
      },
      {
        id: "cas-2",
        name: "Linking Co-applicant & Guarantor",
        desc: "Connect multiple stakeholders to a single application",
      },
      {
        id: "cas-3",
        name: "Customer to Loan Mapping",
        desc: "Assign customer IDs to loans automatically",
      },
      {
        id: "cas-4",
        name: "Loan Appraisal Workflow",
        desc: "Evaluate and process loans with predefined workflows",
      },
    ],
  },
  {
    id: "collections",
    title: "Collections Management",
    link: "/cms",
    description:
      "Tools to manage recoveries, reduce delinquency, and automate collection processes.",
    icon: <CreditCard size={32} className="text-blue-600" />,
    useCases: [
      {
        id: "col-1",
        name: "Allocation of Delinquent Cases_Allocation Hold",
        desc: "Monitor outstanding debts with ease",
      },
      {
        id: "col-2",
        name: "Allocation of Delinquent Cases_Define Allocation contract",
        desc: "Automated reminders and communication",
      },
      {
        id: "col-3",
        name: "Allocation of Delinquent Cases_Manual Allocation",
        desc: "Customizable repayment timelines",
      },
      {
        id: "col-4",
        name: "Allocation of Delinquent Cases_Manual Reallocation",
        desc: "Seamless payment handling within system",
      },
    ],
  },
  {
    id: "fms",
    title: "Financial Management System",
    link: "/fms",
    description:
      "End-to-end financial tracking, processing, and reporting for loan servicing.",
    icon: <DollarSign size={32} className="text-blue-600" />,
    useCases: [
      {
        id: "fms-1",
        name: "Asset Details",
        desc: "Auto-compute interests based on rules",
      },
      {
        id: "fms-2",
        name: "PDC Printing",
        desc: "Apply and track fees across accounts",
      },
      {
        id: "fms-3",
        name: "WF_ Installment Prepayment",
        desc: "Real-time ledger updates and audits",
      },
      {
        id: "fms-4",
        name: "WF_ NPA Grading",
        desc: "Generate balance sheets and statements",
      },
    ],
  },
];

const DomainSection = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Global Lending Management Solutions
          </h2>
          <p className="mt-2 text-gray-600 text-base max-w-2xl mx-auto">
            Explore systems that streamline every phase of the loan lifecycle,
            from origination to servicing.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <Link
              key={domain.id}
              to={domain.link}
              className="group bg-white rounded-xl shadow hover:shadow-xl transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex flex-col justify-between h-full p-6">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      {domain.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {domain.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {domain.description}
                  </p>

                  <div>
                    <h4 className="font-medium text-gray-700 text-sm mb-2">
                      Use Cases:
                    </h4>
                    <ul className="space-y-2">
                      {domain.useCases.map((uc) => (
                        <li key={uc.id}>
                          <div className="text-gray-800 font-medium text-sm">
                            {uc.name}
                          </div>
                          <p className="text-gray-500 text-xs">{uc.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex items-center text-blue-600 text-sm font-medium hover:text-blue-800">
                  Learn more
                  <ChevronRight className="ml-1 w-4 h-4 transition-transform transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainSection;
