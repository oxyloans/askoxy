import React, { useState } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Book,
  Zap,
} from "lucide-react";

const ApiDocs = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedApi, setExpandedApi] = useState<string>("publish");
  const [selectedEnv, setSelectedEnv] = useState<"production" | "staging">(
    "production"
  );

  const baseUrls = {
    production: "https://meta.oxyloans.com/api/ai-service/agent/",
    staging: "http://65.0.147.157:9040/api/ai-service/agent/",
  };

  const apis = [
    {
      id: "publish",
      title: "New Agent Publish",
      method: "PATCH",
      path: "/newAgentPublish",
      description:
        "Creates or updates an AI Assistant (Agent) for a user. Saves agent metadata, interacts with OpenAI Assistant API to create/update assistant, stores starter conversation templates, and sends WhatsApp + email notifications.",
      requestType: "body",
      example: {
        agentId: 123,
        userId: 456,
        agentName: "FitGuide Pro",
        description: "Your personal fitness and wellness assistant",
        instructions: "Help users achieve their fitness goals",
        headerTitle: "FitGuide",
        view: "public",
        roleUser: "fitness coach",
        optionalRole: "nutritionist",
        goals: "fitness improvement",
        optionalGoal: "weight loss",
        purpose: "health guidance",
        optionalPurpose: "meal planning",
        language: "English",
        acheivements: "Certified trainer",
        userExperienceSummary: "5 years experience",
        domain: "Health & Fitness",
        subDomain: "Personal Training",
        uniqueSolution: "AI-powered personalized plans",
        business: "Online coaching",
        targetUser: "Fitness beginners",
        converstionTone: "Friendly and motivating",
        ageLimit: "18+",
        gender: "All",
        contactDetails: "support@fitguide.com",
        chooseStore: "main",
        imageUrl: "https://example.com/agent.jpg",
        voiceStatus: true,
        conStarter1: "How can I start my fitness journey?",
        conStarter2: "What's a good beginner workout?",
        conStarter3: "Can you create a meal plan for me?",
        conStarter4: "How do I track my progress?",
        rateThisPlatform: "5 stars",
        shareYourFeedback: "Great service!",
        jobStatus: "active",
      },
    },
    {
      id: "goals",
      title: "Get Goals By Role",
      method: "POST",
      path: "/getGoalsByRole",
      description:
        "Returns a list of 20 one-word goals based on the given role. Uses OpenAI (gpt-4o) to generate deterministic, consistent results. Results are cached to avoid repeated AI calls.",
      requestType: "params",
      params: [
        {
          name: "role",
          type: "String",
          required: true,
          description:
            "The role for which to generate goals (e.g., teacher, doctor, coach)",
        },
      ],
      example: "teacher",
      response:
        "motivation\ninspiration\neducation\nguidance\nmentorship\nknowledge\nlearning\ndevelopment\ngrowth\nsuccess\nexcellence\nachievement\nempowerment\ninnovation\ncreativity\nunderstanding\npatience\nleadership\nsupport\ntransformation",
    },
    {
      id: "purpose",
      title: "Get Purpose By Role And Goals",
      method: "POST",
      path: "/getPurposeByRoleAndGoals",
      description:
        "Generates and returns 20 deterministic purposes based on a combination of role and goal. Results are cached to ensure consistent output for identical inputs.",
      requestType: "params",
      params: [
        {
          name: "role",
          type: "String",
          required: true,
          description: "The role of the agent",
        },
        {
          name: "goal",
          type: "String",
          required: true,
          description: "The goal to achieve",
        },
      ],
      example: { role: "doctor", goal: "fitness" },
      response:
        "wellness plans\nhealth tracking\nnutrition advice\nexercise routines\npreventive care\nlifestyle coaching\nfitness assessment\nhealth monitoring\nwellness education\nchronic care\nrehabilitation\nmental wellness\nstress management\nsleep optimization\nimmunity boost\naging well\ninjury prevention\nperformance enhancement\nholistic health\npatient empowerment",
    },
    {
      id: "name",
      title: "Generate Agent Name",
      method: "POST",
      path: "/getAgentName",
      description:
        "Generates one creative, short, professional agent name based on the user's selected role, goal, and purpose. Uses OpenAI (gpt-4o) to produce a clean single name (1-3 words). No symbols or numbers.",
      requestType: "params",
      params: [
        {
          name: "role",
          type: "String",
          required: true,
          description: "The role of the agent",
        },
        {
          name: "goal",
          type: "String",
          required: true,
          description: "The primary goal",
        },
        {
          name: "purpose",
          type: "String",
          required: true,
          description: "The specific purpose",
        },
      ],
      example: { role: "teacher", goal: "motivation", purpose: "guidance" },
      response: "Generated Agent Name: EduGuide",
    },
    {
      id: "description",
      title: "Get Agent Description",
      method: "POST",
      path: "/getAgentDescription",
      description:
        "Generates a concise, professional, and meaningful agent description (around 250 characters) based on the user's role, goal, and purpose. The description explains what the agent does in a clear, engaging, user-friendly tone.",
      requestType: "params",
      params: [
        {
          name: "role",
          type: "String",
          required: true,
          description: "The role of the agent",
        },
        {
          name: "goal",
          type: "String",
          required: true,
          description: "The primary goal",
        },
        {
          name: "purpose",
          type: "String",
          required: true,
          description: "The specific purpose",
        },
      ],
      example: { role: "doctor", goal: "care", purpose: "guidance" },
      response:
        "A helpful medical guidance agent designed to support users with clear insights and compassionate assistance, focusing on improving well-being and informed decision-making.",
    },
    {
      id: "instructions",
      title: "Classification Instructions",
      method: "POST",
      path: "/classifyInstruct",
      description:
        "Generates structured, professional, well-formatted instructions based on the provided description. The output includes headings, bullet points, steps, and readable formatting. If an agentId is provided, additional agent details are appended.",
      requestType: "params",
      params: [
        {
          name: "description",
          type: "String",
          required: false,
          description: "Description of what the agent should do",
        },
        {
          name: "agentId",
          type: "UUID",
          required: false,
          description: "Optional agent ID for additional context",
        },
      ],
      example: {
        description: "create a fitness plan",
        agentId: "123e4567-e89b-12d3-a456-426614174000",
      },
      response:
        "<AI-generated structured instructions>\n\n### Agent Information\n- Creator Name: John Doe\n- Age Limit: 18+\n- Creator Identity: FitGuide\n- Preferred Language: English\n- Agent Name: FitGuide\n- Domain: Health\n- SubDomain: Fitness",
    },
    {
      id: "conversation",
      title: "Classify Start Conversation",
      method: "POST",
      path: "/classifyStartConversation",
      description:
        "Generates 6 natural, short, meaningful starter conversation questions based on the provided agent description. Helps users initiate a smooth and relevant chat with the agent.",
      requestType: "params",
      params: [
        {
          name: "description",
          type: "String",
          required: false,
          description: "Description of the agent",
        },
        {
          name: "agentId",
          type: "UUID",
          required: false,
          description: "Optional agent ID (not used in current logic)",
        },
      ],
      example: { description: "fitness training assistant" },
      response:
        "1. How can you help me start my fitness journey?\n2. What daily routine would you recommend?\n3. Can you guide me on healthy meal options?\n4. How do I stay motivated consistently?\n5. What exercises are best for beginners?\n6. How can I track my weekly progress?",
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "POST":
        return "bg-blue-500";
      case "PATCH":
        return "bg-yellow-500";
      case "GET":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const generateCurlCommand = (api: any) => {
    const baseUrl = baseUrls[selectedEnv];
    if (api.requestType === "body") {
      return `curl -X ${api.method} "${baseUrl}${api.path}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(api.example, null, 2)}'`;
    } else {
      const params =
        typeof api.example === "string"
          ? `role=${api.example}`
          : Object.entries(api.example)
              .map(([k, v]) => `${k}=${v}`)
              .join("&");
      return `curl -X ${api.method} "${baseUrl}${api.path}?${params}"`;
    }
  };

  const generateJavaScriptCode = (api: any) => {
    const baseUrl = baseUrls[selectedEnv];
    if (api.requestType === "body") {
      return `const response = await fetch('${baseUrl}${api.path}', {
  method: '${api.method}',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${JSON.stringify(api.example, null, 2)})
});

const data = await response.json();
console.log(data);`;
    } else {
      const params =
        typeof api.example === "string"
          ? `role=${api.example}`
          : Object.entries(api.example)
              .map(([k, v]) => `${k}=${v}`)
              .join("&");
      return `const response = await fetch('${baseUrl}${api.path}?${params}', {
  method: '${api.method}'
});

const data = await response.text();
console.log(data);`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  AI Agent API
                </h1>
                <p className="text-sm text-slate-500">
                  Build intelligent agents with ease
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedEnv}
                onChange={(e) =>
                  setSelectedEnv(e.target.value as "production" | "staging")
                }
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Getting Started
              </h2>
              <p className="text-slate-600 mb-4">
                Welcome to the AI Agent API documentation. This API allows you
                to create, configure, and manage AI-powered agents that can
                assist users with various tasks. Follow the steps below to
                integrate these APIs into your application.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Base URL ({selectedEnv})
                </h3>
                <code className="text-sm text-blue-700 break-all">
                  {baseUrls[selectedEnv]}
                </code>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900">
                  Integration Steps:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                  <li>
                    Choose your environment (Production or Staging) from the
                    selector above
                  </li>
                  <li>Review the API endpoints and their descriptions below</li>
                  <li>
                    Copy the code examples in your preferred format (cURL or
                    JavaScript)
                  </li>
                  <li>Replace example parameters with your actual data</li>
                  <li>
                    Test your integration and handle responses appropriately
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-6">
          {apis.map((api) => (
            <div
              key={api.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* API Header */}
              <div
                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() =>
                  setExpandedApi(expandedApi === api.id ? "" : api.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <span
                      className={`${getMethodColor(
                        api.method
                      )} text-white px-3 py-1 rounded-md text-sm font-semibold`}
                    >
                      {api.method}
                    </span>
                    <code className="text-slate-700 font-mono text-sm bg-slate-100 px-3 py-1 rounded">
                      {api.path}
                    </code>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {api.title}
                    </h3>
                  </div>
                  {expandedApi === api.id ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* API Details */}
              {expandedApi === api.id && (
                <div className="border-t border-slate-200 p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Description
                    </h4>
                    <p className="text-slate-600">{api.description}</p>
                  </div>

                  {/* Parameters or Body */}
                  {api.requestType === "params" && api.params ? (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">
                        Request Parameters
                      </h4>
                      <div className="space-y-2">
                        {api.params.map((param, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <code className="text-blue-600 font-mono text-sm">
                                {param.name}
                              </code>
                              <span className="text-xs px-2 py-1 bg-slate-200 rounded">
                                {param.type}
                              </span>
                              {param.required && (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">
                              {param.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">
                        Request Body (JSON)
                      </h4>
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm font-mono">
                          {JSON.stringify(api.example, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Example Response */}
                  {api.response && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">
                        Example Response
                      </h4>
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                          {api.response}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Code Examples */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Code Examples
                    </h4>

                    {/* cURL */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          cURL
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              generateCurlCommand(api),
                              `${api.id}-curl`
                            )
                          }
                          className="flex items-center space-x-2 px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          {copiedId === `${api.id}-curl` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span>
                            {copiedId === `${api.id}-curl` ? "Copied!" : "Copy"}
                          </span>
                        </button>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre">
                          {generateCurlCommand(api)}
                        </pre>
                      </div>
                    </div>

                    {/* JavaScript */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          JavaScript (fetch)
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              generateJavaScriptCode(api),
                              `${api.id}-js`
                            )
                          }
                          className="flex items-center space-x-2 px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          {copiedId === `${api.id}-js` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span>
                            {copiedId === `${api.id}-js` ? "Copied!" : "Copy"}
                          </span>
                        </button>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre">
                          {generateJavaScriptCode(api)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Need Help?</h3>
          <p className="text-slate-600 mb-4">
            If you have questions or need assistance integrating these APIs,
            please contact our support team.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="mailto:support@oxyloans.com"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="#"
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
