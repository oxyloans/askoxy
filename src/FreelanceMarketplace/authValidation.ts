import type { Rule } from "antd/es/form";

export const emailRules: Rule[] = [
  { required: true, message: "Please enter your email address" },
  { type: "email", message: "Please enter a valid email address" },
  { whitespace: true, message: "Email cannot be empty spaces" },
  { max: 100, message: "Email must be 100 characters or less" },
];

export const loginPasswordRules: Rule[] = [
  { required: true, message: "Please enter your password" },
  { min: 6, message: "Password must be at least 6 characters" },
  { max: 16, message: "Password must be 16 characters or less" },
];

export const registerPasswordRules: Rule[] = [
  { required: true, message: "Please create a password" },
  { min: 8, message: "Password must be at least 8 characters" },
  { max: 16, message: "Password must be 16 characters or less" },
  {
    pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
    message: "Include at least one number and special character (!@#$%^&*)",
  },
];

export const otpRules: Rule[] = [
  { required: true, message: "Please enter the 6-digit OTP" },
  { len: 6, message: "OTP must be exactly 6 digits" },
  { pattern: /^\d{6}$/, message: "OTP must contain numbers only" },
];

export const nameRules: Rule[] = [
  { required: true, message: "Please enter your name" },
  { min: 2, message: "Name must be at least 2 characters" },
  { max: 50, message: "Name must be 50 characters or less" },
  { whitespace: true, message: "Name cannot be empty spaces" },
  {
    pattern: /^[a-zA-Z\s.'-]+$/,
    message: "Name can only contain letters and basic punctuation",
  },
];

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();
