import React, { useState } from "react";
import Header from "../components/Header";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    helpTopic: "",
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call)
    console.log(
      "Form submitted at",
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      ":",
      formData
    );
    // Reset form after submission (optional)
    setFormData({
      helpTopic: "",
      fullName: "",
      email: "",
      mobile: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-6">
        {" "}
        {/* Added padding-top for a small gap */}
        <div className="flex items-start justify-center p-6">
          <div className="max-w-4xl w-full flex">
            {/* Main Form */}
            <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg mr-6">
              <h1 className="text-3xl font-bold mb-6 text-center">
                Contact Us
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  name="helpTopic"
                  value={formData.helpTopic}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="" disabled>
                    How can we help you?*
                  </option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="feedback">Feedback</option>
                  <option value="delete-account">
                    Account/Data Deletion Request
                  </option>
                </select>
                {formData.helpTopic === "delete-account" && (
                  <div className="p-4 mb-4 bg-red-50 border border-red-300 rounded">
                    <h2 className="text-lg font-semibold mb-2 text-red-700">
                      Account & Data Deletion
                    </h2>
                    <p className="text-sm text-gray-700">
                      To delete your ASKOXY.AI account and all associated data,
                      submit this request using your registered email.
                      <br />
                      <strong>Data deleted:</strong> Your account, personal
                      details, orders, and usage info.
                      <br />
                      <strong>Data retained:</strong> Legal/financial records
                      (if required) for up to 180 days as per law.
                      <br />
                      We will confirm deletion within 7 working days.
                    </p>
                  </div>
                )}

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name*"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address*"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number (optional)"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type text*"
                  className="w-full p-2 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-600 transition duration-200"
                >
                  Submit feedback
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg space-y-6">
              <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  Issue with your order?
                </h2>
                <p className="text-gray-600">
                  Contact our support team via mobile at +91 81432 71103 or
                  email at support@askoxy.ai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
