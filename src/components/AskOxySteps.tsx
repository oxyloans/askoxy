import React from "react";

const AskOxySteps = () => {
  const steps = [
    {
      number: 1,
      title: "Login to AskOxy.AI",
      description: "Go to https://www.askoxy.ai/ and login with your account",
    },
    {
      number: 2,
      title: "Open Dashboard",
      description: "You will see the Dashboard after you login",
    },
    {
      number: 3,
      title: "Go to Bharath AI Store",
      description: "From the left side menu, click on Bharath AI Store",
    },
    {
      number: 4,
      title: "Create AI Agent",
      description: "Click on the Create AI Agent button",
    },
    {
      number: 5,
      title: "Choose Card-Based Option",
      description: "Select the Card-Based option",
    },
    {
      number: 6,
      title: "Upload Your Business Card",
      description: "Upload your business card image",
    },
    {
      number: 7,
      title: "Extract & Create Agent",
      description: "Click on Extract & Create Agent button",
    },
    {
      number: 8,
      title: "Check and Update Details",
      description:
        "Review and update: Role, Looking For, To, Agent Name, and Description",
    },
    {
      number: 9,
      title: "Set Agent Name",
      description:
        "Click Use to keep the suggested name or Cancel to set your own name",
    },
    {
      number: 10,
      title: "Make it Public",
      description: "Set Visibility to Public",
    },
    {
      number: 11,
      title: "Publish First Time",
      description:
        "Click Publish to see suggested questions and instructions. Check them and make changes if needed",
    },
    {
      number: 12,
      title: "Publish Again to Confirm",
      description: "Click Publish button again to confirm",
    },
    {
      number: 13,
      title: "Upload Training Document",
      description:
        "A popup will ask you to upload a document to train your agent better",
    },
    {
      number: 14,
      title: "Submit and Finish",
      description: "Upload the document and click Submit to complete",
    },
  ];

  // Convert URLs inside description into clickable links
  const makeClickable = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part: string, i: number) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-semibold underline hover:text-blue-800 break-all"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Outer Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Header Box */}
        <div className="bg-white/90 rounded-2xl shadow-lg border border-purple-100 px-6 py-8 mb-8">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 bg-purple-50 px-4 py-1 rounded-full text-purple-700 font-medium text-sm">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Agent Creation Guide • ASKOXY.AI
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-800">
              Agent Creation Steps – ASKOXY.AI
            </h1>

            <div className="text-gray-600 text-sm">
              <p>An Initiative of FTCCI Member Company</p>
              <p>Registration Number: 12202</p>
              <p className="font-semibold text-gray-800">
                Oxykart Technologies Pvt Ltd
              </p>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
            >
              {/* Number Circle */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 text-white flex items-center justify-center rounded-full text-lg font-bold shadow-md">
                {step.number}
              </div>

              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {makeClickable(step.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AskOxySteps;
