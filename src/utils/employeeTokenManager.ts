

export const setEmployeePreviousPath = (path: string): void => {
  if (path && !path.includes('/employee-login') && !path.includes('/employee-register')) {
    sessionStorage.setItem('employee_previous_path', path);
  }
};

export const getEmployeePreviousPath = (): string | null => {
  return sessionStorage.getItem('employee_previous_path');
};

export const clearEmployeePreviousPath = (): void => {
  sessionStorage.removeItem('employee_previous_path');
};

export const clearEmployeeSession = (): void => {
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('Name');
  sessionStorage.removeItem('primaryType');
  // DO NOT remove employee_previous_path - it needs to persist for redirect after re-login
};
