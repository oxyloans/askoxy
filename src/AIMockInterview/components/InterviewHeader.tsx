import logo from "../../assets/img/askoxylogonew.png";

interface InterviewHeaderProps {
  theme: "light" | "dark";
  user: { id: string; name: string } | null;
  onToggleTheme: () => void;
}

export function InterviewHeader({ theme, user, onToggleTheme }: InterviewHeaderProps) {
  return (
    <header className="ai-header">
      <div className="ai-header-inner">
        <div className="ai-logo-group">
          <img src={logo} alt="AskOxy" style={{ height: 30, objectFit: "contain", width: "auto" }} />
          <div className="ai-logo-divider" />
          <div className="ai-header-label">
            <div className="ai-header-title">AI Interview</div>
            <div className="ai-header-sub">Technical Assessment Platform</div>
          </div>
        </div>
        <div className="ai-header-actions">
          <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </button>
          {user && (
            <div className="ai-user-chip">
              <div className="ai-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="ai-user-name">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
