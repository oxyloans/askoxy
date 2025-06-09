import React, { useState, useEffect } from "react";
import { Star, AlertCircle, CheckCircle, X, MessageSquare } from "lucide-react";
import BASE_URL from "../Config";
const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState({
    comments: "",
    feedbackStatus: "",
    feedback_user_id: "",
    orderid: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  type ValidationErrors = {
    rating?: string;
    comments?: string;
  };
  type FeedbackField = "feedbackStatus" | "comments";
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [checkingExisting, setCheckingExisting] = useState(true);

  const feedbackOptions = [
    {
      value: "EXCELLENT",
      label: "Excellent",
      emoji: "🤩",
      color: "bg-emerald-500 hover:bg-emerald-600",
      ring: "focus:ring-emerald-400",
      description: "Outstanding experience!",
    },
    {
      value: "GOOD",
      label: "Good",
      emoji: "😊",
      color: "bg-blue-500 hover:bg-blue-600",
      ring: "focus:ring-blue-400",
      description: "Great experience",
    },
    {
      value: "AVERAGE",
      label: "Average",
      emoji: "🙂",
      color: "bg-yellow-500 hover:bg-yellow-600",
      ring: "focus:ring-yellow-400",
      description: "It was okay",
    },
    {
      value: "BELOWAVERAGE",
      label: "Below Average",
      emoji: "😐",
      color: "bg-orange-500 hover:bg-orange-600",
      ring: "focus:ring-orange-400",
      description: "Could be better",
    },
    {
      value: "POOR",
      label: "Poor",
      emoji: "😞",
      color: "bg-red-500 hover:bg-red-600",
      ring: "focus:ring-red-400",
      description: "Not satisfied",
    },
  ];

  useEffect(() => {
    const searchString = window.location.search;
    let orderId: string | null = null;
    let userId: string | null = null;

    if (searchString) {
      const urlParams = new URLSearchParams(searchString);
      orderId = urlParams.get("orderId");
      userId = urlParams.get("userId");

      if (!orderId || !userId) {
        const decoded = decodeURIComponent(searchString);
        const orderMatch = decoded.match(/orderId=([^&]+)/);
        const userMatch = decoded.match(/userId=([^&]+)/);
        if (orderMatch) orderId = orderMatch[1];
        if (userMatch) userId = userMatch[1];
      }
    }

    if (orderId && userId) {
      setFeedbackData((prev) => ({
        ...prev,
        orderid: orderId!,
        feedback_user_id: userId!,
      }));
      checkExistingFeedback(orderId, userId);
    } else {
      setError("Invalid feedback link. Please check the URL and try again.");
      setCheckingExisting(false);
    }
  }, []);

  const checkExistingFeedback = async (orderId: string, userId: string) => {
    try {
      const res = await fetch(
        `${BASE_URL}/order-service/feedbackbasedonorderanduserid?orderid=${orderId}&feedbackUserId=${userId}`
      );
      const data = await res.json();
      if (data.status === true) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Error checking existing feedback:", err);
    } finally {
      setCheckingExisting(false);
    }
  };

  const validateForm = () => {
    const errors: ValidationErrors = {};

    if (!feedbackData.feedbackStatus) {
      errors.rating = "Please select your experience rating";
    }

    if (!feedbackData.comments.trim()) {
      errors.comments = "Please share your feedback in comments";
    } else if (feedbackData.comments.length > 300) {
      errors.comments = "Comments should be less than 300 characters";
    } else if (feedbackData.comments.length < 10) {
      errors.comments = "Please provide at least 10 characters of feedback";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitFeedback = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/order-service/submitfeedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData),
        }
      );

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      setError(
        "Unable to submit feedback at the moment. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (field: FeedbackField, value: string) => {
    setFeedbackData((prev) => ({ ...prev, [field]: value }));
    // Clear specific validation error when user starts typing/selecting
    const errorKey: keyof ValidationErrors = field === "feedbackStatus" ? "rating" : "comments";
    if (validationErrors[errorKey]) {
      setValidationErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }));
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative border border-gray-100">
        {/* <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          aria-label="Close feedback form"
        >
          <X className="w-5 h-5" />
        </button> */}

        {checkingExisting ? (
          <div className="text-center py-20 px-8">
            <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto rounded-full mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Loading...
            </h3>
            <p className="text-gray-600">Checking your feedback status</p>
          </div>
        ) : error && !feedbackData.orderid ? (
          <div className="text-center py-20 px-8">
            <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : isSubmitted ? (
          <div className="text-center py-20 px-8">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You! 🎉
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto mb-6">
              Your valuable feedback has been submitted successfully. We truly
              appreciate you taking the time to share your experience with us.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 inline-block">
              <p className="text-blue-800 font-medium text-sm">
                Your feedback helps us serve you better! 💙
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-5">
            
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                We Value Your Feedback
              </h1>
              <p className="text-gray-600 text-lg">
                Help us improve by sharing your experience
              </p>
            </div>

            {/* Rating Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  How was your experience?{" "}
                  <span className="text-red-500">*</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                {feedbackOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange("feedbackStatus", option.value)}
                    className={`relative flex flex-col items-center justify-center rounded-xl py-4 px-3 text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 ${
                      option.ring
                    } transform hover:scale-105 ${
                      feedbackData.feedbackStatus === option.value
                        ? `${
                            option.color
                          } text-white shadow-lg scale-105 ring-4 ${option.ring.replace(
                            "focus:",
                            ""
                          )}`
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                    type="button"
                    aria-pressed={feedbackData.feedbackStatus === option.value}
                    aria-label={`Rate experience as ${option.label}`}
                  >
                    <span className="text-3xl mb-2 block">{option.emoji}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                    {feedbackData.feedbackStatus === option.value && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {feedbackData.feedbackStatus && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm font-medium">
                    ✓{" "}
                    {
                      feedbackOptions.find(
                        (opt) => opt.value === feedbackData.feedbackStatus
                      )?.description
                    }
                  </p>
                </div>
              )}

              {validationErrors.rating && (
                <div className="flex items-center mt-3 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {validationErrors.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-5 h-5 text-gray-600 mr-2" />
                <label
                  htmlFor="comments"
                  className="text-xl font-semibold text-gray-800"
                >
                  Share Your Feedback <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="comments"
                  value={feedbackData.comments}
                  onChange={(e) => handleChange("comments", e.target.value)}
                  className={`w-full border-2 rounded-xl p-4 resize-none focus:outline-none transition-all duration-200 placeholder-gray-400 ${
                    validationErrors.comments
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                  rows={5}
                  maxLength={300}
                  placeholder="Tell us about your experience..."
                  aria-describedby="commentHelp"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                  {feedbackData.comments.length}/300
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  💡 Your honest feedback helps us improve our service
                </div>
                <div
                  className={`text-sm font-medium ${
                    feedbackData.comments.length > 280
                      ? "text-red-500"
                      : feedbackData.comments.length > 250
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {300 - feedbackData.comments.length} characters left
                </div>
              </div>

              {validationErrors.comments && (
                <div className="flex items-center mt-3 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {validationErrors.comments}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Error */}
            {error && (
              <div className="flex items-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Submission Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitFeedback}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Submitting Your Feedback...
                </>
              ) : (
                <>
                  <Star className="w-6 h-6 mr-3" />
                  Submit Feedback
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                🔒 Your feedback is secure and helps us serve you better
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
