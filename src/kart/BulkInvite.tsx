import React, {
  useState,
  ChangeEvent,
  FormEvent,
  FC,
} from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import BASE_URL from "../Config";

const API_URL = `${BASE_URL}/user-service/excelInvite`;

type InviteType = "" | "sample" | "nonsample";

interface FormValues {
  inviteType: InviteType;
  message: string;
  mailSubject: string;
  mailDispalyName: string;
  sampleEmail: string;
  userType: string;
}

const BulkInvite: FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    inviteType: "",
    message:
      `I’m already using ASKOXY.AI, and I’m really impressed with the platform — smooth user experience, intelligent insights, and powerful tools that help simplify decisions.

They’ve also introduced new AI-driven features that make the platform even more useful in everyday tasks. I’d love for you to join using my referral link and explore the benefits yourself.

\nJoin using my referral link: https://www.askoxy.ai/whatsappregister?referralCode=${localStorage.getItem("userId") || ""}
\nFeel free to reach out once you join!`,
    mailSubject: "ASKOXY.AI – Invitation to Join Our AI-Powered Platform",
    mailDispalyName: "",
    sampleEmail: "",
    userType: "CUSTOMER",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
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
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please upload an Excel file.");
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
      setSuccess("Bulk invite sent successfully.");
    } catch (err: any) {
      console.error("Bulk invite error:", err);

      if (err.response) {
        const msg =
          err.response.data?.message ||
          `Request failed with status ${err.response.status}`;
        setError(msg);
      } else {
        setError("Server error. Please check backend logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-6xl space-y-8">

        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            Bulk Invite
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Upload an Excel file and send personalized invitations in one go.
          </p>
        </div>

        {/* Excel Example */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Excel Upload Format
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Your Excel must include the following columns:
              </p>
            </div>

            <button
              onClick={downloadSampleExcel}
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Download Sample Excel
            </button>
          </div>

          <table className="mt-4 w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Name</th>
                <th className="border px-3 py-2 text-left">Email</th>
                <th className="border px-3 py-2 text-left">Mobile</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">John Doe</td>
                <td className="border px-3 py-2">test1@email.com</td>
                <td className="border px-3 py-2">9876543210</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">Jane Smith</td>
                <td className="border px-3 py-2">test2@email.com</td>
                <td className="border px-3 py-2">9988776655</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Form + Preview Layout */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
          >
            {/* File */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Excel File (multiPart)
              </label>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm text-gray-700"
              />
            </div>

            {/* Invite Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Invite Type
              </label>
              <select
                name="inviteType"
                value={formValues.inviteType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm text-gray-700"
              >
                <option value="">Select Type</option>
                <option value="sample">Sample Mail</option>
                <option value="nonsample">Non Sample Mail</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mail Subject
              </label>
              <input
                type="text"
                name="mailSubject"
                value={formValues.mailSubject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Message
              </label>
              <textarea
                name="message"
                value={formValues.message}
                rows={4}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use <code>{`{Referral_Link}`}</code> to include user's referral.
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mail Display Name
              </label>
              <input
                type="text"
                name="mailDispalyName"
                value={formValues.mailDispalyName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>

            {/* Sample Email */}
            {formValues.inviteType === "sample" && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Sample Email
                </label>
                <input
                  type="email"
                  name="sampleEmail"
                  value={formValues.sampleEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
            )}

            {/* Status Messages */}
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-300">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-300">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Bulk Invite"}
            </button>
          </form>

          {/* PREVIEW */}
          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">
              Preview
            </h3>

            <div className="rounded-lg bg-gray-50 p-4 space-y-3 border">
              <p>
                <strong>Mail Subject: </strong>
                {formValues.mailSubject || "-"}
              </p>

              <p>
                <strong>Mail Display Name: </strong>
                {formValues.mailDispalyName || "-"}
              </p>

              <p className="whitespace-pre-line">
                <strong>Message:</strong>
                {"\n"}
                {formValues.message || "-"}
              </p>

              {formValues.inviteType === "sample" && (
                <p>
                  <strong>Sample Email: </strong>
                  {formValues.sampleEmail || "-"}
                </p>
              )}

              <p>
                <strong>File: </strong>
                {file ? file.name : "No file selected"}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              This preview shows how the email content will appear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkInvite;
