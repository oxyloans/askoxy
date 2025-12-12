"use client";

import React, { useRef, useState, useEffect } from "react";
import { api } from "./lib/api";

export default function InterviewPage() {
  function cryptoRandom() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto)
      return crypto.randomUUID();
    return `sess-${Math.random().toString(36).slice(2)}`;
  }

  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [sessionId] = useState<string>(() => cryptoRandom());
  const [parsed, setParsed] = useState<any>(null);
  const [round, setRound] = useState<number | null>(null);
  const [qNo, setQNo] = useState<number>(0);
  const [totalQ, setTotalQ] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  // Get time limit based on round
  const getTimeLimit = (roundNumber: number) => {
    switch (roundNumber) {
      case 1: return 30;   // MCQ - 30 seconds
      case 2: return 120;  // Scenarios - 120 seconds  
      case 3: return 300;  // Technical - 300 seconds
      default: return 30;
    }
  };

  // Get correct question count per round
  const getQuestionCount = (roundNumber: number) => {
    switch (roundNumber) {
      case 1: return 12;  // MCQ - 12 questions
      case 2: return 5;   // Scenarios - 5 questions
      case 3: return 3;   // Technical - 3 questions
      default: return 5;
    }
  };
  const [roundType, setRoundType] = useState<string>("");
  const [roundDescription, setRoundDescription] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const answerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timerStopped, setTimerStopped] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [isFrontendQuestion, setIsFrontendQuestion] = useState<boolean>(false);
  const [lineCount, setLineCount] = useState<number>(1);
  const [modal, setModal] = useState<{show: boolean; type: 'success'|'error'; title: string; message: string; onClose?: () => void} | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/login";
    } else {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (question && timeLeft > 0 && !timerStopped) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (question && timeLeft === 0 && !loading && !submitting) {
      // Auto-submit when time expires
      const handleTimeExpired = async () => {
        if (!user || !question) return;
        
        let answer = "";
        if (round === 1) {
          answer = selectedOption || "No option selected (time expired)";
        } else {
          answer = answerRef.current?.value?.trim() || "No answer provided (time expired)";
        }
        
        // For Round 2, allow auto-submit even with short answers when time expires
        // The backend will handle scoring appropriately for short answers
        
        // Force submit the answer
        setLoading(true);
        setSubmitting(true);
        try {
          const data = await api.submitAnswer({
            userId: user.id,
            sessionId,
            domain: parsed?.domains?.[0] || "General",
            question,
            answer,
          });
          
          // Handle the response same as manual submit
          if (data.advancedTo) {
            setQuestion("");
            setModal({show: true, type: 'success', title: `Round ${data.doneRound} Completed!`, message: `Score: ${data.average}%\nStatus: Passed\n\nRefresh the page to start Round ${data.advancedTo}.`});
          } else if (data.finished) {
            if (data.doneRound === 3) {
              setModal({show: true, type: 'success', title: 'Assessment Completed!', message: `Final Score: ${data.average}%\nStatus: All rounds passed\n\nCongratulations!`});
            }
            setQuestion("");
          } else if (data.doneRound && data.passed === false) {
            setModal({show: true, type: 'error', title: `Round ${data.doneRound} Failed`, message: `Score: ${data.average}%\nStatus: Did not meet passing criteria`});
            setQuestion("");
          } else if (data.question) {
            // Move to next question in same round
            setQNo(data.question_no);
            setQuestion(data.question);
            setTimeLeft(timePerQuestion);
            setSelectedOption("");
            if (answerRef.current) answerRef.current.value = "";
          }
          
          if (data.last) {
            setLastFeedback({
              score: Number(data.last.score || 0),
              feedback: data.last.feedback || "",
            });
          }
        } catch (err: any) {
          console.error("Auto-submit error:", err);
          // Only stop timer for fetch errors, not validation errors during auto-submit
          if (err.message?.includes("Failed to fetch")) {
            console.log("⚠️ Auto-submit failed due to network error, stopping timer");
            setTimerStopped(true);
          } else {
            console.log("⚠️ Auto-submit completed with validation error, continuing");
          }
        } finally {
          setLoading(false);
          setSubmitting(false);
        }
      };
      handleTimeExpired();
    }
  }, [timeLeft, question, loading]);

  useEffect(() => {
    if (question) {
      setTimeLeft(timePerQuestion);
      setTimerStopped(false);
    }
  }, [question, timePerQuestion]);

  async function onUploadResume() {
    if (!user || !selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id);

    setLoading(true);
    setStatus("Uploading and parsing resume...");

    try {
      const data = await api.uploadResume(formData);
      console.log("Upload response:", data);
      setLoading(false);

      if (data?.success && data?.parsed) {
        setParsed(data.parsed);
        setStatus("success");
        console.log("Parsed data:", data.parsed);
      } else if (data?.error) {
        setStatus("error:" + data.error);
        setParsed(null);
      } else {
        setStatus("warning:Resume upload completed but no parsed data returned");
        setParsed(null);
      }
    } catch (error) {
      setLoading(false);
      setStatus("error:Resume upload failed");
      setParsed(null);
      console.error("Upload error:", error);
    }
  }

  async function startInterview() {
    if (!user) {
      alert("Please log in to start the interview");
      window.location.href = "/login";
      return;
    }

    if (!parsed) {
      alert("Please upload and parse your resume first");
      return; 
    }

    if (round === 3) {
      alert("You have already completed all 3 rounds");
      return;
    }

    setLoading(true);
    setStatus("Generating questions...");
    setAskedQuestions([]);

    try {
      const data = await api.startInterview({
        userId: user.id,
        sessionId,
        skills: parsed?.skills || [],
        domain: parsed?.domains?.[0] || "General",
        askedQuestions: askedQuestions,
      });

      setLoading(false);

      if (data.error) throw new Error(data.error);

      if (data.finished) {
        setStatus("success:" + data.message);
        return;
      }

      if (data.resume) {
        setStatus("Continuing Round " + data.round);

        const contData = await api.startInterview({ userId: user.id, sessionId });

        if (contData.question) {
          setRound(contData.round);
          setQNo(contData.question_no);
          setTotalQ(contData.total_questions || getQuestionCount(contData.round));
          setQuestion(contData.question);
          setAskedQuestions(prev => [...prev, contData.question]);
          
          // Set correct round info
          const roundTypes = { 1: "MCQ Skills", 2: "Scenario Based", 3: "Technical Round" };
          const roundDescriptions = {
            1: "Multiple choice questions based on your technical skills",
            2: "Real-world scenarios related to your experience (Need 60% to qualify)",
            3: "Coding problems with input/output format and constraints"
          };
          
          setRoundType(roundTypes[contData.round as keyof typeof roundTypes] || "");
          setRoundDescription(roundDescriptions[contData.round as keyof typeof roundDescriptions] || "");
          
          const timeLimit = contData.timeLimit || getTimeLimit(contData.round);
          setTimePerQuestion(timeLimit);
          setTimeLeft(timeLimit);
          setStatus("");
        } else {
          setStatus("warning:Could not fetch question");
        }
        return;
      }

      setRound(data.round);
      setQNo(data.question_no);
      setTotalQ(data.total_questions || getQuestionCount(data.round));
      setQuestion(data.question);
      setAskedQuestions([data.question]); // Reset for new round
      
      // Set correct round type and description
      const roundTypes = {
        1: "MCQ Skills",
        2: "Scenario Based", 
        3: "Technical Round"
      };
      const roundDescriptions = {
        1: "Multiple choice questions based on your technical skills (Need 70% to qualify)",
        2: "Real-world scenarios related to your experience (Need 60% to qualify, min 300 chars)",
        3: "Coding problems with input/output format and constraints (Need 70% to qualify)"
      };
      
      setRoundType(roundTypes[data.round as keyof typeof roundTypes] || "");
      setRoundDescription(roundDescriptions[data.round as keyof typeof roundDescriptions] || "");
      

      
      const timeLimit = data.timeLimit || getTimeLimit(data.round);
      setTimePerQuestion(timeLimit);
      setTimeLeft(timeLimit);
      setStatus("");

      setTimeout(() => {
        questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    } catch (err: any) {
      console.error("Start interview error:", err);
      setLoading(false);
      alert("Failed to start interview: " + err.message);
    }
  }

  function getTestInput(lang: string) {
    const functionMatch = question.match(/`([^`]+)\(/); 
    const functionName = functionMatch ? functionMatch[1] : 'testFunction';
    
    switch (lang) {
      case 'python': 
        return `# Test with problem example data
if '${functionName}' in globals():
    func = globals()['${functionName}']
    try:
        if 'two_sum' in '${functionName}':
            result = func([2, 7, 11, 15], 9)
        elif 'max_subarray' in '${functionName}':
            result = func([-2, 1, -3, 4, -1, 2, 1, -5, 4])
        else:
            result = func([1, 2, 3, 4, 5])
        print(f"OUTPUT: {result}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
else:
    print(f"ERROR: Function '${functionName}' not found")`;
      case 'java':
        return `public static void main(String[] args) {
    try {
        int[] testArray = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        int result = maxSubarraySum(testArray);
        System.out.println("OUTPUT: " + result);
    } catch (Exception e) {
        System.out.println("ERROR: " + e.getMessage());
    }
}`;
      default: return 'print("Testing function...")';
    }
  }

  function getPlaceholder(lang: string) {
    switch (lang) {
      case 'python': return 'def function_name():\n    # Write your code here\n    pass';
      case 'java': return 'public static int maxSubarraySum(int[] arr) {\n    // Write your code here\n    return 0;\n}';
      default: return 'def function_name():\n    # Write your code here\n    pass';
    }
  }

  async function runCode() {
    if (!answerRef.current?.value.trim()) return;
    
    setLoading(true);
    setCodeOutput("");
    setCodeError("");
    
    try {
      const response = await fetch('/api/code-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: answerRef.current.value,
          language: selectedLanguage,
          testInput: getTestInput(selectedLanguage)
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCodeOutput(result.output || "Code executed successfully");
      } else {
        setCodeError(result.output || result.error || "Execution failed");
      }
    } catch (error) {
      setCodeError("Failed to run code. Please check your syntax.");
    } finally {
      setLoading(false);
    }
  }

  // Show language change notification
  useEffect(() => {
    if (round === 3 && selectedLanguage) {
      const message = `Code will be executed in ${selectedLanguage.toUpperCase()}. Make sure your syntax matches the selected language.`;
      console.log(message);
    }
  }, [selectedLanguage, round]);

  async function submitAnswer() {
    if (!user || !question || submitting) return;

    let ans = "";
    if (round === 1) {
      if (!selectedOption) return alert("Please select an option");
      ans = selectedOption;
    } else {
      ans = answerRef.current?.value?.trim() || "";
      if (!ans) return alert("Please enter an answer");
      
      // Check minimum character requirement for Round 2
      if (round === 2 && ans.length < 300) {
        return alert(`Answer too short! Round 2 requires minimum 300 characters. Current: ${ans.length}`);
      }
    }

    setSubmitting(true);
    setLoading(true);
    setStatus("Evaluating your answer...");

    try {
      const data = await api.submitAnswer({
        userId: user.id,
        sessionId,
        domain: parsed?.domains?.[0] || "General",
        question,
        answer: ans,
        language: isFrontendQuestion ? selectedLanguage : undefined,
        askedQuestions: askedQuestions,
        currentRound: round,
        currentQuestionNo: qNo,
        totalQuestions: totalQ,
      });

      setLoading(false);

      if (data.error) {
        if (data.error.includes("Answer too short")) {
          alert(data.error);
          return;
        }
        if (data.error === "Interview not started") {
          console.log("⚠️ Interview state not found, attempting to recover...");
          // Try to restart the interview instead of failing
          try {
            const restartData = await api.startInterview({
              userId: user.id,
              sessionId,
              skills: parsed?.skills || [],
              domain: parsed?.domains?.[0] || "General"
            });
            if (restartData.question) {
              setRound(restartData.round);
              setQNo(restartData.question_no);
              setTotalQ(restartData.total_questions);
              setQuestion(restartData.question);
              setTimeLeft(restartData.timeLimit || getTimeLimit(restartData.round));
              setTimePerQuestion(restartData.timeLimit || getTimeLimit(restartData.round));
              return;
            }
          } catch (restartErr) {
            console.error("Failed to restart interview:", restartErr);
          }
          alert("Interview session lost. Please refresh the page to start a new interview.");
          setQuestion("");
          setRound(null);
          return;
        }
        throw new Error(data.error);
      }

      if (data.last)
        setLastFeedback({
          score: Number(data.last.score || 0),
          feedback: data.last.feedback || "",
        });

      if (data.average) {
        setStatus("Round Average: " + data.average + "%");
        await new Promise((r) => setTimeout(r, 3000));
      }

      if (data.advancedTo) {
        setStatus("success:Passed Round " + data.doneRound);
        setQuestion(""); // Clear current question
        
        // Show completion popup with option to continue
        const proceed = confirm(`🎉 Round ${data.doneRound} Completed!\n\nScore: ${data.average}%\nStatus: Passed\n\nClick OK to start Round ${data.advancedTo}`);
        
        if (proceed) {
          // Use the nextQuestion from the API response directly
          if (data.nextQuestion) {
            setRound(data.advancedTo);
            setQNo(1);
            setTotalQ(data.total_questions || getQuestionCount(data.advancedTo));
            setQuestion(data.nextQuestion);
            setAskedQuestions([data.nextQuestion]);
            
            // Set correct round type and description
            const roundTypes = {
              1: "MCQ Skills",
              2: "Scenario Based", 
              3: "Technical Round"
            };
            const roundDescriptions = {
              1: "Multiple choice questions based on your technical skills (Need 70% to qualify)",
              2: "Real-world scenarios related to your experience (Need 60% to qualify, min 300 chars)",
              3: "Coding problems with input/output format and constraints (Need 70% to qualify)"
            };
            
            setRoundType(roundTypes[data.advancedTo as keyof typeof roundTypes] || "");
            setRoundDescription(roundDescriptions[data.advancedTo as keyof typeof roundDescriptions] || "");
            
            const timeLimit = data.timeLimit || getTimeLimit(data.advancedTo);
            setTimePerQuestion(timeLimit);
            setTimeLeft(timeLimit);
            setSelectedOption("");
            if (answerRef.current) answerRef.current.value = "";
            setStatus("");
          }
        }
        return;
      }

      if (data.finished) {
        if (data.doneRound === 3) {
          setModal({show: true, type: 'success', title: 'Assessment Completed!', message: `Final Score: ${data.average}%\nStatus: All rounds passed\n\nCongratulations! You have successfully completed the technical assessment.`});
        }
        setStatus("success:" + data.message);
        setQuestion("");
        return;
      }

      if (data.doneRound && data.passed === false) {
        setModal({show: true, type: 'error', title: `Round ${data.doneRound} Failed`, message: `Score: ${data.average}%\nStatus: Did not meet passing criteria\n\nThank you for participating in the assessment.`});
        setStatus("error:" + (data.message || "Failed Round " + data.doneRound));
        setQuestion("");
        return;
      }

      if (data.question) {
        const expectedCount = getQuestionCount(data.round);
        
        // Only validate if we're staying in the same round
        if (data.round === round && data.question_no > expectedCount) {
          console.log(`Backend sent question ${data.question_no} but round ${data.round} should only have ${expectedCount} questions. Forcing round completion.`);
          
          // Simulate round completion and advance to next round
          if (data.round < 3) {
            setQuestion("");
            alert(`🎉 Round ${data.round} Completed!\n\nAll ${expectedCount} questions answered.\n\nRefresh the page to start Round ${data.round + 1}.`);
          } else {
            setQuestion("");
            alert(`🎉 Assessment Completed!\n\nAll rounds finished successfully!`);
          }
          return;
        }
        
        setRound(data.round);
        setQNo(data.question_no);
        setTotalQ(data.total_questions || expectedCount);
        setQuestion(data.question);
        setAskedQuestions(prev => [...prev, data.question]);
        const timeLimit = data.timeLimit || getTimeLimit(data.round);
        setTimePerQuestion(timeLimit);
        setTimeLeft(timeLimit);
        setSelectedOption("");
        if (answerRef.current) answerRef.current.value = "";
        setCodeOutput("");
        setCodeError("");
        setStatus("");
      }
    } catch (err: any) {
      console.error("Submit answer error:", err);
      setLoading(false);
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Modal */}
      {modal?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className={`text-5xl mb-4 ${modal.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {modal.type === 'success' ? '🎉' : '❌'}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{modal.title}</h3>
              <p className="text-gray-300 text-sm whitespace-pre-line">{modal.message}</p>
              <button
                onClick={() => { setModal(null); modal.onClose?.(); }}
                className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="AskOxy" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-base font-semibold text-white">ASKOXY.AI HIRING</h1>
                <p className="text-xs text-gray-400">Technical Assessment</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-200 hidden sm:inline">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!question ? (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Left: Resume Upload & Details */}
            <div className="lg:w-1/2 h-full">
              <section className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm h-full flex flex-col">
                <div className="px-5 py-4 border-b border-gray-700 flex-shrink-0">
                  <h2 className="text-base font-semibold text-white">
                    {parsed ? "Resume Details" : "Upload Resume"}
                  </h2>
                  {parsed && (
                    <p className="text-xs text-gray-400 mt-1">Your profile information</p>
                  )}
                </div>

                <div className="p-5 flex-1 overflow-y-auto min-h-0">
                  {!parsed ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2">
                          Resume File
                        </label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-emerald-400 hover:bg-gray-700 transition-all cursor-pointer"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                          <svg className="w-10 h-10 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          {selectedFile ? (
                            <div>
                              <p className="text-sm font-medium text-white truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">Click to change</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-white">Click to upload</p>
                              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={onUploadResume}
                          disabled={loading || !selectedFile}
                          className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Parsing
                            </>
                          ) : (
                            "Parse Resume"
                          )}
                        </button>
                        {selectedFile && (
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="px-4 py-2.5 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {status && !status.startsWith("success") && (
                        <div
                          className={`p-3 rounded-lg text-xs ${
                            status.startsWith("error")
                              ? "bg-red-900/20 text-red-400"
                              : status.startsWith("warning")
                              ? "bg-amber-900/20 text-amber-400"
                              : "bg-emerald-900/20 text-emerald-400"
                          }`}
                        >
                          {status.replace(/^(error|warning):/, "")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Profile Header */}
                      <div className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-lg font-semibold">
                          {parsed.name ? parsed.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">
                            {parsed.name || "Candidate"}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">Profile Verified</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <p className="text-xs font-semibold text-gray-300 mb-2">Technical Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(parsed.skills) && parsed.skills.length > 0 ? (
                            parsed.skills.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No skills detected</span>
                          )}
                        </div>
                      </div>

                      {/* Domains */}
                      <div>
                        <p className="text-xs font-semibold text-gray-300 mb-2">Domains</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(parsed.domains) && parsed.domains.length > 0 ? (
                            parsed.domains.map((domain: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                              >
                                {domain}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400 italic">No domains detected</span>
                          )}
                        </div>
                      </div>

                      {/* Upload New Resume Button */}
                      <div className="pt-3 border-t border-gray-700">
                        <button
                          onClick={() => {
                            setParsed(null);
                            setSelectedFile(null);
                            setStatus("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="w-full px-4 py-2 text-gray-300 text-sm font-medium rounded-lg border border-gray-600 hover:bg-gray-700 transition-all"
                        >
                          Upload New Resume
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right: Interview Rounds & Start Button */}
            <div className="lg:w-1/2 h-full">
              <section className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm h-full flex flex-col">
                <div className="px-5 py-4 border-b border-gray-700 flex-shrink-0">
                  <h2 className="text-base font-semibold text-white">Assessment Structure</h2>
                  <p className="text-xs text-gray-400 mt-1">Three rounds of evaluation</p>
                </div>

                <div className="p-5 flex-1 flex flex-col min-h-0">
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {/* Round 1 */}
                    <div className="p-4 border border-gray-700 rounded-lg hover:border-emerald-500 hover:bg-gray-700 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          1
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white">MCQ Skills</h3>
                          <p className="text-xs text-gray-400 mt-1">Multiple choice questions</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>12 questions</span>
                            <span>•</span>
                            <span>30s each</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="p-4 border border-gray-700 rounded-lg hover:border-teal-500 hover:bg-gray-700 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          2
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white">Scenario Based</h3>
                          <p className="text-xs text-gray-400 mt-1">Real-world scenarios</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>5 questions</span>
                            <span>•</span>
                            <span>120s each</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Round 3 */}
                    <div className="p-4 border border-gray-700 rounded-lg hover:border-green-500 hover:bg-gray-700 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          3
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white">Technical Coding</h3>
                          <p className="text-xs text-gray-400 mt-1">Coding challenges</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>3 questions</span>
                            <span>•</span>
                            <span>300s each</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Start Button - Fixed at bottom */}
                  <div className="mt-4 pt-4 border-t border-gray-700 flex-shrink-0">
                    {parsed ? (
                      <button
                        onClick={startInterview}
                        disabled={loading || round === 3}
                        className={`w-full px-5 py-3 rounded-lg font-semibold text-white text-sm transition-all ${
                          round === 3
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md"
                        }`}
                      >
                        {loading ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Starting...
                          </span>
                        ) : round === 3 ? (
                          "Assessment Completed"
                        ) : (
                          "Start Assessment"
                        )}
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
                        <p className="text-xs text-amber-400 text-center">
                          Upload resume to begin
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* Question View */
          <div className="min-h-[calc(100vh-200px)] flex justify-center">
            <div ref={questionRef} className="w-full max-w-4xl px-8">
              <section className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
              {/* Header */}
              <div className="px-5 py-2 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold text-white ${
                        round === 1
                          ? "bg-emerald-600"
                          : round === 2
                          ? "bg-teal-600"
                          : "bg-indigo-600"
                      }`}
                    >
                      {round}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        Round {round}: {roundType}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Question {qNo} of {totalQ}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                      timerStopped
                        ? "bg-gray-900/30 text-gray-400"
                        : timeLeft <= 30
                        ? "bg-red-900/30 text-red-400 animate-pulse"
                        : "bg-amber-900/30 text-amber-400"
                    }`}
                  >
                    <span className={`${timeLeft <= 30 && !timerStopped ? "animate-pulse" : ""}`}>⏱</span>
                    <span>{timerStopped ? "Stopped" : `${timeLeft}s`}</span>
                  </div>
                </div>

                {roundDescription && (
                  <div className="text-xs text-gray-400 italic">
                    {roundDescription}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                {/* Question */}
                <div>
                  {round === 3 ? (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <pre className="text-sm text-white whitespace-pre-wrap font-mono leading-relaxed">
                        {question}
                      </pre>
                    </div>
                  ) : round === 2 ? (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="text-sm text-white leading-relaxed space-y-3">
                        {question.split('\n').map((line, idx) => {
                          const trimmedLine = line.trim();
                          if (!trimmedLine) return null;
                          
                          if (trimmedLine.startsWith('**Situation:**')) {
                            return (
                              <div key={idx} className="bg-emerald-900/30 p-3 rounded border-l-4 border-emerald-400">
                                <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wide">Situation</span>
                                <p className="text-white text-base mt-1 font-medium">
                                  {trimmedLine.replace('**Situation:**', '').trim()}
                                </p>
                              </div>
                            );
                          }
                          
                          if (trimmedLine.startsWith('**Question:**')) {
                            return (
                              <div key={idx} className="bg-teal-900/30 p-3 rounded border-l-4 border-teal-400">
                                <span className="text-teal-400 font-semibold text-xs uppercase tracking-wide">Question</span>
                                <p className="text-white text-base mt-1 font-medium">
                                  {trimmedLine.replace('**Question:**', '').trim()}
                                </p>
                              </div>
                            );
                          }
                          
                          return (
                            <p key={idx} className="text-gray-200">
                              {trimmedLine}
                            </p>
                          );
                        }).filter(Boolean)}
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-sm font-medium text-white leading-relaxed">
                      {question.split(/[ABCD]\)/)[0].replace('Question:', '').trim()}
                    </h3>
                  )}
                </div>

                {/* MCQ Options */}
                {round === 1 && question.includes("A)") && (
                  <div className="space-y-1.5">
                    {["A", "B", "C", "D"].map((option) => {
                      const optionText = question
                        .split(`${option})`)[1]
                        ?.split(/[\n\r]|[BCD]\)/)[0]
                        ?.trim();
                      if (!optionText) return null;
                      return (
                        <label
                          key={option}
                          className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-colors ${
                            selectedOption === option
                              ? "border-emerald-500 bg-emerald-900/30"
                              : "border-gray-700 hover:border-emerald-600 hover:bg-gray-700/50"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            selectedOption === option
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-gray-600"
                          }`}>
                            {selectedOption === option && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            )}
                          </div>
                          <input
                            type="radio"
                            name="mcq-option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="flex items-start gap-1">
                              <span className="font-semibold text-emerald-400 text-xs">
                                {option}.
                              </span>
                              <span className="text-xs text-gray-300 leading-relaxed">
                                {optionText}
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Text Answer */}
                {round !== 1 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-white">
                        {round === 3 ? "Your Code Solution" : "Your Answer"}
                      </label>
                      {round === 3 ? (
                        <span className="text-xs text-gray-400">
                          Lines: {lineCount}
                        </span>
                      ) : round === 2 ? (
                        <span className={`text-xs ${
                          (answerRef.current?.value?.length || 0) >= 300 
                            ? 'text-green-400' 
                            : 'text-amber-400'
                        }`}>
                          Characters: {answerRef.current?.value?.length || 0}/300 minimum
                        </span>
                      ) : null}
                    </div>
                    <div className="relative">
                      <textarea
                        ref={answerRef}
                        disabled={timeLeft <= 0}
                        className={`w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${round === 3 ? 'font-mono' : ''}`}
                        placeholder={timeLeft <= 0 ? "Time expired - answer submitted automatically" : round === 3 ? getPlaceholder(selectedLanguage) : round === 2 ? "Your answer (be specific and concise):\n\n1. Immediate action:\n2. Next steps:\n3. Why this approach:" : "Enter your detailed answer here..."}
                        style={{
                          minHeight: round === 3 ? '400px' : round === 2 ? '300px' : '200px',
                          resize: 'vertical',
                          lineHeight: '1.5'
                        }}
                        onChange={(e) => {
                          if (round === 3) {
                            const lines = e.target.value.split('\n').length;
                            setLineCount(lines);
                          }
                          // Force re-render for character count display in Round 2
                          if (round === 2) {
                            setLineCount(e.target.value.length);
                          }
                        }}
                      />
                    </div>
                    
                    {/* Code Runner for Round 3 */}
                    {round === 3 && (
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-2 items-center flex-wrap">
                          <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-600 rounded bg-gray-900 text-white"
                          >
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                          </select>
                          <button
                            onClick={runCode}
                            disabled={loading || !answerRef.current?.value.trim()}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? "Running..." : "▶ Run Code"}
                          </button>
                          <p className="text-xs text-gray-400">
                            💡 Code will be compiled and executed with error checking
                          </p>
                        </div>
                        
                        {/* Output Display */}
                        {codeOutput && (
                          <div className="bg-gray-950 text-green-400 p-3 rounded text-xs font-mono whitespace-pre-wrap border border-gray-700">
                            <div className="text-gray-400 mb-1">Output:</div>
                            {typeof codeOutput === 'string' ? codeOutput : JSON.stringify(codeOutput, null, 2)}
                          </div>
                        )}
                        
                        {codeError && (
                          <div className="bg-red-900/20 text-red-400 p-3 rounded text-xs font-mono whitespace-pre-wrap border border-red-800">
                            <div className="font-semibold mb-1">Error:</div>
                            {typeof codeError === 'string' ? codeError : JSON.stringify(codeError, null, 2)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Display */}
                {lastFeedback && (
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Previous Score
                      </span>
                      <span className="text-2xl font-bold text-emerald-400">
                        {lastFeedback.score}/10
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {lastFeedback.feedback}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2 border-t border-gray-700">
                  <button
                    onClick={submitAnswer}
                    disabled={loading || submitting || (timeLeft <= 0 && !timerStopped) || (round === 1 && !selectedOption)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-all ${
                      (timeLeft <= 0 && !timerStopped) || (round === 1 && !selectedOption) || submitting
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {loading || submitting ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {submitting ? "Submitting..." : "Evaluating"}
                      </span>
                    ) : timeLeft <= 0 && !timerStopped ? (
                      "Time Expired"
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                </div>
              </div>
            </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

  