import Swal from 'sweetalert2';

/**
 * Sanitizes and validates contact number input in real time as the user types.
 * Warns immediately if the user attempts to enter alphabets or special characters.
 * Returns { value, error, isValid, helperText }
 */
export const handleContactNumberChange = (rawInput = '') => {
  const hasNonNumeric = /[^0-9]/.test(rawInput);
  const numericVal = rawInput.replace(/\D/g, '').slice(0, 10);

  let error = '';
  let helperText = '';
  let isValid = false;

  if (hasNonNumeric) {
    error = 'Only numbers (0-9) are allowed! Alphabets, spaces, and special symbols cannot be entered.';
  } else if (numericVal.length === 0) {
    error = 'Contact number is required. Please enter a 10-digit numeric mobile number.';
  } else if (numericVal.length < 10) {
    error = `Only ${numericVal.length} of 10 digits entered. Please enter ${10 - numericVal.length} more numeric digit(s).`;
    helperText = `${numericVal.length}/10 digits entered`;
  } else if (numericVal.length === 10) {
    error = '';
    isValid = true;
    helperText = '✓ Valid 10-digit mobile number';
  }

  return {
    value: numericVal,
    error,
    isValid,
    helperText,
  };
};

/**
 * Validates visit form data for Add Visit and Edit Visit.
 * Explains WHY validation failed and WHAT TO DO / WHAT TO ADD to fix it.
 */
export const validateVisitForm = (formData, actionName = 'Add') => {
  const errors = {};
  const errorDetails = [];
  const actionWord = actionName.toLowerCase(); // 'add' or 'edit' / 'update'

  // 1. Visit Name
  const name = (formData?.name || '').trim();
  if (!name) {
    const errorMsg = 'Visit name is required. Please enter the name of the store or client visited.';
    errors.name = errorMsg;
    errorDetails.push({
      field: 'Visit Name',
      why: `Visit name is blank. The visit cannot be ${actionWord}ed without a visit name.`,
      action: 'What to add: Please enter the name of the store, business, or person you visited (e.g. "Sri Sai Book Stores").',
    });
  }

  // 2. Location
  const location = (formData?.location || '').trim();
  if (!location) {
    const errorMsg = 'Location is required. Please capture GPS or enter a Google Maps link.';
    errors.location = errorMsg;
    errorDetails.push({
      field: 'Location',
      why: `Location coordinate or map link is missing. Location is mandatory to record where the visit took place.`,
      action: 'What to add: Click the "Current Location" button to auto-detect GPS coordinates, or paste a Google Maps link/address.',
    });
  }

  // 3. Contact Number (strictly 10 digits numeric)
  const contact = (formData?.contactNumber || '').trim();
  if (!contact) {
    const errorMsg = 'Contact number is required. Please enter a 10-digit mobile number (0-9 only).';
    errors.contactNumber = errorMsg;
    errorDetails.push({
      field: 'Contact Number',
      why: `Contact number is empty. A valid 10-digit mobile number is required to save the visit.`,
      action: 'What to add: Enter only numbers (0-9). Please enter a valid 10-digit mobile number (e.g. 9876543210). Alphabets and special characters are not allowed.',
    });
  } else if (/[^0-9]/.test(contact)) {
    const errorMsg = 'Alphabets and symbols are not allowed! Please enter numeric digits (0-9) only.';
    errors.contactNumber = errorMsg;
    errorDetails.push({
      field: 'Contact Number',
      why: `Contact number contains non-numeric characters: "${contact}". Mobile numbers must contain only digits (0-9).`,
      action: 'What to add: Remove all alphabets, spaces, and symbols. Enter only 10 numeric digits (e.g. 9876543210).',
    });
  } else if (contact.length !== 10) {
    const errorMsg = `Must be exactly 10 numeric digits. Currently ${contact.length} digit(s) entered.`;
    errors.contactNumber = errorMsg;
    const diff = 10 - contact.length;
    errorDetails.push({
      field: 'Contact Number',
      why: `You entered ${contact.length} digit(s): "${contact}". A valid mobile number must have exactly 10 numeric digits.`,
      action: diff > 0
        ? `What to add: Enter only numbers (0-9). Please enter ${diff} more numeric digit(s) to complete 10 digits (e.g. 9876543210).`
        : `What to add: Remove extra digits. Ensure the number has exactly 10 digits without country code (+91).`,
    });
  }

  // 4. Description
  const description = (formData?.description || '').trim();
  if (!description) {
    const errorMsg = 'Description is required. Please provide notes about the visit.';
    errors.description = errorMsg;
    errorDetails.push({
      field: 'Description',
      why: `Description is blank. You must provide details about what was discussed or done during this visit.`,
      action: 'What to add: Enter brief notes or a summary explaining the visit outcome, store requirements, or client feedback.',
    });
  }

  // 5. Web Link (optional, but if present must be valid URL)
  const webLink = (formData?.webLink || '').trim();
  if (webLink && !/^https?:\/\/.+/i.test(webLink)) {
    const errorMsg = 'Must be a valid web link starting with http:// or https://';
    errors.webLink = errorMsg;
    errorDetails.push({
      field: 'Web Link',
      why: `The URL "${webLink}" is not valid. Web addresses must begin with http:// or https://.`,
      action: 'What to add: Enter a full web address starting with "https://" (e.g. "https://example.com") or clear this field if not applicable.',
    });
  }

  // 6. Image (optional, but if present must be PNG, JPG, JPEG, or IMG)
  if (formData?.image) {
    const file = formData.image;
    const fileName = file.name || '';
    const fileType = file.type || '';
    const isAllowed =
      fileType === 'image/png' ||
      fileType === 'image/jpeg' ||
      fileType === 'image/jpg' ||
      /\.(png|jpe?g|img)$/i.test(fileName);

    if (!isAllowed) {
      const errorMsg = 'Only PNG, JPG, or JPEG image files are allowed';
      errors.image = errorMsg;
      errorDetails.push({
        field: 'Image',
        why: `File "${fileName || 'uploaded'}" (${fileType || 'unknown format'}) is not supported by the system.`,
        action: 'What to add: Please upload a photo in PNG, JPG, or JPEG format only.',
      });
    }
  }

  return {
    isValid: errorDetails.length === 0,
    errors,
    errorDetails,
  };
};

