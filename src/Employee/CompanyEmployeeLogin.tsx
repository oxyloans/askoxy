import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  ShieldCheck,
  User,
} from 'lucide-react';

const API_BASE_URL = 'https://meta.oxyloans.com/api';
const EMPLOYEE_DASHBOARD_ROUTE = '/employeedashboard';

interface LoginFormState {
  identifier: string;
  password: string;
}

interface EmployeeData {
  id: string;
  name: string;
  companyEmailId: string;
  companyName: string;
  personRole: string;
  mustResetPassword: boolean;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T | null;
}

type LoginFeedbackType = 'invalid' | 'pending' | 'rejected' | 'server';

interface LoginFeedback {
  type: LoginFeedbackType;
  title: string;
  message: string;
}

interface EmployeeLoginProps {
  onLoginSuccess?: (employee: EmployeeData) => void;
}

const getLoginFeedback = (
  httpStatus: number,
  apiMessage?: string
): LoginFeedback => {
  const message = apiMessage?.trim() || '';
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes('rejected') ||
    normalizedMessage.includes('access has been rejected')
  ) {
    return {
      type: 'rejected',
      title: 'Access Rejected',
      message: message || 'Please contact your administrator for assistance.',
    };
  }

  if (
    httpStatus === 403 ||
    normalizedMessage.includes('pending') ||
    normalizedMessage.includes('approval') ||
    normalizedMessage.includes('created')
  ) {
    return {
      type: 'pending',
      title: 'Admin Approval Pending',
      message: 'Your account is waiting for administrator approval.',
    };
  }

  if (
    httpStatus === 401 ||
    normalizedMessage.includes('invalid email') ||
    normalizedMessage.includes('invalid password')
  ) {
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

const CompanyEmployeeLogin: React.FC<EmployeeLoginProps> = ({
  onLoginSuccess,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormState>({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<LoginFeedback | null>(null);
  const [pendingEmployee, setPendingEmployee] = useState<EmployeeData | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [successEmployee, setSuccessEmployee] = useState<EmployeeData | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof LoginFormState
  ) => {
    setFormData((previous) => ({ ...previous, [field]: event.target.value }));
    setLoginFeedback(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing-service/campgin/company-login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyEmailId: formData.identifier.trim(),
            password: formData.password,
          }),
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as ApiResponse<EmployeeData> | null;

      if (!response.ok || !result?.status || !result.data) {
        setLoginFeedback(getLoginFeedback(response.status, result?.message));
        setFormData((previous) => ({ ...previous, password: '' }));
        setShowPassword(false);
        return;
      }

      if (result.data.mustResetPassword) {
        setPendingEmployee(result.data);
        setShowResetModal(true);
      } else {
        setSuccessEmployee(result.data);
      }
    } catch {
      setLoginFeedback(getLoginFeedback(0));
      setFormData((previous) => ({ ...previous, password: '' }));
      setShowPassword(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetSuccess = (employee: EmployeeData) => {
    setShowResetModal(false);
    setPendingEmployee(null);
    onLoginSuccess?.(employee);
    navigate(EMPLOYEE_DASHBOARD_ROUTE);
  };

  const handleContinueAfterSuccess = () => {
    if (successEmployee) {
      onLoginSuccess?.(successEmployee);
    }

    setSuccessEmployee(null);
    navigate(EMPLOYEE_DASHBOARD_ROUTE);
  };

  const resetLogin = () => {
    setLoginFeedback(null);
    setFormData({ identifier: '', password: '' });
    setShowPassword(false);
  };

  const isPending = loginFeedback?.type === 'pending';

  return (
    <main className="cel-page">
      <style>{loginStyles}</style>

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

          <div className={`cel-card ${isPending ? 'cel-card-pending' : ''}`}>
            <div className="cel-window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            {isPending ? (
              <section className="cel-pending" role="status" aria-live="polite">
                <span className="cel-pending-icon" aria-hidden="true">
                  <Clock3 />
                </span>
                <p>Account Status</p>
                <h2>
                  ADMIN APPROVAL
                  <strong>PENDING</strong>
                </h2>
                <span className="cel-pending-message">
                  Your account is waiting for administrator approval.
                </span>
                {formData.identifier && (
                  <small className="cel-pending-email">{formData.identifier}</small>
                )}
                <button type="button" onClick={resetLogin} className="cel-secondary-button">
                  Try Another Account
                </button>
              </section>
            ) : (
              <>
                <div className="cel-card-heading">
                  <span className="cel-card-icon" aria-hidden="true">
                    <User />
                  </span>
                  <div>
                    <p>Welcome Back</p>
                    <h2>Employee Login</h2>
                  </div>
                </div>

                <form className="cel-form" onSubmit={handleSubmit} noValidate>
                  <label htmlFor="company-email">Company Email</label>
                  <div className="cel-input-wrap">
                    <User />
                    <input
                      id="company-email"
                      type="email"
                      inputMode="email"
                      autoComplete="username"
                      placeholder="name@company.com"
                      value={formData.identifier}
                      onChange={(event) => handleChange(event, 'identifier')}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <label htmlFor="company-password">Password</label>
                  <div className="cel-input-wrap">
                    <Lock />
                    <input
                      id="company-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(event) => handleChange(event, 'password')}
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

                  {loginFeedback && (
                    <div
                      className={`cel-feedback cel-feedback-${loginFeedback.type}`}
                      role="alert"
                    >
                      <AlertCircle />
                      <span>
                        <strong>{loginFeedback.title}</strong>
                        <small>{loginFeedback.message}</small>
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="cel-primary-button"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                    {isSubmitting ? <LoaderCircle className="cel-spin" /> : <ArrowRight />}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>

      {showResetModal && pendingEmployee && (
        <ChangePasswordModal
          employee={pendingEmployee}
          onSuccess={handlePasswordResetSuccess}
        />
      )}

      {successEmployee && (
        <LoginSuccessModal
          employee={successEmployee}
          onContinue={handleContinueAfterSuccess}
        />
      )}
    </main>
  );
};

interface LoginSuccessModalProps {
  employee: EmployeeData;
  onContinue: () => void;
}

const LoginSuccessModal: React.FC<LoginSuccessModalProps> = ({
  employee,
  onContinue,
}) => {
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

interface ChangePasswordModalProps {
  employee: EmployeeData;
  onSuccess: (employee: EmployeeData) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  employee,
  onSuccess,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword === oldPassword) {
      setError('Choose a password different from your current password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/marketing-service/campgin/company-change-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: employee.id,
            oldPassword,
            newPassword,
          }),
        }
      );

      const result = (await response.json()) as ApiResponse<EmployeeData>;

      if (!response.ok || !result.status || !result.data) {
        setError(result.message || 'Unable to update password.');
        return;
      }

      onSuccess(result.data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cel-modal" role="dialog" aria-modal="true">
      <div className="cel-modal-card">
        <span className="cel-card-icon" aria-hidden="true">
          <ShieldCheck />
        </span>
        <h3>Update Password</h3>
        <p>Create a new password to continue.</p>

        <form className="cel-form" onSubmit={handleSubmit}>
          <PasswordInput
            id="current-password"
            label="Current Password"
            value={oldPassword}
            onChange={setOldPassword}
            visible={showPasswords}
          />
          <PasswordInput
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showPasswords}
          />
          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showPasswords}
          />

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

          <button
            type="submit"
            className="cel-primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
            {isSubmitting ? <LoaderCircle className="cel-spin" /> : <ArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
};

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  visible,
}) => (
  <>
    <label htmlFor={id}>{label}</label>
    <div className="cel-input-wrap">
      <Lock />
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={id === 'current-password' ? 'current-password' : 'new-password'}
        required
      />
    </div>
  </>
);

const loginStyles = `
  html,
  body,
  #root {
    width: 100%;
    min-width: 0;
    min-height: 100%;
    margin: 0;
    background: #030612;
  }

  body {
    overflow-x: hidden;
  }

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
    min-height: 100vh;
    min-height: 100svh;
    min-height: 100dvh;
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
  .cel-card-icon,
  .cel-pending-icon {
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
  .cel-card-heading p,
  .cel-pending > p {
    margin: 0;
    color: #b7c0ff;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
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

  .cel-card-pending {
    padding: 0;
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

  .cel-card-heading h2,
  .cel-modal-card h3 {
    margin: 5px 0 0;
    color: #ffffff;
    font-size: 1.36rem;
    line-height: 1.2;
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

  .cel-feedback-invalid,
  .cel-feedback-rejected {
    color: #ffbac8;
    border-color: rgba(251, 113, 133, 0.30);
    background: linear-gradient(145deg, rgba(136, 28, 58, 0.25), rgba(85, 18, 43, 0.18));
  }

  .cel-feedback-server {
    color: #ffd28a;
    border-color: rgba(245, 158, 11, 0.30);
    background: linear-gradient(145deg, rgba(145, 89, 14, 0.24), rgba(88, 53, 10, 0.16));
  }

  .cel-feedback-pending {
    color: #b8efff;
    border-color: rgba(76, 201, 240, 0.30);
    background: linear-gradient(145deg, rgba(24, 105, 143, 0.24), rgba(37, 44, 103, 0.20));
  }

  .cel-pending {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: clamp(420px, 60svh, 520px);
    padding: clamp(38px, 6vw, 54px) clamp(18px, 4vw, 34px);
    text-align: center;
  }

  .cel-pending-icon {
    width: 76px;
    height: 76px;
    margin-bottom: 20px;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 25px;
    background: linear-gradient(145deg, #536dfe 0%, #845dff 56%, #c950f3 100%);
    box-shadow:
      0 20px 48px rgba(98, 101, 245, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.26);
  }

  .cel-pending-icon svg {
    width: 32px;
    height: 32px;
  }

  .cel-pending h2 {
    margin: 18px 0 0;
    color: #ffffff;
    font-size: clamp(2.25rem, 4.6vw, 4rem);
    font-weight: 850;
    line-height: 0.94;
    letter-spacing: -0.055em;
  }

  .cel-pending h2 strong {
    display: block;
    padding-bottom: 0.05em;
    color: transparent;
    font-weight: inherit;
    background: linear-gradient(105deg, #8ff1ff 0%, #9a86ff 38%, #ff7bd7 70%, #ffd370 100%);
    -webkit-background-clip: text;
    background-clip: text;
    filter:
      drop-shadow(0 4px 0 rgba(56, 43, 139, 0.46))
      drop-shadow(0 16px 30px rgba(116, 75, 255, 0.28));
  }

  .cel-pending-message {
    max-width: 350px;
    margin-top: 18px;
    color: rgba(235, 239, 255, 0.70);
    font-size: 0.94rem;
    line-height: 1.62;
  }

  .cel-pending-email {
    display: block;
    max-width: 100%;
    margin-top: 14px;
    padding: 8px 13px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.76);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.055);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cel-secondary-button {
    margin-top: 24px;
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
    padding: 31px;
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

  .cel-modal-card > p {
    margin: 8px 0 0;
    color: rgba(235, 239, 255, 0.66);
    line-height: 1.55;
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

    .cel-card-pending {
      padding: 0;
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

    .cel-pending {
      min-height: 430px;
      padding: 38px 18px;
    }

    .cel-pending h2 {
      font-size: clamp(2rem, 11vw, 3.1rem);
    }

    .cel-modal-card {
      padding: 25px 18px;
      border-radius: 22px;
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

    .cel-card-pending {
      padding: 0;
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

    .cel-pending {
      min-height: 390px;
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
