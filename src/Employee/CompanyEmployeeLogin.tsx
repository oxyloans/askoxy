import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';

import { getEmployeeAuth, saveEmployeeAuth } from './employeeAuthCookie';
import { setEmployeeAccessToken, setEmployeeRefreshToken } from '../utils/cookieUtils';

import BASE_URL from "../Config"

const EMPLOYEE_DASHBOARD_ROUTE = '/employeedashboard';

// Single endpoint that now handles email-check, existing-user login and
// new-user OTP registration, all keyed off which fields are present in the
// request body.
const USER_EMAIL_PASSWORD_URL = `${BASE_URL}/user-service/userEmailPassword`;
const CHANGE_PASSWORD_URL = `${BASE_URL}/user-service/change-password`;

const PRIMARY_TYPE = 'JOBS';

interface EmailCheckResponse {
  timeInMilliSeconds: string | null;
  emailOtpSession: string | null;
  whatsappOtpSession: string | null;
  salt: string | null;
  status: string | null;
  token: string | null;
  accessToken: string | null;
  userId: string | null;
  refreshToke: string | null;
  id: string | null;
  primaryType: string | null;
  name: string | null;
  companyName: string | null;
  designation: string | null;
  requiredToChangePassword?: boolean | null;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
  errorMessage?: string;
}

interface EmployeeData {
  id: string;
  userId?: string | null;
  name: string;
  email: string;
  primaryType?: string | null;
  companyName?: string | null;
  token?: string | null;
  accessToken?: string | null;
}

type LoginFeedbackType = 'invalid' | 'server';

interface LoginFeedback {
  type: LoginFeedbackType;
  title: string;
  message: string;
}

// Which tab the user has picked.
type Intent = 'login' | 'register';

// If the user picked a tab that doesn't match what the email check
// actually returns (e.g. picked "Register" but the account already
// exists), we surface a clickable way to jump to the right form instead
// of silently overriding their choice.
interface IntentMismatch {
  actual: 'exists' | 'new';
}

interface EmployeeLoginProps {
  onLoginSuccess?: (employee: EmployeeData) => void;
}

const getLoginFeedback = (httpStatus: number, apiMessage?: string): LoginFeedback => {
  const message = apiMessage?.trim() || '';

  if (httpStatus === 409 || httpStatus === 401) {
    return {
      type: 'invalid',
      title: 'Unable to Sign In',
      message: message || 'Invalid email or password.',
    };
  }

  return {
    type: 'server',
    title: 'Login Unavailable',
    message: message || 'Something went wrong. Please try again.',
  };
};

const extractApiError = (result: unknown): string | undefined => {
  if (!result || typeof result !== 'object') return undefined;
  const r = result as ApiErrorResponse;
  return r.error || r.message || r.errorMessage;
};

const hasLoginTokens = (result: EmailCheckResponse | null): boolean =>
  Boolean(result && (result.token || result.accessToken) && (result.id || result.userId));

// Email provider classification used to identify common personal providers
// and to distinguish them from company domains.
type EmailProvider =
  | 'Gmail'
  | 'Yahoo'
  | 'iCloud'
  | 'Rediffmail'
  | 'Proton'
  | 'AOL'
  | 'Outlook'
  | 'Zoho'
  | 'Yandex'
  | 'GMX'
  | 'Mail'
  | 'Fastmail'
  | 'Company'
  | 'Unknown';