/**
 * Displays a detailed popup listing all validation failures with WHY and WHAT TO DO.
 */
export const showValidationErrorsPopup = (errorDetails, actionName = 'Add') => {
  const isAdd = actionName.toLowerCase().includes('add');
  const actionWord = isAdd ? 'Add' : 'Update';
  const actionPast = isAdd ? 'added' : 'updated';

  const listHtml = errorDetails
    .map(
      (err, idx) => `
        <div style="text-align: left; margin-bottom: 12px; padding: 12px 14px; background: #fff1f2; border-left: 5px solid #ef4444; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
          <div style="font-weight: 700; color: #991b1b; font-size: 14px; display: flex; align-items: center; gap: 6px;">
            <span>❌</span> <span>${idx + 1}. ${err.field}</span>
          </div>
          <div style="font-size: 13px; color: #374151; margin-top: 5px; line-height: 1.45;">
            <strong style="color: #b91c1c;">Why it cannot be ${actionPast}:</strong> ${err.why}
          </div>
          <div style="font-size: 13px; color: #1e3a8a; margin-top: 5px; line-height: 1.45; background: #eff6ff; padding: 6px 10px; border-radius: 4px; border: 1px solid #bfdbfe;">
            <strong style="color: #1d4ed8;">${err.action.startsWith('What to add') ? '' : 'What to add: '}</strong>${err.action}
          </div>
        </div>
      `
    )
    .join('');

  Swal.fire({
    icon: 'error',
    title: `<span style="color: #dc2626; font-size: 21px; font-weight: bold;">Cannot ${actionWord} Visit — Validation Error</span>`,
    html: `
      <p style="font-size: 14px; color: #4b5563; margin-bottom: 14px; text-align: left; line-height: 1.4;">
        The visit could not be <strong>${actionPast}</strong> because <strong>${errorDetails.length}</strong> required field(s) have errors. Please check the reasons and instructions below:
      </p>
      <div style="max-height: 340px; overflow-y: auto; padding-right: 4px;">
        ${listHtml}
      </div>
    `,
    confirmButtonText: 'Fix Required Fields',
    confirmButtonColor: '#dc2626',
    customClass: {
      popup: 'swal2-border-radius-xl',
    },
  });
};

