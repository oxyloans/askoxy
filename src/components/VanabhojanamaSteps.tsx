import React from "react";
import Vanabhojanam from "../assets/img/website 2.png";

const VanabhojanamSteps: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Image Section */}
      <div className="flex justify-center my-8">
        <img
          src={Vanabhojanam}
          alt="Vanabhojanam"
          className="rounded-xl shadow-lg w-full sm:w-3/4 lg:w-2/3"
        />
      </div>

      {/* Steps Section */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h5 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Steps for Vanabhojanam Confirmation
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
          <p>2. Click the "Sign In" button.</p>
          <p>3. Enter your WhatsApp number.</p>
          <p>4. Enter the OTP that is sent to your WhatsApp number.</p>
          <p>5. Click the "Submit" button.</p>
          <p>6. Re-enter your WhatsApp number to log in (if needed).</p>
          <p>
            7. Select “Vanabhojanam” from the left panel and scroll down to click
            on the “Confirm Participation” button.
          </p>
          <p>
            8. Enter your details in the text box: Your name, the total number of
            family members or friends attending Vanabhojanam.
          </p>
          <p>9. Select one of the transportation options provided.</p>
          <p>
            10. Review your details on the confirmation popup:
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li>If everything is correct, click "Confirm."</li>
              <li>If you need to make changes, click "Edit & Submit."</li>
            </ul>
          </p>
          <p>
            11. After submitting, you will see a success message and receive a
            confirmation message on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VanabhojanamSteps;