const classifyEmailProvider = (email: string): EmailProvider => {
  if (!email || typeof email !== 'string') return 'Unknown';
  const at = email.lastIndexOf('@');
  if (at < 0) return 'Unknown';
  const domain = email.slice(at + 1).toLowerCase();

  // Helper for simple suffix checks
  const endsWithAny = (d: string, list: string[]) => list.some((s) => d === s || d.endsWith(`.${s}`) || d.endsWith(s));

  if (endsWithAny(domain, ['gmail.com', 'googlemail.com'])) return 'Gmail';
  if (endsWithAny(domain, ['yahoo.com', 'ymail.com', 'rocketmail.com']) || domain.startsWith('yahoo')) return 'Yahoo';
  if (endsWithAny(domain, ['icloud.com', 'me.com', 'mac.com'])) return 'iCloud';
  if (endsWithAny(domain, ['rediffmail.com', 'rediff.com'])) return 'Rediffmail';
  if (endsWithAny(domain, ['protonmail.com', 'proton.me'])) return 'Proton';
  if (endsWithAny(domain, ['aol.com'])) return 'AOL';
  if (endsWithAny(domain, ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'])) return 'Outlook';
  if (endsWithAny(domain, ['zoho.com', 'zoho.in', 'zoho.eu'])) return 'Zoho';
  if (endsWithAny(domain, ['yandex.com', 'yandex.ru'])) return 'Yandex';
  if (endsWithAny(domain, ['gmx.com', 'gmx.co.uk'])) return 'GMX';
  if (endsWithAny(domain, ['mail.com'])) return 'Mail';
  if (endsWithAny(domain, ['fastmail.com'])) return 'Fastmail';

  // If domain doesn't match any of the known personal providers, treat it as a company domain
  // unless it's malformed (then Unknown).
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) return 'Company';
  return 'Unknown';
};

// Central place that decides whether an authenticated response is actually
// allowed into the Employee Workspace. Anything that isn't primaryType
// "JOBS" is rejected here, before a cookie is ever written.
const isAuthorizedForJobsWorkspace = (result: EmailCheckResponse): boolean =>
  result.primaryType === PRIMARY_TYPE;

const CompanyEmployeeLogin: React.FC<EmployeeLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // getEmployeeAuth() already validates primaryType === "JOBS" internally,
    // so a stale/foreign-role cookie will correctly return null here instead
    // of bouncing the user straight to the dashboard.
    if (getEmployeeAuth()) {
      navigate(EMPLOYEE_DASHBOARD_ROUTE, { replace: true });
    }
  }, [navigate]);

  const [intent, setIntent] = useState<Intent>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<LoginFeedback | null>(null);
  const [mismatch, setMismatch] = useState<IntentMismatch | null>(null);

  useEffect(() => {
    if (!feedback) return;

    const options = {
      toastId: `employee-login-${feedback.type}-${feedback.message}`,
      autoClose: feedback.type === 'server' ? 5000 : 4000,
    };

    if (feedback.type === 'server') {
      toast.error('We could not complete your request. Please try again.', options);
    } else {
      toast.warning(feedback.message, options);
    }
  }, [feedback]);

  useEffect(() => {
    if (!mismatch) return;

    toast.info(
      mismatch.actual === 'exists'
        ? 'An account already exists for this email. Please sign in instead.'
        : 'No employee account was found. Continue with email verification to register.',
      { toastId: `employee-login-mismatch-${mismatch.actual}` }
    );
  }, [mismatch]);

  // Carried over from the email-check response, needed to complete OTP
  // verification for a brand-new employee.
  const [otpSession, setOtpSession] = useState('');
  const [otpSalt, setOtpSalt] = useState('');

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [successEmployee, setSuccessEmployee] = useState<EmployeeData | null>(null);
  const [passwordChangeEmployee, setPasswordChangeEmployee] = useState<EmployeeData | null>(null);

  // Classify current email for UI hints and restrictions
  const emailProvider = classifyEmailProvider(email.trim());
  const isPersonalEmail = emailProvider !== 'Company' && emailProvider !== 'Unknown';

  const buildEmployee = (result: EmailCheckResponse, fallbackName?: string): EmployeeData => ({
    id: (result.id || result.userId) as string,
    userId: result.userId,
    name: result.name || fallbackName || 'Employee',
    email: email.trim(),
    primaryType: result.primaryType,
    companyName: result.companyName,
    token: result.token,
    accessToken: result.accessToken,
  });

  // Only id / primaryType / companyName go into the cookie as JSON.
  // Tokens stay out of client-readable cookies deliberately (XSS surface) —
  // keep them in memory / an httpOnly cookie set by the backend instead.
  const finishLogin = (employee: EmployeeData) => {
    saveEmployeeAuth({
      id: employee.id,
      primaryType: employee.primaryType ?? null,
      companyName: employee.companyName ?? null,
    });
    setSuccessEmployee(employee);
  };

  const saveEmployeeTokens = (result: EmailCheckResponse) => {
    const accessToken = result.accessToken || result.token;
    if (accessToken) setEmployeeAccessToken(accessToken);
    if (result.refreshToke) setEmployeeRefreshToken(result.refreshToke);
  };

  // Single handler for both tabs. Login sends email+password together in
  // one call, exactly like a normal sign-in form. Register sends email
  // only, since the password gets created inside the OTP popup.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setMismatch(null);
    setIsSubmitting(true);

    try {
      const body: Record<string, string> = { email: email.trim() };
      if (intent === 'login') {
        body.password = password;
      }

      const response = await fetch(USER_EMAIL_PASSWORD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = (await response.json().catch(() => null)) as
        | EmailCheckResponse
        | ApiErrorResponse
        | null;

      // Login (or registration completion) succeeded.
      if (response.ok && hasLoginTokens(result as EmailCheckResponse)) {
        const loginResult = result as EmailCheckResponse;

        if (!isAuthorizedForJobsWorkspace(loginResult)) {
          setFeedback({
            type: 'invalid',
            title: 'Access Not Allowed',
            message: 'This account is not registered for the Employee Workspace. Please use an account created for employee access.',
          });
          setPassword('');
          setShowPassword(false);
          return;
        }

        const employee = buildEmployee(loginResult);
        saveEmployeeTokens(loginResult);

        // A temporary password must be replaced before workspace access.
        if (loginResult.requiredToChangePassword) {
          setPasswordChangeEmployee(employee);
          setPassword('');
          setShowPassword(false);
          return;
        }

        finishLogin(employee);
        return;
      }

      // No account exists yet for this email — OTP was just sent.
      if (response.ok && (result as EmailCheckResponse)?.emailOtpSession) {
        const otpResult = result as EmailCheckResponse;
        setOtpSession(otpResult.emailOtpSession || '');
        setOtpSalt(otpResult.salt || '');

        if (intent === 'register') {
          toast.info('Verification code sent to your email.', { toastId: 'employee-otp-sent' });
          setShowOtpModal(true);
        } else {
          // They were on the Login tab, but there's no account to log into.
          setMismatch({ actual: 'new' });
        }
        return;
      }

      if (response.status === 409) {
        if (intent === 'register') {
          // Account already exists — registering again doesn't apply.
          setMismatch({ actual: 'exists' });
        } else {
          // Existing account, wrong (or missing) password.
          setFeedback(getLoginFeedback(response.status, extractApiError(result)));
          setPassword('');
          setShowPassword(false);
        }
        return;
      }

      setFeedback(getLoginFeedback(response.status, extractApiError(result)));
    } catch {
      setFeedback(getLoginFeedback(0));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lets the user jump straight to the correct form after a mismatch,
  // without re-hitting the endpoint.
  const handleSwitchToActualFlow = () => {
    if (!mismatch) return;

    if (mismatch.actual === 'exists') {
      setIntent('login');
      setPassword('');
    } else {
      setIntent('register');
      setShowOtpModal(true);
    }

    setMismatch(null);
  };

  const handleOtpRegistrationSuccess = (employee: EmployeeData) => {
    setShowOtpModal(false);
    toast.success('Employee account created successfully.');
    finishLogin(employee);
  };

  const handlePasswordChanged = () => {
    if (!passwordChangeEmployee) return;
    const employee = passwordChangeEmployee;
    setPasswordChangeEmployee(null);
    toast.success('Password updated successfully.');
    finishLogin(employee);
  };

  const handleContinueAfterSuccess = () => {
    if (successEmployee) {
      onLoginSuccess?.(successEmployee);
    }
    setSuccessEmployee(null);
    navigate(EMPLOYEE_DASHBOARD_ROUTE);
  };

  return (
    <main className="cel-page">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        draggable
        limit={3}
        theme="dark"
        aria-label="Employee notifications"
      />
      <style>{loginStyles}</style>
      <style>{toastResponsiveStyles}</style>

      <div className="cel-orb cel-orb-one" aria-hidden="true" />
      <div className="cel-orb cel-orb-two" aria-hidden="true" />
      <div className="cel-mesh cel-mesh-one" aria-hidden="true" />
      <div className="cel-mesh cel-mesh-two" aria-hidden="true" />

      <div className="cel-shell">
        <header className="cel-header">
          <div className="cel-brand">
            <span className="cel-brand-icon" aria-hidden="true">
              <LayoutDashboard />
            </span>
            <span>
              <strong>ASKOXY.AI</strong>
              <small>Employee Workspace</small>
            </span>
          </div>

          <div className="cel-secure" aria-label="Secure employee login">
            <ShieldCheck /> <span>Secure Login</span>
          </div>
        </header>

        <section className="cel-layout">
          <div className="cel-copy">
            <p className="cel-caption">Employee Access</p>
            <h1>
              Welcome to your
              <span> workspace.</span>
            </h1>
            <p>Sign in with your company email to continue.</p>
          </div>

          <div className="cel-card">
            <div className="cel-window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            <div className="cel-tabs" role="tablist" aria-label="Choose login or register">
              <button
                type="button"
                role="tab"
                aria-selected={intent === 'login'}
                className={`cel-tab ${intent === 'login' ? 'cel-tab-active' : ''}`}
                onClick={() => {
                  setIntent('login');
                  setFeedback(null);
                  setMismatch(null);
                }}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={intent === 'register'}
                className={`cel-tab ${intent === 'register' ? 'cel-tab-active' : ''}`}
                onClick={() => {
                  setIntent('register');
                  setFeedback(null);
                  setMismatch(null);
                }}
              >
                Register
              </button>
            </div>

            <div className="cel-card-heading">
              <span className="cel-card-icon" aria-hidden="true">
                <User />
              </span>
              <div>
                <p>{intent === 'login' ? 'Employee Access' : 'New Employee'}</p>
                <h2>{intent === 'login' ? 'Sign In' : 'Create Account'}</h2>
              </div>
            </div>

            <form className="cel-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="company-email">Company Email</label>
              <div className="cel-input-wrap">
                <Mail />
                <input
                  id="company-email"
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFeedback(null);
                    setMismatch(null);
                  }}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {email.trim() && (
                <p className={`cel-email-provider ${isPersonalEmail ? 'cel-email-provider-personal' : 'cel-email-provider-company'}`}>
                  {isPersonalEmail ? (
                    <>
                      <strong>{emailProvider} email is not allowed.</strong>
                      <small>Please use your company email address.</small>
                    </>
                  ) : (
                    <>
                      <strong>Company email recognised.</strong>
                      <small>You may proceed.</small>
                    </>
                  )}
                </p>
              )}

              {intent === 'login' && (
                <>
                  <label htmlFor="company-password">Password</label>
                  <div className="cel-input-wrap">
                    <Lock />
                    <input
                      id="company-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setFeedback(null);
                        setMismatch(null);
                      }}
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      className="cel-eye-button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </>
              )}

              <p className="cel-hint">
                {intent === 'login'
                  ? "New here? Switch to the Register tab above."
                  : 'Already have an account? Switch to the Login tab above.'}
              </p>

              {mismatch && (
                <div className="cel-mismatch" role="alert">
                  <AlertCircle />
                  <span>
                    {mismatch.actual === 'exists'
                      ? 'An account already exists for this email.'
                      : "We couldn't find an account for this email."}
                  </span>
                  <button
                    type="button"
                    className="cel-mismatch-button"
                    onClick={handleSwitchToActualFlow}
                  >
                    {mismatch.actual === 'exists' ? 'Switch to Login' : 'Switch to Register'}
                  </button>
                </div>
              )}

              {feedback && (
                <div className={`cel-feedback cel-feedback-${feedback.type}`} role="alert">
                  <AlertCircle />
                  <span>
                    <strong>{feedback.title}</strong>
                    <small>{feedback.message}</small>
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="cel-primary-button"
                disabled={
                  isSubmitting ||
                  !email.trim() ||
                  (intent === 'login' && !password) ||
                  Boolean(mismatch) || (intent === 'register' && isPersonalEmail)
                }
              >
                <span>
                  {isSubmitting
                    ? intent === 'login'
                      ? 'Signing In...'
                      : 'Checking...'
                    : intent === 'login'
                      ? 'Sign In'
                      : 'Continue to Register'}
                </span>
                {isSubmitting ? <LoaderCircle className="cel-spin" /> : <ArrowRight />}
              </button>
            </form>
          </div>
        </section>
      </div>

      {showOtpModal && (
        <OtpRegistrationModal
          email={email.trim()}
          otpSession={otpSession}
          salt={otpSalt}
          onClose={() => setShowOtpModal(false)}
          onSuccess={handleOtpRegistrationSuccess}
          buildEmployee={buildEmployee}
        />
      )}

      {passwordChangeEmployee && (
        <ChangePasswordModal employee={passwordChangeEmployee} onSuccess={handlePasswordChanged} />
      )}

      {successEmployee && (
        <LoginSuccessModal employee={successEmployee} onContinue={handleContinueAfterSuccess} />
      )}
    </main>
  );
};

