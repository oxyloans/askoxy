"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "./lib/api";
import { Modal } from "antd";
import  logo from '../assets/img/ask oxy white.png';
import { AttemptStatus } from './AttemptStatus';

export default function InterviewPage() {
  function cryptoRandom() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto)
      return crypto.randomUUID();
    return `sess-${Math.random().toString(36).slice(2)}`;
  }

  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [sessionId] = useState<string>(() => cryptoRandom());
  const [parsed, setParsed] = useState<any>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [round, setRound] = useState<number | null>(null);
  const [qNo, setQNo] = useState<number>(0);
  const [totalQ, setTotalQ] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [showResumeDetails, setShowResumeDetails] = useState(false);

  // Get time limit based on round
  const getTimeLimit = (roundNumber: number) => {
    switch (roundNumber) {
      case 1: return 30;   // Round 1: 30 seconds
      case 2: return 120;  // Round 2: 120 seconds
      case 3: return 300;  // Round 3: 300 seconds
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

  // Check if user is from non-technical background
  const isNonTechnical = (skills: string[], domains: string[]) => {
    const nonTechKeywords = ['hr', 'human resource', 'marketing', 'sales', 'finance', 'accounting', 'business', 'management', 'admin', 'operations', 'customer service', 'support'];
    const allText = [...(skills || []), ...(domains || [])].join(' ').toLowerCase();
    return nonTechKeywords.some(keyword => allText.includes(keyword));
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
  const [typingText, setTypingText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [analysisTypingText, setAnalysisTypingText] = useState("");
  const [showAnalysisMessage, setShowAnalysisMessage] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{score: number; feedback: string; userAnswer: string} | null>(null);
  const [feedbackTimer, setFeedbackTimer] = useState(10);
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [nextQuestionData, setNextQuestionData] = useState<any>(null);
  const [canStartInterview, setCanStartInterview] = useState(true);

  // Helper function to handle next question
  const handleNextQuestion = useCallback(async (feedbackData: any) => {
    if (!user || !question) return;
    
    const answer = feedbackData?.userAnswer || currentFeedback?.userAnswer || "No answer provided";
    
    try {
      const data = await api.submitAnswer({
        userId: user.id,
        sessionId,
        domain: parsed?.domains?.[0] || "General",
        question,
        answer,
      });
      
      if (data.advancedTo) {
        setQuestion("");
        const roundNames: { [key: number]: string } = { 1: "MCQ Skills", 2: "Scenario Based", 3: "Technical Coding" };
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Pass Criteria: ${data.doneRound === 1 ? '70%' : data.doneRound === 2 ? '60%' : '70%'}\n\nStatus: Qualified\n\nCongratulations!\nYou have met the eligibility criteria and can proceed to the next round.\n\nClick Continue to move forward.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              const roundTypes = { 1: "MCQ Skills", 2: "Scenario Based", 3: "Technical Round" };
              const roundDescriptions = { 1: "Multiple choice questions based on your technical skills (Need 70% to qualify)", 2: "Real-world scenarios related to your experience (Need 60% to qualify, min 300 chars)", 3: "Coding problems with input/output format and constraints (Need 70% to qualify)" };
              setRoundType(roundTypes[data.advancedTo as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[data.advancedTo as keyof typeof roundDescriptions] || "");
              setTimePerQuestion(getTimeLimit(data.advancedTo));
              setTimeLeft(getTimeLimit(data.advancedTo));
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }
      
      if (data.doneRound && data.passed === false) {
        setQuestion("");
        const roundNames: { [key: number]: string } = { 1: "MCQ Skills", 2: "Scenario Based", 3: "Technical Coding" };
        const requiredScores: { [key: number]: string } = { 1: "70%", 2: "60%", 3: "70%" };
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Your Score: ${data.average}%\nMinimum Required: ${requiredScores[data.doneRound]}\n\nRound completed! You can continue to the next round to complete the full assessment.\n\nClick Continue to proceed.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo || data.doneRound + 1);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo || data.doneRound + 1));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              const roundTypes = { 1: "MCQ Skills", 2: "Scenario Based", 3: "Technical Round" };
              const roundDescriptions = { 1: "Multiple choice questions based on your technical skills (Need 70% to qualify)", 2: "Real-world scenarios related to your experience (Need 60% to qualify, min 300 chars)", 3: "Coding problems with input/output format and constraints (Need 70% to qualify)" };
              const nextRound = data.advancedTo || data.doneRound + 1;
              setRoundType(roundTypes[nextRound as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[nextRound as keyof typeof roundDescriptions] || "");
              setTimePerQuestion(getTimeLimit(nextRound));
              setTimeLeft(getTimeLimit(nextRound));
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }
      
      if (data.question) {
        setQNo(data.question_no);
        setQuestion(data.question);
        setAskedQuestions(prev => [...prev, data.question]);
        setTimePerQuestion(30);
        setTimeLeft(30);
        setTimerStopped(true);
        setSelectedOption("");
        if (answerRef.current) answerRef.current.value = "";
      }
    } catch (err) {
      console.error("Failed to get next question:", err);
    }
  }, [user, question, sessionId, parsed, currentFeedback, getQuestionCount]);

  const languageOptions = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    // { value: "Automation", label: "C#" }, 
  ];

  const aiMessages = [
    "Welcome to AI Interview! 🤖",
    "I'll analyze your resume...",
    "Generate personalized questions...",
    "Evaluate your responses...",
    "Ready to start your assessment?"
  ];

    useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
     handleLogin()
    } else {
      setUser(JSON.parse(stored));
    }
  }, []);

  // AI Bot typing animation effect
  useEffect(() => {
    if (!showWelcome) return;
    
    const message = aiMessages[currentMessageIndex];
    let charIndex = 0;
    setTypingText("");
    
    const typingInterval = setInterval(() => {
      if (charIndex < message.length) {
        setTypingText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Wait 2 seconds then move to next message
        setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % aiMessages.length);
        }, 2000);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, [currentMessageIndex, showWelcome]);

   const handleLogin = async () => {

    const stored = localStorage.getItem("profileData") || localStorage.getItem("user") || "";

    console.log("Stored profile data:", stored);

    const phone = stored ? JSON.parse(stored).mobileNumber ? JSON.parse(stored).mobileNumber : JSON.parse(stored).whatsappNumber : "";
    const name = stored ? JSON.parse(stored).userFirstName + " " + JSON.parse(stored).userLastName : "";
    console.log("Phone:", phone);
        console.log("Name:", name);
     
    if (!phone) {
        Modal.warning({ title: "Login Required", content: "Please login to continue." });
        sessionStorage.setItem("redirectPath","/interview")
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



  useEffect(() => {
    if (question && timeLeft > 0 && !timerStopped) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (question && timeLeft === 0 && !loading && !submitting && !showFeedback && !timerStopped) {
      // When time expires, auto-submit regardless of character count
      console.log('Timer expired - auto submitting answer');
      setTimerStopped(true);
      submitAnswer();
    }
  }, [timeLeft, question, loading, submitting, showFeedback, round, selectedOption, timerStopped]);



  async function onUploadResume() {
    if (!user || !selectedFile) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      setModal({
        show: true, 
        type: 'error', 
        title: 'Invalid File Type', 
        message: `Please upload a valid resume file.\n\nSupported formats: PDF, DOC, DOCX, TXT\nYour file: ${fileExtension.toUpperCase()}`
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id);

    setShowUpload(false);
    setShowAnalyzing(true);
    setStatus("AI Bot analyzing resume...");

    try {
      const data = await api.uploadResume(formData);
      console.log("Upload response:", data);
      setShowAnalyzing(false);

      if (data?.success && data?.parsed) {
        setParsed(data.parsed);
        // Extract years of experience
        const years = data.parsed.experience || data.parsed.years_of_experience || 0;
        setYearsOfExperience(years);
        setShowAnalyzing(false);
        
        // Show typing animation for analysis complete message
        setShowAnalysisMessage(true);
        const message = "AI analysis complete! We've extracted your details from the resume. Please review and confirm.";
        let charIndex = 0;
        setAnalysisTypingText("");
        
        const typingInterval = setInterval(() => {
          if (charIndex < message.length) {
            setAnalysisTypingText(message.slice(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(typingInterval);
            // Show success modal after typing completes
            setTimeout(() => {
              setShowAnalysisMessage(false);
              setModal({show: true, type: 'success', title: 'Resume Analysis Complete', message: 'Resume processed successfully. Please review your extracted profile details.'});
            }, 1500);
          }
        }, 50);
        
      } else if (data?.error) {
        setShowAnalyzing(false);
        setShowUpload(true);
        
        let errorMessage = "Please upload a proper resume file.";
        
        if (data.error.includes("format") || data.error.includes("type")) {
          errorMessage = "Invalid file format. Please upload a PDF, DOC, DOCX, or TXT file.";
        } else if (data.error.includes("size")) {
          errorMessage = "File too large. Please upload a file smaller than 10MB.";
        } else if (data.error.includes("corrupt") || data.error.includes("damaged")) {
          errorMessage = "File appears to be corrupted. Please try uploading a different file.";
        } else if (data.error.includes("content") || data.error.includes("text")) {
          errorMessage = "Unable to extract text from resume. Please ensure your file contains readable text.";
        }
        
        setModal({
          show: true,
          type: 'error',
          title: 'Resume Upload Failed',
          message: errorMessage
        });
        setParsed(null);
      } else {
        setShowAnalyzing(false);
        setShowUpload(true);
        setModal({
          show: true,
          type: 'error',
          title: 'Resume Processing Failed',
          message: 'Resume upload completed but could not extract profile data. Please try uploading a different resume file.'
        });
        setParsed(null);
      }
    } catch (error) {
      setShowAnalyzing(false);
      setShowUpload(true);
      
      let errorMessage = "Please upload a proper resume file.";
      
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Upload timed out. Please try again with a smaller file.";
        }
      }
      
      setModal({
        show: true,
        type: 'error',
        title: 'Upload Error',
        message: errorMessage
      });
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

    if (!canStartInterview) {
      alert("Maximum attempt limit reached. You have used all your attempts.");
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
        yearsOfExperience: yearsOfExperience,
      });

      setLoading(false);

      if (data.error) throw new Error(data.error);

      if (data.finished) {
        
        setStatus("success:" + data.message);
        return;
      }

      if (data.resume) {
        setStatus("Continuing Round " + data.round);

        const contData = await api.startInterview({ 
          userId: user.id, 
          sessionId,
          yearsOfExperience: yearsOfExperience 
        });

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
          
          const timeLimit = getTimeLimit(contData.round);
          setTimePerQuestion(timeLimit);
          setTimeLeft(timeLimit);
          setTimerStopped(false);
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
      

      
      const timeLimit = getTimeLimit(data.round);
      setTimePerQuestion(timeLimit);
      setTimeLeft(timeLimit);
      setTimerStopped(false);
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
        if 'is_palindrome' in '${functionName}':
            result1 = func("A man, a plan, a canal, Panama")
            result2 = func("Hello, World!")
            print(f"Test 1: {result1}, Test 2: {result2}")
        elif 'two_sum' in '${functionName}':
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

    const postdata = {
        code: answerRef.current.value,
        language: selectedLanguage,
        testInput: getTestInput(selectedLanguage)
    }
    
    try {
      const result = await api.codeRunner(postdata);
      console.log('Code Runner Response:', result);
      
      if (result.success) {
        setCodeOutput(result.output || "Code executed successfully");
        setCodeError("");
      } else {
        setCodeError(result.error || result.stderr || result.message || "Execution failed");
        setCodeOutput("");
      }
    } catch (error: any) {
      console.error('Code execution error:', error);
      
      let errorMessage = "Code execution failed. Please check your syntax and try again.";
      
      if (error.message?.includes("timeout")) {
        errorMessage = "Code execution timed out. Your code may have an infinite loop or is taking too long to execute.";
      } else if (error.message?.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection and try running the code again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setCodeError(errorMessage);
      setCodeOutput("");
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

    const isTimeExpired = timeLeft <= 0 || timerStopped;
    let ans = "";
    
    console.log(`Submitting answer - Round: ${round}, TimeLeft: ${timeLeft}, TimerStopped: ${timerStopped}, IsTimeExpired: ${isTimeExpired}`);
    
    if (round === 1) {
      ans = selectedOption || "No option selected";
    } else {
      ans = answerRef.current?.value?.trim() || "No answer provided";
      
      // Round 2 validation - minimum 300 characters (only if time hasn't expired)
      if (round === 2 && ans.length < 300 && !isTimeExpired) {
        alert("Answer too short. Minimum 300 characters required. Current: " + ans.length);
        return;
      }
    }

    // Stop timer immediately when user submits
    setTimerStopped(true);
    
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
        isTimeExpired: isTimeExpired
      });

      setLoading(false);

      if (data.error) {
        // Ignore character validation errors for Round 1 (MCQ) or when time expired
        if (data.error.includes("Answer too short") && round === 1) {
          console.log("Ignoring character validation for Round 1 MCQ");
          // Don't return, continue processing the response
        } else if (data.error.includes("Answer too short") && round === 2 && timeLeft > 0) {
          alert(data.error);
          setSubmitting(false);
          setTimerStopped(false);
          return;
        } else if (data.error === "Interview not started") {
          console.log("⚠️ Interview state not found, attempting to recover...");
          try {
            const restartData = await api.startInterview({
              userId: user.id,
              sessionId,
              skills: parsed?.skills || [],
              domain: parsed?.domains?.[0] || "General",
              yearsOfExperience: yearsOfExperience
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

      // Check for round completion first (advancedTo or doneRound)
      if (data.advancedTo) {
        setStatus("success:Passed Round " + data.doneRound);
        setQuestion("");
        
        const roundNames: { [key: number]: string } = { 1: "MCQ Skills", 2: "Scenario Based", 3: "Technical Coding" };
        
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Pass Criteria: ${data.doneRound === 1 ? '70%' : data.doneRound === 2 ? '60%' : '70%'}\n\nStatus: Qualified\n\nCongratulations!\nYou have met the eligibility criteria and can proceed to the next round.\n\nClick Continue to move forward.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              
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
              
              const timeLimit = getTimeLimit(data.advancedTo);
              setTimePerQuestion(timeLimit);
              setTimeLeft(timeLimit);
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }

      if (data.doneRound && data.passed === false) {
        const roundNames: { [key: number]: string } = { 1: "MCQ Skills", 2: "Scenario Based", 3: "Technical Coding" };
        const requiredScores: { [key: number]: string } = { 1: "70%", 2: "60%", 3: "70%" };
        
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Your Score: ${data.average}%\nMinimum Required: ${requiredScores[data.doneRound]}\n\nRound completed! You can continue to the next round to complete the full assessment.\n\nClick Continue to proceed.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo || data.doneRound + 1);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo || data.doneRound + 1));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              
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
              
              const nextRound = data.advancedTo || data.doneRound + 1;
              setRoundType(roundTypes[nextRound as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[nextRound as keyof typeof roundDescriptions] || "");
              
              const timeLimit = getTimeLimit(nextRound);
              setTimePerQuestion(timeLimit);
              setTimeLeft(timeLimit);
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }

      if (data.finished) {
        if (data.doneRound === 3) {
          setModal({
            show: true, 
            type: 'success', 
            title: 'Assessment Completed', 
            message: `Your Final Score: ${data.average}%\nStatus: All rounds passed\n\nCongratulations!\nYou have successfully completed the entire technical assessment.`
          });
        }
        setStatus("success:" + data.message);
        setQuestion("");
        return;
      }

      // Only show individual feedback if not a round completion
      if (data.last) {
        setCurrentFeedback({
          score: Number(data.last.score || 0),
          feedback: data.last.feedback || "",
          userAnswer: ans
        });
        setShowFeedback(true);
        if (data.question) {
          setNextQuestionData(data);
        }
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
        const timeLimit = getTimeLimit(data.round);
        setTimePerQuestion(timeLimit);
        setTimeLeft(timeLimit);
        setTimerStopped(false);
        setSelectedOption("");
        if (answerRef.current) answerRef.current.value = "";
        setCodeOutput("");
        setCodeError("");
        setStatus("");
      }
    } catch (err: any) {
      console.error("Submit answer error:", err);
      setLoading(false);
      
      // Show proper error modal instead of alert
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (err.message?.includes("Failed to fetch")) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (err.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try submitting your answer again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setModal({
        show: true,
        type: 'error',
        title: 'Submission Error',
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Modal */}
      {modal?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className={`text-5xl mb-4 ${modal.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {modal.type === 'success' ? '✓' : '✗'}
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
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <img src={logo} alt="AskOxy" className="w-24 sm:w-36 h-auto object-contain" />
              <div className="border-l border-slate-600 pl-2 sm:pl-4">
                <h1 className="text-sm sm:text-lg font-bold text-white">AI INTERVIEW</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Technical Assessment Platform</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white hidden sm:inline">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {showWelcome ? (
          <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
            <div className="max-w-4xl w-full">
              <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-xl border border-emerald-500/30 overflow-hidden shadow-xl">
                {/* Header Section with AI Bot */}
                <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-6">
                  <div className="flex items-center justify-between">
                    {/* Left: AI Bot */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce shadow-lg border border-white/30">
                          <div className="text-3xl">🤖</div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                      </div>
                      
                      <div className="bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg border border-white/30">
                        <div className="text-sm font-medium">
                          {typingText}
                          <span className="animate-pulse">|</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Welcome Text */}
                    <div className="text-right">
                      <h1 className="text-2xl font-bold text-white mb-1">Welcome, {user.name}!</h1>
                      <p className="text-emerald-100 text-sm">AI Technical Assessment</p>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                  {/* AI Features Banner */}
                  <div className="mb-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <h3 className="text-emerald-400 font-bold text-base mb-3 text-center">How It Works</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                          1
                        </div>
                        <div className="text-gray-300 text-sm">Upload your resume to get started with your AI-powered mock interview.</div>
                      </div>
                      <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                          2
                        </div>
                        <div className="text-gray-300 text-sm">Start by uploading your resume so our AI can understand your profile.</div>
                      </div>
                      <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                          3
                        </div>
                        <div className="text-gray-300 text-sm">You’ll be asked to review and confirm your details to ensure accuracy.</div>
                      </div>
                      <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                          4
                        </div>
                        <div className="text-gray-300 text-sm">Once confirmed, you’ll be redirected to your personalized AI mock interview.</div>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Details */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-4 text-center">3-Round AI-Driven Assessment</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { 
                          round: "1", 
                          title: "MCQ Skills", 
                          questions: "12 Questions",
                          time: "30s each",
                          desc: "Test your core technical knowledge with quick MCQ-based questions.",
                          gradient: "from-purple-500 to-indigo-600"
                        },
                        { 
                          round: "2", 
                          title: "Scenarios", 
                          questions: "5 Questions",
                          time: "120s each",
                          desc: "Answer scenario-based questions that assess your analytical thinking.",
                          gradient: "from-purple-500 to-indigo-600"
                        },
                        { 
                          round: "3", 
                          title: "Coding", 
                          questions: "3 Questions",
                          time: "300s each",
                          desc: "Demonstrate your coding ability through timed, hands-on challenges.",
                          gradient: "from-purple-500 to-indigo-600"
                        }
                      ].map((round) => (
                        <div key={round.round} className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-emerald-500/50 transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${round.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                              {round.round}
                            </div>
                            <div>
                              <div className="text-white font-bold text-sm">{round.title}</div>
                              <div className="text-emerald-400 text-xs">{round.questions}</div>
                            </div>
                          </div>
                          <div className="text-gray-400 text-xs mb-2">{round.time}</div>
                          <p className="text-gray-300 text-xs">{round.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Section */}
                  <div className="text-center bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg p-5 border border-emerald-500/30">
                    <button
                      onClick={() => { setShowWelcome(false); setShowUpload(true); }}
                      className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 text-white font-bold py-3 px-8 rounded-lg text-base transition-all transform hover:scale-105 shadow-lg"
                    >
                     Begin Your AI Assessment
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400 flex-wrap">
                      <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>45-60 min</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <span>20 Questions</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Instant Results</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showUpload ? (
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-xl border border-emerald-500/30 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-4 border-b border-emerald-500/30 flex items-center gap-3">
                <button
                  onClick={() => { setShowUpload(false); setShowWelcome(true); }}
                  className="text-white hover:text-emerald-100 transition-colors"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-semibold text-white">Upload Resume</h2>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-white font-semibold mb-2">Upload Your Resume</h3>
                  <p className="text-gray-300 text-sm">AI will analyze your skills and experience</p>
                </div>
                
                <div className="mb-6">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-lg p-6 text-center transition-colors cursor-pointer bg-gray-800/50"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    {selectedFile ? (
                      <div>
                        <p className="text-white font-medium mb-1">{selectedFile.name}</p>
                        <p className="text-emerald-400 text-sm">✓ File selected - Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white font-medium mb-1">Click to upload file</p>
                        <p className="text-gray-400 text-sm">PDF, DOC, DOCX, TXT supported</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={onUploadResume}
                  disabled={!selectedFile}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {selectedFile ? "Analyze Resume" : "Select file to continue"}
                </button>
                
                <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="text-white font-medium text-sm mb-1">What happens next:</div>
                  <div className="text-gray-300 text-xs space-y-1">
                    <div>• AI extracts your technical skills</div>
                    <div>• Generates personalized questions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showAnalyzing || showAnalysisMessage ? (
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
              {showAnalyzing ? (
                <>
                  <style>{`
                    @keyframes rotate3d {
                      0% { transform: rotateY(0deg); }
                      100% { transform: rotateY(360deg); }
                    }
                    .rotate-3d {
                      animation: rotate3d 2s linear infinite;
                      transform-style: preserve-3d;
                    }
                  `}</style>
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-emerald-600 rounded-full flex items-center justify-center rotate-3d shadow-lg">
                      <div className="text-3xl">🤖</div>
                    </div>
                    <h2 className="text-lg font-semibold text-white mb-2">Analyzing Resume</h2>
                    <p className="text-gray-400 text-sm">AI is processing your profile data</p>
                  </div>
                  
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>Parsing document structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <span>Extracting technical skills</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      <span>Generating question matrix</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-3xl">🤖</div>
                  </div>
                  <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-500/30">
                    <p className="text-emerald-400 text-sm font-medium">
                      {analysisTypingText}
                      <span className="animate-pulse">|</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !question ? (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-[calc(100vh-140px)]">
            {/* Left: Resume Upload & Details */}
            <div className="lg:w-1/2 min-h-[400px] lg:h-full">
              <section className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm h-full flex flex-col">
                <div className="px-4 sm:px-5 py-4 border-b border-gray-700 flex-shrink-0">
                  <h2 className="text-base font-semibold text-white">
                    {parsed ? "Resume Details" : "Upload Resume"}
                  </h2>
                  {parsed && (
                    <p className="text-xs text-gray-400 mt-1">Your profile information</p>
                  )}
                </div>

                <div className="p-4 sm:p-5 flex-1 overflow-y-auto min-h-0">
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
                            "analyze Resume"
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
                          <p className="text-xs text-gray-400 mt-0.5">Profile Verified ✅</p>
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
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-700 text-emerald-400 border border-gray-600"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No skills detected</span>
                          )}
                        </div>
                      </div>

                      {/* Experience */}
                      {yearsOfExperience > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-300 mb-2">Experience</p>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-700 text-blue-400 border border-gray-600">
                            {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'}
                          </span>
                        </div>
                      )}

                      {/* Domains */}
                      <div>
                        <p className="text-xs font-semibold text-gray-300 mb-2">Domains</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(parsed.domains) && parsed.domains.length > 0 ? (
                            parsed.domains.map((domain: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-700 text-teal-400 border border-gray-600"
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
                            setShowUpload(true);
                          }}
                          className="w-full px-4 py-2 text-gray-300 text-sm font-medium rounded-lg border border-gray-600 hover:bg-gray-700 transition-all"
                        >
                          Edit Resume
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right: Interview Rounds & Start Button */}
            <div className="lg:w-1/2 min-h-[400px] lg:h-full">
              <section className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm h-full flex flex-col">
                <div className="px-4 sm:px-5 py-4 border-b border-gray-700 flex-shrink-0">
                  <h2 className="text-base font-semibold text-white">Assessment Structure</h2>
                  <p className="text-xs text-gray-400 mt-1">Three rounds of evaluation</p>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col min-h-0">
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
                          <h3 className="text-sm font-semibold text-white">
                            {parsed && isNonTechnical(parsed.skills, parsed.domains) ? "Professional Assessment" : "Technical Coding"}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {parsed && isNonTechnical(parsed.skills, parsed.domains) ? "Domain-specific questions" : "Coding challenges"}
                          </p>
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
                    {parsed && user && (
                      <div className="mb-4">
                        <AttemptStatus 
                          userId={user.id} 
                          onStatusChange={(canAttempt) => setCanStartInterview(canAttempt)}
                        />
                      </div>
                    )}
                    {parsed ? (
                      <button
                        onClick={startInterview}
                        disabled={loading || round === 3 || !canStartInterview}
                        className={`w-full px-5 py-3 rounded-lg font-semibold text-white text-sm transition-all ${
                          round === 3 || !canStartInterview
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
                        ) : !canStartInterview ? (
                          "Attempt Limit Reached"
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
          <div className="min-h-[calc(100vh-140px)] flex justify-center px-2">
            <div ref={questionRef} className="w-full max-w-4xl px-2 sm:px-8">
              <section className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
              {/* Header */}
              <div className="px-3 sm:px-5 py-2 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                      <h2 className="text-sm sm:text-base font-semibold text-white">
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
                  <div className="text-xs text-gray-400 italic mt-2 px-3 sm:px-0">
                    {roundDescription}
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4 space-y-3">
                {/* Question */}
                <div>
                  {round === 3 && parsed?.skills && parsed.skills.length > 0 && (
                    <div className="mb-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">
                      {isNonTechnical(parsed.skills, parsed.domains) ? (
                        <span>💼 Professional assessment question based on: {parsed.skills.slice(0, 3).join(', ')}</span>
                      ) : (
                        <span>💡 Technical question based on: {parsed.skills.slice(0, 3).join(', ')}</span>
                      )}
                    </div>
                  )}
                  {round === 3 ? (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 space-y-3">
                      {(() => {
                        const lines = question.split('\n');
                        let currentSection = '';
                        let sectionContent: string[] = [];
                        const sections: {type: string, content: string[]}[] = [];
                        
                        lines.forEach(line => {
                          const trimmed = line.trim().replace(/\*+/g, '').trim();
                          if (!trimmed) return;
                          
                          if (trimmed.toLowerCase().startsWith('problem') || trimmed.toLowerCase().startsWith('given')) {
                            if (currentSection) sections.push({type: currentSection, content: sectionContent});
                            currentSection = 'problem';
                            sectionContent = [trimmed.replace(/^(problem|given)[:\s]*/i, '')];
                          } else if (trimmed.toLowerCase().startsWith('function')) {
                            if (currentSection) sections.push({type: currentSection, content: sectionContent});
                            currentSection = 'function';
                            sectionContent = [trimmed];
                          } else if (trimmed.toLowerCase().startsWith('example')) {
                            if (currentSection) sections.push({type: currentSection, content: sectionContent});
                            currentSection = 'example';
                            sectionContent = [];
                          } else if (trimmed.toLowerCase().startsWith('input format') || trimmed.toLowerCase().startsWith('input:')) {
                            sectionContent.push(trimmed);
                          } else if (trimmed.toLowerCase().startsWith('output format') || trimmed.toLowerCase().startsWith('output:')) {
                            sectionContent.push(trimmed);
                          } else if (trimmed.toLowerCase().startsWith('constraint')) {
                            if (currentSection) sections.push({type: currentSection, content: sectionContent});
                            currentSection = 'constraints';
                            sectionContent = [trimmed.replace(/^constraints?[:\s]*/i, '')];
                          } else if (trimmed.toLowerCase().startsWith('notes')) {
                            if (currentSection) sections.push({type: currentSection, content: sectionContent});
                            currentSection = 'notes';
                            sectionContent = [trimmed.replace(/^notes?[:\s]*/i, '')];
                          } else if (trimmed.startsWith('-') || trimmed.startsWith('###')) {
                            sectionContent.push(trimmed.replace(/^[-#\s]+/, ''));
                          } else {
                            sectionContent.push(trimmed);
                          }
                        });
                        if (currentSection) sections.push({type: currentSection, content: sectionContent});
                        
                        return (
                          <>
                            {sections.map((section, idx) => {
                              if (section.type === 'problem') {
                                return (
                                  <div key={idx} className="bg-indigo-900/30 p-3 rounded border-l-4 border-indigo-400">
                                    <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wide">Problem</span>
                                    <div className="text-white text-sm mt-2 space-y-1">
                                      {section.content.map((line, i) => <p key={i}>{line}</p>)}
                                    </div>
                                  </div>
                                );
                              }
                              if (section.type === 'function') {
                                return (
                                  <div key={idx} className="bg-emerald-900/30 p-3 rounded border-l-4 border-emerald-400">
                                    <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wide">Function Signature</span>
                                    <code className="text-white text-sm mt-2 block font-mono">{section.content[0]}</code>
                                  </div>
                                );
                              }
                              if (section.type === 'example') {
                                return (
                                  <div key={idx} className="bg-purple-900/30 p-3 rounded border-l-4 border-purple-400">
                                    <span className="text-purple-400 font-semibold text-xs uppercase tracking-wide">Examples</span>
                                    <div className="text-white text-sm mt-2 space-y-2 font-mono">
                                      {section.content.map((line, i) => {
                                        if (line.toLowerCase().includes('input')) {
                                          return <div key={i} className="text-green-300">→ {line}</div>;
                                        }
                                        if (line.toLowerCase().includes('output')) {
                                          return <div key={i} className="text-blue-300">← {line}</div>;
                                        }
                                        return <div key={i}>{line}</div>;
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                              if (section.type === 'constraints') {
                                return (
                                  <div key={idx} className="bg-amber-900/30 p-3 rounded border-l-4 border-amber-400">
                                    <span className="text-amber-400 font-semibold text-xs uppercase tracking-wide">Constraints</span>
                                    <div className="text-white text-sm mt-2 space-y-1">
                                      {section.content.map((line, i) => <p key={i}>• {line}</p>)}
                                    </div>
                                  </div>
                                );
                              }
                              if (section.type === 'notes') {
                                return (
                                  <div key={idx} className="bg-teal-900/30 p-3 rounded border-l-4 border-teal-400">
                                    <span className="text-teal-400 font-semibold text-xs uppercase tracking-wide">Notes</span>
                                    <div className="text-white text-sm mt-2 space-y-1">
                                      {section.content.map((line, i) => <p key={i}>• {line}</p>)}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </>
                        );
                      })()}
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
                          className={`flex items-start gap-2 p-2 rounded border transition-colors ${
                            showFeedback ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          } ${
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
                            disabled={showFeedback}
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
                        disabled={timeLeft <= 0 || showFeedback}
                        className={`w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${round === 3 ? 'font-mono' : ''}`}
                        placeholder={timeLeft <= 0 ? "Time expired - answer submitted automatically" : round === 3 ? getPlaceholder(selectedLanguage) : round === 2 ? "Your answer (be specific and concise):\n\n1. Immediate action:\n2. Next steps:\n3. Why this approach:" : "Enter your detailed answer here..."}
                        style={{
                          minHeight: round === 3 ? '300px' : round === 2 ? '250px' : '150px',
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
                            disabled={showFeedback}
                            className="px-2 py-1 text-xs border border-gray-600 rounded bg-gray-900 text-white min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {languageOptions.map(lang => (
                              <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={runCode}
                            disabled={loading || !answerRef.current?.value.trim() || showFeedback}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? "Running..." : "▶ Run Code"}
                          </button>
                          <p className="text-xs text-gray-400 w-full sm:w-auto">
                            Code will be compiled and executed with error checking
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
                {showFeedback && currentFeedback && (
                  <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30 mb-4">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Feedback</span>
                    </div>
                    <p className="text-xs text-gray-300 mb-3">{currentFeedback.feedback}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (nextQuestionData && nextQuestionData.question) {
                            setRound(nextQuestionData.round);
                            setQNo(nextQuestionData.question_no);
                            setTotalQ(nextQuestionData.total_questions || getQuestionCount(nextQuestionData.round));
                            setQuestion(nextQuestionData.question);
                            setAskedQuestions(prev => [...prev, nextQuestionData.question]);
                            setTimePerQuestion(getTimeLimit(nextQuestionData.round));
                            setTimeLeft(getTimeLimit(nextQuestionData.round));
                            setSelectedOption("");
                            if (answerRef.current) answerRef.current.value = "";
                            setCodeOutput("");
                            setCodeError("");
                            setNextQuestionData(null);
                          }
                          setShowFeedback(false);
                          setCurrentFeedback(null);
                          setTimerStopped(false);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded"
                      >
                        Next Question →
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2 border-t border-gray-700">
                  {!showFeedback ? (
                    <button
                      onClick={submitAnswer}
                      disabled={loading || submitting || (round === 1 && !selectedOption)}
                      className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-all ${
                        (round === 1 && !selectedOption) || submitting
                          ? "bg-gray-600 cursor-not-allowed"
                          : timeLeft <= 0
                          ? "bg-orange-600 hover:bg-orange-700"
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
                      ) : timeLeft <= 0 ? (
                        "Submit (Time Expired)"
                      ) : (
                        "Submit Answer"
                      )}
                    </button>
                  ) : (
                    <div className="text-center text-gray-400 text-sm">
                      Click Next Question above to continue
                    </div>
                  )}
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