import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Bot } from "lucide-react";
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
  const token = localStorage.getItem("accessToken");
  if (!token)
    throw new Error("No authorization token found. Please log in again.");

  const res = await apiClient.get("/student-service/user/getAllAssistants", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: { limit, after },
  });

  return res.data;
}

// -------------------- Reusable Assistant Card --------------------
const AssistantCard: React.FC<{
  assistant: Assistant;
  onClick: () => void;
}> = ({ assistant, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex flex-col items-center text-center"
    >
      <div className="bg-indigo-100 text-indigo-600 w-12 h-12 flex items-center justify-center rounded-full mb-4">
        <Bot className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
        {assistant.name}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2">
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
    return assistants.filter(
      (assistant) =>
        assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assistant.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, assistants]);

  // -------------------- UI --------------------
  if (loading && assistants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center animate-pulse">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading Bharat Agent Store...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Assistants
          </h2>
          <p className="text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => fetchAssistants()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Bharath AI Expert Store
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Discover and explore AI Assistants tailored for Indian businesses
            and citizens.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search assistants by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
            />
          </div>
        </div>
      </header>

      {/* Assistants Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAssistants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Assistants Found
            </h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssistants.map((assistant) => (
                <AssistantCard
                  key={assistant.id}
                  assistant={assistant}
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
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
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
