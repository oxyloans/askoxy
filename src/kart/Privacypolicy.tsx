import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Privacy Policy
            </h1>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Last Updated: July 16, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
            </div>

            {/* Section: Interpretation and Definitions */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                Interpretation and Definitions
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Interpretation
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Definitions
                  </h3>
                  <p className="text-gray-600 mb-4">For the purposes of this Privacy Policy:</p>
                  <div className="space-y-3">
                    {[
                      { term: "Account", definition: "means a unique account created for You to access our Service or parts of our Service." },
                      { term: "Affiliate", definition: "means an entity that controls, is controlled by or is under common control with a party, where \"control\" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority." },
                      { term: "Application", definition: "refers to ASKOXY.AI, the software program provided by the Company." },
                      { term: "Company", definition: "refers to OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085" },
                      { term: "Country", definition: "refers to: Telangana, India." },
                      { term: "Device", definition: "means any device that can access the Service such as a computer, a cell phone or a digital tablet." },
                      { term: "Personal Data", definition: "is any information that relates to an identified or identifiable individual." },
                      { term: "Service", definition: "refers to the Application." },
                      { term: "Service Provider", definition: "means any natural or legal person who processes the data on behalf of the Company." },
                      { term: "Third-party Social Media Service", definition: "means any website or social network website through which a User can log in or create an account to use the Service." },
                      { term: "Usage Data", definition: "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself." },
                      { term: "You", definition: "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable." }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">{item.term}:</strong>
                          <span className="text-gray-600 ml-1">{item.definition}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Collecting and Using Your Personal Data */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                Collecting and Using Your Personal Data
              </h2>

              <div className="space-y-6">
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Types of Data Collected
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Personal Data</h4>
                      <p className="text-gray-600 mb-3">
                        While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          "Email address and password",
                          "First name and Last name",
                          "Phone number",
                          "Address, State, Province, ZIP/Postal code, City",
                          "Payment information (credit/debit cards, UPI, wallets)",
                          "Profile pictures and uploaded photos",
                          "Government-issued ID (for verification)",
                          "Bank account details (for partners)",
                          "GST/Tax information (for business partners)",
                          "Emergency contact information"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center p-2 bg-purple-50 rounded-md">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Device Permissions & Media Access</h4>
                      <p className="text-gray-600 mb-3">
                        Our Service may request access to certain device features and media to enhance your experience:
                      </p>
                      <div className="space-y-3">
                        <div className="bg-purple-50 rounded-lg p-3">
                          <h5 className="font-medium text-gray-900 mb-2">📷 Camera Access</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Profile picture capture</li>
                            <li>• Product/order photos for quality feedback</li>
                            <li>• Delivery verification photos</li>
                            <li>• Document scanning (ID verification)</li>
                            <li>• Issue reporting with visual evidence</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <h5 className="font-medium text-gray-900 mb-2">📍 Location Services</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Real-time delivery tracking</li>
                            <li>• Finding nearby restaurants/stores</li>
                            <li>• Accurate address detection</li>
                            <li>• Delivery route optimization</li>
                            <li>• Location-based recommendations</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <h5 className="font-medium text-gray-900 mb-2">🖼️ Photo & Video Storage</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Accessing gallery for profile pictures</li>
                            <li>• Uploading food/product images</li>
                            <li>• Sharing delivery experience videos</li>
                            <li>• Storing delivery proof photos</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <h5 className="font-medium text-gray-900 mb-2">📞 Communication Access</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Phone calls for order support</li>
                            <li>• SMS for order updates</li>
                            <li>• Push notifications</li>
                            <li>• In-app messaging</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Usage Data</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Usage Data is collected automatically when using the Service. This includes IP address, browser type, device identifiers, pages visited, time spent, search queries, order history, preferences, app interactions, crash reports, and performance metrics. Location data may include GPS coordinates, Wi-Fi access points, and cell tower information when location services are enabled.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Third-Party Data</h4>
                      <p className="text-gray-600 mb-3">
                        We may receive information from third-party services when you connect your accounts:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          "Social media profile information",
                          "Google/Facebook login credentials",
                          "Payment gateway transaction data",
                          "Analytics and advertising partners",
                          "Restaurant/store partner systems",
                          "Logistics and mapping services"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center p-2 bg-purple-50 rounded-md">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Use of Your Personal Data
                  </h3>
                  <p className="text-gray-600 mb-4">The Company may use Personal Data for the following purposes:</p>
                  <div className="space-y-2">
                    {[
                      "To provide and maintain our Service, including order processing and delivery coordination",
                      "To manage Your Account and authenticate your identity",
                      "To process payments, handle refunds, and manage billing",
                      "To provide customer support and respond to inquiries",
                      "To send order confirmations, delivery updates, and service notifications",
                      "To enable real-time tracking and location-based services",
                      "To facilitate photo/video uploads for feedback and quality assurance",
                      "To verify delivery completion through photos and signatures",
                      "To analyze usage patterns and improve our services",
                      "To provide personalized recommendations and offers",
                      "To prevent fraud and ensure platform security",
                      "To comply with legal obligations and resolve disputes",
                      "To manage partnerships with restaurants, stores, and delivery personnel",
                      "To conduct market research and gather user feedback",
                      "To send promotional materials (with your consent)",
                      "For business transfers, mergers, or acquisitions"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Data Sharing and Disclosure */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                Data Sharing and Disclosure
              </h2>
              <div className="bg-rose-50 rounded-xl p-6 border border-rose-100">
                <p className="text-gray-600 mb-4">We may share your Personal Data in the following circumstances:</p>
                <div className="space-y-3">
                  {[
                    { title: "Service Providers", description: "With payment processors, delivery partners, and technical service providers who assist in providing our services" },
                    { title: "Business Partners", description: "With restaurants, stores, and merchants to fulfill your orders and provide customer service" },
                    { title: "Legal Requirements", description: "When required by law, court orders, or to protect our rights and safety" },
                    { title: "Business Transfers", description: "In connection with mergers, acquisitions, or sale of assets" },
                    { title: "Consent", description: "When you have given explicit consent for specific sharing purposes" },
                    { title: "Emergency Situations", description: "To protect the safety of users or the general public" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-rose-200">
                      <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">{item.title}:</strong>
                        <span className="text-gray-600 ml-1">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Data Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                Retention of Your Personal Data
              </h2>
              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-100">
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    The Company will retain Your Personal Data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to comply with legal obligations, resolve disputes, and enforce our agreements.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-cyan-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Retention Periods:</h4>
                    <div className="space-y-2">
                      {[
                        "Account information: Until account deletion + 30 days",
                        "Order history: 7 years for tax and legal compliance",
                        "Payment data: As required by payment regulations",
                        "Photos/videos: 90 days after order completion",
                        "Location data: 30 days for active orders, anonymized thereafter",
                        "Communication logs: 2 years for customer service",
                        "Usage analytics: 3 years in anonymized form"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center p-2 bg-cyan-50 rounded-md">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Data Storage and Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                Data Storage and Security
              </h2>
              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Local Data Storage</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Your Personal Data is processed and stored on secure servers located within India. We comply with Indian data protection laws and do not transfer personal data outside India without appropriate safeguards.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Security Measures</h4>
                    <div className="space-y-2">
                      {[
                        "End-to-end encryption for sensitive data transmission",
                        "Secure server infrastructure with regular updates",
                        "Multi-factor authentication for admin access",
                        "Regular security audits and penetration testing",
                        "Encrypted storage for photos, videos, and documents",
                        "Access controls and role-based permissions",
                        "Backup and disaster recovery procedures",
                        "Staff training on data protection protocols",
                        "PCI DSS compliance for payment processing",
                        "Regular monitoring for suspicious activities"
                      ].map((measure, index) => (
                        <div key={index} className="flex items-center p-2 bg-red-50 rounded-md">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-gray-700 text-sm">{measure}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-gray-600 text-sm">
                      <strong>Important Note:</strong> While we implement robust security measures, no method of transmission over the Internet is 100% secure. We continuously update our security practices and encourage users to use strong passwords and enable two-factor authentication.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Your Data Subject Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">6</span>
                </div>
                Your Data Subject Rights
              </h2>
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <p className="text-gray-600 mb-4">Under applicable data protection laws, you have the following rights:</p>
                <div className="space-y-3">
                  {[
                    { title: "Right to Access", description: "Request copies of your personal data, including photos and location history" },
                    { title: "Right to Rectification", description: "Request correction of inaccurate personal data" },
                    { title: "Right to Erasure", description: "Request deletion of your personal data and uploaded content" },
                    { title: "Right to Restrict Processing", description: "Request restriction of processing of your personal data" },
                    { title: "Right to Data Portability", description: "Request transfer of your data to another service provider" },
                    { title: "Right to Object", description: "Object to processing of your personal data for marketing purposes" },
                    { title: "Right to Withdraw Consent", description: "Withdraw consent for data processing, photo/video access, or location services" },
                    { title: "Right to Manage Permissions", description: "Control camera, location, and storage permissions through device settings" }
                  ].map((right, index) => (
                    <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-900">{right.title}:</strong>
                        <span className="text-gray-600 ml-1">{right.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Cookies and Tracking Technologies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">7</span>
                </div>
                Cookies and Tracking Technologies
              </h2>
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                <p className="text-gray-600 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and provide personalized services.
                </p>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Types of Cookies and Tracking:</h4>
                    <div className="space-y-2">
                      {[
                        { type: "Essential Cookies", description: "Required for login, cart functionality, and basic operations" },
                        { type: "Performance Cookies", description: "Collect information about app usage and performance" },
                        { type: "Functional Cookies", description: "Remember preferences, language settings, and location" },
                        { type: "Analytics Cookies", description: "Help us understand user behavior and improve services" },
                        { type: "Marketing Cookies", description: "Used for targeted advertising and promotional campaigns" },
                        { type: "Location Tracking", description: "GPS and network-based location for delivery services" },
                        { type: "Device Fingerprinting", description: "Unique device identification for security purposes" }
                      ].map((cookie, index) => (
                        <div key={index} className="flex items-start p-2 bg-amber-50 rounded-md">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2"></div>
                          <div>
                            <strong className="text-gray-900 text-sm">{cookie.type}:</strong>
                            <span className="text-gray-600 text-sm ml-1">{cookie.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="text-gray-600 text-sm">
                      You can manage cookies through your browser settings or app preferences. Note that disabling certain cookies may limit functionality like location services and personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Children's Privacy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">8</span>
                </div>
                Children's Privacy
              </h2>
              <div className="bg-violet-50 rounded-xl p-6 border border-violet-100">
                <p className="text-gray-600 leading-relaxed">
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover we have collected personal information from a child under 13, we will delete such information promptly.
                </p>
              </div>
            </section>

            {/* Section: Changes to Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">9</span>
                </div>
                Changes to this Privacy Policy
              </h2>
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <h4 className="font-semibold text-gray-900 mb-2">How We Notify You:</h4>
                  <div className="space-y-2">
                    {[
                      "Email notification to registered users",
                      "In-app notifications for significant changes",
                      "Prominent notice on our website",
                      "Push notifications for policy updates",
                      "Updated date at the top of this policy"
                    ].map((method, index) => (
                      <div key={index} className="flex items-center p-2 bg-indigo-50 rounded-md">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                        <span className="text-gray-700 text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  Continued use of our Service after changes indicates acceptance of the updated Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section: International Transfers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">10</span>
                </div>
                International Data Transfers
              </h2>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your information, including Personal Data, is processed and stored within India. We do not transfer your personal data to countries outside India except in the following limited circumstances:
                </p>
                <div className="space-y-3">
                  {[
                    "Third-party service providers with adequate data protection measures",
                    "Legal requirements or court orders from recognized jurisdictions",
                    "Your explicit consent for specific international services",
                    "Emergency situations to protect user safety"
                  ].map((circumstance, index) => (
                    <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-slate-200">
                      <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">{circumstance}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  When international transfers are necessary, we ensure appropriate safeguards are in place to protect your data.
                </p>
              </div>
            </section>

            {/* Section: Complaint Resolution */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">11</span>
                </div>
                Complaint Resolution & Grievance Officer
              </h2>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                <p className="text-gray-600 mb-4">
                  If you have any concerns about how we handle your personal data, you can contact our Grievance Officer:
                </p>
                <div className="bg-white rounded-lg p-4 border border-yellow-200 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Grievance Officer Details:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Name:</span>
                      <span className="text-gray-600">Grievance Officer</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Email:</span>
                      <span className="text-gray-600">support@askoxy.ai</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Phone:</span>
                      <span className="text-gray-600">+91-814-327-1103</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  We are committed to resolving your concerns within 30 days of receiving your complaint. You also have the right to file a complaint with the relevant data protection authority.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">12</span>
                </div>
                Contact Us
              </h2>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                <p className="text-gray-600 mb-4">If you have any questions about this Privacy Policy, data handling, or permission usage, You can contact us:</p>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-white rounded-lg border border-teal-200">
                    <svg className="w-5 h-5 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-900">Email:</span>
                      <span className="text-gray-600 ml-2">support@askoxy.ai</span>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border border-teal-200">
                    <svg className="w-5 h-5 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-900">Phone:</span>
                      <span className="text-gray-600 ml-2">+91-814-327-1103</span>
                    </div>
                  </div>
                   <div className="flex items-center p-3 bg-white rounded-lg border border-teal-200">
                    <svg className="w-5 h-5 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-900">Phone:</span>
                      <span className="text-gray-600 ml-2">+91-911-056-4106</span>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-white rounded-lg border border-teal-200">
                    <svg className="w-5 h-5 text-teal-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-900">Address:</span>
                      <span className="text-gray-600 ml-2">OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085</span>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg border border-teal-200">
                    <svg className="w-5 h-5 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-900">Website:</span>
                      <span className="text-gray-600 ml-2">www.askoxy.ai</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-teal-100 rounded-lg">
                  <p className="text-teal-800 text-sm">
                    <strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM (IST)<br />
                    <strong>Emergency Support:</strong> Available 24/7 for critical privacy concerns
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;