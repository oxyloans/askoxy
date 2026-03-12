// Disable right-click context menu
export const disableContextMenu = () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
};

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
export const disableDevToolsShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
    
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
  });
};

// Detect if DevTools is open
export const detectDevTools = () => {
  const threshold = 160;
  let devtoolsOpen = false;

  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:24px;color:red;">Developer tools are not allowed!</div>';
      }
    } else {
      devtoolsOpen = false;
    }
  };

  setInterval(checkDevTools, 1000);
};

// Disable console methods
export const disableConsole = () => {
  if (process.env.NODE_ENV === 'production') {
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;
  }
};

// Clear console periodically
export const clearConsole = () => {
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      console.clear();
    }, 1000);
  }
};

// Initialize all security measures
export const initializeSecurity = () => {
  disableContextMenu();
  disableDevToolsShortcuts();
  detectDevTools();
  disableConsole();
  clearConsole();
};