/**
 * Displays a detailed popup when the API/backend call fails, explaining WHY and WHAT TO DO.
 */
export const showBackendErrorPopup = (error, actionName = 'Add') => {
  const isAdd = actionName.toLowerCase().includes('add');
  const actionWord = isAdd ? 'Add' : 'Update';
  const actionPast = isAdd ? 'added' : 'updated';
  let why = '';
  let whatToDo = 'Please check your information and try again.';

  if (!navigator.onLine) {
    why = 'You are currently offline or lost your internet connection.';
    whatToDo = 'Please check your Wi-Fi or mobile data connection, then try submitting again.';
  } else if (error?.code === 'ECONNABORTED' || error?.message?.toLowerCase().includes('timeout')) {
    why = 'The server took too long to respond (connection timeout).';
    whatToDo = 'Please check your internet speed and try again in a few moments.';
  } else if (!error?.response) {
    why = error?.message || 'Cannot reach the backend server (Network or CORS error).';
    whatToDo = 'Please verify that the server is online and reachable, then try again.';
  } else {
    const status = error.response.status;
    const data = error.response.data;

    let serverMsg = '';
    if (typeof data === 'string') {
      serverMsg = data;
    } else if (data) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        serverMsg = data.errors.map((e) => e.defaultMessage || e.message || String(e)).join(', ');
      } else if (typeof data.errors === 'object' && data.errors !== null) {
        serverMsg = Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join(', ');
      } else {
        serverMsg = data.errorMessage || data.error || data.message || data.status || '';
      }
    }

    if (status === 400) {
      why = serverMsg
        ? `The server rejected the visit: "${serverMsg}"`
        : 'The request contains invalid or incomplete fields.';
      whatToDo = 'Please ensure the contact number has exactly 10 digits (0-9 only), verify the image format, and retry.';
    } else if (status === 401) {
      why = 'Your login session has expired or authentication token is missing.';
      whatToDo = 'Please log out and log back in, then re-submit the visit.';
    } else if (status === 403) {
      why = 'You do not have permission to perform this action.';
      whatToDo = 'Please check your user role permissions or contact your system administrator.';
    } else if (status === 404) {
      why = serverMsg ? `Not found: "${serverMsg}"` : 'The category, visit, or API endpoint was not found on the server.';
      whatToDo = 'Please refresh the page and verify that the category/visit still exists.';
    } else if (status === 413) {
      why = 'The uploaded image file size exceeds the server limit.';
      whatToDo = 'Please select a smaller image file (under 5MB) and try again.';
    } else if (status >= 500) {
      why = serverMsg
        ? `Internal Server Error: "${serverMsg}"`
        : `The server encountered an unexpected error (HTTP ${status}).`;
      whatToDo = 'Please wait a moment and try again. If the issue continues, contact technical support.';
    } else {
      why = serverMsg || `Request failed with HTTP status code ${status}.`;
      whatToDo = 'Please review your inputs and try again.';
    }
  }

  Swal.fire({
    icon: 'error',
    title: `<span style="color: #dc2626; font-size: 21px; font-weight: bold;">Cannot ${actionWord} Visit — Server Error</span>`,
    html: `
      <div style="text-align: left; padding: 14px; background: #fff1f2; border-left: 5px solid #ef4444; border-radius: 8px; margin-top: 8px;">
        <div style="font-size: 14px; color: #991b1b; margin-bottom: 8px; line-height: 1.45;">
          <strong>Why it was not ${actionPast}:</strong> ${why}
        </div>
        <div style="font-size: 13px; color: #1e3a8a; line-height: 1.45; background: #eff6ff; padding: 8px 10px; border-radius: 4px; border: 1px solid #bfdbfe;">
          <strong style="color: #1d4ed8;">What to do:</strong> ${whatToDo}
        </div>
      </div>
    `,
    confirmButtonText: 'OK',
    confirmButtonColor: '#dc2626',
  });
};

/**
 * Displays a popup when an uploaded image is invalid in beforeUpload.
 */