interface LoginSuccessModalProps {
  employee: EmployeeData;
  onContinue: () => void;
}

interface ChangePasswordModalProps {
  employee: EmployeeData;
  onSuccess: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ employee, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    const accessToken = employee.accessToken || employee.token;
    const userId = employee.userId || employee.id;
    if (!accessToken || !userId) {
      setError('Your login session is incomplete. Please sign in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(CHANGE_PASSWORD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId, newPassword }),
      });
      const result = (await response.json().catch(() => null)) as ApiErrorResponse | null;

      if (!response.ok) {
        setError(extractApiError(result) || 'Unable to change password. Please try again.');
        return;
      }

      onSuccess();
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cel-modal" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
      <div className="cel-modal-card">
        <div className="cel-modal-heading">
          <span className="cel-card-icon" aria-hidden="true">
            <Lock />
          </span>
          <p className="cel-modal-eyebrow">Password Update Required</p>
        </div>
        <h3 id="change-password-title">Create a new password</h3>
        <p>Your account requires a password change before you can enter the workspace.</p>

        <form className="cel-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="required-new-password">New Password</label>
          <div className="cel-input-wrap">
            <Lock />
            <input
              id="required-new-password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(event) => { setNewPassword(event.target.value); setError(''); }}
              disabled={isSubmitting}
              required
            />
          </div>

