import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button, Checkbox, Divider, Input, PasswordInput, SocialButtons } from "@/components";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { hasErrors, validators } from "../validators";

export default function LoginPage() {
  const { user, login } = useAuth();
  const from = useLocation().state?.from || "/builder";
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = { email: validators.email(form.email), password: validators.loginPassword(form.password) };
    setErrors(errs); setFormError("");
    if (hasErrors(errs)) return;
    setLoading(true);
    try { await login(form); } catch (err) { setFormError(err.message); } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue building with your agents."
      footer={<>New to Dev Nexus? <Link to="/signup" className="text-gold hover:underline">Create an account</Link></>}>
      <SocialButtons />
      <Divider>or continue with email</Divider>
      <form onSubmit={submit} noValidate>
        <Input label="Email" type="email" autoComplete="email" placeholder="you@company.com"
          value={form.email} onChange={set("email")} error={errors.email} />
        <PasswordInput label="Password" autoComplete="current-password" placeholder="Your password"
          value={form.password} onChange={set("password")} error={errors.password} />
        <div className="-mt-0.5 mb-5 flex items-center justify-between gap-3 text-[.9rem]">
          <Checkbox checked={form.remember} onChange={set("remember")}>Remember me</Checkbox>
          <a href="#" className="text-gold hover:underline">Forgot password?</a>
        </div>
        {formError && <p role="alert" className="mb-3 text-sm text-[#ff8a7a]">{formError}</p>}
        <Button type="submit" className="w-full !py-3.5" disabled={loading}>
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />}
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
