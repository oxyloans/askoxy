import React from "react";

const AskOxySteps = () => {
  const commonSteps = [
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
  ];

  const cardSteps = [
    {
      number: 1,
      title: "Select Card-Based Option",
      description: "This helps you make an agent from your business card",
    },
    {
      number: 2,
      title: "Upload Your Business Card",
      description: "Choose a photo of your business card (JPG or PNG)",
    },
    {
      number: 3,
      title: "Click Extract & Create Agent",
      description: "The AI will read your card and pull out the details",
    },
    {
      number: 4,
      title: "Check Details & Save Changes",
      description:
        "Look at and fix if needed: Role, Looking For, To, Agent Name, Description",
    },
    {
      number: 5,
      title: "Use Agent Name",
      description:
        "A box will show a name suggestion. Click Use to keep it or Cancel to type your own",
    },
    {
      number: 6,
      title: "Make it Public Visibility",
      description: "Change to Public so anyone can see your agent",
    },
    {
      number: 7,
      title: "Click Preview",
      description: "Review the AI agent details before publishing",
    },
    {
      number: 8,
      title: "Agent Preview Panel Opens",
      description:
        "After clicking Preview, the Agent Preview panel opens on the right side of the screen",
    },
    {
      number: 9,
      title: "Review Agent Details",
      description:
        "Review the Agent Name, selected Role, Goal, Purpose, Visibility, and Agent Description to ensure all details are correct",
    },
    {
      number: 10,
      title: "Review Conversation Starters",
      description: "Review the Conversation Starters generated for your AI agent",
    },
    {
      number: 11,
      title: "Review Instructions",
      description:
        "Review the Instructions that define how your AI agent will respond to users",
    },
    {
      number: 12,
      title: "Edit Instructions (Optional)",
      description: "If you want to modify the AI instructions, click Edit",
    },
    {
      number: 13,
      title: "Generate New Instructions (Optional)",
      description:
        "If you want the system to generate new instructions, click Generate",
    },
    {
      number: 14,
      title: "Click Publish",
      description:
        "If you are satisfied with the preview, click Publish to publish your AI agent",
    },
    {
      number: 15,
      title: "Close Preview & Update (Optional)",
      description:
        "If you need to make changes before publishing, click Close Preview, update the required details, and preview again",
    },
  ];

  const roleSteps = [
    {
      number: 1,
      title: "Select Role Based Option",
      description:
        "Click the Role Based option on the Create Your AI Agent page",
    },
    {
      number: 2,
      title: "Select Your Role",
      description: "Select your role from the I am dropdown (e.g., Student)",
    },
    {
      number: 3,
      title: "Select Your Goal",
      description: "Select your goal from the I want to dropdown (e.g., Learn)",
    },
    {
      number: 4,
      title: "Select Your Purpose",
      description:
        "Select your purpose from the My purpose dropdown (e.g., Gain Knowledge)",
    },
    {
      number: 5,
      title: "Enter Creator Name",
      description: "Enter your name in the Creator Name field",
    },
    {
      number: 6,
      title: "Enter Agent Name",
      description:
        "Enter a unique name in the Agent Name field, or click AI Suggested to generate a name automatically",
    },
    {
      number: 7,
      title: "Enter Agent Description",
      description:
        "Enter a brief description of your AI agent, or click AI Suggested to generate a description automatically",
    },
    {
      number: 8,
      title: "Choose Visibility",
      description:
        "Personal – only you can access the agent. Public – anyone can discover and use the agent",
    },
    {
      number: 9,
      title: "Click Preview",
      description: "Review the AI agent details before publishing",
    },
    {
      number: 10,
      title: "Agent Preview Panel Opens",
      description:
        "After clicking Preview, the Agent Preview panel opens on the right side of the screen",
    },
    {
      number: 11,
      title: "Review Agent Details",
      description:
        "Review the Agent Name, selected Role, Goal, Purpose, Visibility, and Agent Description to ensure all details are correct",
    },
    {
      number: 12,
      title: "Review Conversation Starters",
      description: "Review the Conversation Starters generated for your AI agent",
    },
    {
      number: 13,
      title: "Review Instructions",
      description:
        "Review the Instructions that define how your AI agent will respond to users",
    },
    {
      number: 14,
      title: "Edit Instructions (Optional)",
      description: "If you want to modify the AI instructions, click Edit",
    },
    {
      number: 15,
      title: "Generate New Instructions (Optional)",
      description:
        "If you want the system to generate new instructions, click Generate",
    },
    {
      number: 16,
      title: "Click Publish",
      description:
        "If you are satisfied with the preview, click Publish to publish your AI agent",
    },
    {
      number: 17,
      title: "Close Preview & Update (Optional)",
      description:
        "If you need to make changes before publishing, click Close Preview, update the required details, and preview again",
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

  const FlowChart = ({
    steps,
  }: {
    steps: { number: number; title: string; description: string }[];
  }) => (
    <div className="flex flex-col items-center">
      {steps.map((step, idx) => (
        <React.Fragment key={step.number}>
          {/* Flow Node */}
          <div className="w-full max-w-md bg-white rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md hover:border-purple-400 transition-all px-4 py-2.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                STEP {step.number}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              {step.title}
            </h3>
            <p className="text-gray-600 text-xs leading-snug mt-0.5">
              {makeClickable(step.description)}
            </p>
          </div>

          {/* Connector Arrow */}
          {idx < steps.length - 1 && (
            <div className="flex flex-col items-center py-0.5">
              <div className="w-0.5 h-3 bg-purple-300"></div>
              <svg
                width="12"
                height="9"
                viewBox="0 0 16 12"
                className="fill-purple-400"
              >
                <path d="M8 12 L0 2 L16 2 Z" />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Compact branch node used inside each column (no max-width so it fills its column)
  const BranchFlowChart = ({
    steps,
  }: {
    steps: { number: number; title: string; description: string }[];
  }) => (
    <div className="flex flex-col items-center w-full">
      {steps.map((step, idx) => (
        <React.Fragment key={step.number}>
          <div className="w-full bg-white rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md hover:border-purple-400 transition-all px-3.5 py-2.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                STEP {step.number}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              {step.title}
            </h3>
            <p className="text-gray-600 text-xs leading-snug mt-0.5">
              {makeClickable(step.description)}
            </p>
          </div>

          {idx < steps.length - 1 && (
            <div className="flex flex-col items-center py-0.5">
              <div className="w-0.5 h-3 bg-purple-300"></div>
              <svg
                width="12"
                height="9"
                viewBox="0 0 16 12"
                className="fill-purple-400"
              >
                <path d="M8 12 L0 2 L16 2 Z" />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Visual fork connecting the common flow down into two branches
  const ForkConnector = () => (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-0.5 h-4 bg-purple-300"></div>
      <div className="relative w-full h-7">
        <div className="absolute left-1/4 right-1/4 top-0 h-0.5 bg-purple-300"></div>
        <div className="absolute left-1/4 top-0 w-0.5 h-7 bg-purple-300"></div>
        <div className="absolute right-1/4 top-0 w-0.5 h-7 bg-purple-300"></div>
      </div>
      <div className="flex w-full justify-between px-[calc(25%-6px)]">
        <svg width="12" height="9" viewBox="0 0 16 12" className="fill-purple-400">
          <path d="M8 12 L0 2 L16 2 Z" />
        </svg>
        <svg width="12" height="9" viewBox="0 0 16 12" className="fill-purple-400">
          <path d="M8 12 L0 2 L16 2 Z" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Outer Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Header Box */}
        <div className="bg-white/90 rounded-2xl shadow-lg border border-purple-100 px-6 py-5 mb-6">
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-2 bg-purple-50 px-4 py-1 rounded-full text-purple-700 font-medium text-xs">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Agent Creation Guide • ASKOXY.AI
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-800">
              Agent Creation Steps – ASKOXY.AI
            </h1>

            <p className="text-gray-600 text-sm">
              Login once, then choose Card Based or Role Based to create your AI Agent
            </p>
          </div>
        </div>

        {/* Common Steps */}
        <FlowChart steps={commonSteps} />

        {/* Fork into two branches */}
        <ForkConnector />

        {/* Branch labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
          <h2 className="text-base font-bold text-purple-800 text-center bg-purple-50 rounded-full py-1.5">
            1. Role Based Agent
          </h2>
          <h2 className="text-base font-bold text-purple-800 text-center bg-purple-50 rounded-full py-1.5">
            2. Card Based Agent
          </h2>
        </div>

        {/* Two Branches Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <BranchFlowChart steps={roleSteps} />
          <BranchFlowChart steps={cardSteps} />
        </div>
      </div>
    </div>
  );
};

export default AskOxySteps;