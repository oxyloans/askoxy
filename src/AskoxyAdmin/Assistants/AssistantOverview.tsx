import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import AssistantDetails from "./AssistantDetails";
import { getAssistantDetails, Assistant } from "./assistantApi";

const AssistantOverview: React.FC = () => {
  const { assistantId } = useParams<{ assistantId: string }>();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "details">("details");
  const navigate = useNavigate();

  const handleAssistantUpdated = (updatedAssistant: Assistant) => {
    setAssistant(updatedAssistant);
    if (assistantId) {
      getAssistantDetails(assistantId)
        .then((data) => {
          setAssistant(data);
        })
        .catch((err) => {
          console.error("Failed to refresh assistant data:", err);
        });
    }
  };
  const handleAssistantDeleted = () => {
    setAssistant(null);
    navigate("/admn/assistants");
  };

  useEffect(() => {
    if (!assistantId) return;

    setLoading(true);
    getAssistantDetails(assistantId)
      .then((data) => {
        setAssistant(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [assistantId]);

  if (!assistantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-purple-600 text-xl font-semibold">
            Invalid assistant ID
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="flex flex-col max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-xl border border-purple-100 border-b-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 p-4 text-center font-semibold rounded-tl-2xl transition-all duration-200 ${
                activeTab === "chat"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              Chat with {assistant ? assistant.name : "Assistant"}
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 p-4 text-center font-semibold rounded-tr-2xl transition-all duration-200 ${
                activeTab === "details"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              Assistant Details
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-xl border border-purple-100 border-t-0 p-4">
          {activeTab === "chat" ? (
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <div className="text-purple-600 font-medium">
                      Loading assistant...
                    </div>
                  </div>
                </div>
              ) : assistant ? (
                <ChatWindow
                  assistantId={assistantId}
                  assistantName={assistant.name}
                />
              ) : (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="text-purple-600 font-medium">
                      Assistant not found
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ minHeight: "70vh" }}>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <div className="text-purple-600 font-medium">
                      Loading assistant...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <AssistantDetails
                    assistant={assistant}
                    onAssistantUpdated={handleAssistantUpdated}
                    onAssistantDeleted={handleAssistantDeleted}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistantOverview;
