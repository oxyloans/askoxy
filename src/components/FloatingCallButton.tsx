// import React, { useState } from 'react';
// import BASE_URL from '../Config';
// import { FaPhoneAlt } from "react-icons/fa";

// interface CallerInfo {
//   callerId: string;
//   callerNumber: string;
//   callerName: string;
//   callerStatus: boolean;
//   email: string;
// }

// const FloatingCallButton: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [callerInfo, setCallerInfo] = useState<CallerInfo | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [copiedPhone, setCopiedPhone] = useState(false);
//   const [copiedEmail, setCopiedEmail] = useState(false);

//   const fetchCallerInfo = async () => {
//     setLoading(true);
//     try {
//       const userId = localStorage.getItem('userId') || 'default-user-id';
//       const response = await fetch(`${BASE_URL}/user-service/callerNumberToUserMapping/${userId}`);
//       const data = await response.json();
//       setCallerInfo(data);
//     } catch (error) {
//       console.error('Error fetching caller info:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCallClick = () => {
//     setIsModalOpen(true);
//     fetchCallerInfo();
//   };

//   const copyToClipboard = (text: string, type: 'phone' | 'email') => {
//     navigator.clipboard.writeText(text);
//     if (type === 'phone') {
//       setCopiedPhone(true);
//       setTimeout(() => setCopiedPhone(false), 2000);
//     } else {
//       setCopiedEmail(true);
//       setTimeout(() => setCopiedEmail(false), 2000);
//     }
//   };

//   const handleEmailClick = (email: string) => {
//     window.location.href = `mailto:${email}`;
//   };

//   return (
//     <>
//       <button
//         onClick={handleCallClick}
//         className="fixed top-1/2 right-0 -translate-y-1/2 bg-white rounded-l-full shadow-lg hover:shadow-xl z-[9999] flex items-center gap-2 px-4 py-3 transition-all duration-300 ease-in-out border-none cursor-pointer"
//       >
//         <div className="bg-green-500 rounded-full p-3 flex items-center justify-center">
//           <FaPhoneAlt className="text-white text-mb" />
//         </div>
//         {/* <div className="text-black text-sm font-medium">
//           <div>WE ARE</div>
//           <div className="text-xs text-gray-600">Join with the fu...</div>
//         </div> */}
//       </button>

//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] p-5"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="bg-white p-4 md:p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-slideUp"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="m-0 text-gray-800 text-lg font-semibold">📞 Caller Info</h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-transparent border-none text-xl cursor-pointer text-gray-400 hover:text-gray-600"
//               >
//                 ✕
//               </button>
//             </div>

//             {loading ? (
//               <div className="text-center py-3">
//                 <div className="text-2xl mb-1">⏳</div>
//                 <p className="text-gray-600 text-sm">Loading...</p>
//               </div>
//             ) : callerInfo ? (
//               <div className="space-y-3">
//                 <div className="p-2.5 bg-gray-50 rounded-lg">
//                   <div className="text-xs text-gray-600 mb-1">👤 Name</div>
//                   <div className="text-sm font-medium">{callerInfo.callerName}</div>
//                 </div>

//                 <div className="p-2.5 bg-gray-50 rounded-lg">
//                   <div className="text-xs text-gray-600 mb-1">📱 Phone</div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">{callerInfo.callerNumber}</span>
//                     <button
//                       onClick={() => copyToClipboard(callerInfo.callerNumber, 'phone')}
//                       className={`${copiedPhone ? 'bg-green-500' : 'bg-blue-500'} text-white border-none px-2 py-1 rounded text-sm cursor-pointer hover:opacity-90 transition-colors`}
//                     >
//                       {copiedPhone ? '✓' : '📋'}
//                     </button>
//                   </div>
//                 </div>

//                 {/* <div className="p-2.5 bg-gray-50 rounded-lg">
//                   <div className="text-xs text-gray-600 mb-1">📧 Email</div>
//                   <div className="flex justify-between items-center flex-wrap gap-2">
//                     <span
//                       className="text-sm font-medium text-blue-500 cursor-pointer underline break-all flex-1 hover:text-blue-700"
//                       onClick={() => handleEmailClick(callerInfo.email)}
//                     >
//                       {callerInfo.email}
//                     </span>
//                     <button
//                       onClick={() => copyToClipboard(callerInfo.email, 'email')}
//                       className={`${copiedEmail ? 'bg-green-500' : 'bg-blue-500'} text-white border-none px-2 py-1 rounded text-sm cursor-pointer hover:opacity-90 transition-colors`}
//                     >
//                       {copiedEmail ? '✓' : '📋'}
//                     </button>
//                   </div>
//                 </div> */}
//               </div>
//             ) : (
//               <div className="text-center py-3">
//                 <div className="text-2xl mb-1">❌</div>
//                 <p className="text-gray-600 text-sm">No caller information available</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes slideUp {
//           from { transform: translateY(30px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease;
//         }
//       `}</style>
//     </>
//   );
// };

