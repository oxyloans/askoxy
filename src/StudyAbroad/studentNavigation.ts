import type { NavigateFunction } from "react-router-dom";

export const navigateToStudentArea = (navigate: NavigateFunction) => {
  const userId =
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    sessionStorage.getItem("user_id");

  if (userId) {
    navigate("/student-dashboard");
    return;
  }

  sessionStorage.setItem("redirectPath", "/student-dashboard");
  sessionStorage.setItem("primaryType", "STUDENT");
  navigate("/whatsappregister?primaryType=STUDENT");
};
