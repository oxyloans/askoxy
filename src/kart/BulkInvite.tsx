import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import { customerApi } from "../utils/axiosInstance";
import * as XLSX from "xlsx";
import { Modal } from "antd";
import { AlertCircle } from "lucide-react";
import BASE_URL from "../Config";

const API_URL = `${BASE_URL}/user-service/excelInvite`;

type InviteType = "" | "sample" | "nonsample";

interface FormValues {
  inviteType: InviteType;
  message: string;
  mailSubject: string;
  mailDispalyName: string;
  sampleEmail: string;
  userId: string;
}

interface FormErrors {
  file?: string;
  inviteType?: string;
  mailSubject?: string;
  message?: string;
  mailDispalyName?: string;
  sampleEmail?: string;
}

const BulkInvite: FC = () => {
  const profileRaw = localStorage.getItem("profileData");
  const profile = profileRaw ? JSON.parse(profileRaw) : null;

  const name = profile
    ? `${profile.userFirstName} ${profile.userLastName}`
    : "";
  const [formValues, setFormValues] = useState<FormValues>({
    inviteType: "",
    message: `I’m already using ASKOXY.AI, and I’m really impressed with the platform — smooth user experience, intelligent insights, and powerful tools that help simplify decisions.

They’ve also introduced new AI-driven features that make the platform even more useful in everyday tasks. I’d love for you to join using my referral link and explore the benefits yourself.

\nJoin using my referral link: https://www.askoxy.ai/whatsappregister?referralCode=${
      localStorage.getItem("userId") || ""
    }
\nFeel free to reach out once you join!`,
    mailSubject: "ASKOXY.AI – Invitation to Join Our AI-Powered Platform",
    mailDispalyName: name || "ASKOXY.AI User",
    sampleEmail: "",
    userId: localStorage.getItem("userId") || "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. File validation
    if (!file) {
      newErrors.file = "Please upload an Excel (.xlsx) file";
    } else {
      const ext = file.name.toLowerCase().split(".").pop();
      if (ext !== "xlsx") {
        newErrors.file = "Only .xlsx files are supported";
      }
    }

    // 2. Invite Type
    if (!formValues.inviteType) {
      newErrors.inviteType = "Please select an invite type";
    }

    // 3. Mail Subject
    if (!formValues.mailSubject.trim()) {
      newErrors.mailSubject = "Mail subject is required";
    } else if (formValues.mailSubject.trim().length < 3) {
      newErrors.mailSubject = "Subject must be at least 3 characters";
    }

    // 4. Message
    if (!formValues.message.trim()) {
      newErrors.message = "Message content is required";
    } else if (formValues.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    // 5. Display Name
    if (!formValues.mailDispalyName.trim()) {
      newErrors.mailDispalyName = "Display name is required";
    }

    // 6. Sample Email (only if sample mail selected)
    if (formValues.inviteType === "sample") {
      const email = formValues.sampleEmail.trim();
      if (!email) {
        newErrors.sampleEmail = "Sample email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.sampleEmail = "Please enter a valid email address (e.g. name@example.com)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the current field as user types/selects
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (name === "inviteType" && value !== "sample" && errors.sampleEmail) {
      setErrors((prev) => ({
        ...prev,
        sampleEmail: undefined,
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      const fileExtension = selectedFile.name.toLowerCase().split(".").pop();
      if (fileExtension !== "xlsx") {
        setErrors((prev) => ({
          ...prev,
          file: "Please upload only .xlsx files. Other formats (.xls, .csv) are not supported.",
        }));
        e.target.value = ""; // Clear the input
        setFile(null);
        return;
      }
    }

    setFile(selectedFile);
    // Clear file error if a valid file is chosen
    setErrors((prev) => ({
      ...prev,
      file: undefined,
    }));
    if (apiError) {
      setApiError("");
    }
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      {
        name: "John Doe",
        email: "test1@email.com",
        mobile: "9876543210",
      },
      {
        name: "Jane Smith",
        email: "test2@email.com",
        mobile: "9988776655",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BulkInvite");
    XLSX.writeFile(workbook, "bulkInviteSample.xlsx");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if (file) {
        formData.append("multiPart", file);
      }

      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await customerApi.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API response:", response.data);
      Modal.success({
        title: "Success",
        content: "Bulk invite sent successfully.",
        centered: true,
      });
      setErrors({});
    } catch (err: any) {
      console.error("Bulk invite error:", err);

      let msg = "Request failed. Please try again.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.status) {
        msg = `Request failed with status ${err.response.status}`;
      } else if (err.message) {
        msg = err.message;
      }

      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 px-3 py-6 sm:px-4 sm:py-8 lg:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 bg-[#008cba] bg-clip-text text-transparent">
            Bulk Invite
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
            Upload an Excel file and send personalized invitations in one go.
          </p>
        </div>

        {/* Excel Example */}
        <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
                Excel Upload Format
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Your Excel must include the following columns:
              </p>
            </div>

            <button
              onClick={downloadSampleExcel}
              type="button"
              className="w-full sm:w-auto rounded-lg bg-[#008cba] px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              📥 Download Sample Excel
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="border-r border-gray-200 px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="border-r border-gray-200 px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mobile
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="border-r border-gray-200 px-3 sm:px-4 lg:px-6 py-3 text-sm text-gray-900">
                    John Doe
                  </td>
                  <td className="border-r border-gray-200 px-3 sm:px-4 lg:px-6 py-3 text-sm text-gray-900">
                    test1@email.com
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 text-sm text-gray-900">
                    9876543210
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="border-r border-gray-200 px-3 sm:px-4 lg:px-6 py-3 text-sm text-gray-900">
                    Jane Smith
                  </td>
                  <td className="border-r border-gray-200 px-3 sm:px-4 lg:px-6 py-3 text-sm text-gray-900">
                    test2@email.com
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 text-sm text-gray-900">
                    9988776655
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Form + Preview Layout */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-2">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg"
          >
            {/* File */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Excel File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer focus:outline-none focus:ring-2 rounded-lg border p-1 transition-colors ${
                  errors.file
                    ? "border-red-400 bg-red-50/20 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              {errors.file ? (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errors.file}</span>
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Only .xlsx files are supported
                </p>
              )}
            </div>

            {/* Invite Type */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Invite Type <span className="text-red-500">*</span>
              </label>
              <select
                name="inviteType"
                value={formValues.inviteType}
                onChange={handleChange}
                className={`block w-full rounded-lg border px-3 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 transition-colors ${
                  errors.inviteType
                    ? "border-red-400 bg-red-50/20 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
              >
                <option value="">Select Type</option>
                <option value="sample">Sample Mail</option>
                <option value="nonsample">Non Sample Mail</option>
              </select>
              {errors.inviteType && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errors.inviteType}</span>
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Mail Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mailSubject"
                value={formValues.mailSubject}
                onChange={handleChange}
                className={`block w-full rounded-lg border px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 transition-colors ${
                  errors.mailSubject
                    ? "border-red-400 bg-red-50/20 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
                placeholder="Enter email subject..."
              />
              {errors.mailSubject && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errors.mailSubject}</span>
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formValues.message}
                rows={4}
                onChange={handleChange}
                className={`block w-full rounded-lg border px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 transition-colors resize-vertical ${
                  errors.message
                    ? "border-red-400 bg-red-50/20 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
                placeholder="Enter your message..."
              />
              {errors.message ? (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errors.message}</span>
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Use{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{`{Referral_Link}`}</code>{" "}
                  to include user's referral link
                </p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Mail Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mailDispalyName"
                value={formValues.mailDispalyName}
                onChange={handleChange}
                className={`block w-full rounded-lg border px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 transition-colors ${
                  errors.mailDispalyName
                    ? "border-red-400 bg-red-50/20 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
                placeholder="Enter display name..."
              />
              {errors.mailDispalyName && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errors.mailDispalyName}</span>
                </p>
              )}
            </div>

            {/* Sample Email */}
            {formValues.inviteType === "sample" && (
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Sample Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="sampleEmail"
                  value={formValues.sampleEmail}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 transition-colors ${
                    errors.sampleEmail
                      ? "border-red-400 bg-red-50/20 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="Enter sample email address..."
                />
                {errors.sampleEmail && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errors.sampleEmail}</span>
                  </p>
                )}
              </div>
            )}

            {/* API / Submission Error Banner */}
            {apiError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 text-red-700 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800">Unable to Send Invitations</p>
                  <p className="mt-0.5 text-xs sm:text-sm text-red-600 leading-relaxed">{apiError}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#008cba] px-4 py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Bulk Invite"
              )}
            </button>
          </form>

          {/* PREVIEW */}
          <div className="space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2">
             
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Email Preview
              </h3>
            </div>

            <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 space-y-4 border border-gray-200 shadow-inner">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                  <span className="text-sm font-semibold text-gray-700 min-w-[120px] sm:min-w-[140px]">
                     Subject:
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 break-words">
                    {formValues.mailSubject || (
                      <span className="text-gray-400 italic">No subject</span>
                    )}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                  <span className="text-sm font-semibold text-gray-700 min-w-[120px] sm:min-w-[140px]">
                  From:
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 break-words">
                    {formValues.mailDispalyName || (
                      <span className="text-gray-400 italic">
                        No display name
                      </span>
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Message:
                    </span>
                    <div className="text-sm sm:text-base text-gray-900 whitespace-pre-line bg-white p-3 rounded-lg border border-gray-200 break-words">
                      {formValues.message || (
                        <span className="text-gray-400 italic">
                          No message content
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {formValues.inviteType === "sample" && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                    <span className="text-sm font-semibold text-gray-700 min-w-[120px] sm:min-w-[140px]">
                      Sample Email:
                    </span>
                    <span className="text-sm sm:text-base text-gray-900 break-words">
                      {formValues.sampleEmail || (
                        <span className="text-gray-400 italic">
                          No sample email
                        </span>
                      )}
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                  <span className="text-sm font-semibold text-gray-700 min-w-[120px] sm:min-w-[140px]">
                    Attachment:
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 break-words">
                    {file ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {file.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        No file selected
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">ℹ️</span>
                <span>
                  This preview shows how the email content will appear to
                  recipients.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkInvite;