// export default FloatingCallButton;

import React, { useState, useRef, useCallback } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { Phone, PhoneOff, Mic, Check, Copy } from "lucide-react";
import BASE_URL from "../Config";

interface CallerInfo {
  callerId: string;
  callerNumber: string;
  callerName: string;
  callerStatus: boolean;
  email: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

const FloatingCallButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callerInfo, setCallerInfo] = useState<CallerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Voice call states
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<
    ChatMessage[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const bufferRef = useRef<string>("");

  const getUserId = () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return null;
      }
      return userId;
    } catch (error) {
      console.error("Error reading userId from localStorage:", error);
      return null;
    }
  };

  const fetchCallerInfo = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId") || "default-user-id";
      const response = await fetch(
        `${BASE_URL}/user-service/callerNumberToUserMapping/${userId}`
      );
      const data = await response.json();
      setCallerInfo(data);
    } catch (error) {
      console.error("Error fetching caller info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallClick = () => {
    setIsModalOpen(true);
    fetchCallerInfo();
  };

  const copyToClipboard = (text: string, type: "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Voice calling functions
  const getEphemeralToken = useCallback(
    async (
      instructions: string,
      assistantId: string,
      voicemode: string
    ): Promise<string> => {
      try {
        const res = await fetch(
          `${BASE_URL}/student-service/user/token?assistantId=${""}&voicemode=${voicemode}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ instructions }),
          }
        );
        const data = await res.json();
        return data.client_secret.value;
      } catch (error) {
        console.error("Failed to get ephemeral token:", error);
        throw error;
      }
    },
    []
  );

  const handleRaisequery = useCallback(
    async (_callId: string, query: string) => {
      const userId = getUserId();
      if (!userId) {
        return { error: "User not logged in" };
      }
      const profileRaw = localStorage.getItem("profileData");
      if (!profileRaw) {
        setErrorMessage("Please complete your profile");
        return { error: "Profile data missing" };
      }

      let profile: any;
      try {
        profile = JSON.parse(profileRaw);
      } catch {
        setErrorMessage("Please complete your profile");
        return { error: "Invalid profile data" };
      }

      const firstName = profile.userFirstName?.trim() || "";
      const lastName = profile.userLastName?.trim() || "";
      const email = profile.customerEmail?.trim() || null;

      const userName = `${firstName} ${lastName}`.trim();

      const mobileNumber =
        localStorage.getItem("whatsappNumber")?.trim() ||
        localStorage.getItem("mobileNumber")?.trim() ||
        null;

      if (!userName || !email) {
        setErrorMessage("Please complete your profile");
        return { error: "Incomplete profile" };
      }

      const payload = {
        email,
        mobileNumber,
        queryStatus: "PENDING",
        projectType: "ASKOXY",
        askOxyOfers: "FREESAMPLE",
        adminDocumentId: "",
        comments: "",
        id: "",
        resolvedBy: "",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        query,
        userId,
      };

      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(
          `${BASE_URL}/user-service/write/saveData`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        return data
          ? {
              success: true,
              message:
                "Your query has been raised successfully. Our support team will contact you soon.",
            }
          : { error: "Failed to raise query" };
      } catch (err) {
        console.error("Error raising query:", err);
        return {
          error:
            "Something went wrong while raising your query. Please try again.",
        };
      }
    },
    []
  );

  const handleToolCall = useCallback(
    async (_callId: string, query: string, _assistantId: string) => {
      const userId = getUserId();
      if (!userId) {
        return { error: "User not found" };
      }

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${BASE_URL}/ai-service/chat1?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: query }),
      });

      const text = await res.text();

      return {
        success: true,
        data: text,
      };
    },
    []
  );

  const injectRealtimeTools = (instructions: string) => {
    if (!dataChannelRef.current) return;

    const event = {
      type: "session.update",
      session: {
        instructions,
        modalities: ["text", "audio"],
        tool_choice: "auto",
        tools: [
          {
            type: "function",
            name: "get_detailed_info",
            description:
              "Fetch user-specific or platform-related information such as orders, offers, gold prices, products, services, AI agents, or account details.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
          {
            type: "function",
            name: "raise_query",
            description: "Raises a support query.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
        ],
      },
    };

    dataChannelRef.current.send(JSON.stringify(event));
    console.log("✅ Realtime tools registered");
  };

  const setupDataChannelHandlers = useCallback(
    (
      dc: RTCDataChannel,
      onMessage: (message: ChatMessage) => void,
      onAssistantSpeaking: (speaking: boolean) => void,
      assistantId: string,
      selectedInstructions: string
    ) => {
      const pendingArgs: Record<string, string> = {};

      dc.onmessage = async (e) => {
        try {
          const event = JSON.parse(e.data);

          if (event.status === "session_started") {
            console.log("✅ Realtime session started");
            return;
          }

          if (event.type === "response.output_text.delta" && event.delta) {
            bufferRef.current += event.delta;
            onAssistantSpeaking(true);
            onMessage({
              role: "assistant",
              text: bufferRef.current,
              timestamp: new Date().toLocaleTimeString(),
            });
            return;
          }

          if (event.type === "response.stop") {
            bufferRef.current = "";
            onAssistantSpeaking(false);
            return;
          }

          if (event.type === "response.function_call_arguments.delta") {
            if (!pendingArgs[event.call_id]) {
              pendingArgs[event.call_id] = "";
            }
            pendingArgs[event.call_id] += event.delta;
            return;
          }

          if (event.type === "response.function_call_arguments.done") {
            const callId = event.call_id;
            const args = JSON.parse(pendingArgs[callId] || "{}");

            console.log("🛠 Realtime tool called:", event.name);

            let result: any = {};

            if (event.name === "get_detailed_info") {
              result = await handleToolCall(callId, args.query, assistantId);
            }

            if (event.name === "raise_query") {
              result = await handleRaisequery(callId, args.query);
            }

            dc.send(
              JSON.stringify({
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: callId,
                  output: JSON.stringify(result),
                },
              })
            );

            dc.send(JSON.stringify({ type: "response.create" }));

            delete pendingArgs[callId];
            return;
          }
        } catch (err) {
          console.error("❌ Failed to parse Realtime event:", err, e.data);
        }
      };

      dc.onopen = () => {
        console.log("Voice channel opened ✅");
        injectRealtimeTools(selectedInstructions);
        setTimeout(() => {
          dc.send(JSON.stringify({ type: "response.create" }));
        }, 300);
      };
    },
    [handleToolCall, handleRaisequery]
  );

  const startVoiceSession = useCallback(
    async (
      assistantId: string,
      selectedInstructions: string,
      onMessage: (message: ChatMessage) => void,
      onAssistantSpeaking: (speaking: boolean) => void,
      voicemode: string
    ): Promise<void> => {
      try {
        const EPHEMERAL_KEY = await getEphemeralToken(
          selectedInstructions,
          assistantId,
          voicemode
        );

        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        pc.ontrack = (e) => {
          audioEl.srcObject = e.streams[0];
        };

        micStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        pc.addTrack(micStreamRef.current.getTracks()[0]);

        const dc = pc.createDataChannel("oai-events");
        dataChannelRef.current = dc;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const model = "gpt-4o-realtime-preview-2025-06-03";
        const sdpRes = await fetch(
          `https://api.openai.com/v1/realtime?model=${model}`,
          {
            method: "POST",
            body: offer.sdp,
            headers: {
              Authorization: `Bearer ${EPHEMERAL_KEY}`,
              "Content-Type": "application/sdp",
            },
          }
        );

        const answer: RTCSessionDescriptionInit = {
          type: "answer",
          sdp: await sdpRes.text(),
        };
        await pc.setRemoteDescription(answer);

        setupDataChannelHandlers(
          dc,
          onMessage,
          onAssistantSpeaking,
          assistantId,
          selectedInstructions
        );
      } catch (error) {
        console.error("Failed to start voice session:", error);
        throw error;
      }
    },
    [getEphemeralToken, setupDataChannelHandlers]
  );

  const stopVoiceSession = useCallback(() => {
    dataChannelRef.current?.close();
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    dataChannelRef.current = null;
    micStreamRef.current = null;
    peerConnectionRef.current = null;
    bufferRef.current = "";
  }, []);

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      return false;
    }
  };

  const handleStartVoiceCall = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      setShowMicPermissionModal(true);
      return;
    }

    try {
      setIsVoiceCallActive(true);
      setVoiceTranscript("");
      setConversationMessages([]);
      setErrorMessage("");

      const onVoiceMessage = (msg: ChatMessage) => {
        if (msg.role === "user") {
          setVoiceTranscript(msg.text);
        }
        setConversationMessages((prev) => [...prev, msg]);
      };

      await startVoiceSession(
        "",
        `You are the ASKOXY.AI Voice Assistant.

  SCOPE (MANDATORY):
  Answer ONLY questions related to ASKOXY.AI, its platform, features, services, marketplace offerings, AI agents, and capabilities.
  Do NOT respond to topics unrelated to ASKOXY.AI.
  Do NOT suggest that ASKOXY.AI runs, manages, or owns users’ businesses.

 LANGUAGE & VOICE HANDLING (STRICT):

• English is the default language. Start conversations in English whenever possible.
• If the user speaks in Telugu or Hindi, detect the language and respond in the same language.
• Once detected, lock the response language for that user input.
• Do NOT switch or mix languages in the same response.
• Change language only if the user clearly speaks a different language again.
• Respond ONLY in Telugu, English, or Hindi.
• If the user speaks in any other language, respond politely:
“Sorry, I can assist only in English, Hindi, or Telugu.”
• Ignore background noise, silence, and unclear sounds.
• Do NOT guess or respond to unclear or incomplete speech.
• If the user’s voice is not clear, politely ask them to repeat in the same detected language.

  VOICE STYLE:
  This is a voice-first assistant.
  • Keep responses short, clear, natural, polite, and conversational.
  • Avoid long explanations unless explicitly asked.
  • If a request is unclear or incomplete, ask simple follow-up questions before proceeding.

  ABOUT ASKOXY.AI :
  ASKOXY.AI is an AI-Z marketplace and AI enablement platform.

  ASKOXY.AI provides:
  • A marketplace to sell products such as rice, groceries, gold, and silver
  • Services including study-abroad support, job opportunities, and free AI learning resources
  • A platform where users can create AI agents for personal and business needs

  ASKOXY.AI does NOT run or manage users’ businesses.
  It enables individuals and businesses to build and use AI agents based on their own data, services, and requirements.

  The core foundation of ASKOXY.AI is the Bharath AI Store, which allows users to create, configure, and manage AI agents for automation, support, and information delivery. Explain this clearly when asked.

  TOOL CALLING RULES (CRITICAL — NO EXCEPTIONS):
  For ANY request related to:
  • user data
  • orders
  • offers
  • gold prices
  • products
  • services
  • AI agents
  • account information

  YOU MUST call the get_detailed_info function.
  • Do NOT answer from memory and don't Guess
  • Do NOT respond before the function call
  • Always wait for the function result before replying

  REAL-TIME DATA :
  Whenever a user asks any questions related to products or items (including item details, price, availability, offers, specifications), you must call the get_detailed_info function to fetch the information.

  SUPPORT & QUERY RAISING (SIMPLIFIED FLOW):
  If the user asks for help, support, complaint, or says they want to raise a query:
  • Ask the user to explain the issue clearly in their own words
  • Accept the explanation in Telugu, English, or Hindi
  • If needed, internally convert the issue to English
  • YOU MUST call the raise_query function using ONLY the detailed issue text
  • After the function completes, politely confirm that the query has been raised

  IMPORTANT BEHAVIOR RULES:
  • Never mention APIs, tools, functions, or technical processes
  • Maintain a calm, helpful, and reassuring tone at all times
  • Encourage users to ask questions or raise queries whenever needed
  `,
        onVoiceMessage,
        setIsAssistantSpeaking,
        "alloy"
      );
    } catch (error) {
      console.error("Failed to start voice call:", error);
      setErrorMessage(
        "Failed to start voice call. Please check your microphone permissions."
      );
      setIsVoiceCallActive(false);
    }
  };

  const handleEndVoiceCall = () => {
    stopVoiceSession();
    setIsVoiceCallActive(false);
    setIsAssistantSpeaking(false);
    setVoiceTranscript("");
    setConversationMessages([]);
  };

  const MicrophonePermissionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Microphone Permission Required
          </h3>
          <p className="text-gray-600 mb-6">
            To use voice features, please allow microphone access in your
            browser settings and try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={async () => {
                try {
                  await navigator.mediaDevices.getUserMedia({ audio: true });
                  setShowMicPermissionModal(false);
                  handleStartVoiceCall();
                } catch (error) {
                  console.error("Permission denied:", error);
                }
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Give Permission
            </button>
            <button
              onClick={() => setShowMicPermissionModal(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showMicPermissionModal && <MicrophonePermissionModal />}

      <button
        onClick={handleCallClick}
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-white rounded-l-full shadow-lg hover:shadow-xl z-[9999] flex items-center gap-2 px-4 py-3 transition-all duration-300 ease-in-out border-none cursor-pointer"
      >
        <div className="bg-green-500 rounded-full p-3 flex items-center justify-center">
          <FaPhoneAlt className="text-white text-mb" />
        </div>
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] p-5"
          onClick={(e) => {
            e.stopPropagation();
            handleEndVoiceCall();
            setIsModalOpen(false);
          }}
        >
          <div
            className="bg-white p-4 md:p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {!isVoiceCallActive ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="m-0 text-gray-800 text-xl font-bold flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    Contact Support
                  </h3>
                  <button
                    onClick={() => {
                      handleEndVoiceCall();
                      setIsModalOpen(false);
                    }}
                    className="bg-transparent border-none text-2xl cursor-pointer text-gray-400 hover:text-gray-600 leading-none"
                  >
                    ✕
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-3">
                    <div className="text-2xl mb-1">⏳</div>
                    <p className="text-gray-600 text-sm">Loading...</p>
                  </div>
                ) : callerInfo ? (
                  <div className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                        <p className="text-sm text-red-600">{errorMessage}</p>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <button
                        onClick={handleStartVoiceCall}
                        className="w-fit bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Start AI Call</span>
                      </button>
                    </div>

                    <div className="w-full h-px bg-gray-300"></div>

                    <div className="flex items-center justify-center gap-6 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        <span className="text-gray-700 font-medium text-sm">
                          {callerInfo.callerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        <span className="text-gray-700 font-medium text-sm">
                          +91 {callerInfo.callerNumber}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(callerInfo.callerNumber, "phone")
                        }
                        className={`${
                          copiedPhone ? "bg-green-500" : "bg-blue-500"
                        } text-white border-none px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:opacity-90 transition-colors`}
                      >
                        {copiedPhone ? (
                          <Check className="w-4 h-4 transition-all" />
                        ) : (
                          <Copy className="w-4 h-4 transition-all" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <div className="text-2xl mb-1">❌</div>
                    <p className="text-gray-600 text-sm">
                      No caller information available
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="m-0 text-gray-800 text-xl font-bold flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      Speak with AI
                    </h3>
                    <button
                      onClick={() => {
                        handleEndVoiceCall();
                        setIsModalOpen(false);
                      }}
                      className="bg-transparent border-none text-2xl cursor-pointer text-gray-400 hover:text-gray-600 leading-none"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div
                        className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                          isAssistantSpeaking
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse"
                            : "bg-gradient-to-br from-purple-600 to-indigo-600"
                        } shadow-2xl transition-all duration-300`}
                      >
                        <Phone className="w-12 h-12 text-white" />
                      </div>
                      {isAssistantSpeaking && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border-4 border-green-400 animate-ping opacity-75"></div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Voice Call Active
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm">
                        {isAssistantSpeaking
                          ? "🔊 Assistant is speaking..."
                          : "🎤 Listening..."}
                      </p>
                    </div>

                    {voiceTranscript && (
                      <div className="bg-gray-50 rounded-lg p-3 text-left">
                        <p className="text-xs text-gray-500 mb-1">You said:</p>
                        <p className="text-sm text-gray-800">
                          {voiceTranscript}
                        </p>
                      </div>
                    )}

                    {conversationMessages.length > 0 && (
                      <div className="max-h-32 overflow-y-auto space-y-2 text-left">
                        {conversationMessages.slice(-3).map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg text-xs ${
                              msg.role === "user"
                                ? "bg-purple-100 text-purple-900"
                                : "bg-green-100 text-green-900"
                            }`}
                          >
                            <p className="font-semibold text-[10px] mb-1">
                              {msg.role === "user" ? "You" : "Assistant"}
                            </p>
                            <p className="line-clamp-2">{msg.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={handleEndVoiceCall}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg transition-all flex items-center space-x-2 mx-auto active:scale-95"
                    >
                      <PhoneOff className="w-5 h-5" />
                      <span>End Call</span>
                    </button>

                    <p className="text-xs text-gray-500">
                      💡 Speak naturally - the assistant will respond with voice
                    </p>
                  </div>

                  <div className="w-full h-px bg-gray-300 mt-4"></div>

                  {callerInfo && (
                    <div className="flex items-center justify-center gap-6 px-2 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        <span className="text-gray-700 font-medium text-sm">
                          {callerInfo.callerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        <span className="text-gray-700 font-medium text-sm">
                          +91 {callerInfo.callerNumber}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(callerInfo.callerNumber, "phone")
                        }
                        className={`${
                          copiedPhone ? "bg-green-500" : "bg-blue-500"
                        } text-white border-none px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:opacity-90 transition-colors`}
                      >
                        {copiedPhone ? (
                          <Check className="w-4 h-4 transition-all" />
                        ) : (
                          <Copy className="w-4 h-4 transition-all" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default FloatingCallButton;
