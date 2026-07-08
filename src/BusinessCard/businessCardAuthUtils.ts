import Swal from "sweetalert2";

const toastDefaults = {
  toast: true,
  position: "top-end" as const,
  showConfirmButton: false,
  timerProgressBar: true,
};

export const showAuthSuccess = (title: string, timer = 2000) =>
  Swal.fire({
    ...toastDefaults,
    icon: "success",
    title,
    timer,
  });

export const showAuthError = (title: string, timer = 4000) =>
  Swal.fire({
    ...toastDefaults,
    icon: "error",
    title,
    timer,
  });

export const showAuthWarning = (title: string, timer = 3500) =>
  Swal.fire({
    ...toastDefaults,
    icon: "warning",
    title,
    timer,
  });

export const showAuthInfo = (title: string, timer = 3000) =>
  Swal.fire({
    ...toastDefaults,
    icon: "info",
    title,
    timer,
  });
