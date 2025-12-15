import React from "react";

const AskOxySteps = () => {
  const steps = [
    {
      number: 1,
      title: "Login to ASKOXY.AI",
      description: "Go to https://www.askoxy.ai/ and login",
    },
    {
      number: 2,
      title: "You're Now on the Dashboard",
      description: "After login, you're automatically taken to your dashboard.",
    },
    {
      number: 3,
      title: "Click on Bharath AI Store From Left Menu",
      description: "You'll find it on the left side menu",
    },
    {
      number: 4,
      title: "Click Create AI Agent",
      description: "Press the button to start making your agent",
    },
    {
      number: 5,
      title: "Select Card-Based Option",
      description: "This helps you make an agent from your business card",
    },
    {
      number: 6,
      title: "Upload Your Business Card",
      description: "Choose a photo of your business card (JPG or PNG)",
    },
    {
      number: 7,
      title: "Click Extract & Create Agent",
      description: "The AI will read your card and pull out the details",
    },
    {
      number: 8,
      title: "Check Details & Save Changes ",
      description:
        "Look at and fix if needed: Role, Looking For, To, Agent Name, Description",
    },
    {
      number: 9,
      title: "Use Agent Name",
      description:
        "A box will show a name suggestion. Click Use to keep it or Cancel to type your own",
    },
    {
      number: 10,
      title: "Make it Public Visibility",
      description: "Change to Public so anyone can see your agent",
    },
    {
      number: 11,
      title: "Click Publish",
      description:
        "You'll see some questions and instructions. Check them and change if you want",
    },
    {
      number: 12,
      title: "Click Publish Again",
      description: "Press Publish one more time to confirm everything",
    },
    {
      number: 13,
      title: "Upload Training Document",
      description:
        "A box will pop up asking for a document to help train your agent better",
    },
    {
      number: 14,
      title: "Upload Document & Continue!",
      description: "Upload your file, click Submit and you're all set!",
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