          <label htmlFor="required-confirm-password">Confirm New Password</label>
          <div className="cel-input-wrap">
            <Lock />
            <input
              id="required-confirm-password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(event) => { setConfirmPassword(event.target.value); setError(''); }}
              disabled={isSubmitting}
              required
            />
            <button
              type="button"
              className="cel-eye-button"
              onClick={() => setShowPasswords((previous) => !previous)}
              aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
              disabled={isSubmitting}
            >
              {showPasswords ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && (
            <div className="cel-feedback cel-feedback-invalid" role="alert">
              <AlertCircle />
              <span><strong>Password not changed</strong><small>{error}</small></span>
            </div>
          )}

          <button type="submit" className="cel-primary-button" disabled={isSubmitting || !newPassword || !confirmPassword}>
            <span>{isSubmitting ? 'Changing Password...' : 'Change Password'}</span>
            {isSubmitting ? <LoaderCircle className="cel-spin" /> : <ArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
};

const LoginSuccessModal: React.FC<LoginSuccessModalProps> = ({ employee, onContinue }) => {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 1200);
    return () => window.clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="cel-modal" role="dialog" aria-modal="true">
      <div className="cel-modal-card cel-success-card">
        <CheckCircle2 />
        <h3>Login Successful</h3>
        <p>Welcome, {employee.name || 'Employee'}.</p>
        <button type="button" onClick={onContinue} className="cel-primary-button">
          Continue <ArrowRight />
        </button>
      </div>
    </div>
  );
};

interface OtpRegistrationModalProps {
  email: string;
  otpSession: string;
  salt: string;
  onClose: () => void;
  onSuccess: (employee: EmployeeData) => void;
  buildEmployee: (result: EmailCheckResponse, fallbackName?: string) => EmployeeData;
}

