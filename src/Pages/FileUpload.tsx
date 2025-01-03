import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sider";

const FileUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null); // File state
  const [isSubmitting, setIsSubmitting] = useState(false); // To manage form submission state
  const [errorMessage, setErrorMessage] = useState<string>(""); // To display error messages
  const [successMessage, setSuccessMessage] = useState<string>(""); // To display success messages

  // Handler for file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Set the selected file
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submit

    // Check if a file is selected
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true); // Set submission state to true
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    const formData = new FormData(); // Create FormData object
    formData.append("file", file, file.name); // Append file to FormData object

    try {
      // Sending the POST request with form data
      const response = await axios.post(
        `https://meta.oxyloans.com/api/upload-service/upload?id=87ff1a63-ccc2-4824-8d03-f1a2bef833b4&fileType=image`,
        formData
      );

      // Check if the upload was successful
      if (response.status === 200) {
        setSuccessMessage("File uploaded successfully!");
      } else {
        setErrorMessage("Failed to upload file. Please try again.");
      }
    } catch (error: any) {
      // Handle error during API request
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while uploading the file."
      );
      console.error("API Error:", error); // Log error for debugging
    } finally {
      setIsSubmitting(false); // Reset the submission state after request completion
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar /> {/* Sidebar should be responsive */}
      <div className="p-8 bg-white rounded shadow-lg w-full max-w-lg mx-auto mt-8">
        <h1 className="text-2xl font-semibold mb-6">Upload File</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Choose File
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange} // Handle file change
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm mb-4">{successMessage}</div>
          )}

          <div>
            <button
              type="submit"
              className={`w-full p-2 text-white rounded ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadComponent;
