import React, { useState, useEffect } from "react";
import { Star, MessageCircle, CheckCircle, AlertCircle, X } from "lucide-react";

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
  const [validationError, setValidationError] = useState("");
  const [checkingExisting, setCheckingExisting] = useState(true);

  const feedbackOptions = [
    { value: "POOR", label: "Poor", emoji: "😞", color: "bg-red-500" },
    {
      value: "BELOWAVERAGE",
      label: "Below Average",
      emoji: "😐",
      color: "bg-orange-500",
    },
    { value: "AVERAGE", label: "Average", emoji: "🙂", color: "bg-yellow-500" },
    { value: "GOOD", label: "Good", emoji: "😊", color: "bg-blue-500" },
    {
      value: "EXCELLENT",
      label: "Excellent",
      emoji: "🤩",
      color: "bg-green-500",
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
      setError("Invalid link. Order ID or User ID missing.");
      setCheckingExisting(false);
    }
  }, []);

  const checkExistingFeedback = async (orderId: string, userId: string) => {
    try {
      const res = await fetch(
        `https://meta.oxyglobal.tech/api/order-service/feedbackbasedonorderanduserid?orderid=${orderId}&feedbackUserId=${userId}`
      );
      const data = await res.json();
      if (data.status === true) setIsSubmitted(true);
    } catch (err) {
      console.error("Error checking existing feedback:", err);
    } finally {
      setCheckingExisting(false);
    }
  };

  const handleSubmitFeedback = async () => {
    setError("");
    setValidationError("");

    if (!feedbackData.feedbackStatus) {
      setValidationError("Please select your experience rating.");
      return;
    }

    if (feedbackData.comments.length > 300) {
      setValidationError("Comments should be less than 300 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        "https://meta.oxyglobal.tech/api/order-service/submitfeedback",
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
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFeedbackData((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative animate-fadeIn p-6 md:p-8">
        <button
          onClick={() => window.close()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close feedback"
        >
          <X className="w-6 h-6" />
        </button>

        {checkingExisting ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600">Checking feedback status...</p>
          </div>
        ) : error && !feedbackData.orderid ? (
          <div className="text-center text-red-600">
            <AlertCircle className="mx-auto w-10 h-10 mb-2" />
            <p>{error}</p>
          </div>
        ) : isSubmitted ? (
          <div className="text-center py-10">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Thank you! 🎉
            </h2>
            <p className="text-gray-600">
              You already submitted your feedback.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-6 space-x-3 text-purple-700">
             
              <h2 className="text-xl md:text-2xl font-bold">
                We value your feedback 
              </h2>
            </div>

            {/* Rating Options */}
            <div className="mb-5">
              <p className="mb-2 font-medium text-gray-700">
                Rate your experience:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {feedbackOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange("feedbackStatus", option.value)}
                    className={`rounded-lg py-3 px-4 text-sm font-medium transition-all focus:outline-none ${
                      feedbackData.feedbackStatus === option.value
                        ? `${option.color} text-white shadow-md scale-105`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    type="button"
                  >
                    <span className="block text-xl">{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="mb-5">
              <label className="block mb-2 text-gray-700 font-medium">
                Additional Comments:
              </label>
              <textarea
                value={feedbackData.comments}
                onChange={(e) => handleChange("comments", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                rows={3}
                placeholder="Tell us more about your experience..."
              />
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 mb-4">
              <div className="flex justify-between flex-wrap gap-2">
                <span>
                  <strong>Order ID:</strong> {feedbackData.orderid}
                </span>
                <span>
                  <strong>User ID:</strong> {feedbackData.feedback_user_id}
                </span>
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-sm">
                <AlertCircle className="inline mr-2" />
                {validationError}
              </div>
            )}

            {/* Submit Error */}
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
                <AlertCircle className="inline mr-2" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitFeedback}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-b-2 border-white mr-2 rounded-full"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  Submit Feedback
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Your input helps us improve 🙏
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
