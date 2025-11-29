"use client";

import React, { useRef, useState, useEffect } from "react";
import { api } from "./lib/api";
import logo from "../assets/img/askoxylogostatic.png"

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
  const [roundType, setRoundType] = useState<string>("");
  const [roundDescription, setRoundDescription] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const answerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
     handleLogin()
    } else {
      setUser(JSON.parse(stored));
    }
  }, []);

   const handleLogin = async () => {

    const stored = localStorage.getItem("profileData") || localStorage.getItem("user") || "";

    console.log("Stored profile data:", stored);

    const phone = stored ? JSON.parse(stored).mobileNumber ? JSON.parse(stored).mobileNumber : JSON.parse(stored).whatsappNumber : "";
    const name = stored ? JSON.parse(stored).userFirstName + " " + JSON.parse(stored).userLastName : "";
    console.log("Phone:", phone);
        console.log("Name:", name);
     
    if (!phone) {
        alert("Please login to continue.");
       window.location.href = "/whatsapplogin";
      return;
    }

    if (!name) {
        alert("Name not found in profile data, please fill profile details.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.login({ phone_number: phone, name });
      console.log('Login response:', data);

      if (data.user && data.user.id) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`Welcome, ${data.user.name}!`);
       window.location.href = "/interview";
      } else if (data.error) {
        alert(`Login failed: ${data.error}`);
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (question && timeLeft === 0 && !loading) {
      // Auto-submit when time expires
      const handleTimeExpired = async () => {
        if (!user || !question) return;
        
        let answer = "";
        if (round === 1) {
          answer = selectedOption || "No option selected (time expired)";
        } else {
          answer = answerRef.current?.value?.trim() || "No answer provided (time expired)";
        }
        
        // Force submit the answer
        setLoading(true);
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
            alert(`🎉 Round ${data.doneRound} Completed!\n\nScore: ${data.average}%\nStatus: Passed\n\nYou are now eligible to proceed to Round ${data.advancedTo}.`);
            
            if (data.nextQuestion) {
              setRound(data.advancedTo);
              setQNo(1);
              setTotalQ(data.total_questions);
              setQuestion(data.nextQuestion);
              setRoundType(data.roundType || "");
              setRoundDescription(data.roundDescription || "");
              setTimePerQuestion(data.timePerQuestion || 90);
              setTimeLeft(data.timePerQuestion || 90);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
            }
          } else if (data.finished) {
            if (data.doneRound === 3) {
              alert(`🎉 Assessment Completed!\n\nFinal Score: ${data.average}%\nStatus: All rounds passed\n\nCongratulations!`);
            }
            setQuestion("");
          } else if (data.doneRound && data.passed === false) {
            alert(`❌ Round ${data.doneRound} Failed\n\nScore: ${data.average}%\nStatus: Did not meet passing criteria`);
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
        } catch (err) {
          console.error("Auto-submit error:", err);
        } finally {
          setLoading(false);
        }
      };
      
      handleTimeExpired();
    }
  }, [timeLeft, question, loading]);

  useEffect(() => {
    if (question) setTimeLeft(timePerQuestion);
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
      window.location.href = "/whatsapplogin";
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

    try {
      const data = await api.startInterview({
        userId: user.id,
        sessionId,
        skills: parsed?.skills || [],
        domain: parsed?.domains?.[0] || "General",
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
          setTotalQ(contData.total_questions);
          setQuestion(contData.question);
          setTimeLeft(90);
          setStatus("");
        } else {
          setStatus("warning:Could not fetch question");
        }
        return;
      }

      setRound(data.round);
      setQNo(data.question_no);
      setTotalQ(data.total_questions);
      setQuestion(data.question);
      setRoundType(data.roundType || "");
      setRoundDescription(data.roundDescription || "");
      setTimePerQuestion(data.timePerQuestion || 90);
      setTimeLeft(data.timePerQuestion || 90);
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

  async function submitAnswer() {
    if (!user || !question) return;

    let ans = "";
    if (round === 1) {
      if (!selectedOption) return alert("Please select an option");
      ans = selectedOption;
    } else {
      ans = answerRef.current?.value?.trim() || "";
      if (!ans) return alert("Please enter an answer");
    }

    setLoading(true);
    setStatus("Evaluating your answer...");

    try {
      const data = await api.submitAnswer({
        userId: user.id,
        sessionId,
        domain: parsed?.domains?.[0] || "General",
        question,
        answer: ans,
      });

      setLoading(false);

      if (data.error) throw new Error(data.error);

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
        // Show round completion popup
        alert(`🎉 Round ${data.doneRound} Completed!\n\nScore: ${data.average}%\nStatus: Passed\n\nYou are now eligible to proceed to Round ${data.advancedTo}.`);
        
        setStatus("success:Passed Round " + data.doneRound);
        await new Promise((r) => setTimeout(r, 1000));

        if (data.nextQuestion) {
          setRound(data.advancedTo);
          setQNo(1);
          setTotalQ(data.total_questions);
          setQuestion(data.nextQuestion);
          setRoundType(data.roundType || "");
          setRoundDescription(data.roundDescription || "");
          setTimeLeft(90);
          setSelectedOption("");
          if (answerRef.current) answerRef.current.value = "";
          setStatus("");
          
          // Auto-scroll to new round
          setTimeout(() => {
            questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        } else {
          await startInterview();
        }
        return;
      }

      if (data.finished) {
        // Show final completion popup
        if (data.doneRound === 3) {
          alert(`🎉 Assessment Completed!\n\nFinal Score: ${data.average}%\nStatus: All rounds passed\n\nCongratulations! You have successfully completed the technical assessment.`);
        }
        setStatus("success:" + data.message);
        setQuestion("");
        return;
      }

      if (data.doneRound && data.passed === false) {
        // Show failure popup
        alert(`❌ Round ${data.doneRound} Failed\n\nScore: ${data.average}%\nStatus: Did not meet passing criteria\n\nThank you for participating in the assessment.`);
        setStatus("error:" + (data.message || "Failed Round " + data.doneRound));
        setQuestion("");
        return;
      }

      if (data.question) {
        setRound(data.round);
        setQNo(data.question_no);
        setTotalQ(data.total_questions);
        setQuestion(data.question);
        setTimeLeft(90);
        setSelectedOption("");
        if (answerRef.current) answerRef.current.value = "";
        setStatus("");
      }
    } catch (err: any) {
      console.error("Submit answer error:", err);
      setLoading(false);
      alert("Error: " + err.message);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logo}
                alt="AskOxy Logo" 
                className="w-20 h-20 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">ASKOXY Hiring</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Technical Assessment</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white hidden sm:inline">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!question ? (
          <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)]">
            {/* Left: Resume Upload & Details */}
            <div className="lg:w-1/2 h-full">
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-full flex flex-col">
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {parsed ? "Resume Details" : "Upload Resume"}
                  </h2>
                  {parsed && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Parsed resume information</p>
                  )}
                </div>

                <div className="p-5 flex-1 overflow-y-auto min-h-0">
                  {!parsed ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Resume File
                        </label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                          <svg className="w-5 h-5 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          {selectedFile ? (
                            <div>
                              <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Click to change</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs font-medium text-slate-900 dark:text-white">Click to upload</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOC, DOCX, TXT</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={onUploadResume}
                          disabled={loading || !selectedFile}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
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
                            className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {status && !status.startsWith("success") && (
                        <div
                          className={`p-3 rounded-lg text-xs ${
                            status.startsWith("error")
                              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                              : status.startsWith("warning")
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                              : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {status.replace(/^(error|warning):/, "")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Profile Header */}
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {parsed.name ? parsed.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {parsed.name || "Candidate"}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Profile Summary</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Technical Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(parsed.skills) && parsed.skills.length > 0 ? (
                            parsed.skills.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500 dark:text-slate-400 italic">No skills detected</span>
                          )}
                        </div>
                      </div>

                      {/* Domains */}
                      <div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2.5 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                          Domains
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(parsed.domains) && parsed.domains.length > 0 ? (
                            parsed.domains.map((domain: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                              >
                                {domain}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500 dark:text-slate-400 italic">No domains detected</span>
                          )}
                        </div>
                      </div>

                      {/* Upload New Resume Button */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => {
                            setParsed(null);
                            setSelectedFile(null);
                            setStatus("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="w-full px-3 py-2 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-full flex flex-col">
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Assessment Structure</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Three rounds of technical evaluation</p>
                </div>

                <div className="p-5 flex-1 flex flex-col min-h-0">
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {/* Round 1 */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">
                          1
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">MCQ Skills</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Multiple choice questions based on your technical skills
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">12 questions • 30 seconds each</p>
                        </div>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm flex-shrink-0">
                          2
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Scenario Based</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Real-world scenarios related to your experience
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">8 questions • 90 seconds each</p>
                        </div>
                      </div>
                    </div>

                    {/* Round 3 */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-semibold text-sm flex-shrink-0">
                          3
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Technical Round</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Technical questions based on your skills and experience
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">5 questions • 90 seconds each</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Start Button - Fixed at bottom */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                    {parsed ? (
                      <button
                        onClick={startInterview}
                        disabled={loading || round === 3}
                        className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                          round === 3
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {loading ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Starting Assessment
                          </span>
                        ) : round === 3 ? (
                          "Assessment Completed"
                        ) : (
                          "Start Assessment"
                        )}
                      </button>
                    ) : (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                          Upload and parse your resume to begin the assessment
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
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div ref={questionRef} className="w-full max-w-2xl">
              <section className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              {/* Header */}
              <div className="px-5 py-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold text-white ${
                        round === 1
                          ? "bg-blue-600"
                          : round === 2
                          ? "bg-purple-600"
                          : "bg-green-600"
                      }`}
                    >
                      {round}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        Round {round}: {roundType}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Question {qNo} of {totalQ}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                      timeLeft <= 30
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    <span className={`${timeLeft <= 30 ? "animate-pulse" : ""}`}>⏱</span>
                    <span>{timeLeft}s</span>
                  </div>
                </div>

                {roundDescription && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                    {roundDescription}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                {/* Question */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                    {question.split(/[ABCD]\)/)[0].replace('Question:', '').trim()}
                  </h3>
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
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            selectedOption === option
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-300 dark:border-slate-600"
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
                              <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">
                                {option}.
                              </span>
                              <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
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
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Your Answer
                    </label>
                    <textarea
                      ref={answerRef}
                      disabled={timeLeft <= 0}
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={timeLeft <= 0 ? "Time expired - answer submitted automatically" : "Enter your detailed answer here..."}
                      rows={8}
                    />
                  </div>
                )}

                {/* Feedback Display */}
                {lastFeedback && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Previous Score
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {lastFeedback.score}/10
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {lastFeedback.feedback}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={submitAnswer}
                    disabled={loading || timeLeft <= 0 || (round === 1 && !selectedOption)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-all ${
                      timeLeft <= 0 || (round === 1 && !selectedOption)
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Evaluating
                      </span>
                    ) : timeLeft <= 0 ? (
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
  