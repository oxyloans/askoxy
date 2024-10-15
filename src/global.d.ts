// src/global.d.ts

export {}; // Makes sure the file is treated as a module.

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
