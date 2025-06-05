import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RCSConsentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    consentType: "", // "promotional" or "transactional"
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    consent: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, consentType: e.target.value });
    setErrors({ ...errors, consent: "" }); // Clear consent error on change
  };

  const validateForm = () => {
    let isValid = true;
    let firstErrorId = "";
    const newErrors = {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      consent: "",
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
      firstErrorId = firstErrorId || "firstNameInput";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
      firstErrorId = firstErrorId || "lastNameInput";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required.";
      isValid = false;
      firstErrorId = firstErrorId || "mobileNumberInput";
    } else if (!/^\+91\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile Number must be in the format +91 followed by 10 digits.";
      isValid = false;
      firstErrorId = firstErrorId || "mobileNumberInput";
    }
    if (!formData.consentType) {
      newErrors.consent = "Please select one consent option.";
      isValid = false;
      firstErrorId = firstErrorId || "consentPreferences";
    }

    setErrors(newErrors);
    return { isValid, firstErrorId };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, firstErrorId } = validateForm();
    if (isValid) {
      // Placeholder for backend consent recording (e.g., API call)
      console.log("RCS consent given:", formData);
      // Example: await recordConsent({ ...formData, timestamp: new Date() });
      navigate("/whatsappregister");
    } else if (firstErrorId) {
      const errorElement = document.getElementById(firstErrorId);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-black mb-6">RCS Consent Form</h1>
      <div className="text-black text-base leading-relaxed space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-black">1. Introduction</h2>
          <p>
            <strong>OXYKART TECHNOLOGIES PVT LTD</strong> (operating as <strong>Aksoxy.ai</strong>) uses Rich Communication Services (RCS) to deliver enhanced, interactive messages directly to your mobile device's native messaging application. These messages provide a richer experience than traditional SMS, including images, buttons, and branded content.
          </p>
          <p className="mt-2">
            This RCS Consent Form explains how we collect, use, and manage your consent for sending RCS messages. By providing your consent, you acknowledge that you have read and understood our{" "}
            <Link to="/termsandconditions" className="text-purple-600 hover:text-purple-800">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacypolicy" className="text-purple-600 hover:text-purple-800">
              Privacy Policy
            </Link>.
          </p>
          <p className="mt-2">
            <strong>Important:</strong> Your explicit consent is required under Indian telecom regulations (TRAI guidelines) to receive commercial RCS messages from Aksoxy.ai.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">2. Types of RCS Messages</h2>
          <p>We may send you the following types of RCS messages:</p>
          <h3 className="text-lg font-medium text-black mt-4">2.1 Transactional Messages (No consent required)</h3>
          <ul className="list-disc pl-6">
            <li>Order confirmations and status updates</li>
            <li>Payment confirmations and receipts</li>
            <li>Delivery notifications and tracking information</li>
            <li>Account security alerts</li>
            <li>Customer service responses to your inquiries</li>
          </ul>
          <h3 className="text-lg font-medium text-black mt-4">2.2 Promotional Messages (Consent required)</h3>
          <ul className="list-disc pl-6">
            <li>Special offers and discounts on rice, gold, and other products</li>
            <li>New product announcements and launches</li>
            <li>Study abroad program updates and opportunities</li>
            <li>Cryptocurrency and BMVCoin related updates</li>
            <li>Seasonal sales and promotional campaigns</li>
            <li>AI service feature updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">3. Message Frequency and Charges</h2>
          <p><strong>Frequency:</strong></p>
          <ul className="list-disc pl-6">
            <li>Transactional messages: Sent as needed based on your activities</li>
            <li>Promotional messages: Maximum 4 messages per week</li>
            <li>Urgent notifications: As required for time-sensitive offers</li>
          </ul>
          <p className="mt-2"><strong>Charges:</strong></p>
          <ul className="list-disc pl-6">
            <li>RCS messages are typically free to receive on most modern smartphones</li>
            <li>Standard data charges from your mobile carrier may apply</li>
            <li>No additional charges from Aksoxy.ai for receiving RCS messages</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">4. Your Consent Options</h2>
          <p>Please select your preferences below:</p>
          <h3 className="text-lg font-medium text-black mt-4">4.1 Personal Information (Required)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-base font-medium">First Name</label>
              <input
                id="firstNameInput"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-purple-600 focus:border-purple-600"
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-base font-medium">Last Name</label>
              <input
                id="lastNameInput"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-purple-600 focus:border-purple-600"
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-base font-medium">Mobile Number</label>
              <input
                id="mobileNumberInput"
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-purple-600 focus:border-purple-600"
                placeholder="+91 1234567890"
              />
              {errors.mobileNumber && <p className="text-red-600 text-sm">{errors.mobileNumber}</p>}
            </div>
          </div>
          <h3 className="text-lg font-medium text-black mt-4">4.2 Consent Preferences</h3>
          <div id="consentPreferences" className="space-y-2">
            <label className="flex items-start space-x-3">
              <input
                type="radio"
                name="consentType"
                value="promotional"
                checked={formData.consentType === "promotional"}
                onChange={handleRadioChange}
                className="h-5 w-5 mt-1 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-base">
                YES, I consent to receive promotional RCS messages from Aksoxy.ai including offers, product updates, and promotional campaigns.
              </span>
            </label>
            <label className="flex items-start space-x-3">
              <input
                type="radio"
                name="consentType"
                value="transactional"
                checked={formData.consentType === "transactional"}
                onChange={handleRadioChange}
                className="h-5 w-5 mt-1 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-base">
                NO, I only want to receive transactional RCS messages related to my orders and account activities.
              </span>
            </label>
            {errors.consent && <p className="text-red-600 text-sm">{errors.consent}</p>}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">5. Your Rights and Control</h2>
          <p>You have the following rights regarding RCS messages:</p>
          <h3 className="text-lg font-medium text-black mt-4">5.1 Opt-Out Rights</h3>
          <ul className="list-disc pl-6">
            <li>Instant Opt-Out: Reply "STOP" to any promotional message.</li>
            <li>Email Opt-Out: Send request to{" "}
              <a href="mailto:support@aksoxy.ai" className="text-purple-600 hover:text-purple-800">
                support@aksoxy.ai
              </a>.</li>
            <li>Selective Opt-Out: Choose specific message categories to stop.</li>
            <li>Temporary Pause: Reply "PAUSE" to suspend messages for 30 days.</li>
          </ul>
          <h3 className="text-lg font-medium text-black mt-4">5.2 Data Rights</h3>
          <ul className="list-disc pl-6">
            <li>Access: Request details of your consent and message history.</li>
            <li>Update: Modify your contact information or preferences.</li>
            <li>Delete: Request deletion of your RCS consent data.</li>
            <li>Portability: Request your consent data in a readable format.</li>
          </ul>
          <h3 className="text-lg font-medium text-black mt-4">5.3 Complaint Rights</h3>
          <ul className="list-disc pl-6">
            <li>Contact our support team for RCS-related concerns.</li>
            <li>File complaints with TRAI for regulatory violations.</li>
            <li>Withdraw consent without affecting past lawful processing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">6. Data Processing and Privacy</h2>
          <h3 className="text-lg font-medium text-black mt-4">6.1 Data Collection</h3>
          <p>We collect and process:</p>
          <ul className="list-disc pl-6">
            <li>Your first name, last name, and mobile number.</li>
            <li>Message delivery status and engagement data.</li>
            <li>Device information for RCS compatibility.</li>
            <li>Consent preferences and opt-out requests.</li>
            <li>Mobile carrier information for RCS delivery.</li>
          </ul>
          <h3 className="text-lg font-medium text-black mt-4">6.2 Data Sharing</h3>
          <ul className="list-disc pl-6">
            <li>We do not sell your mobile number to third parties.</li>
            <li>RCS platform providers may process delivery data.</li>
            <li>Anonymized analytics may be shared with service partners.</li>
            <li>Legal authorities may access data under lawful requirements.</li>
          </ul>
          <h3 className="text-lg font-medium text-black mt-4">6.3 Data Retention</h3>
          <ul className="list-disc pl-6">
            <li>Active consent records: Retained while consent is valid.</li>
            <li>Opt-out records: Retained for 3 years to honor your preferences.</li>
            <li>Messages logs: Retained for 1 year for service improvement.</li>
            <li>Deleted upon account closure or specific deletion request.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">7. Regulatory Compliance</h2>
          <p>This RCS consent form complies with:</p>
          <ul className="list-disc pl-6">
            <li><strong>TRAI (Telecom Regulatory Authority of India)</strong> commercial communication regulations</li>
            <li><strong>Information Technology Act, 2000</strong> and related privacy rules</li>
            <li><strong>Consumer Protection Act, 2019</strong> for transparent communication</li>
            <li><strong>Personal Data Protection guidelines</strong> as applicable</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">8. Technical Requirements</h2>
          <p>To receive RCS messages, you need:</p>
          <ul className="list-disc pl-6">
            <li>A smartphone with RCS-enabled messaging app</li>
            <li>Active mobile data or Wi-Fi connection</li>
            <li>Compatible mobile carrier supporting RCS</li>
            <li>Updated messaging application</li>
          </ul>
          <p className="mt-2">
            <strong>Note:</strong> If RCS is unavailable, messages may be delivered as SMS/MMS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">9. Consent Confirmation</h2>
          <p>By checking the consent box above and clicking "Continue" below, you confirm that:</p>
          <ol className="list-decimal pl-6">
            <li>You are at least 18 years old or have parental consent</li>
            <li>You have read and understood this RCS Consent Form</li>
            <li>You agree to receive RCS messages based on your selected preferences</li>
            <li>You acknowledge your right to withdraw consent at any time</li>
            <li>You have reviewed our{" "}
              <Link to="/termsandconditions" className="text-purple-600 hover:text-purple-800">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacypolicy" className="text-purple-600 hover:text-purple-800">
                Privacy Policy
              </Link>
            </li>
          </ol>
          <p className="mt-2">
            <strong>Consent Validity:</strong> This consent remains valid until withdrawn by you or when you close your account with Aksoxy.ai.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">10. Contact Information</h2>
          <p>
            For questions about RCS messages or to manage your preferences:
            <br />
            <strong>OXYKART TECHNOLOGIES PVT LTD</strong>
            <br />
            (Operating as Aksoxy.ai)
            <br />
            CC-02, Ground Floor, Indu Fortune Fields
            <br />
            KPHB Colony, Hyderabad, Telangana - 500085
            <br />
            India
            <br />
            Email:{" "}
            <a href="mailto:support@aksoxy.ai" className="text-purple-600 hover:text-purple-800">
              support@aksoxy.ai
            </a>
            <br />
            Phone: +91 98765 43210
            <br />
            Website:{" "}
            <a href="https://www.aksoxy.ai" className="text-purple-600 hover:text-purple-800" target="_blank" rel="noopener noreferrer">
              www.aksoxy.ai
            </a>
            <br />
            RCS Support: Available Monday-Saturday, 9 AM - 6 PM IST
          </p>
        </section>

        <section>
          <p className="font-medium">
            Last Updated: June 05, 2025<br />
            Effective Date: June 05, 2025
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">Action Required</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
      {/* <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-black hover:text-gray-800 transition-colors duration-200 text-base"
        >
          Back to Home
        </Link>
      </div> */}
    </div>
  );
};

export default RCSConsentForm;