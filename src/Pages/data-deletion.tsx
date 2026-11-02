import React from "react";
import { Link } from "react-router-dom";

const DataDeletion: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-blue-700">
              AskOxy<span className="text-slate-800">.ai</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <Link
              to="/privacypolicy"
              className="text-slate-600 hover:text-blue-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:support@askoxy.ai"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 text-center sm:px-6 sm:py-12 lg:px-8">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100">
            Privacy &amp; Data Protection
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px]">
            AskOxy – User Data Deletion Instructions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            AskOxy respects user privacy and provides users with the ability to
            request deletion of their personal information.
          </p>
        </div>
      </header>

      {/* Main Content Cards */}
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 space-y-6">
        {/* Section 1: How to request data deletion */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-7 sm:py-5 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              1
            </span>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              How to request data deletion
            </h2>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-sm sm:text-[15px] font-medium text-slate-700 mb-4">
              To request deletion of your personal data:
            </p>

            <ol className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 mt-0.5">
                  1
                </span>
                <div>
                  Send an email to{" "}
                  <a
                    href="mailto:support@askoxy.ai?subject=Data%20Deletion%20Request"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    support@askoxy.ai
                  </a>
                  .
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 mt-0.5">
                  2
                </span>
                <div>
                  Use the subject line:{" "}
                  <strong className="text-slate-900">
                    Data Deletion Request
                  </strong>
                  .
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 mt-0.5">
                  3
                </span>
                <div>
                  Include your registered email address or WhatsApp phone number
                  associated with your AskOxy account.
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 mt-0.5">
                  4
                </span>
                <div>
                  Our support team will verify your request and process it.
                </div>
              </li>
            </ol>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Ready to submit your request?
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Click below to open your email client with pre-filled details.
                </p>
              </div>
              <a
                href="mailto:support@askoxy.ai?subject=Data%20Deletion%20Request&body=Hello%20AskOxy%20Support%2C%0A%0APlease%20process%20my%20data%20deletion%20request.%0A%0ARegistered%20Email%20Address%3A%20%0ARegistered%20Phone%20%2F%20WhatsApp%20Number%3A%20%0AReason%20(optional)%3A%20%0A%0AThank%20you."
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm shrink-0"
              >
                Email Data Deletion Request
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: What information can be deleted? */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-7 sm:py-5 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              2
            </span>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              What information can be deleted?
            </h2>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-sm sm:text-[15px] font-medium text-slate-700 mb-4">
              Depending on your request, this may include:
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"></span>
                <span>Account and profile information.</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"></span>
                <span>Personal information associated with your account.</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"></span>
                <span>WhatsApp-related user information stored by AskOxy.</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"></span>
                <span>
                  Other personal data associated with your account, subject to
                  applicable legal retention requirements.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Processing your request */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-7 sm:py-5 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              3
            </span>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Processing your request
            </h2>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-sm sm:text-[15px] leading-relaxed text-slate-700">
              We will verify your identity, review the request and delete
              eligible personal data in accordance with applicable laws and our
              privacy policy. We will communicate with you if additional
              information is required.
            </p>
          </div>
        </section>

        {/* Section 4: Contact Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-7 sm:py-5 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              4
            </span>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Contact Us
            </h2>
          </div>

          <div className="p-5 sm:p-7 space-y-3 text-sm sm:text-[15px] text-slate-700">
            <div className="flex items-center gap-2">
              <strong className="text-slate-900 min-w-[100px]">Email:</strong>
              <a
                href="mailto:support@askoxy.ai"
                className="text-blue-600 hover:underline font-medium"
              >
                support@askoxy.ai
              </a>
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-slate-900 min-w-[100px]">Phone:</strong>
              <span>+91-814-327-1103 / +91-911-056-4106</span>
            </div>
            <div className="flex items-start gap-2">
              <strong className="text-slate-900 min-w-[100px]">Address:</strong>
              <span>
                OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu Fortune
                Fields, KPHB Colony, Hyderabad, Telangana - 500085
              </span>
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-slate-900 min-w-[100px]">Website:</strong>
              <a
                href="https://www.askoxy.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                www.askoxy.ai
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; 2026 AskOxy.ai / Oxykart Technologies Pvt Ltd. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacypolicy"
              className="hover:text-slate-800 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <a
              href="/account-deletion.html"
              className="hover:text-slate-800 transition-colors"
            >
              Account Deletion
            </a>
            <span>&bull;</span>
            <a
              href="mailto:support@askoxy.ai"
              className="hover:text-slate-800 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataDeletion;

