export const validators = {
  name: (v) => (v.trim().length < 2 ? "Please enter your full name." : ""),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."),
  loginPassword: (v) => (v ? "" : "Enter your password."),
  newPassword: (v) => (v.length < 8 ? "Use at least 8 characters." : ""),
  terms: (v) => (v ? "" : "Please accept the terms to continue."),
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export function passwordScore(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.max(s, 1);
}
