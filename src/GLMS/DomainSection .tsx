import React from "react";
import { ChevronRight, Users, CreditCard, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const domains = [
  {
    id: "cas",
    title: "Loan Origination System",
    link: "/los",
    description:
      "Optimized workflows for onboarding and expanding your customer base efficiently.",
    icon: <Users size={28} className="text-blue-600" />,
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
    icon: <CreditCard size={28} className="text-blue-600" />,
    useCases: [
      {
        id: "col-1",
        name: "Allocation Hold",
        desc: "Monitor outstanding debts with ease",
      },
      {
        id: "col-2",
        name: "Define Allocation Contract",
        desc: "Automated reminders and communication",
      },
      {
        id: "col-3",
        name: "Manual Allocation",
        desc: "Customizable repayment timelines",
      },
      {
        id: "col-4",
        name: "Manual Reallocation",
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
    icon: <DollarSign size={28} className="text-blue-600" />,
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
        name: "Installment Prepayment",
        desc: "Real-time ledger updates and audits",
      },
      {
        id: "fms-4",
        name: "NPA Grading",
        desc: "Generate balance sheets and statements",
      },
    ],
  },
];

const DomainSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Global Lending Management Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Explore systems that streamline every phase of the loan lifecycle,
            from origination to servicing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map((domain) => (
            <Link
              to={domain.link}
              key={domain.id}
              className="bg-white rounded-xl shadow hover:shadow-2xl transition-all duration-300 group overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    {domain.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {domain.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {domain.description}
                </p>

                {/* Use Cases */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 text-sm mb-2">
                    Use Cases:
                  </h4>
                  <ul className="space-y-2">
                    {domain.useCases.map((uc) => (
                      <li key={uc.id}>
                        <div className="text-sm font-medium text-gray-800">
                          {uc.name}
                        </div>
                        <p className="text-xs text-gray-500">{uc.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn More */}
                <div className="mt-auto text-blue-600 font-medium text-sm flex items-center group-hover:text-blue-800">
                  Learn more
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
