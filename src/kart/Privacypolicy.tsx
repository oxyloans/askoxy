import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        Welcome to OXYKART TECHNOLOGIES PVT LTD. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our Buy Rice platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="text-gray-600">
        - Personal information such as name, email, phone number, and address when you register or place an order. <br />
        - Payment details for processing transactions (handled securely via third-party payment gateways). <br />
        - Cookies and usage data to enhance user experience.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="text-gray-600">
        - To process and fulfill your orders. <br />
        - To provide customer support and respond to inquiries. <br />
        - To improve our services and personalize your experience. <br />
        - To send promotional offers and updates (you can opt-out anytime).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
      <p className="text-gray-600">
        We implement industry-standard security measures to protect your data. However, no online transaction is 100% secure. We encourage users to safeguard their account credentials.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Third-Party Services</h2>
      <p className="text-gray-600">
        We may use third-party services for payments, analytics, and marketing. These services have their own privacy policies that you should review.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p className="text-gray-600">
        - You can update or delete your account information anytime. <br />
        - You can request a copy of the personal data we hold about you. <br />
        - You can opt out of marketing communications.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Privacy Policy</h2>
      <p className="text-gray-600">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p className="text-gray-600">
        If you have any questions or concerns about our Privacy Policy, please contact us at: <br />
        <strong>Email:</strong> support@oxykart.com <br />
        <strong>Phone:</strong> +91 98765 43210
      </p>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">Last Updated: February 2025</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
