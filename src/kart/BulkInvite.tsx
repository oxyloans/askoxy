import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Modal } from "antd";
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      const fileExtension = selectedFile.name.toLowerCase().split(".").pop();
      if (fileExtension !== "xlsx") {
        Modal.error({
          title: "Invalid File Format",
          content:
            "Please upload only .xlsx files. Other Excel formats (.xls) are not supported.",
          centered: true,
        });
        e.target.value = ""; // Clear the input
        setFile(null);
        return;
      }
    }

    setFile(selectedFile);
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

    if (!file) {
      Modal.error({
        title: "Error",
        content: "Please upload an Excel file.",
        centered: true,
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("multiPart", file);

      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("API response:", response.data);
      Modal.success({
        title: "Success",
        content: "Bulk invite sent successfully.",
        centered: true,
      });
    } catch (err: any) {
      console.error("Bulk invite error:", err);

      if (err.response) {
        const msg =
          err.response.data?.message ||
          `Request failed with status ${err.response.status}`;
        Modal.error({
          title: "Error",
          content: msg,
          centered: true,
        });
      } else {
        Modal.error({
          title: "Error",
          content: "Request failed. Please try again.",
          centered: true,
        });
      }
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Only .xlsx files are supported
              </p>
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
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select Type</option>
                <option value="sample"> Sample Mail</option>
                <option value="nonsample"> Non Sample Mail</option>
              </select>
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
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter email subject..."
              />
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
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                placeholder="Enter your message..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Use{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{`{Referral_Link}`}</code>{" "}
                to include user's referral link
              </p>
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
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter display name..."
              />
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
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter sample email address..."
                />
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
