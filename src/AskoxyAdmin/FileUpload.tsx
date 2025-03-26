import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sider";

const FileUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await axios.post(
        `https://meta.oxyloans.com/api/upload-service/upload?id=87ff1a63-ccc2-4824-8d03-f1a2bef833b4&fileType=image`,
        formData
      );

      if (response.status === 200) {
        setSuccessMessage("File uploaded successfully!");
      } else {
        setErrorMessage("Failed to upload file. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while uploading the file."
      );
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:ml-55">
        {" "}
        {/* Add margin-left for sidebar width on desktop */}
        <div className="w-full max-w-lg mx-auto mt-2 md:mt-10">
          {" "}
          {/* Adjust margin top for different screens */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
            {" "}
            {/* Adjust padding for different screens */}
            <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center md:text-left">
              Upload File
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  required
                />
              </div>

              {/* Messages */}
              <div className="min-h-[40px]">
                {" "}
                {/* Fixed height for messages to prevent layout shift */}
                {errorMessage && (
                  <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
                    {successMessage}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md transition-colors duration-200 text-sm md:text-base
                  ${
                    isSubmitting
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                  }
                  text-white font-medium shadow-sm`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
                    Uploading...
                  </span>
                ) : (
                  "Upload File"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;
