import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Bot,
  Sparkles,
  Lightbulb,
  Globe,
  Brain,
  Shield,
} from "lucide-react";
import BASE_URL from "../Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// -------------------- Types --------------------
interface Assistant {
  id: string;
  object: string;
  created_at: number;
  name: string;
  description: string;
  model: string;
  instructions: string;
  tools: any[];
  top_p: number;
  temperature: number;
  reasoning_effort: null;
  tool_resources: any;
  metadata: any;
  response_format: string;
}

interface AssistantsResponse {
  object: string;
  data: Assistant[];
  has_more: boolean;
  first_id?: string;
  last_id?: string;
}

interface PaginationState {
  pageSize: number;
  hasMore: boolean;
  firstId?: string;
  lastId?: string;
  total: number;
}

// -------------------- API Client --------------------
const apiClient = axios.create({
  baseURL: BASE_URL,
});

async function getAssistants(
  limit = 50,
  after?: string
): Promise<AssistantsResponse> {
  const res = await apiClient.get("/student-service/user/getAllAssistants", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
    params: { limit, after },
  });

  return res.data;
}

// -------------------- Icon Colors --------------------
const iconStyles = [
  {
    icon: Bot,
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-300",
  },
  {
    icon: Sparkles,
    bg: "bg-pink-100 dark:bg-pink-900",
    text: "text-pink-700 dark:text-pink-300",
  },
  {
    icon: Lightbulb,
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  {
    icon: Globe,
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
  },
  {
    icon: Brain,
    bg: "bg-indigo-100 dark:bg-indigo-900",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  {
    icon: Shield,
    bg: "bg-teal-100 dark:bg-teal-900",
    text: "text-teal-700 dark:text-teal-300",
  },
];

// -------------------- Reusable Assistant Card --------------------
const AssistantCard: React.FC<{
  assistant: Assistant;
  onClick: () => void;
  index: number;
}> = ({ assistant, onClick, index }) => {
  const { icon: Icon, bg, text } = iconStyles[index % iconStyles.length];
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex flex-col items-center text-center"
    >
      <div
        className={`${bg} ${text} w-12 h-12 flex items-center justify-center rounded-full mb-4`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300 mb-2 ">
        {assistant.name}
      </h3>
      <p className="text-indigo-600 dark:text-indigo-300 text-sm line-clamp-2">
        {assistant.description}
      </p>
    </div>
  );
};

// -------------------- Component --------------------
const BharatAgentsStore: React.FC = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 12,
    hasMore: true,
    total: 0,
  });

  // Fetch Assistants
  const fetchAssistants = useCallback(
    async (after?: string, isLoadMore = false) => {
      setLoading(true);
      try {
        const response = await getAssistants(pagination.pageSize, after);

        setAssistants((prev) =>
          isLoadMore ? [...prev, ...response.data] : response.data
        );

        setPagination((prev) => ({
          ...prev,
          hasMore: response.has_more,
          firstId: response.first_id,
          lastId: response.last_id,
          total: isLoadMore
            ? prev.total + response.data.length
            : response.data.length,
        }));
      } catch (err) {
        console.error("Error fetching assistants:", err);
        setError("Failed to load assistants");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  // Search filter with useMemo
  const filteredAssistants = useMemo(() => {
    return assistants.filter((assistant) => {
      const name = assistant.name?.toLowerCase() || "";
      const description = assistant.description?.toLowerCase() || "";
      return (
        name.includes(searchTerm.toLowerCase()) ||
        description.includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, assistants]);

  // -------------------- UI --------------------
  if (loading && assistants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        <div className="flex flex-col items-center animate-pulse">
          <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-purple-700 dark:text-purple-300 text-lg font-medium">
            Loading Bharat AI Store...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
            Error Loading Assistants
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-5">{error}</p>
          <button
            onClick={() => fetchAssistants()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <header className="border-b bg-purple-50/70 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-purple-700 dark:text-purple-300">Bharat</span>{" "}
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent dark:from-pink-300 dark:to-fuchsia-400">
              AI
            </span>{" "}
            <span className="text-indigo-600 dark:text-indigo-300">Store</span>
          </h1>
          <p className="text-purple-700 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover and explore AI Assistants tailored for Indian businesses
            and citizens.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search assistants by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 dark:border-gray-700 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300"
            />
          </div>
        </div>
      </header>

      {/* Assistants Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAssistants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
              No Assistants Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssistants.map((assistant, index) => (
                <AssistantCard
                  key={assistant.id}
                  assistant={assistant}
                  index={index}
                  onClick={() =>
                    navigate(`/bharathaiexpertstore/${assistant.id}`)
                  }
                />
              ))}
            </div>

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="text-center mt-12">
                <button
                  disabled={loading}
                  onClick={() => fetchAssistants(pagination.lastId, true)}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition duration-300 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BharatAgentsStore;