const OtpRegistrationModal: React.FC<OtpRegistrationModalProps> = ({
  email,
  otpSession,
  salt,
  onClose,
  onSuccess,
  buildEmployee,
}) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!companyName.trim()) {
      setError('Please enter your company name.');
      return;
    }
    if (!designation.trim()) {
      setError('Please enter your designation.');
      return;
    }
    if (!otp.trim()) {
      setError('Please enter the OTP sent to your email.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(USER_EMAIL_PASSWORD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          emailOtp: otp.trim(),
          emailOtpSession: otpSession,
          password: newPassword,
          primaryType: PRIMARY_TYPE,
          salt,
          name: name.trim(),
          companyName: companyName.trim(),
          designation: designation.trim(),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | EmailCheckResponse
        | ApiErrorResponse
        | null;

      if (!response.ok || !hasLoginTokens(result as EmailCheckResponse)) {
        setError(extractApiError(result) || 'Unable to verify OTP. Please try again.');
        return;
      }

      const otpResult = result as EmailCheckResponse;

      if (otpResult.primaryType !== PRIMARY_TYPE) {
        setError('This account is not registered for the Employee Workspace. Please use an account created for employee access.');
        return;
      }

      onSuccess(buildEmployee(otpResult, name.trim()));
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cel-modal" role="dialog" aria-modal="true">
      <div className="cel-modal-card cel-modal-card-wide">
        <div className="cel-modal-heading">
          <span className="cel-card-icon" aria-hidden="true">
            <ShieldCheck />
          </span>
          <p className="cel-modal-eyebrow">Employee Registration</p>
        </div>
        <h3>Verify Your Email</h3>
        <p>
          OTP sent to <strong>{email}</strong> — please fill the details below to continue.
        </p>

        <form className="cel-form" onSubmit={handleSubmit}>
          <div className="cel-form-row">
            <div className="cel-form-field">
              <label htmlFor="otp-name">Full Name</label>
              <div className="cel-input-wrap">
                <User />
                <input
                  id="otp-name"
                  type="text"
                  placeholder="e.g. Virat"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="cel-form-field">
              <label htmlFor="otp-code">Email OTP</label>
              <div className="cel-input-wrap">
                <ShieldCheck />
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          <div className="cel-form-row">
            <div className="cel-form-field">
              <label htmlFor="otp-company-name">Company Name</label>
              <div className="cel-input-wrap">
                <Building2 />
                <input
                  id="otp-company-name"
                  type="text"
                  placeholder="e.g. Askoxy"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="cel-form-field">
              <label htmlFor="otp-designation">Designation</label>
              <div className="cel-input-wrap">
                <Briefcase />
                <input
                  id="otp-designation"
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={designation}
                  onChange={(event) => setDesignation(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          <div className="cel-form-row">
            <div className="cel-form-field">
              <PasswordInput
                id="otp-new-password"
                label="Set Password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={setNewPassword}
                visible={showPasswords}
                disabled={isSubmitting}
              />
            </div>

            <div className="cel-form-field">
              <PasswordInput
                id="otp-confirm-password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showPasswords}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="button"
            className="cel-show-passwords"
            onClick={() => setShowPasswords((previous) => !previous)}
          >
            {showPasswords ? <EyeOff /> : <Eye />}
            {showPasswords ? 'Hide passwords' : 'Show passwords'}
          </button>

          {error && (
            <div className="cel-feedback cel-feedback-invalid" role="alert">
              <AlertCircle />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="cel-primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            {isSubmitting ? <LoaderCircle className="cel-spin" /> : <ArrowRight />}
          </button>

          <button
            type="button"
            className="cel-secondary-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  visible,
  disabled,
}) => (
  <>
    <label htmlFor={id}>{label}</label>
    <div className="cel-input-wrap">
      <Lock />
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        disabled={disabled}
        required
      />
    </div>
  </>
);

const toastResponsiveStyles = `
  .Toastify__toast-container {
    z-index: 99999;
  }

  .Toastify__toast {
    border-radius: 14px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-shadow: 0 16px 42px rgba(0, 0, 0, 0.28);
  }

  @media (max-width: 640px) {
    .Toastify__toast-container {
      top: 10px;
      right: 10px;
      left: 10px;
      width: auto;
      padding: 0;
    }

    .Toastify__toast {
      min-height: 58px;
      margin: 0 0 10px;
      border-radius: 12px;
    }
  }
`;

const loginStyles = `
  /* All login theme rules stay below .cel-page so this screen cannot
     override the application's theme after navigation. */
  .cel-page,
  .cel-page * {
    box-sizing: border-box;
  }

  @keyframes cel-spin {
    to { transform: rotate(360deg); }
  }

  .cel-page {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    min-height: 100svh;
    min-height: 100dvh;
    margin: 0;
    overflow-x: clip;
    overflow-y: auto;
    color: #ffffff;
    color-scheme: dark;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 9% 8%, rgba(72, 100, 255, 0.30), transparent 31%),
      radial-gradient(circle at 92% 13%, rgba(0, 211, 255, 0.14), transparent 28%),
      radial-gradient(circle at 88% 89%, rgba(242, 72, 208, 0.20), transparent 36%),
      radial-gradient(circle at 47% 108%, rgba(126, 79, 255, 0.20), transparent 44%),
      linear-gradient(135deg, #030612 0%, #09122d 45%, #17103a 73%, #071b2d 100%);
  }

  .cel-page::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 0;
    pointer-events: none;
    opacity: 0.11;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.72) 68%, transparent 100%);
  }

  .cel-page::after {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(115deg, rgba(255, 255, 255, 0.035), transparent 25%, transparent 75%, rgba(113, 92, 255, 0.035));
  }

  .cel-orb,
  .cel-mesh {
    position: fixed;
    z-index: 0;
    pointer-events: none;
  }

  .cel-orb {
    width: min(58vw, 500px);
    aspect-ratio: 1;
    border-radius: 50%;
    filter: blur(120px) saturate(135%);
    opacity: 0.56;
  }

  .cel-orb-one {
    top: -220px;
    left: -185px;
    background: linear-gradient(135deg, #536dfe, #00d9ff 45%, #8a55ff 72%, #ff55c8);
  }

  .cel-orb-two {
    right: -205px;
    bottom: -235px;
    background: linear-gradient(135deg, #ff55c8, #8c5cff 42%, #00d4ff 72%, #52e7b8);
  }

  .cel-mesh {
    width: min(38vw, 410px);
    aspect-ratio: 1.5;
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(58px) saturate(130%);
  }

  .cel-mesh-one {
    top: 25%;
    right: 7%;
    background: linear-gradient(120deg, rgba(0, 213, 255, 0.72), rgba(113, 86, 255, 0.08), rgba(255, 79, 202, 0.58));
  }

  .cel-mesh-two {
    left: 6%;
    bottom: 8%;
    background: linear-gradient(125deg, rgba(82, 232, 184, 0.48), rgba(126, 84, 255, 0.58), rgba(255, 191, 63, 0.16));
  }

  .cel-shell {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: min(100%, 1260px);
    min-height: 100vh;
    min-height: 100svh;
    min-height: 100dvh;
    margin: 0 auto;
    padding:
      max(20px, env(safe-area-inset-top))
      clamp(16px, 4vw, 56px)
      max(26px, env(safe-area-inset-bottom));
  }

  .cel-header,
  .cel-brand,
  .cel-secure,
  .cel-card-heading,
  .cel-input-wrap,
  .cel-primary-button,
  .cel-secondary-button,
  .cel-show-passwords {
    display: flex;
    align-items: center;
  }

  .cel-header {
    flex: 0 0 auto;
    justify-content: space-between;
    gap: 16px;
    min-width: 0;
  }

  .cel-brand {
    min-width: 0;
    gap: 12px;
  }

  .cel-brand > span:last-child {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1;
  }

  .cel-brand-icon,
  .cel-card-icon {
    display: grid;
    place-items: center;
  }

  .cel-brand-icon {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    color: #eef1ff;
    border: 1px solid rgba(255, 255, 255, 0.20);
    border-radius: 15px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.045));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 18px 38px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .cel-brand-icon svg,
  .cel-secure svg {
    width: 19px;
    height: 19px;
  }

  .cel-brand strong {
    overflow: hidden;
    font-size: 0.92rem;
    letter-spacing: 0.12em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cel-brand small {
    margin-top: 6px;
    overflow: hidden;
    color: rgba(235, 239, 255, 0.58);
    font-size: 0.68rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cel-secure {
    flex: 0 0 auto;
    gap: 8px;
    padding: 9px 13px;
    color: rgba(238, 242, 255, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
    font-size: 0.72rem;
    font-weight: 700;
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .cel-secure svg {
    color: #72ebc2;
  }

  .cel-layout {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(360px, 470px);
    align-items: center;
    gap: clamp(48px, 8vw, 112px);
    width: 100%;
    min-width: 0;
    padding: clamp(42px, 7vh, 78px) 0 clamp(26px, 4vh, 42px);
  }

  .cel-copy {
    min-width: 0;
    max-width: 680px;
  }

  .cel-caption,
  .cel-card-heading p {
    margin: 0;
    color: #b7c0ff;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .cel-email-provider {
    margin: 8px 0 16px 0;
    color: rgba(235, 239, 255, 0.78);
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .cel-email-provider strong {
    display: block;
    font-size: 0.82rem;
    font-weight: 800;
    margin-bottom: 2px;
  }

  .cel-email-provider small {
    display: block;
    font-size: 0.76rem;
    opacity: 0.88;
    line-height: 1.5;
  }

  .cel-email-provider-personal {
    color: #ffd2c2;
  }

  .cel-email-provider-company {
    color: #b7ffd6;
  }

  .cel-copy h1 {
    max-width: 680px;
    margin: 20px 0 0;
    font-size: clamp(3rem, 5.6vw, 5.7rem);
    font-weight: 830;
    line-height: 0.98;
    letter-spacing: -0.06em;
  }

  .cel-copy h1 span {
    display: block;
    padding-bottom: 0.08em;
    color: transparent;
    background: linear-gradient(105deg, #ffffff 0%, #91e7ff 22%, #9385ff 48%, #ff7bd7 72%, #ffd370 100%);
    -webkit-background-clip: text;
    background-clip: text;
    filter:
      drop-shadow(0 5px 0 rgba(52, 42, 132, 0.44))
      drop-shadow(0 18px 34px rgba(104, 75, 255, 0.30));
  }

  .cel-copy > p:last-child {
    max-width: 480px;
    margin: 20px 0 0;
    color: rgba(235, 239, 255, 0.69);
    font-size: 1rem;
    line-height: 1.72;
  }

  .cel-card {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    padding: 36px 32px 32px;
    color: #f8faff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 30px;
    background:
      radial-gradient(circle at 88% 5%, rgba(38, 207, 255, 0.12), transparent 30%),
      radial-gradient(circle at 8% 98%, rgba(170, 84, 255, 0.16), transparent 34%),
      linear-gradient(145deg, rgba(25, 35, 76, 0.88), rgba(36, 22, 69, 0.84)),
      rgba(9, 15, 39, 0.88);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.20),
      inset 0 -1px 0 rgba(255, 255, 255, 0.035),
      0 44px 110px rgba(0, 0, 0, 0.52),
      0 20px 50px rgba(87, 67, 220, 0.20),
      0 0 0 1px rgba(114, 131, 255, 0.04);
    backdrop-filter: blur(28px) saturate(118%);
    -webkit-backdrop-filter: blur(28px) saturate(118%);
  }

  .cel-card::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.11), transparent 30%, transparent 74%, rgba(255, 255, 255, 0.035));
  }

  .cel-card > * {
    position: relative;
    z-index: 1;
  }

  .cel-window-dots {
    position: absolute;
    z-index: 3;
    top: 18px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 7px;
    pointer-events: none;
  }

  .cel-window-dots i {
    display: block;
    width: 9px;
    height: 9px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
  }

  .cel-window-dots i:first-child {
    background: #ff5f57;
    box-shadow: 0 0 12px rgba(255, 95, 87, 0.72);
  }

  .cel-window-dots i:nth-child(2) {
    background: #ffbd2e;
    box-shadow: 0 0 12px rgba(255, 189, 46, 0.70);
  }

  .cel-window-dots i:nth-child(3) {
    background: #28c840;
    box-shadow: 0 0 12px rgba(40, 200, 64, 0.68);
  }

  .cel-card-heading {
    gap: 13px;
    margin-bottom: 24px;
    padding-right: 62px;
  }

  .cel-card-icon {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.20);
    border-radius: 16px;
    background: linear-gradient(145deg, #526dff 0%, #835dff 55%, #d24fff 100%);
    box-shadow:
      0 18px 42px rgba(98, 101, 245, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }

  .cel-card-icon svg {
    width: 21px;
    height: 21px;
  }

  .cel-card-heading h2 {
    margin: 5px 0 0;
    color: #ffffff;
    font-size: 1.36rem;
    line-height: 1.2;
  }

  .cel-modal-card h3 {
    margin: 0;
    color: #ffffff;
    font-size: 1.02rem;
    font-weight: 700;
    line-height: 1.25;
  }

  .cel-form {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .cel-form label {
    margin: 15px 0 8px;
    color: rgba(239, 242, 255, 0.78);
    font-size: 0.80rem;
    font-weight: 750;
  }

  .cel-input-wrap {
    position: relative;
    width: 100%;
    min-width: 0;
  }

  .cel-input-wrap > svg {
    position: absolute;
    z-index: 2;
    left: 14px;
    width: 18px;
    height: 18px;
    color: rgba(194, 203, 242, 0.62);
    pointer-events: none;
  }

  .cel-input-wrap input {
    width: 100%;
    min-width: 0;
    min-height: 52px;
    padding: 0 46px;
    color: #ffffff;
    caret-color: #8ae8ff;
    border: 1px solid rgba(201, 211, 255, 0.16);
    outline: none;
    border-radius: 15px;
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025)),
      rgba(8, 14, 36, 0.60);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.07),
      inset 0 -1px 0 rgba(0, 0, 0, 0.18);
    font: inherit;
    font-size: 16px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }

  .cel-input-wrap input::placeholder {
    color: rgba(196, 204, 233, 0.42);
  }

  .cel-input-wrap input:hover:not(:disabled) {
    border-color: rgba(183, 196, 255, 0.28);
  }

  .cel-input-wrap input:focus {
    border-color: rgba(107, 214, 255, 0.72);
    box-shadow:
      0 0 0 4px rgba(75, 180, 255, 0.11),
      inset 0 1px 0 rgba(255, 255, 255, 0.09);
  }

  .cel-input-wrap input:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  .cel-input-wrap input:-webkit-autofill,
  .cel-input-wrap input:-webkit-autofill:hover,
  .cel-input-wrap input:-webkit-autofill:focus {
    -webkit-text-fill-color: #ffffff;
    caret-color: #ffffff;
    transition: background-color 9999s ease-out 0s;
    box-shadow:
      0 0 0 1000px #111a3c inset,
      0 0 0 1px rgba(104, 211, 255, 0.36);
  }

  .cel-eye-button {
    position: absolute;
    z-index: 3;
    right: 7px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    padding: 0;
    color: rgba(205, 213, 241, 0.58);
    border: 0;
    border-radius: 11px;
    background: transparent;
    cursor: pointer;
  }

  .cel-eye-button:hover:not(:disabled) {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }

  .cel-eye-button:disabled {
    cursor: not-allowed;
    opacity: 0.50;
  }

  .cel-eye-button svg {
    width: 18px;
    height: 18px;
  }

  .cel-primary-button,
  .cel-secondary-button {
    justify-content: center;
    gap: 9px;
    width: 100%;
    min-height: 52px;
    padding: 0 18px;
    border-radius: 15px;
    font-family: inherit;
    font-size: 0.87rem;
    font-weight: 800;
    cursor: pointer;
    transition: border-color 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
  }

  .cel-primary-button {
    margin-top: 23px;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.19);
    background: linear-gradient(100deg, #4d6dff 0%, #705cff 39%, #ba4fff 72%, #2ecff3 100%);
    box-shadow:
      0 18px 42px rgba(83, 79, 235, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.30),
      inset 0 -1px 0 rgba(28, 16, 80, 0.30);
  }

  .cel-primary-button:hover:not(:disabled) {
    filter: brightness(1.08) saturate(1.05);
    box-shadow:
      0 20px 48px rgba(83, 79, 235, 0.38),
      inset 0 1px 0 rgba(255, 255, 255, 0.34);
  }

  .cel-primary-button:disabled,
  .cel-secondary-button:disabled {
    cursor: not-allowed;
    opacity: 0.60;
  }

  .cel-primary-button svg,
  .cel-secondary-button svg {
    width: 18px;
    height: 18px;
  }

  .cel-primary-button:focus-visible,
  .cel-secondary-button:focus-visible,
  .cel-eye-button:focus-visible,
  .cel-show-passwords:focus-visible {
    outline: 3px solid rgba(112, 216, 255, 0.45);
    outline-offset: 3px;
  }

  .cel-hint {
    margin: 14px 0 0;
    color: rgba(235, 239, 255, 0.58);
    font-size: 0.76rem;
    line-height: 1.55;
  }

  .cel-hint strong {
    color: #cdd6ff;
  }

  .cel-modal-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 18px;
  }

  .cel-modal-heading .cel-card-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .cel-modal-heading .cel-card-icon svg {
    width: 17px;
    height: 17px;
  }

  .cel-modal-eyebrow {
    margin: 0 !important;
    color: #b7c0ff;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .cel-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-bottom: 22px;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 14px;
    background: rgba(8, 14, 36, 0.55);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .cel-tab {
    min-height: 40px;
    padding: 0 12px;
    color: rgba(224, 229, 255, 0.62);
    border: 0;
    border-radius: 10px;
    background: transparent;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 750;
    cursor: pointer;
    transition: background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
  }

  .cel-tab:hover {
    color: #ffffff;
  }

  .cel-tab-active {
    color: #ffffff;
    background: linear-gradient(100deg, #4d6dff 0%, #705cff 50%, #ba4fff 100%);
    box-shadow:
      0 10px 26px rgba(83, 79, 235, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }

  .cel-mismatch {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 12px;
    margin-top: 17px;
    padding: 13px 14px;
    color: #ffd28a;
    border: 1px solid rgba(245, 158, 11, 0.30);
    border-radius: 13px;
    background: linear-gradient(145deg, rgba(145, 89, 14, 0.24), rgba(88, 53, 10, 0.16));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .cel-mismatch > svg {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
  }

  .cel-mismatch > span {
    flex: 1 1 160px;
    min-width: 0;
  }

  .cel-mismatch-button {
    flex: 0 0 auto;
    padding: 8px 14px;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 10px;
    background: linear-gradient(100deg, #4d6dff 0%, #705cff 50%, #ba4fff 100%);
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
  }

  .cel-mismatch-button:hover {
    filter: brightness(1.08);
  }

  .cel-feedback {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 17px;
    padding: 12px 13px;
    border: 1px solid;
    border-radius: 13px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    font-size: 0.78rem;
    line-height: 1.45;
  }

  .cel-feedback > svg {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
  }

  .cel-feedback span,
  .cel-feedback strong,
  .cel-feedback small {
    display: block;
    min-width: 0;
  }

  .cel-feedback small {
    margin-top: 3px;
    overflow-wrap: anywhere;
    color: inherit;
    opacity: 0.76;
  }

  .cel-feedback-invalid {
    color: #ffbac8;
    border-color: rgba(251, 113, 133, 0.30);
    background: linear-gradient(145deg, rgba(136, 28, 58, 0.25), rgba(85, 18, 43, 0.18));
  }

  .cel-feedback-server {
    color: #ffd28a;
    border-color: rgba(245, 158, 11, 0.30);
    background: linear-gradient(145deg, rgba(145, 89, 14, 0.24), rgba(88, 53, 10, 0.16));
  }

  .cel-secondary-button {
    margin-top: 14px;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.045));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.10);
  }

  .cel-secondary-button:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.28);
    filter: brightness(1.08);
  }

  .cel-modal {
    position: fixed;
    z-index: 1000;
    inset: 0;
    display: grid;
    place-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    padding:
      max(16px, env(safe-area-inset-top))
      16px
      max(16px, env(safe-area-inset-bottom));
    background: rgba(3, 5, 17, 0.82);
    backdrop-filter: blur(16px) saturate(115%);
    -webkit-backdrop-filter: blur(16px) saturate(115%);
  }

  .cel-modal-card {
    position: relative;
    isolation: isolate;
    width: min(100%, 440px);
    max-height: calc(100vh - 32px);
    max-height: calc(100dvh - 32px);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 32px 34px;
    color: #f8faff;
    border: 1px solid rgba(255, 255, 255, 0.19);
    border-radius: 26px;
    background:
      radial-gradient(circle at 88% 8%, rgba(33, 205, 255, 0.11), transparent 30%),
      radial-gradient(circle at 8% 95%, rgba(160, 84, 246, 0.15), transparent 34%),
      linear-gradient(145deg, rgba(28, 37, 78, 0.96), rgba(34, 22, 70, 0.94)),
      rgba(11, 17, 43, 0.94);
    box-shadow:
      0 40px 110px rgba(0, 0, 0, 0.58),
      inset 0 1px 0 rgba(255, 255, 255, 0.17);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
  }

  /* Wider variant for forms with paired fields (e.g. registration OTP modal),
     so two inputs can sit comfortably side by side on larger screens. */
  .cel-modal-card-wide {
    width: min(100%, 600px);
  }

  /* Pairs two fields on one row on wider screens; collapses to a single
     column automatically on narrow/mobile viewports (see breakpoint below). */
  .cel-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
  }

  .cel-form-field {
    min-width: 0;
  }

  .cel-form-row .cel-form-field label {
    margin-top: 18px;
  }

  .cel-form-row:first-of-type .cel-form-field label {
    margin-top: 0;
  }

  .cel-modal-card > p {
    margin: 6px 0 22px;
    color: rgba(235, 239, 255, 0.62);
    font-size: 0.86rem;
    line-height: 1.5;
  }

  .cel-modal-card > p strong {
    color: #7fe3ff;
    font-weight: 700;
  }

  .cel-success-card {
    text-align: center;
  }

  .cel-success-card > svg {
    width: 60px;
    height: 60px;
    color: #64e4b7;
    filter: drop-shadow(0 14px 26px rgba(34, 197, 136, 0.24));
  }

  .cel-show-passwords {
    align-self: flex-start;
    gap: 7px;
    margin-top: 12px;
    padding: 5px 0;
    color: #b9c1ff;
    border: 0;
    background: transparent;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 750;
    cursor: pointer;
  }

  .cel-show-passwords:hover:not(:disabled) {
    color: #ffffff;
  }

  .cel-spin {
    animation: cel-spin 0.8s linear infinite;
  }

  @media (max-width: 900px) {
    .cel-layout {
      grid-template-columns: 1fr;
      gap: 34px;
      padding: 46px 0 28px;
    }

    .cel-copy {
      max-width: 720px;
      text-align: center;
      justify-self: center;
    }

    .cel-copy h1,
    .cel-copy > p:last-child {
      margin-left: auto;
      margin-right: auto;
    }

    .cel-card {
      width: min(100%, 500px);
      justify-self: center;
    }
  }

  @media (max-width: 560px) {
    .cel-shell {
      padding:
        max(15px, env(safe-area-inset-top))
        14px
        max(20px, env(safe-area-inset-bottom));
    }

    .cel-header {
      gap: 10px;
    }

    .cel-brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 13px;
    }

    .cel-brand strong {
      font-size: 0.82rem;
      letter-spacing: 0.09em;
    }

    .cel-brand small {
      font-size: 0.62rem;
    }

    .cel-secure {
      width: 40px;
      height: 40px;
      justify-content: center;
      padding: 0;
      border-radius: 13px;
    }

    .cel-secure span {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .cel-layout {
      gap: 28px;
      padding: 38px 0 22px;
    }

    .cel-copy h1 {
      margin-top: 15px;
      font-size: clamp(2.65rem, 14vw, 4rem);
      line-height: 0.99;
    }

    .cel-copy > p:last-child {
      margin-top: 15px;
      font-size: 0.92rem;
      line-height: 1.58;
    }

    .cel-card {
      padding: 34px 18px 24px;
      border-radius: 24px;
    }

    .cel-window-dots {
      top: 16px;
      right: 17px;
    }

    .cel-card-heading {
      gap: 11px;
      margin-bottom: 18px;
      padding-right: 54px;
    }

    .cel-card-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
    }

    .cel-card-heading h2,
    .cel-modal-card h3 {
      font-size: 1.24rem;
    }

    .cel-input-wrap input,
    .cel-primary-button,
    .cel-secondary-button {
      min-height: 50px;
    }

    .cel-modal-card {
      padding: 25px 18px;
      border-radius: 22px;
    }

    .cel-form-row {
      grid-template-columns: 1fr;
    }

    .cel-orb,
    .cel-mesh {
      opacity: 0.38;
    }
  }

  @media (max-width: 350px) {
    .cel-brand small {
      display: none;
    }

    .cel-copy h1 {
      font-size: 2.5rem;
    }

    .cel-card {
      padding-left: 15px;
      padding-right: 15px;
    }
  }

  @media (max-height: 680px) and (min-width: 901px) {
    .cel-layout {
      padding-top: 28px;
      padding-bottom: 22px;
    }

    .cel-copy h1 {
      font-size: clamp(3rem, 5vw, 4.7rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cel-spin {
      animation: none;
    }

    .cel-primary-button,
    .cel-secondary-button,
    .cel-eye-button,
    .cel-input-wrap input {
      transition: none;
    }
  }
`;

export default CompanyEmployeeLogin;






