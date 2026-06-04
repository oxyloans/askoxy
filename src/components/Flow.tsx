import React from "react";

const Flow: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Flexbox or Grid for side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Steps to Get Rudraksha */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h5 className="text-xl font-semibold mb-4">Steps to Get Rudraksha:</h5>
          <p className="text-gray-700 space-y-2">
            <span className="block">1. Visit the askoxy.ai website.</span>
            <span className="block">2. Sign In: Once the dashboard opens, click the "Sign In" button.</span>
            <span className="block">3. Input your WhatsApp number.</span>
            <span className="block">4. Enter the OTP that is sent to your WhatsApp number.</span>
            <span className="block">5. Click the "Submit" button.</span>
            <span className="block">6. Re-enter your WhatsApp number to log in (if needed).</span>
            <span className="block">7. Select "Free Rudraksha" from the menu on the left side of the page.</span>
            <span className="block">8. Click the "I want Free Rudraksha" button.</span>
            <span className="block">9. Verify Your WhatsApp Number: The system will display your WhatsApp number (e.g., xxxxxxxxxx).</span>
            <span className="block">10. Click "Yes" to confirm or "No" if you need to edit the number.</span>
            <span className="block">11. Enter your address and click "Save Address."</span>
            <span className="block">12. Confirm Your Address: Click "Confirm" if the address is correct, or "Edit" to update it.</span>
            <span className="block">13. Select your preferred delivery method: Home Delivery or Office Address.</span>
            <span className="block">14. For Home Delivery: A confirmation message will be sent to your WhatsApp.</span>
            <span className="block">15. For Office Address: Click "Confirm and Proceed" to finish the process.</span>
          </p>
        </div>

        {/* Steps for Vanabhojanam Confirmation */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h5 className="text-xl font-semibold mb-4">Steps for Vanabhojanam Confirmation</h5>
          <p className="text-gray-700 space-y-2">
            <span className="block">1. Visit the askoxy.ai website.</span>
            <span className="block">2. Click the "Sign In" button.</span>
            <span className="block">3. Input your WhatsApp number.</span>
            <span className="block">4. Enter the OTP that is sent to your WhatsApp number.</span>
            <span className="block">5. Click the "Submit" button.</span>
            <span className="block">6. Re-enter your WhatsApp number to log in (if needed).</span>
            <span className="block">7. Select “Vanabhojanam” from the left panel and scroll down to click on the “Confirm Participation” button.</span>
            <span className="block">8. Enter your details in the text box: Your name, the total number of family members or friends attending Vanabhojanam.</span>
            <span className="block">9. Select one of the transportation options provided.</span>
            <span className="block">10. Review your details on the confirmation popup:</span>
            <span className="block">    - If everything is correct, click "Submit."</span>
            <span className="block">    - If you need to make changes, click "Edit & Submit."</span>
            <span className="block">11. After submitting, you will see a success message and receive a confirmation message on WhatsApp.</span>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Flow;
