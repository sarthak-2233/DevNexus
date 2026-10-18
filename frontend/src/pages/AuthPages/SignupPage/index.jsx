import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Checkbox, Divider, Input, PasswordInput, SocialButtons } from "@/components";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import PasswordStrength from "../components/PasswordStrength";
import { hasErrors, validators } from "../validators";

export default function SignupPage() {
  const { user, signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", terms: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/builder" replace />;

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {
      name: validators.name(form.name), email: validators.email(form.email),
      password: validators.newPassword(form.password), terms: validators.terms(form.terms),
    };
    setErrors(errs); setFormError("");
    if (hasErrors(errs)) return;
    setLoading(true);
    try { await signup(form); } catch (err) { setFormError(err.message); } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start building websites with a team of agents."
      footer={<>Already have an account? <Link to="/login" className="text-gold hover:underline">Log in</Link></>}>
      <SocialButtons />
      <Divider>or sign up with email</Divider>
      <form onSubmit={submit} noValidate>
        <Input label="Full name" autoComplete="name" placeholder="Ada Lovelace"
          value={form.name} onChange={set("name")} error={errors.name} />
        <Input label="Email" type="email" autoComplete="email" placeholder="you@company.com"
          value={form.email} onChange={set("email")} error={errors.email} />
        <PasswordInput label="Password" autoComplete="new-password" placeholder="At least 8 characters"
          value={form.password} onChange={set("password")} error={errors.password} />
        <PasswordStrength password={form.password} />
        <Checkbox className="mb-5" checked={form.terms} onChange={set("terms")} error={errors.terms}>
          I agree to the <a href="#" className="text-gold hover:underline">Terms</a> and <a href="#" className="text-gold hover:underline">Privacy Policy</a>.
        </Checkbox>
        {formError && <p role="alert" className="mb-3 text-sm text-[#ff8a7a]">{formError}</p>}
        <Button type="submit" className="w-full !py-3.5" disabled={loading}>
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />}
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
