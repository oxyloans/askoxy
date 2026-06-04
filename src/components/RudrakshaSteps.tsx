import React from "react";
import rudraksha from "../assets/img/WEBSITE.png";

const RudrakshaSteps: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Image Section */}
      <div className="flex justify-center my-8">
        <img
          src={rudraksha}
          alt="Rudraksha"
          className="rounded-xl shadow-lg w-full sm:w-3/4 lg:w-2/3"
        />
      </div>

      {/* Steps Section */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h5 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Steps to Get Rudraksha
        </h5>
        <div className="text-gray-700 space-y-4 text-left">
          <p>
            1. Visit the{" "}
            <a
              href="https://www.askoxy.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              askoxy.ai
            </a>{" "}
            website.
          </p>
          <p>2. Sign In: Once the dashboard opens, click the "Sign In" button.</p>
          <p>3. Input your WhatsApp number.</p>
          <p>4. Enter the OTP that is sent to your WhatsApp number.</p>
          <p>5. Click the "Submit" button.</p>
          <p>6. Re-enter your WhatsApp number to log in (if needed).</p>
          <p>7. Select "Free Rudraksha" from the menu on the left side of the page.</p>
          <p>8. Click the "I want Free Rudraksha" button.</p>
          <p>
            9. Verify Your WhatsApp Number: The system will display your WhatsApp
            number (e.g., xxxxxxxxxx).
          </p>
          <p>10. Click "Yes" to confirm or "No" if you need to edit the number.</p>
          <p>11. Enter your address and click "Save Address."</p>
          <p>
            12. Confirm Your Address: Click "Confirm" if the address is correct,
            or "Edit" to update it.
          </p>
          <p>13. Select your preferred delivery method: Home Delivery or Office Address.</p>
          <p>
            14. For Home Delivery: A confirmation message will be sent to your
            WhatsApp.
          </p>
          <p>15. For Office Address: Click "Confirm and Proceed" to finish the process.</p>
        </div>
      </div>
    </div>
  );
};

export default RudrakshaSteps;
