/**
 * Safely resolves current logged in user details from all possible storage locations
 */
export const getCurrentUser = () => {
  let user = {};
  try {
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (rawUser) {
      user = JSON.parse(rawUser) || {};
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  const id =
    user.id ||
    user.userId ||
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("admin_userId") ||
    "";

  const name =
    user.name ||
    user.userName ||
    user.firstName ||
    localStorage.getItem("userName") ||
    sessionStorage.getItem("userName") ||
    sessionStorage.getItem("Name") ||
    localStorage.getItem("name") ||
    localStorage.getItem("admin_userName") ||
    "";

  return {
    id,
    name,
    userId: id,
    userName: name,
    primaryType: user.primaryType || localStorage.getItem("primaryType") || "",
    email: user.email || localStorage.getItem("savedEmail") || "",
  };
};

export const setCurrentUser = (userData) => {
  if (!userData) return;
  const user = {
    id: userData.id || userData.userId || "",
    userId: userData.id || userData.userId || "",
    name: userData.name || userData.userName || "",
    userName: userData.name || userData.userName || "",
    primaryType: userData.primaryType || "",
    email: userData.email || "",
  };
  try {
    localStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    // Ignore
  }
  if (user.id) {
    localStorage.setItem("userId", user.id);
  }
  if (user.name) {
    localStorage.setItem("userName", user.name);
    sessionStorage.setItem("userName", user.name);
    sessionStorage.setItem("Name", user.name);
  }
};

