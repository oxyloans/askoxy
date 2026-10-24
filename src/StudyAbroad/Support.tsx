import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Send,
} from "lucide-react";
import { message } from "antd";
import BASE_URL from "../Config";

interface SupportProps {
  onNavigate?: (tab: string) => void;
}

const Support: React.FC<SupportProps> = ({ onNavigate }) => {
  const [consultationForm, setConsultationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredCountry: "",
    preferredDate: "",
    preferredIntake: "",
    preferredTime: "",
    currentQualification: "",
    studyLevel: "",
    message: "",
  });
  const contactMessage =
    "Hi, I’m interested in studying abroad and would like to book a counselling session. Could you please assist me?";
  const emailSubject = "Study Abroad Counselling";

  const handleFormSubmit = async () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "preferredCountry",
      "preferredDate",
      "preferredIntake",
      "preferredTime",
      "currentQualification",
      "studyLevel",
    ];

    const missingField = requiredFields.find(
      (field) =>
        !consultationForm[field as keyof typeof consultationForm]?.trim(),
    );
    if (missingField) {
      message.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/user-service/counselor/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: consultationForm.fullName,
            email: consultationForm.email,
            phone: consultationForm.phone,
            preferredCountry: consultationForm.preferredCountry,
            preferredDate: consultationForm.preferredDate,
            preferredIntake: consultationForm.preferredIntake,
            preferredTime: consultationForm.preferredTime,
            currentQualification: consultationForm.currentQualification,
            studyLevel: consultationForm.studyLevel,
            message: consultationForm.message,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Submission failed: ${response.status} ${errorText}`);
      }

      message.success(
        "Counselor request submitted successfully! We will contact you soon.",
      );
      setConsultationForm({
        fullName: "",
        email: "",
        phone: "",
        preferredCountry: "",
        preferredDate: "",
        preferredIntake: "",
        preferredTime: "",
        currentQualification: "",
        studyLevel: "",
        message: "",
      });
    } catch (error) {
      console.error("Counselor submit error:", error);
      message.error("Unable to submit request. Please try again later.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setConsultationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderCounselorSupport = () => (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
      <div className="mb-4 flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900">
            Schedule a Consultation
          </h4>
          <p className="text-xs text-gray-600">
            Book a session with our experienced counselors
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              value={consultationForm.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              value={consultationForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Phone *
            </label>
            <input
              type="tel"
              value={consultationForm.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Preferred Country *
            </label>
            <input
              type="text"
              value={consultationForm.preferredCountry}
              onChange={(e) =>
                handleInputChange("preferredCountry", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="Country of study"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Preferred Intake *
            </label>
            <input
              type="text"
              value={consultationForm.preferredIntake}
              onChange={(e) =>
                handleInputChange("preferredIntake", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="e.g. Fall 2024"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Current Qualification *
            </label>
            <input
              type="text"
              value={consultationForm.currentQualification}
              onChange={(e) =>
                handleInputChange("currentQualification", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="e.g. Graduation"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Study Level *
            </label>
            <input
              type="text"
              value={consultationForm.studyLevel}
              onChange={(e) => handleInputChange("studyLevel", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="e.g. Master's"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Preferred Date *
            </label>
            <input
              type="date"
              value={consultationForm.preferredDate}
              onChange={(e) =>
                handleInputChange("preferredDate", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Preferred Time *
            </label>
            <input
              type="text"
              value={consultationForm.preferredTime}
              onChange={(e) =>
                handleInputChange("preferredTime", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="e.g. 10:00 AM"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Message
            </label>
            <textarea
              value={consultationForm.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="Any additional information or questions?"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleFormSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-violet-600 hover:to-purple-600"
          >
            <Send className="w-4 h-4" />
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="grid grid-cols-1 items-start gap-4 md:gap-6 lg:grid-cols-3">
        {/* Left Column - Main Support Content */}
        <div className="lg:col-span-2">
          {renderCounselorSupport()}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Emergency Contact */}
          <section
            aria-labelledby="emergency-contact-heading"
            className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"
          >
            <div className="border-b border-red-100 bg-red-50 p-4 md:p-5">
              <h5
                id="emergency-contact-heading"
                className="flex items-center gap-2 font-bold text-red-900"
              >
                <Phone className="h-5 w-5 shrink-0 text-red-600" />
                Quick Connect
              </h5>
            </div>
            <div className="space-y-3 p-4 md:p-5">
              <a
                href={`https://wa.me/918919636330?text=${encodeURIComponent(contactMessage)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Contact Study Abroad support on WhatsApp at +91 89196 36330"
                className="flex min-w-0 items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-red-600" />
                <span className="min-w-0">
                  <span className="block break-words font-semibold text-red-900">
                    +91 89196 36330
                  </span>
                  <span className="block text-xs text-red-700">
                    Tap to chat on WhatsApp
                  </span>
                </span>
              </a>
              <a
                href={`mailto:studyabroad@askoxy.ai?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(contactMessage)}`}
                aria-label="Email Study Abroad support at studyabroad@askoxy.ai"
                className="flex min-w-0 items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Mail className="h-5 w-5 shrink-0 text-blue-600" />
                <span className="min-w-0">
                  <span className="block break-all font-semibold text-blue-900">
                    studyabroad@askoxy.ai
                  </span>
                  <span className="block text-xs text-blue-700">
                    Tap to email our team
                  </span>
                </span>
              </a>
            </div>
          </section>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h5 className="font-bold text-gray-900 mb-4 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Quick Actions
            </h5>
            <div className="space-y-2">
              {[
                { label: "Complete Profile", action: "profile" },
                { label: "Upload Documents", action: "documents" },
                { label: "Search Universities", action: "universities" },
                { label: "View Applications", action: "applications" },
              ].map((item) => (
                <button
                  key={item.action}
                  onClick={() => onNavigate?.(item.action)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
