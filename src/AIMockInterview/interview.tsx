"use client";

import React, { useRef, useState, useEffect } from "react";
import { Alert, Modal } from "antd";
import { api } from "./lib/api";
import logo from "../assets/img/askoxylogoblack.png";

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
        Modal.warning({ title: "Login Required", content: "Please login to continue." });
       window.location.href = "/whatsapplogin";
      return;
    }

    if (!name) {
        Modal.warning({ title: "Profile Incomplete", content: "Name not found in profile data, please fill profile details." });
      return;
    }

    setLoading(true);
    try {
      const data = await api.login({ phone_number: phone, name });
      console.log('Login response:', data);

      if (data.user && data.user.id) {
        localStorage.setItem("user", JSON.stringify(data.user));
        Modal.success({ title: "Welcome", content: `Welcome, ${data.user.name}!` });
       window.location.href = "/interview";
      } else if (data.error) {
        Modal.error({ title: "Login Failed", content: data.error });
      } else {
        Modal.error({ title: "Login Failed", content: "Please try again." });
      }
    } catch (err) {
      console.error("Login error:", err);
      Modal.error({ title: "Error", content: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };


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
  const [lastFeedback, setLastFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");


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
            setQuestion(""); // Clear question first
            Modal.success({ title: "🎉 Round Completed", content: `Round ${data.doneRound} Completed!\n\nScore: ${data.average}%\nStatus: Passed\n\nRefresh the page to start Round ${data.advancedTo}.` });
          } else if (data.finished) {
            if (data.doneRound === 3) {
              Modal.success({ title: "🎉 Assessment Completed", content: `Final Score: ${data.average}%\nStatus: All rounds passed\n\nCongratulations!` });
            }
            setQuestion("");
          } else if (data.doneRound && data.passed === false) {
            Modal.error({ title: "❌ Round Failed", content: `Round ${data.doneRound}\n\nScore: ${data.average}%\nStatus: Did not meet passing criteria` });
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
      Modal.warning({ title: "Login Required", content: "Please log in to start the interview" });
      window.location.href = "/login";
      return;
    }

    if (!parsed) {
      Modal.warning({ title: "Resume Required", content: "Please upload and parse your resume first" });
      return;
    }

    if (round === 3) {
      Modal.info({ title: "All Rounds Completed", content: "You have already completed all 3 rounds" });
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
            1: "Multiple choice questions based on your technical skills (Need 8/12 correct to qualify)",
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
        1: "Multiple choice questions based on your technical skills (Need 8/12 correct to qualify)",
        2: "Real-world scenarios related to your experience (Need 60% to qualify)",
        3: "Coding problems with input/output format and constraints"
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
    // Extract function name from question to create proper test
    const functionMatch = question.match(/`([^`]+)\(/); 
    const functionName = functionMatch ? functionMatch[1] : 'testFunction';
    
    switch (lang) {
      case 'python': 
        return `# Test with problem example data
if '${functionName}' in globals():
    func = globals()['${functionName}']
    
    # Test with actual problem examples
    try:
        if 'two_sum' in '${functionName}':
            print("Testing two_sum with [2, 7, 11, 15], target=9")
            result = func([2, 7, 11, 15], 9)
            print(f"OUTPUT: {result}")
        elif 'max_non_adjacent' in '${functionName}':
            print("Testing max_non_adjacent_sum with [3, 2, 7, 10]")
            result = func([3, 2, 7, 10])
            print(f"OUTPUT: {result}")
        elif 'calculate_total' in '${functionName}':
            print("Testing calculate_total with cart data")
            result = func([('Laptop', 1200.0), ('Mouse', 25.5)])
            print(f"OUTPUT: {result}")
        elif 'max_subarray' in '${functionName}':
            print("Testing max_subarray_sum with [-2,1,-3,4,-1,2,1,-5,4]")
            result = func([-2, 1, -3, 4, -1, 2, 1, -5, 4])
            print(f"OUTPUT: {result}")
        else:
            # Generic test for other functions - handle different function signatures
            print("Testing function with sample data")
            if any(name in '${functionName}' for name in ['two_sum', 'twoSum', 'find_pairs', 'findPairs']):
                # Functions that need array and target
                result = func([1, 2, 3, 4, 5], 6)
            else:
                # Other functions just need array
                result = func([1, 2, 3, 4, 5])
            print(f"OUTPUT: {result}")
            
        print("SUCCESS: Function executed correctly!")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print("HINT: Check your function implementation")
else:
    print(f"ERROR: Function '${functionName}' not found")`;
      case 'php':
        // Create appropriate PHP test call based on question
        let phpTestCall = '';
        if (question.includes('manageUsers')) {
          phpTestCall = `${functionName}('add', ['id' => 1, 'name' => 'Test User', 'email' => 'test@example.com'])`;
        } else {
          phpTestCall = `${functionName}()`;
        }
        
        return `// Test the function
if (function_exists('${functionName}')) {
    try {
        $result = ${phpTestCall};
        print_r($result);
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Function not found. Make sure to define the function.";
}`;
      case 'javascript':
        return `// Test the function
if (typeof ${functionName} === 'function') {
    try {
        const result = ${functionName}([['Laptop', 1200], ['Mouse', 25.5]]);
        console.log('Result:', result);
    } catch (e) {
        console.log('Error calling function:', e.message);
    }
} else {
    console.log('Function not found. Make sure to define the function.');
}`;
      case 'java':
        return `public class Main {
    public static void main(String[] args) {
        try {
            if ("${functionName}".contains("max_subarray") || "${functionName}".contains("maxSubarray")) {
                System.out.println("Testing max_subarray_sum with [-2,1,-3,4,-1,2,1,-5,4]");
                int[] testArray = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
                int result = maxSubarraySum(testArray);
                System.out.println("OUTPUT: " + result);
            } else {
                System.out.println("Testing function with sample data");
                int[] testArray = {1, 2, 3, 4, 5};
                int result = maxSubarraySum(testArray);
                System.out.println("OUTPUT: " + result);
            }
            System.out.println("SUCCESS: Function executed correctly!");
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            System.out.println("HINT: Check your function implementation");
        }
    }
}`;
      default: return 'print("Testing function...")';
    }
  }

  function getPlaceholder(lang: string) {
    switch (lang) {
      case 'python': return 'def calculate_total(cart):\n    # Write your code here\n    pass';
      case 'php': return 'function manageUsers($action, $data = null) {\n    // Write your code here\n}';
      case 'javascript': return 'function calculateTotal(cart) {\n    // Write your code here\n}';
      case 'java': return 'public static int maxSubarraySum(int[] arr) {\n    // Write your code here using Kadane\'s algorithm\n    return 0;\n}';
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
      
      console.log('API Response:', result); // Debug log
      
      if (result.success) {
        setCodeOutput(String(result.output || "Code executed successfully"));
      } else {
        // Handle object errors properly
        let errorMsg = "Execution failed";
        if (typeof result.error === 'string') {
          errorMsg = result.error;
        } else if (typeof result.stderr === 'string') {
          errorMsg = result.stderr;
        } else if (result.error && typeof result.error === 'object') {
          errorMsg = JSON.stringify(result.error);
        }
        setCodeError(errorMsg);
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
        askedQuestions: askedQuestions,
        currentRound: round,
        currentQuestionNo: qNo,
        totalQuestions: totalQ,
      });

      setLoading(false);

      if (data.error) {
        if (data.error === "Interview not started") {
          alert("Interview session expired. Please start a new interview.");
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
        const proceed = window.confirm(`🎉 Round ${data.doneRound} Completed!\n\nScore: ${data.average}%\nStatus: Passed\n\nClick OK to start Round ${data.advancedTo}`);
        
        if (proceed) {
          setLoading(true);
          setStatus(`Starting Round ${data.advancedTo}...`);
          
          try {
            const nextRoundData = await api.startInterview({
              userId: user.id,
              sessionId,
              skills: parsed?.skills || [],
              domain: parsed?.domains?.[0] || "General",
              askedQuestions: []
            });
            
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
                1: "Multiple choice questions based on your technical skills (Need 8/12 correct to qualify)",
                2: "Real-world scenarios related to your experience (Need 60% to qualify)",
                3: "Coding problems with input/output format and constraints"
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
          } catch (err) {
            console.error("Error starting next round:", err);
            setStatus("error:Failed to start next round");
          } finally {
            setLoading(false);
          }
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
                className="w-30 h-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">AskOxy Hiring</h1>
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
                            Multiple choice questions with 4 options based on your technical skills
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">12 questions • 30 seconds each • Need 8/12 correct</p>
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
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">5 questions • 120 seconds each • Need 60% to qualify</p>
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
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">3 questions • 300 seconds each</p>
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
                  {round === 3 ? (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <pre className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap font-mono leading-relaxed">
                        {question}
                      </pre>
                    </div>
                  ) : (
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
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
                      {round === 3 ? "Your Code Solution" : "Your Answer"}
                    </label>
                    <div className="relative">
                      <textarea
                        ref={answerRef}
                        disabled={timeLeft <= 0}
                        className={`w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${round === 3 ? 'font-mono pl-12' : ''}`}
                        placeholder={timeLeft <= 0 ? "Time expired - answer submitted automatically" : round === 3 ? getPlaceholder(selectedLanguage) : "Enter your detailed answer here..."}
                        rows={round === 3 ? 20 : 8}
                        style={round === 3 ? { lineHeight: '1.5' } : {}}
                      />
                      {round === 3 && (
                        <div className="absolute left-2 top-3 text-xs text-slate-400 dark:text-slate-500 font-mono pointer-events-none select-none">
                          {Array.from({ length: 20 }, (_, i) => (
                            <div key={i} style={{ lineHeight: '1.5', height: '21px' }}>
                              {String(i + 1).padStart(2, ' ')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Code Runner for Round 3 */}
                    {round === 3 && (
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-2 items-center flex-wrap">
                          <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            💡 Backend languages only - Python/Java with line numbers
                          </p>
                        </div>
                        
                        {/* Output Display */}
                        {codeOutput && (
                          <div className="bg-slate-900 text-green-400 p-3 rounded text-xs font-mono whitespace-pre-wrap border">
                            <div className="text-slate-400 mb-1">Output:</div>
                            {typeof codeOutput === 'string' ? codeOutput : JSON.stringify(codeOutput, null, 2)}
                          </div>
                        )}
                        
                        {codeError && (
                          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded text-xs font-mono whitespace-pre-wrap border border-red-200 dark:border-red-800">
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

  