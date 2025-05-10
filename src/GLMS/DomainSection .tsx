import React from "react";
import {
  ChevronRight,
  ArrowRight,
  Users,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

const domains = [
  {
    id: "cas",
    title: "Customer Acquisition System",
    link: "/cas",
    description:
      "Optimized workflows for onboarding and expanding your customer base efficiently.",
    icon: <Users size={40} className="text-blue-600" />,
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
    icon: <CreditCard size={40} className="text-blue-600" />,
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
    icon: <DollarSign size={40} className="text-blue-600" />,
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
    <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gray-100/60 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Global Loan Management Solutions
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Explore comprehensive systems that streamline every phase of the
            loan lifecycle, from origination to servicing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {domains.map((domain) => (
            <Link
              key={domain.id}
              to={domain.link} // Dynamically set the link based on the domain
              className="block bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] p-5 sm:p-6 h-full"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-50 rounded-full p-3 mr-3">
                      {domain.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {domain.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {domain.description}
                  </p>

                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-2">Use Cases:</p>
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

                <div className="mt-4">
                  <span className="text-blue-600 font-medium flex items-center group hover:text-blue-800 text-sm">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/solutions"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-full font-medium inline-flex items-center text-sm sm:text-base transition-all duration-300"
          >
            View All Solutions
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DomainSection;
