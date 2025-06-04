import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-black mb-6">
        Terms and Conditions
      </h1>
      <div className="text-black text-base leading-relaxed space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-black">1. Introduction</h2>
          <p>
            Welcome to Aksoxy.ai ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms.
          </p>
          <p className="mt-2">
            <strong>Company Information:</strong><br />
            · Business Name: Aksoxy.ai<br />
            · Legal Entity: OXYKART TECHNOLOGIES PVT LTD<br />
            · Address: CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">2. Services Offered</h2>
          <p>Aksoxy.ai provides the following services and products:</p>
          <h3 className="text-lg font-medium text-black mt-4">2.1 Physical Products</h3>
          <p>
            · <strong>Rice Sales:</strong> Retail and wholesale rice distribution<br />
            · <strong>Gold Sales:</strong> Retail gold selling with proper certification<br />
            · <strong>Additional Products:</strong> We may add various consumer products to our platform
          </p>
          <h3 className="text-lg font-medium text-black mt-4">2.2 Digital Services</h3>
          <p>
            · <strong>Free AI Generation Tools:</strong> Complimentary artificial intelligence-powered services<br />
            · <strong>Study Abroad Consultation:</strong> Educational consulting and guidance services<br />
            · <strong>Cryptocurrency Services:</strong> BMVCoin transactions on our proprietary Oxy Chain blockchain
          </p>
          <h3 className="text-lg font-medium text-black mt-4">2.3 Service Coverage</h3>
          <p>
            Our delivery and service area is limited to a 20-kilometer radius from CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">3. User Eligibility</h2>
          <p>
            · You must be at least 18 years old to use our services<br />
            · You must provide accurate and complete information during registration<br />
            · You are responsible for maintaining the confidentiality of your account credentials<br />
            · One person may not maintain multiple accounts
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">4. Product Sales Terms</h2>
          <h3 className="text-lg font-medium text-black mt-4">4.1 Rice Sales</h3>
          <p>
            · All rice products are subject to quality standards and food safety regulations<br />
            · Prices are subject to market fluctuations and may change without prior notice<br />
            · Bulk orders may qualify for wholesale pricing
          </p>
          <h3 className="text-lg font-medium text-black mt-4">4.2 Gold Sales</h3>
          <p>
            · All gold products come with proper certification and purity verification<br />
            · Gold prices fluctuate based on market rates and are updated regularly<br />
            · We comply with all applicable gold trading regulations in India<br />
            · Proper identification and documentation required for gold purchases
          </p>
          <h3 className="text-lg font-medium text-black mt-4">4.3 General Product Terms</h3>
          <p>
            · Product availability is subject to stock levels<br />
            · We reserve the right to limit quantities purchased<br />
            · All sales are final unless otherwise specified in our return policy
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">5. Digital Services</h2>
          <h3 className="text-lg font-medium text-black mt-4">5.1 Free AI Generation Services</h3>
          <p>
            · Services are provided "as-is" without warranties<br />
            · We reserve the right to modify, suspend, or discontinue services<br />
            · Usage may be subject to fair use policies and limitations
          </p>
          <h3 className="text-lg font-medium text-black mt-4">5.2 Study Abroad Services</h3>
          <p>
            · Consultation services are advisory in nature<br />
            · We do not guarantee admission to any educational institution<br />
            · Third-party application fees and institutional charges are separate
          </p>
          <h3 className="text-lg font-medium text-black mt-4">5.3 Cryptocurrency and Blockchain Services</h3>
          <p>
            · BMVCoin operates on our proprietary Oxy Chain blockchain<br />
            · Cryptocurrency transactions are subject to market risks<br />
            · Users must comply with applicable cryptocurrency regulations in India<br />
            · We are not responsible for market volatility or investment losses
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">6. Payment Terms</h2>
          <p>
            · We accept various payment methods as displayed at checkout<br />
            · All prices are in Indian Rupees (INR) unless otherwise specified<br />
            · Payment must be received before product delivery or service provision<br />
            · Additional charges may apply for certain payment methods
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">7. Delivery and Service Area</h2>
          <p>
            · Delivery is limited to areas within 20 KM of CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085<br />
            · Delivery times are estimates and may vary based on location and product availability<br />
            · Delivery charges may apply based on distance and order value<br />
            · Risk of loss transfers to buyer upon delivery
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">8. Returns and Refunds</h2>
          <h3 className="text-lg font-medium text-black mt-4">8.1 Physical Products</h3>
          <p>
            · <strong>Rice:</strong> Returns accepted within 24 hours if unopened and in original packaging<br />
            · <strong>Gold:</strong> Returns subject to verification and market value at time of return<br />
            · Defective products will be replaced or refunded at our discretion
          </p>
          <h3 className="text-lg font-medium text-black mt-4">8.2 Digital Services</h3>
          <p>
            · AI Generation services are non-refundable<br />
            · Study abroad consultation fees are non-refundable after service commencement<br />
            · Cryptocurrency transactions are generally irreversible
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">9. User Responsibilities</h2>
          <p>
            · Provide accurate delivery information<br />
            · Be available to receive deliveries during specified times<br />
            · Comply with all applicable laws and regulations<br />
            · Use digital services responsibly and ethically<br />
            · Maintain security of account credentials
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">10. Prohibited Uses</h2>
          <p>
            You may not use our platform to:<br />
            · Engage in fraudulent or illegal activities<br />
            · Resell our products without authorization<br />
            · Manipulate cryptocurrency markets<br />
            · Provide false information during consultation services<br />
            · Violate any applicable laws or regulations
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">11. Intellectual Property</h2>
          <p>
            · All content on Aksoxy.ai is our intellectual property or used with permission<br />
            · Users may not reproduce, distribute, or create derivative works without permission<br />
            · AI-generated content usage rights are granted for personal/commercial use as applicable
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">12. Privacy and Data Protection</h2>
          <p>
            · We collect and process personal data in accordance with applicable privacy laws<br />
            · User data is protected and not shared with unauthorized third parties<br />
            · Cryptocurrency transaction data is recorded on the blockchain and may be publicly visible
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">13. Limitation of Liability</h2>
          <p>
            · Our liability is limited to the value of products or services purchased<br />
            · We are not liable for indirect, consequential, or punitive damages<br />
            · Cryptocurrency investments carry inherent risks and we disclaim liability for losses<br />
            · Force majeure events may affect service delivery without liability
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">14. Disclaimers</h2>
          <p>
            · Products and services are provided "as-is"<br />
            · We make no warranties regarding AI service accuracy<br />
            · Study abroad consultation does not guarantee admission outcomes<br />
            · Cryptocurrency values are volatile and investments carry risk
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">15. Modifications to Terms</h2>
          <p>
            · We reserve the right to modify these Terms at any time<br />
            · Changes will be posted on our website with updated effective date<br />
            · Continued use of services constitutes acceptance of modified Terms
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">16. Governing Law and Jurisdiction</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana, India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">17. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">18. Contact Information</h2>
          <p>
            For questions about these Terms and Conditions, please contact us:<br />
            OXYKART TECHNOLOGIES PVT LTD<br />
            (Operating as Aksoxy.ai)<br />
            CC-02, Ground Floor, Indu Fortune Fields<br />
            KPHB Colony, Hyderabad, Telangana - 500085<br />
            India<br />
            Email: <a href="mailto:support@askoxy.ai" className="text-black hover:text-gray-800">support@askoxy.ai</a><br />
            Phone: +91 91541 50728<br />
            Website: <a href="https://www.aksoxy.ai" className="text-black hover:text-gray-800" target="_blank" rel="noopener noreferrer">www.aksoxy.ai</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black">19. Compliance</h2>
          <p>
            We comply with:<br />
            · Indian Consumer Protection Act, 2019<br />
            · Food Safety and Standards Act, 2006 (for rice sales)<br />
            · Foreign Exchange Management Act (FEMA) regulations<br />
            · Information Technology Act, 2000<br />
            · Applicable cryptocurrency and blockchain regulations
          </p>
        </section>

        <p className="mt-6 font-medium">
          By using Aksoxy.ai services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
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

export default TermsAndConditions;