export const showInvalidImagePopup = (file) => {
  Swal.fire({
    icon: 'error',
    title: '<span style="color: #dc2626; font-size: 20px; font-weight: bold;">Invalid Image Format</span>',
    html: `
      <div style="text-align: left; padding: 12px 14px; background: #fff1f2; border-left: 4px solid #ef4444; border-radius: 6px; margin-top: 8px;">
        <div style="font-size: 14px; color: #991b1b; margin-bottom: 6px; line-height: 1.4;">
          <strong>Why:</strong> The file <em>"${file?.name || 'file'}"</em> is not an allowed image format (${file?.type || 'unknown type'}).
        </div>
        <div style="font-size: 13px; color: #1e3a8a; line-height: 1.4;">
          <strong>What to do:</strong> Please select an image with <strong>.png</strong>, <strong>.jpg</strong>, or <strong>.jpeg</strong> extension only.
        </div>
      </div>
    `,
    confirmButtonText: 'Choose Another File',
    confirmButtonColor: '#dc2626',
  });
};

/**
 * Parses a backend timestamp (which is in UTC) into a local Date object.
 * Correctly converts UTC timestamps like "2026-11-02 06:23:24" to client system time (e.g. 11:53 AM IST).
 */
export const parseVisitDate = (dateVal) => {
  if (!dateVal) return null;
  try {
    if (dateVal instanceof Date && !isNaN(dateVal.getTime())) return dateVal;
    if (typeof dateVal === 'number' || (/^\d{10,13}$/).test(String(dateVal).trim())) {
      const num = Number(dateVal);
      const d = new Date(num > 1e11 ? num : num * 1000);
      return !isNaN(d.getTime()) ? d : null;
    }
    const str = String(dateVal).trim();
    if (!str) return null;

    // Has explicit timezone (+05:30, +00:00, Z)
    if (/([+-]\d{2}:?\d{2}|Z)$/i.test(str)) {
      const d = new Date(str);
      if (!isNaN(d.getTime())) return d;
    }

    // Matches 'YYYY-MM-DD HH:mm:ss' or 'YYYY-MM-DDTHH:mm:ss' (Server saves UTC)
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?$/);
    if (match) {
      const [, y, m, d, h, min, s] = match;
      const dt = new Date(Date.UTC(+y, +m - 1, +d, +h, +min, +s));
      if (!isNaN(dt.getTime())) return dt;
    }

    // Matches 'YYYY-MM-DD'
    const matchDate = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (matchDate) {
      const [, y, m, d] = matchDate;
      const dt = new Date(+y, +m - 1, +d);
      if (!isNaN(dt.getTime())) return dt;
    }

    const fallback = new Date(str);
    return !isNaN(fallback.getTime()) ? fallback : null;
  } catch {
    return null;
  }
};

/**
 * Formats a visit date and time into local system date and time strings.
 * e.g. "02/11/2026 11:53 am" or "02/11/2026\n11:53 am"
 */
export const formatVisitDateTime = (dateVal, multiLine = false) => {
  const dt = parseVisitDate(dateVal);
  if (!dt) return '-';
  const dateStr = dt.toLocaleDateString();
  const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  return multiLine ? `${dateStr}\n${timeStr}` : `${dateStr} ${timeStr}`;
};

/**
 * Determines whether a visit timestamp belongs to "today" according to the user's local system calendar.
 */
export const isToday = (dateVal) => {
  if (!dateVal) return false;
  try {
    const dt = parseVisitDate(dateVal);
    const now = new Date();
    if (dt && !isNaN(dt.getTime())) {
      if (
        dt.getFullYear() === now.getFullYear() &&
        dt.getMonth() === now.getMonth() &&
        dt.getDate() === now.getDate()
      ) {
        return true;
      }
    }

    // Secondary fallback for strings matching YYYY-MM-DD
    const str = String(dateVal).trim();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const curDate = now.getDate();
    const yyyy = String(curYear);
    const mm = String(curMonth + 1).padStart(2, '0');
    const dd = String(curDate).padStart(2, '0');
    const todayISO = `${yyyy}-${mm}-${dd}`;
    const todayDMY_dash = `${dd}-${mm}-${yyyy}`;
    const todayDMY_slash = `${dd}/${mm}/${yyyy}`;

    if (str.startsWith(todayISO) || str.startsWith(todayDMY_dash) || str.startsWith(todayDMY_slash)) {
      return true;
    }
    const datePart = str.split(/[ T]/)[0];
    if (datePart === todayISO || datePart === todayDMY_dash || datePart === todayDMY_slash) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

